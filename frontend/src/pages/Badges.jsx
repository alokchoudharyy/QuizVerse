import React, { useEffect, useState } from 'react';
import { Medal, Trophy, Star, Shield, Zap, Lock, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../store/authStore';
import axios from 'axios';

export default function Badges() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalPlayed: 0, accuracy: 0 });
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;
        const res = await axios.get(`${API_URL}/api/analytics/telemetry`, {
          headers: { Authorization: `Bearer ${session.access_token}` }
        });
        if (res.data && res.data.profile) {
          setStats({
            totalPlayed: res.data.profile.total_quizzes_attempted || 0,
            accuracy: res.data.profile.average_accuracy || 0
          });
        }
      } catch (err) {
        console.error("Failed to load badge stats");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Gamification Logic (Kaunsa badge unlock hoga)
  const badgesData = [
    { id: 1, name: "First Blood", desc: "Complete your first quiz assessment.", icon: <Star className="w-8 h-8" />, unlocked: stats.totalPlayed >= 1, color: "text-amber-500", bg: "bg-amber-50 border-amber-200" },
    { id: 2, name: "Quiz Master", desc: "Complete 10 or more quizzes.", icon: <Medal className="w-8 h-8" />, unlocked: stats.totalPlayed >= 10, color: "text-indigo-500", bg: "bg-indigo-50 border-indigo-200" },
    { id: 3, name: "Sharpshooter", desc: "Maintain an overall accuracy of 80% or higher.", icon: <Target className="w-8 h-8" />, unlocked: stats.totalPlayed > 0 && stats.accuracy >= 80, color: "text-emerald-500", bg: "bg-emerald-50 border-emerald-200" },
    { id: 4, name: "Veteran", desc: "Complete 50 quizzes across the platform.", icon: <Shield className="w-8 h-8" />, unlocked: stats.totalPlayed >= 50, color: "text-rose-500", bg: "bg-rose-50 border-rose-200" },
    { id: 5, name: "Flawless", desc: "Get 100% accuracy on at least one hard quiz.", icon: <Trophy className="w-8 h-8" />, unlocked: false, color: "text-purple-500", bg: "bg-purple-50 border-purple-200" }, // Hardcoded locked for demo
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-10 text-slate-800">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-amber-50 border border-amber-100 rounded-2xl text-amber-500">
              <Medal className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800">Badges & Rewards</h1>
              <p className="text-xs text-slate-500 font-bold mt-1 tracking-wider uppercase">Unlock achievements</p>
            </div>
          </div>
          <button onClick={() => navigate('/dashboard')} className="flex items-center space-x-2 px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-bold transition-all tracking-wider">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>DASHBOARD</span>
          </button>
        </div>

        {loading ? (
          <div className="text-center p-10 font-bold text-slate-400 animate-pulse">Loading Your Trophies...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {badgesData.map((badge) => (
              <div key={badge.id} className={`relative p-6 rounded-3xl border shadow-sm transition-all flex flex-col items-center text-center ${badge.unlocked ? badge.bg : 'bg-slate-50 border-slate-200 opacity-70 grayscale'}`}>
                {!badge.unlocked && (
                  <div className="absolute top-4 right-4 p-1.5 bg-slate-200 rounded-lg text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                )}
                <div className={`p-4 rounded-full bg-white shadow-sm mb-4 ${badge.unlocked ? badge.color : 'text-slate-400'}`}>
                  {badge.icon}
                </div>
                <h3 className="text-base font-black text-slate-800 mb-1">{badge.name}</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed px-2">{badge.desc}</p>
                {badge.unlocked && (
                  <span className="mt-4 px-3 py-1 bg-white border border-slate-200 rounded-full text-[10px] font-bold text-emerald-600 uppercase tracking-widest shadow-sm">Unlocked</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Target(props) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>; }