import { supabaseAdmin } from '../config/supabase.js';
import axios from 'axios';


export const submitEvaluationMatrix = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { quizId, externalCategory, difficulty, answersTimeline, timeTaken, totalQuestions } = req.body;

    let correctCount = 0; let wrongCount = 0; let unattemptedCount = 0;
    answersTimeline.forEach(ans => {
      if (!ans.userSelectedOption) unattemptedCount++;
      else if (ans.isCorrect) correctCount++;
      else wrongCount++;
    });

    const nominalScore = (correctCount * 1.0) - (wrongCount * 0.25);
    const finalScore = Math.max(0, nominalScore);
    const percentage = totalQuestions > 0 ? ((correctCount / totalQuestions) * 100) : 0;

    // Write core attempt record
    const { data: attemptRecord, error: attemptError } = await supabaseAdmin
      .from('quiz_attempts')
      .insert([{
        user_id: userId, quiz_id: quizId || null, external_category: externalCategory || 'System Verification Matrix',
        difficulty, status: 'completed', total_questions: totalQuestions, correct_answers: correctCount,
        wrong_answers: wrongCount, unattempted_answers: unattemptedCount, score: finalScore, percentage,
        time_taken_seconds: timeTaken, completed_at: new Date().toISOString()
      }]).select().single();

    if (attemptError) throw attemptError;

    if (answersTimeline && answersTimeline.length > 0) {
      const detailPayloads = answersTimeline.map(ans => ({
        attempt_id: attemptRecord.id, question_id: quizId ? ans.questionId : null,
        external_question_text: quizId ? null : ans.questionText,
        topic_tag: ans.topicTag || externalCategory || 'General Verification',
        user_selected_option: ans.userSelectedOption || null, is_correct: ans.isCorrect,
        time_spent_seconds: ans.timeSpent || 0
      }));
      await supabaseAdmin.from('attempt_answers').insert(detailPayloads);
    }

    // 🔥 DYNAMIC PROFILE SYNC AND UPSERT ENGINE (FIXED METHOD NAME) 🔥
    const { data: profile } = await supabaseAdmin.from('profiles').select('*').eq('id', userId).maybeSingle();
    
    // Fallback name logic in a safe block so it NEVER crashes the server
    let fallbackName = 'Anonymous';
    try {
      // Changed from .getUser() to .getUserById()
      const { data: adminUserData, error: adminUserError } = await supabaseAdmin.auth.admin.getUserById(userId);
      if (!adminUserError && adminUserData?.user) {
        fallbackName = adminUserData.user.user_metadata?.name || adminUserData.user.email?.split('@')[0] || 'Anonymous';
      }
    } catch (authErr) {
      console.error("Non-fatal auth sync error:", authErr.message);
    }

    const nextTotalAttempts = (profile?.total_quizzes_attempted || 0) + 1;
    const nextCumulativeScore = (parseFloat(profile?.total_score || 0) + finalScore);
    const nextAccuracy = (((parseFloat(profile?.average_accuracy || 0) * (nextTotalAttempts - 1)) + percentage) / nextTotalAttempts);
    const todayString = new Date().toISOString().split('T')[0];
    
    let resolvedStreak = profile?.streak_count || 1;
    if (profile?.last_active_date && profile.last_active_date !== todayString) {
      const delta = new Date(todayString).getTime() - new Date(profile.last_active_date).getTime();
      resolvedStreak = (delta <= 86400000 * 2) ? resolvedStreak + 1 : 1;
    }

    // Upsert maps both update and insert in a single network stream
    await supabaseAdmin.from('profiles').upsert({
      id: userId,
      name: profile?.name || fallbackName, 
      total_quizzes_attempted: nextTotalAttempts,
      total_score: nextCumulativeScore,
      average_accuracy: nextAccuracy,
      streak_count: resolvedStreak,
      last_active_date: todayString,
      updated_at: new Date().toISOString()
    });

    return res.status(201).json({ success: true, summary: attemptRecord });
  } catch (error) { 
    console.error("Profile sync fatal error:", error.message);
    next(error); 
  }
};
//     const userId = req.user.id;
//     const { quizId, externalCategory, difficulty, answersTimeline, timeTaken, totalQuestions } = req.body;

