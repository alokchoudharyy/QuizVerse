import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Home, CheckCircle2, XCircle, Target, Sparkles, BrainCircuit, Bookmark } from 'lucide-react';
import { supabase } from '../store/authStore';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function QuizResult() {
  const navigate = useNavigate();

  const score = JSON.parse(localStorage.getItem('qv_score') || '0');
  const correct = JSON.parse(localStorage.getItem('qv_correct') || '0');
  const incorrect = JSON.parse(localStorage.getItem('qv_incorrect') || '0');
  const total = JSON.parse(localStorage.getItem('qv_total') || '10');
  const userAnswers = JSON.parse(localStorage.getItem('qv_answers') || '[]');
  const accuracy = total > 0 ? ((correct / total) * 100).toFixed(0) : 0;

  const [activeAI, setActiveAI] = useState(null);
  const [aiResponse, setAiResponse] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [savedIds, setSavedIds] = useState([]); // Bookmarked track bar

  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  // 🔥 REAL AI CALL FUNCTION
  // QuizResult.jsx ke andar askAI function ko isse replace karo:
  const askAI = async (idx, question, correctAnswer, userAnswer, isCorrect) => {
    setActiveAI(idx);
    setIsTyping(true);
    setAiResponse('');

    // Agar correctAnswer blank ya space hai, toh use empty string bhejo taaki backend handle kare
    const cleanCorrectAnswer = correctAnswer && correctAnswer.trim() !== "" ? correctAnswer : "";

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await axios.post(`${API_URL}/api/analytics/explain`, {
        question, 
        correctAnswer: cleanCorrectAnswer, 
        userAnswer
      }, {
        headers: { Authorization: `Bearer ${session?.access_token}` }
      });

      setAiResponse(res.data.explanation);
    } catch (err) {
      setAiResponse("Network connection failed. Could not dispatch payload to backend server.");
    } finally {
      setIsTyping(false);
    }
  };

  // 🔥 REAL BOOKMARK FUNCTION (Saves to 'saved_questions' table)
  const saveToVault = async (idx, question, correctAnswer) => {
    const loadingToast = toast.loading("Saving to Revision Vault...");
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await axios.post(`${API_URL}/api/analytics/bookmark`, {
        question, correct_answer: correctAnswer
      }, {
        headers: { Authorization: `Bearer ${session?.access_token}` }
      });

      if (res.data.success) {
        setSavedIds(prev => [...prev, idx]);
        toast.success("Saved permanently to database!", { id: loadingToast });
      }
    } catch (err) {
      toast.error("Database save failed.", { id: loadingToast });
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-10 flex flex-col items-center">
      
      {/* Top HUD Stats Box */}
      <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-xl p-8 text-center mb-8">
        <div className="inline-flex p-4 bg-indigo-50 border border-indigo-100 rounded-2xl mb-6 text-indigo-600"><Trophy className="w-12 h-12" /></div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Assessment Complete</h1>
        <p className="text-xs text-slate-500 font-bold mt-1 uppercase tracking-wider">System Evaluation Generated</p>

        <div className="flex justify-center my-8">
          <div className="w-36 h-36 rounded-full border-[6px] border-slate-100 flex flex-col items-center justify-center bg-slate-50 relative">
            <span className="text-4xl font-black text-indigo-600">{score}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Total PTS</span>
            <div className="absolute -bottom-3 bg-white text-emerald-600 text-[10px] font-bold px-3 py-1 rounded-full border border-emerald-200 shadow-sm">{accuracy}% ACC</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex flex-col items-center">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 mb-2" /><p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Correct</p><h4 className="text-xl font-black text-emerald-600 mt-1">{correct}</h4>
          </div>
          <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl flex flex-col items-center">
            <XCircle className="w-5 h-5 text-rose-500 mb-2" /><p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Incorrect</p><h4 className="text-xl font-black text-rose-600 mt-1">{incorrect}</h4>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={() => navigate('/history')} className="flex-1 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md tracking-wider">VIEW DETAILED ANALYTICS</button>
          <button onClick={() => navigate('/dashboard')} className="flex-1 py-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs tracking-wider">RETURN TO DASHBOARD</button>
        </div>
      </div>

      {/* AI REVIEW & SAVING LIST */}
      {userAnswers.length > 0 && (
        <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-sm p-8">
          <div className="flex items-center space-x-2 mb-6"><BrainCircuit className="w-6 h-6 text-indigo-600" /><h2 className="text-lg font-black text-slate-800">Review Answers & AI Insights</h2></div>

          <div className="space-y-4">
            {userAnswers.map((ans, idx) => {
              // Find the correct answer text from state context safely
              const activeFullQuestion = JSON.parse(localStorage.getItem('qv_questions') || '[]')[idx];
              const trueAnswerText = activeFullQuestion?.correct_answer || ' ';
              const isAlreadyBookmarked = savedIds.includes(idx);

              return (
                <div key={idx} className={`p-4 rounded-2xl border ${ans.isCorrect ? 'border-emerald-100 bg-emerald-50/40' : 'border-rose-100 bg-rose-50/40'}`}>
                  
                  <div className="flex justify-between items-start gap-4">
                    <p className="text-sm font-bold text-slate-700" dangerouslySetInnerHTML={{ __html: `${idx + 1}. ${ans.questionText}` }}></p>
                    
                    {/* Action Panel Group */}
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      {/* 🔥 NEW BOOKMARK BUTTON 🔥 */}
                      <button 
                        onClick={() => saveToVault(idx, ans.questionText, trueAnswerText)}
                        disabled={isAlreadyBookmarked}
                        className={`p-1.5 rounded-lg border transition-all ${isAlreadyBookmarked ? 'bg-amber-100 text-amber-600 border-amber-200' : 'bg-white text-slate-400 border-slate-200 hover:text-amber-500'}`}
                        title="Save to Revision Vault"
                      >
                        <Bookmark className="w-4 h-4" fill={isAlreadyBookmarked ? "currentColor" : "none"} />
                      </button>
                      {ans.isCorrect ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <XCircle className="w-5 h-5 text-rose-500" />}
                    </div>
                  </div>

                  <div className="mt-3 text-xs font-bold text-slate-500">
                    Your Answer: <span dangerouslySetInnerHTML={{ __html: ans.userSelectedOption || 'Skipped' }} className={ans.isCorrect ? "text-emerald-600" : "text-rose-600"} />
                    {!ans.isCorrect && <span className="ml-3 text-emerald-600">Correct: <span dangerouslySetInnerHTML={{ __html: trueAnswerText }} /></span>}
                  </div>

                  {/* Ask AI Button */}
                  <button 
                    onClick={() => askAI(idx, ans.questionText, trueAnswerText, ans.userSelectedOption, ans.isCorrect)}
                    className="mt-4 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Ask AI for Explanation</span>
                  </button>

                  {activeAI === idx && (
                    <div className="mt-3 p-4 bg-slate-900 rounded-xl text-slate-100 text-sm leading-relaxed border border-slate-800 relative shadow-inner">
                      <Sparkles className="w-4 h-4 text-amber-400 absolute top-4 left-4" />
                      <div className="pl-6">
                        {isTyping ? (
                          <span className="animate-pulse text-indigo-300 font-mono text-xs">QuizVerse AI core is computing logic parameters...</span>
                        ) : (
                          <span className="font-medium text-slate-300">{aiResponse}</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}