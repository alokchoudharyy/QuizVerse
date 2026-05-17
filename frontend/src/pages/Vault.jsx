import React, { useEffect, useState } from 'react';
import { Bookmark, ArrowLeft, Target, HelpCircle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../store/authStore';
import axios from 'axios';

export default function Vault() {
  const navigate = useNavigate();
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVault = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
        const res = await axios.get(`${API_URL}/api/analytics/bookmarks`, {
          headers: { Authorization: `Bearer ${session?.access_token}` }
        });
        if (res.data.success) setSaved(res.data.saved || []);
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchVault();
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-10 text-slate-800">
      <div className="max-w-4xl mx-auto">
        
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-amber-50 border border-amber-100 rounded-2xl text-amber-500"><Bookmark className="w-6 h-6" fill="currentColor"/></div>
            <div>
              <h1 className="text-2xl font-black text-slate-800">Revision Vault</h1>
              <p className="text-xs text-slate-500 font-bold mt-1 tracking-wider uppercase">Your Bookmarked Questions</p>
            </div>
          </div>
          <button onClick={() => navigate('/dashboard')} className="flex items-center space-x-2 px-4 py-2 border border-slate-200 bg-white text-slate-600 rounded-xl text-xs font-bold shadow-sm"><ArrowLeft className="w-3.5 h-3.5" /><span>DASHBOARD</span></button>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden p-6">
          {loading ? <div className="p-6 text-center font-bold text-slate-400">Loading your vault storage...</div> : saved.length === 0 ? (
            <div className="p-10 text-center flex flex-col items-center">
              <Target className="w-10 h-10 text-slate-300 mb-2" />
              <p className="text-sm font-bold text-slate-400">Your Revision Vault is empty. Bookmark tough questions during quiz reviews!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {saved.map((item, idx) => (
                <div key={item.id || idx} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50">
                  <div className="flex items-start space-x-3">
                    <HelpCircle className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-800" dangerouslySetInnerHTML={{ __html: item.question }} />
                      <div className="mt-3 flex items-center space-x-2 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-xl w-fit">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Correct Answer: <span dangerouslySetInnerHTML={{ __html: item.correct_answer }} /></span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}