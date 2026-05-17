import React, { useEffect, useState } from 'react';
import { History as HistoryIcon, ArrowLeft, Target, Calendar, Trash2, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../store/authStore';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function History() {
  const navigate = useNavigate();
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 🔥 NAYA STATE: Delete modal ko control karne ke liye
  const [recordToDelete, setRecordToDelete] = useState(null);

  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.access_token) return;

        const res = await axios.get(`${API_URL}/api/analytics/telemetry`, {
          headers: { Authorization: `Bearer ${session.access_token}` }
        });
        if (res.data && !res.data.empty) {
          setTimeline(res.data.timeline || []);
        }
      } catch (err) {
        console.error("Failed to load history:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  // 🔥 ACTUAL DELETE FUNCTION (Modal ke "Delete" button se call hoga)
  const executeDelete = async () => {
    if (!recordToDelete) return;
    
    const id = recordToDelete;
    setRecordToDelete(null); // Modal turant band karo
    
    const loadingToast = toast.loading("Deleting record...");
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const res = await axios.delete(`${API_URL}/api/analytics/history/${id}`, {
        headers: { Authorization: `Bearer ${session?.access_token}` }
      });
      
      if (res.data.success) {
        setTimeline(prev => prev.filter(record => record.id !== id));
        toast.success("Record deleted successfully!", { id: loadingToast });
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete. Check server.", { id: loadingToast });
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-10 text-slate-800">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-2xl text-indigo-600">
              <HistoryIcon className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800">Assessment History</h1>
              <p className="text-xs text-slate-500 font-bold mt-1 tracking-wider uppercase">Past Telemetry Logs</p>
            </div>
          </div>
          <button onClick={() => navigate('/dashboard')} className="flex items-center space-x-2 px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-bold transition-all tracking-wider">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>DASHBOARD</span>
          </button>
        </div>

        {/* History List */}
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-10 text-center text-slate-400 font-bold text-sm animate-pulse tracking-wider">Fetching records...</div>
          ) : timeline.length === 0 ? (
            <div className="p-10 text-center flex flex-col items-center">
              <Target className="w-10 h-10 text-slate-300 mb-3" />
              <p className="text-slate-500 font-bold text-sm">No records found.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {timeline.map((record, index) => {
                const date = new Date(record.completed_at || record.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                return (
                  <div key={record.id || index} className="p-5 flex flex-col lg:flex-row lg:items-center justify-between hover:bg-slate-50 transition-all gap-4">
                    
                    {/* Left Side: Topic & Date */}
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-black text-sm shadow-sm flex-shrink-0
                        ${record.percentage >= 70 ? 'border-emerald-200 bg-emerald-50 text-emerald-600' : 
                          record.percentage >= 40 ? 'border-amber-200 bg-amber-50 text-amber-600' : 
                          'border-rose-200 bg-rose-50 text-rose-600'}`}>
                        {Math.round(record.percentage)}%
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">{record.external_category}</h4>
                        <div className="flex items-center text-[10px] text-slate-500 font-bold mt-1 space-x-3">
                          <span className="flex items-center"><Calendar className="w-3 h-3 mr-1 text-slate-400" /> {date}</span>
                          <span className="px-1.5 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-600 uppercase">{record.difficulty}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Side: Score & Delete Button */}
                    <div className="flex items-center justify-between sm:justify-end w-full lg:w-auto gap-4">
                      <div className="flex items-center space-x-4 sm:space-x-6 bg-slate-50 px-4 py-3 rounded-xl border border-slate-100 flex-grow sm:flex-grow-0 justify-center">
                        <div className="text-center">
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Score</p>
                          <p className="text-sm font-black text-indigo-600">{record.score}</p>
                        </div>
                        <div className="w-px h-6 bg-slate-200"></div>
                        <div className="text-center">
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Correct</p>
                          <p className="text-sm font-black text-emerald-600">{record.correct_answers}/{record.total_questions}</p>
                        </div>
                      </div>

                      {/* Trash Button - Ispe click karne se modal khulega */}
                      <button 
                        onClick={() => setRecordToDelete(record.id)}
                        className="flex-shrink-0 p-3.5 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white rounded-xl transition-all shadow-sm border border-red-100 flex items-center justify-center"
                        title="Delete Record"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 🔥 PREMIUM DELETE CONFIRMATION MODAL 🔥 */}
      {recordToDelete && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-sm border border-slate-200 rounded-2xl shadow-xl p-6 relative">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 bg-red-50 text-red-500 rounded-full flex-shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-800">Delete Record?</h3>
                <p className="text-xs text-slate-500 font-medium mt-1">This action is permanent and cannot be undone.</p>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setRecordToDelete(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={executeDelete}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm shadow-md shadow-red-500/20 transition-all"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}