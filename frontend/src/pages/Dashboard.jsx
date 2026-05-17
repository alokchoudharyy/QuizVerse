import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Activity, Award, Zap, Code, FlaskConical, Globe, LogOut, ArrowRight, ChevronDown, ChevronUp,
  BookOpen, Calculator, Film, Music, Trophy, Clapperboard, X
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useQuizStore } from '../store/quizStore';
import { supabase } from '../store/authStore'; // Supabase se token nikalne ke liye
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { startQuiz, loading } = useQuizStore();
  
  const [showAll, setShowAll] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // 🔥 YEH HAI DYNAMIC STATE JO NUMBERS CHANGE KAREGA
  const [metrics, setMetrics] = useState({ totalPlayed: 0, accuracy: '0%', streak: '1 Day' });

  const displayName = user?.user_metadata?.name || user?.email?.split('@')[0] || "User";

  // DATABASE SE REAL DATA LAANE WALI API

useEffect(() => {
  const fetchTelemetry = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) return;

      const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      
      const res = await axios.get(`${API_URL}/api/analytics/telemetry`, {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
      
      if (res.data && !res.data.empty) {
        setMetrics({
          totalPlayed: res.data.metrics?.totalAttempts || 0,
          accuracy: `${res.data.metrics?.precisionAccuracy || 0}%`,
          streak: `${res.data.profile?.streak_count || 1} Day(s)`
        });
      }
    } catch (err) {
      console.error("Dashboard telemetry error:", err);
    }
  };
  fetchTelemetry();
}, []);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully.');
      navigate('/login');
    } catch (error) {
      toast.error('Logout failed.');
    }
  };

  const handleSelectDifficulty = async (difficulty) => {
    if (!selectedCategory) return;
    
    let amount = 10;
    if (difficulty === 'easy') amount = 5;
    if (difficulty === 'medium') amount = 10;
    if (difficulty === 'hard') amount = 20;

    try {
      await startQuiz(selectedCategory, difficulty, amount);
      toast.success(`Starting ${selectedCategory.toUpperCase()} Quiz (${difficulty.toUpperCase()})...`);
      setSelectedCategory(null);
      navigate('/quiz-attempt');
    } catch (error) {
      toast.error('Failed to load questions. Try again!');
    }
  };

  const allCategories = [
    { id: 'programming', name: 'Software & Logic', icon: <Code className="w-5 h-5 text-indigo-600" /> },
    { id: 'science', name: 'Applied Sciences', icon: <FlaskConical className="w-5 h-5 text-emerald-600" /> },
    { id: 'history', name: 'Global History', icon: <Globe className="w-5 h-5 text-amber-500" /> },
    { id: 'mathematics', name: 'Mathematics', icon: <Calculator className="w-5 h-5 text-blue-600" /> },
    { id: 'literature', name: 'Literature & Books', icon: <BookOpen className="w-5 h-5 text-rose-500" /> },
    { id: 'sports', name: 'Sports & Athletics', icon: <Trophy className="w-5 h-5 text-orange-500" /> },
    { id: 'films', name: 'Cinema & Movies', icon: <Film className="w-5 h-5 text-purple-600" /> },
    { id: 'music', name: 'Music & Art', icon: <Music className="w-5 h-5 text-cyan-500" /> },
    { id: 'general', name: 'General Knowledge', icon: <Clapperboard className="w-5 h-5 text-teal-600" /> },
  ];

  const visibleCategories = showAll ? allCategories : allCategories.slice(0, 4);

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-12">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="text-sm font-medium text-slate-500">
            Welcome back, <span className="text-indigo-600 font-bold">{displayName}</span>
          </div>
          <button onClick={handleLogout} className="flex items-center space-x-2 text-slate-500 hover:text-slate-900 transition-colors text-xs font-semibold">
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 mt-8">
        {/* 🔥 METRICS MAPPING SE REAL NUMBERS AAYENGE 🔥 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Quizzes Played', value: metrics.totalPlayed, icon: <Activity className="text-indigo-600 w-4 h-4" /> },
            { label: 'Average Accuracy', value: metrics.accuracy, icon: <Award className="text-emerald-600 w-4 h-4" /> },
            { label: 'Current Streak', value: metrics.streak, icon: <Zap className="text-amber-500 w-4 h-4" /> },
          ].map((stat, i) => (
            <div key={i} className="bg-white border border-slate-200 p-5 rounded-xl flex items-center justify-between shadow-sm">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                <h3 className="text-2xl font-black text-slate-800 mt-1">{stat.value}</h3>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
                {stat.icon}
              </div>
            </div>
          ))}
        </div>

        <div>
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Select Quiz Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {visibleCategories.map((cat) => (
              <div key={cat.id} className="bg-white border border-slate-200 p-5 rounded-xl flex flex-col justify-between hover:border-slate-400 transition-all shadow-sm">
                <div className="flex items-center space-x-3 mb-4">
                  {cat.icon}
                  <h3 className="text-base font-bold text-slate-800">{cat.name}</h3>
                </div>
                <button 
                  onClick={() => setSelectedCategory(cat.id)}
                  className="w-full bg-slate-50 hover:bg-indigo-600 border border-slate-200 hover:border-indigo-500 text-slate-700 hover:text-white font-semibold py-2 rounded-lg flex items-center justify-center space-x-2 text-xs transition-all"
                >
                  <span>Configure Quiz</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-center">
            <button onClick={() => setShowAll(!showAll)} className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 shadow-sm">
              <span>{showAll ? 'Show Less' : 'View All'}</span>
              {showAll ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {selectedCategory && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md border border-slate-200 rounded-2xl shadow-xl p-6 relative">
            <button onClick={() => setSelectedCategory(null)} className="absolute right-4 top-4 text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-base font-black text-slate-800 mb-1">Select Level</h3>
            <p className="text-xs text-slate-400 mb-5">Choose complexity for <span className="text-indigo-600 font-bold uppercase">{selectedCategory}</span>.</p>
            <div className="space-y-3">
              {[
                { id: 'easy', name: 'Easy Tier', count: '5 Qs', color: 'border-emerald-200 text-emerald-700 bg-emerald-50' },
                { id: 'medium', name: 'Medium Tier', count: '10 Qs', color: 'border-amber-200 text-amber-700 bg-amber-50' },
                { id: 'hard', name: 'Hard Tier', count: '20 Qs', color: 'border-rose-200 text-rose-700 bg-rose-50' }
              ].map((lvl) => (
                <button
                  key={lvl.id} disabled={loading} onClick={() => handleSelectDifficulty(lvl.id)}
                  className={`w-full p-3.5 border rounded-xl flex items-center justify-between transition-all text-left ${lvl.color} hover:opacity-80`}
                >
                  <h4 className="text-sm font-bold">{lvl.name}</h4>
                  <span className="text-xs font-extrabold px-2.5 py-1 bg-white border rounded-md shadow-sm text-slate-700">
                    {loading ? '...' : lvl.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}