//     let correctCount = 0; let wrongCount = 0; let unattemptedCount = 0;
//     answersTimeline.forEach(ans => {
//       if (!ans.userSelectedOption) unattemptedCount++;
//       else if (ans.isCorrect) correctCount++;
//       else wrongCount++;
//     });

//     const nominalScore = (correctCount * 1.0) - (wrongCount * 0.25);
//     const finalScore = Math.max(0, nominalScore);
//     const percentage = totalQuestions > 0 ? ((correctCount / totalQuestions) * 100) : 0;

//     const { data: attemptRecord, error: attemptError } = await supabaseAdmin
//       .from('quiz_attempts')
//       .insert([{
//         user_id: userId, quiz_id: quizId || null, external_category: externalCategory || 'System Verification Matrix',
//         difficulty, status: 'completed', total_questions: totalQuestions, correct_answers: correctCount,
//         wrong_answers: wrongCount, unattempted_answers: unattemptedCount, score: finalScore, percentage,
//         time_taken_seconds: timeTaken, completed_at: new Date().toISOString()
//       }]).select().single();

//     if (attemptError) throw attemptError;

//     if (answersTimeline && answersTimeline.length > 0) {
//       const detailPayloads = answersTimeline.map(ans => ({
//         attempt_id: attemptRecord.id, question_id: quizId ? ans.questionId : null,
//         external_question_text: quizId ? null : ans.questionText,
//         topic_tag: ans.topicTag || externalCategory || 'General Verification',
//         user_selected_option: ans.userSelectedOption || null, is_correct: ans.isCorrect,
//         time_spent_seconds: ans.timeSpent || 0
//       }));
//       await supabaseAdmin.from('attempt_answers').insert(detailPayloads);
//     }

//     const { data: profile } = await supabaseAdmin.from('profiles').select('*').eq('id', userId).single();
//     if (profile) {
//       const nextTotalAttempts = (profile.total_quizzes_attempted || 0) + 1;
//       const nextCumulativeScore = (parseFloat(profile.total_score || 0) + finalScore);
//       const nextAccuracy = (((parseFloat(profile.average_accuracy || 0) * (nextTotalAttempts - 1)) + percentage) / nextTotalAttempts);
//       const todayString = new Date().toISOString().split('T')[0];
//       let resolvedStreak = profile.streak_count || 1;
//       if (profile.last_active_date && profile.last_active_date !== todayString) {
//         const delta = new Date(todayString).getTime() - new Date(profile.last_active_date).getTime();
//         resolvedStreak = (delta <= 86400000 * 2) ? resolvedStreak + 1 : 1;
//       }
//       await supabaseAdmin.from('profiles').update({
//         total_quizzes_attempted: nextTotalAttempts, total_score: nextCumulativeScore,
//         average_accuracy: nextAccuracy, streak_count: resolvedStreak, last_active_date: todayString, updated_at: new Date().toISOString()
//       }).eq('id', userId);
//     }
//     return res.status(201).json({ success: true, summary: attemptRecord });
//   } catch (error) { next(error); }
// };

e// In backend/controllers/analytics.controller.js
export const aggregateDashboardTelemetry = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const [attemptsQuery, profileQuery] = await Promise.all([
      supabaseAdmin.from('quiz_attempts').select('*').eq('user_id', userId).order('completed_at', { ascending: false }),
      supabaseAdmin.from('profiles').select('*').eq('id', userId).single()
    ]);
    if (attemptsQuery.error) throw attemptsQuery.error;
    
    const totalRecords = attemptsQuery.data || [];
    const profileData = profileQuery.data || { total_score: 0, average_accuracy: 0, streak_count: 1 };
    
    if (totalRecords.length === 0) return res.status(200).json({ empty: true, profile: profileData });

    const analyticalClusters = {};
    let totalAccuracySum = 0; // 🔥 NAYA LOGIC: Total accuracy sum track karne ke liye

    totalRecords.forEach(rec => {
      const key = rec.external_category || 'Custom Verification';
      if (!analyticalClusters[key]) analyticalClusters[key] = { aggregatePercentage: 0, executionCount: 0 };
      
      const currentPercentage = parseFloat(rec.percentage || 0);
      analyticalClusters[key].aggregatePercentage += currentPercentage;
      analyticalClusters[key].executionCount++;
      
      totalAccuracySum += currentPercentage; // 🔥 NAYA LOGIC
    });

    const parsedRadarData = Object.keys(analyticalClusters).map(catName => ({
      topic: catName, value: parseFloat((analyticalClusters[catName].aggregatePercentage / analyticalClusters[catName].executionCount).toFixed(2))
    }));

    // 🔥 REAL, FRESH ACCURACY CALCULATION 🔥
    // Database ke purane corrupt column ko chhod do, naya math lagao:
    const freshCalculatedAccuracy = totalRecords.length > 0 
      ? (totalAccuracySum / totalRecords.length).toFixed(2) 
      : 0;

    return res.status(200).json({
      empty: false, 
      profile: profileData,
      metrics: { 
        totalAttempts: totalRecords.length, 
        meanScore: profileData.total_score || 0, 
        precisionAccuracy: freshCalculatedAccuracy // Puraani value ki jagah fresh math
      },
      timeline: totalRecords.slice(0, 10), 
      topicDistribution: parsedRadarData
    });
  } catch (error) { next(error); }
};

