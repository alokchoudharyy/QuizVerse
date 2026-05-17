import React, { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, Target, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../store/authStore';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

export default function Analytics() {
  const navigate = useNavigate();
  const [chartData, setChartData] = useState({ radar: [], timeline: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTelemetry = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.access_token) return;
        const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
        const res = await axios.get(`${API_URL}/api/analytics/telemetry`, { headers: { Authorization: `Bearer ${session.access_token}` } });
        
        if (res.data && !res.data.empty) {
          setChartData({
            radar: res.data.topicDistribution || [],
            timeline: (res.data.timeline || []).reverse().map((t, idx) => ({ name: `Quiz ${idx + 1}`, score: t.score }))
          });
        }
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchTelemetry();
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-10 text-slate-800">
      <div className="max-w-6xl mx-auto">
        
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-2xl text-indigo-600"><Activity className="w-6 h-6" /></div>
            <div>
              <h1 className="text-2xl font-black text-slate-800">Advanced Analytics</h1>
              <p className="text-xs text-slate-500 font-bold mt-1 tracking-wider uppercase">Performance Metrics</p>
            </div>
          </div>
          <button onClick={() => navigate('/dashboard')} className="flex items-center space-x-2 px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-bold transition-all tracking-wider shadow-sm"><ArrowLeft className="w-3.5 h-3.5" /><span>DASHBOARD</span></button>
        </div>

        {loading ? <div className="p-10 text-center font-bold text-slate-400">Loading Intelligence Data...</div> : chartData.timeline.length === 0 ? <div className="p-10 text-center font-bold text-slate-400">Play a few quizzes to unlock analytics!</div> : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm">
              <div className="flex items-center space-x-2 mb-6"><TrendingUp className="w-5 h-5 text-indigo-500" /><h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Score Progression</h3></div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData.timeline}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <ChartTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm">
              <div className="flex items-center space-x-2 mb-2"><Target className="w-5 h-5 text-emerald-500" /><h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Topic Mastery</h3></div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData.radar}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="topic" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar name="Accuracy %" dataKey="value" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                    <ChartTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}