import { create } from 'zustand';
import axios from 'axios';
import { supabase } from './authStore';

const getInitialState = (key, fallback) => {
  const stored = localStorage.getItem(key);
  try {
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
};

export const useQuizStore = create((set, get) => ({
  questions: getInitialState('qv_questions', []),
  currentQuestionIndex: getInitialState('qv_index', 0),
  userAnswers: getInitialState('qv_answers', []),
  quizConfig: getInitialState('qv_config', null),
  isQuizActive: getInitialState('qv_active', false),
  timeSpentSeconds: getInitialState('qv_time', 0),
  
  score: getInitialState('qv_score', 0),
  correctAnswers: getInitialState('qv_correct', 0),
  incorrectAnswers: getInitialState('qv_incorrect', 0),
  totalQuestions: getInitialState('qv_total', 0),
  loading: false,

  startQuiz: async (category, difficulty, amount = 10) => {
    set({ loading: true, isQuizActive: true, score: 0, correctAnswers: 0, incorrectAnswers: 0, totalQuestions: 0 });
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/quizzes/stream`, {
        params: { category, difficulty, amount },
        headers: { Authorization: `Bearer ${session?.access_token}` }
      });

      if (response.data.success) {
        const payload = response.data.questions;
        set({ 
          questions: payload, 
          currentQuestionIndex: 0, 
          userAnswers: [], 
          quizConfig: { category, difficulty },
          timeSpentSeconds: 0,
          totalQuestions: payload.length,
          loading: false 
        });

        localStorage.setItem('qv_active', 'true');
        localStorage.setItem('qv_config', JSON.stringify({ category, difficulty }));
        localStorage.setItem('qv_questions', JSON.stringify(payload));
        localStorage.setItem('qv_answers', JSON.stringify([]));
        localStorage.setItem('qv_index', '0');
        localStorage.setItem('qv_time', '0');
        localStorage.setItem('qv_total', JSON.stringify(payload.length));
        localStorage.setItem('qv_score', '0');
        localStorage.setItem('qv_correct', '0');
        localStorage.setItem('qv_incorrect', '0');
      }
    } catch (error) {
      set({ loading: false, isQuizActive: false });
      throw error;
    }
  },

  selectOption: (questionId, optionText, isCorrect) => {
    const { userAnswers, questions } = get();
    const activeQuestion = questions[questionId];
    
    const filteredAnswers = userAnswers.filter(a => a.questionId !== questionId);
    const updatedAnswers = [...filteredAnswers, {
      questionId: questionId,
      questionText: activeQuestion.question,
      userSelectedOption: optionText,
      isCorrect: isCorrect,
      timeSpent: 10
    }];

    const correctCount = updatedAnswers.filter(ans => ans.isCorrect).length;
    const incorrectCount = updatedAnswers.length - correctCount;
    const finalScore = correctCount * 10;

    set({ 
      userAnswers: updatedAnswers,
      correctAnswers: correctCount,
      incorrectAnswers: incorrectCount,
      score: finalScore
    });

    localStorage.setItem('qv_answers', JSON.stringify(updatedAnswers));
    localStorage.setItem('qv_correct', JSON.stringify(correctCount));
    localStorage.setItem('qv_incorrect', JSON.stringify(incorrectCount));
    localStorage.setItem('qv_score', JSON.stringify(finalScore));
  },

  nextQuestion: () => {
    const { currentQuestionIndex, questions } = get();
    if (currentQuestionIndex < questions.length - 1) {
      set({ currentQuestionIndex: currentQuestionIndex + 1 });
      localStorage.setItem('qv_index', JSON.stringify(currentQuestionIndex + 1));
    }
  },

  prevQuestion: () => {
    const { currentQuestionIndex } = get();
    if (currentQuestionIndex > 0) {
      set({ currentQuestionIndex: currentQuestionIndex - 1 });
      localStorage.setItem('qv_index', JSON.stringify(currentQuestionIndex - 1));
    }
  },

  submitQuiz: async () => {
    const { questions, userAnswers, quizConfig, timeSpentSeconds } = get();
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/quizzes/evaluate`, {
        quizId: null,
        externalCategory: quizConfig.category,
        difficulty: quizConfig.difficulty,
        totalQuestions: questions.length,
        timeTaken: timeSpentSeconds,
        answersTimeline: userAnswers
      }, {
        headers: { Authorization: `Bearer ${session?.access_token}` }
      });

      localStorage.removeItem('qv_active');
      localStorage.removeItem('qv_config');
      localStorage.removeItem('qv_questions');
      localStorage.removeItem('qv_index');
      localStorage.removeItem('qv_time');
      
      return response.data.summary;
    } catch (error) {
      console.error("Submission failed:", error);
      throw error;
    }
  },

  clearQuizState: () => {
    set({ isQuizActive: false, questions: [], userAnswers: [], quizConfig: null, currentQuestionIndex: 0, timeSpentSeconds: 0, score: 0, correctAnswers: 0, incorrectAnswers: 0, totalQuestions: 0 });
    localStorage.clear();
  }
}));