export const deleteHistoryRecord = async (req, res, next) => {
  try {
    const userId = req.user.id; const attemptId = req.params.id;
    const { data: attempt } = await supabaseAdmin.from('quiz_attempts').select('id').eq('id', attemptId).eq('user_id', userId).single();
    if (!attempt) return res.status(404).json({ success: false, message: 'Record not found.' });
    await supabaseAdmin.from('attempt_answers').delete().eq('attempt_id', attemptId);
    await supabaseAdmin.from('quiz_attempts').delete().eq('id', attemptId);
    return res.status(200).json({ success: true });
  } catch (error) { next(error); }
};

// 🔥 NAYE DB FUNCTION: SAVE/BOOKMARK QUESTION
export const bookmarkQuestion = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { question, correct_answer } = req.body;

    const { data, error } = await supabaseAdmin
      .from('saved_questions')
      .insert([{ user_id: userId, question, correct_answer }])
      .select();

    if (error) throw error;
    return res.status(201).json({ success: true, message: 'Question saved to vault!', data });
  } catch (error) { next(error); }
};

// 🔥 NAYE DB FUNCTION: GET ALL SAVED QUESTIONS
export const getSavedQuestions = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { data, error } = await supabaseAdmin
      .from('saved_questions')
      .select('*')
      .eq('user_id', userId)
      .order('saved_at', { ascending: false });

    if (error) throw error;
    return res.status(200).json({ success: true, saved: data });
  } catch (error) { next(error); }
};

// backend/controllers/analytics.controller.js ke sabse niche isse replace karo:

export const explainQuestionWithAI = async (req, res, next) => {
  try {
    const { question, correctAnswer, userAnswer } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    // HTML entities ko clean karo
    const cleanQuestion = question
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">");

    if (!apiKey) {
      return res.status(200).json({ success: true, explanation: "AI Configuration Missing: GEMINI_API_KEY is not defined." });
    }

    console.log("🤖 Connected to Google Gemini 2.5 Active Pipeline...");
    
    // 🔥 GOOGLE GEMINI ACTIVE MODEL URL (gemini-2.5-flash) 🔥
    const geminiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    
    const prompt = `You are an expert tutor. Analyze this multiple-choice question: "${cleanQuestion}". 
    The student selected the answer: "${userAnswer || 'Skipped/No Answer'}". 
    ${correctAnswer && correctAnswer.trim() !== "" ? `The correct answer is confirmed to be "${correctAnswer}".` : "Determine the correct answer yourself."}
    Provide a concise, friendly 2-3 line explanation explaining the correct fact/logic and why the student's answer is right or wrong.`;

    const response = await axios.post(geminiUrl, {
      contents: [{ parts: [{ text: prompt }] }]
    }, {
      headers: { 'Content-Type': 'application/json' }
    });

    const aiText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (aiText) {
      return res.status(200).json({ success: true, explanation: aiText.trim() });
    }

    return res.status(200).json({ success: true, explanation: "Gemini responded with an empty payload. Try again." });

  } catch (error) {
    console.error("Gemini Error Details:", error.response?.data || error.message);
    const googleRawError = error.response?.data?.error?.message || error.message;
    
    return res.status(200).json({ 
      success: true, 
      explanation: `🚨 Google Gemini API Error: "${googleRawError}". Please verify your settings.` 
    });
  }
};