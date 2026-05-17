import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, ArrowRight, ArrowLeft, Send, AlertCircle, HelpCircle } from 'lucide-react';
import { useQuizStore } from '../store/quizStore';
import toast from 'react-hot-toast';

export default function QuizAttempt() {
  const navigate = useNavigate();
  const { 
    questions, currentQuestionIndex, userAnswers, selectOption, 
    nextQuestion, prevQuestion, submitQuiz, loading, timeSpentSeconds 
  } = useQuizStore();
  
  const [timeLeft, setTimeLeft] = useState(600 - timeSpentSeconds); 
  const [shuffledOptions, setShuffledOptions] = useState([]);
  const timerRef = useRef(null);

  const activeQuestion = questions ? questions[currentQuestionIndex] : null;

  useEffect(() => {
    if (!questions || questions.length === 0) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [questions?.length]);

  useEffect(() => {
    if (activeQuestion) {
      const allOptions = [
        ...activeQuestion.incorrect_answers,
        activeQuestion.correct_answer
      ];
      setShuffledOptions(allOptions.sort(() => Math.random() - 0.5));
    }
  }, [activeQuestion, currentQuestionIndex]);

  const handleAutoSubmit = async () => {
    toast.error('Time limit finished! Submitting quiz automatically...');
    await executeSubmission();
  };

  const executeSubmission = async () => {
    clearInterval(timerRef.current);
    const submittingToast = toast.loading('Saving score to Supabase database...');
    try {
      await submitQuiz();
      toast.success('Quiz safely synchronized with Database!', { id: submittingToast });
      navigate('/quiz-result');
    } catch (err) {
      console.error("💥 SUBMIT ERROR DETECTED:", err);
      toast.error(err.response?.data?.error || 'Database write failed. Check backend terminal.', { id: submittingToast });
    }
  };

  // 🔥 LIGHT THEME LOADING SCREEN 🔥
  if (loading || !questions || questions.length === 0) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center space-y-4">
        <div className="w-14 h-14 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-bold tracking-widest animate-pulse text-xs uppercase">Streaming Data Blocks...</p>
      </div>
    );
  }

  const existingAnswer = userAnswers.find(a => a.questionId === currentQuestionIndex);
  const selectedOptionText = existingAnswer ? existingAnswer.userSelectedOption : null;

  const handleOptionSelect = (option) => {
    const isCorrect = option === activeQuestion.correct_answer;
    selectOption(currentQuestionIndex, option, isCorrect);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 sm:p-8 flex flex-col items-center select-none text-slate-800">
      <div className="w-full max-w-4xl space-y-6 mt-4 sm:mt-10">
        
        {/* 🔥 LIGHT HUD TOP BAR 🔥 */}
        <div className="bg-white border border-slate-200 p-4 rounded-2xl flex justify-between items-center shadow-sm">
          <div className="text-xs font-bold tracking-wider text-slate-500 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 uppercase">
            Question Progress: <span className="text-indigo-600 font-black ml-1">{currentQuestionIndex + 1} / {questions.length}</span>
          </div>
          <div className={`flex items-center space-x-2 text-sm font-bold px-5 py-2 rounded-xl border ${
            timeLeft < 120 
              ? 'bg-rose-50 border-rose-200 text-rose-600 animate-pulse' 
              : 'bg-emerald-50 border-emerald-100 text-emerald-600'
          }`}>
            <Timer className="w-4 h-4" />
            <span className="tracking-widest font-mono">{formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* 🔥 LIGHT PROGRESS BAR 🔥 */}
        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden border border-slate-200/50">
          <motion.div 
            className="bg-indigo-600 h-full"
            initial={{ width: '0%' }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* 🔥 LIGHT QUESTION PANEL 🔥 */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            transition={{ duration: 0.2 }}
            className="bg-white border border-slate-200 p-6 sm:p-10 rounded-3xl shadow-sm relative"
          >
            <div className="flex items-start space-x-4">
              <div className="p-2.5 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-xl mt-1 flex-shrink-0">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h2 
                className="text-base sm:text-lg font-black leading-relaxed text-slate-800" 
                dangerouslySetInnerHTML={{ __html: activeQuestion.question }} 
              />
            </div>

            {/* 🔥 LIGHT OPTIONS LIST 🔥 */}
            <div className="grid grid-cols-1 gap-3 pt-8">
              {shuffledOptions.map((option, index) => {
                const isSelected = selectedOptionText === option;
                return (
                  <button 
                    key={index}
                    onClick={() => handleOptionSelect(option)}
                    className={`w-full p-4 border rounded-xl font-bold text-sm transition-all text-left flex items-center justify-between ${
                      isSelected 
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-500/20' 
                        : 'border-slate-200 bg-slate-50/40 hover:bg-slate-50 text-slate-600 hover:text-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <span dangerouslySetInnerHTML={{ __html: option }} />
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ml-4 ${
                      isSelected ? 'border-indigo-500 bg-indigo-600' : 'border-slate-300 bg-white'
                    }`}>
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* 🔥 LIGHT CONTROLS 🔥 */}
        <div className="flex justify-between items-center pt-2">
          <button
            onClick={prevQuestion} disabled={currentQuestionIndex === 0}
            className="px-6 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-700 disabled:opacity-20 transition-all flex items-center space-x-2 text-xs font-bold tracking-wider shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>BACK</span>
          </button>

          {currentQuestionIndex < questions.length - 1 ? (
            <button
              onClick={nextQuestion}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all flex items-center space-x-2 text-xs font-bold tracking-wider shadow-md"
            >
              <span>NEXT QUESTION</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={executeSubmission}
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-all flex items-center space-x-2 text-xs font-bold tracking-wider shadow-md"
            >
              <span>SUBMIT ASSESSMENT</span>
              <Send className="w-4 h-4" />
            </button>
          )
        }
        </div>

      </div>
    </div>
  );
}