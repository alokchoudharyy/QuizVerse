import React, { useEffect, useState } from 'react';
import { Trophy, Medal, Crown, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../store/authStore';
import axios from 'axios';

export default function Leaderboard() {
  const navigate = useNavigate();
  const [ranks, setRanks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/leaderboard`, {
          headers: { Authorization: `Bearer ${session?.access_token}` }
        });
        if (res.data.success) setRanks(res.data.leaderboard);
      } catch (err) {
        console.error("Failed to load rankings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto text-slate-800">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-amber-50 border border-amber-100 rounded-2xl text-amber-500">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-800">Global Leaderboard</h1>
            <p className="text-xs text-slate-400 mt-0.5">Top rankers across all quiz modules</p>
          </div>
        </div>
        <button onClick={() => navigate('/dashboard')} className="flex items-center space-x-1.5 px-3 py-1.5 border border-slate-200 bg-white text-slate-600 rounded-xl text-xs font-bold">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Dashboard</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {ranks.slice(0, 3).map((player, index) => (
          <div key={index} className="p-5 rounded-2xl border flex flex-col items-center justify-center relative bg-white shadow-sm">
            {index === 0 && <Crown className="w-6 h-6 text-amber-500 absolute -top-3" />}
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm mb-2 ${index === 0 ? 'bg-amber-100 text-amber-700' : index === 1 ? 'bg-slate-100 text-slate-700' : 'bg-orange-100 text-orange-700'}`}>
              {index === 0 ? <Medal className="w-5 h-5" /> : index + 1}
            </div>
            <h3 className="text-sm font-black text-slate-800 truncate max-w-[150px]">{player.name || "Anonymous"}</h3>
            <p className="text-xs font-bold text-indigo-600 mt-1">{player.total_score || player.score || 0} PTS</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between text-[10px] font-bold text-slate-400 uppercase">
          <span>Rank & Username</span>
          <span className="pr-4">Score</span>
        </div>
        <div className="divide-y divide-slate-100">
          {ranks.map((player, index) => (
            <div key={index} className="p-4 flex items-center justify-between hover:bg-slate-50">
              <div className="flex items-center space-x-4">
                <span className="text-xs font-bold text-slate-400 w-4 text-center">{index + 1}</span>
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs uppercase">{player.name?.charAt(0) || "U"}</div>
                <h4 className="text-sm font-bold text-slate-800">{player.name || "Anonymous"}</h4>
              </div>
              <div className="text-sm font-extrabold text-slate-700 pr-2">{player.total_score || player.score || 0} PTS</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}