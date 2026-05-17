import React, { useState } from 'react';
import { Settings as SettingsIcon, User, Phone, Mail, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, supabase } from '../store/authStore';
import toast from 'react-hot-toast';

export default function Settings() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  // Existing data ko default value set kar rahe hain
  const [name, setName] = useState(user?.user_metadata?.name || '');
  const [phone, setPhone] = useState(user?.user_metadata?.phone || '');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    const loadingToast = toast.loading("Updating profile...");

    try {
      // Supabase ka secure user update function
      const { data, error } = await supabase.auth.updateUser({
        data: { name: name, phone: phone }
      });

      if (error) throw error;

      toast.success("Profile updated successfully!", { id: loadingToast });
      
      // Page ko halka sa reload karenge taaki Sidebar naya naam pakad le
      setTimeout(() => {
        window.location.reload();
      }, 1000);

    } catch (err) {
      toast.error(err.message || "Failed to update profile.", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-10 text-slate-800">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-2xl text-indigo-600">
              <SettingsIcon className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800">Profile Settings</h1>
              <p className="text-xs text-slate-500 font-bold mt-1 tracking-wider uppercase">Manage your account parameters</p>
            </div>
          </div>
          <button onClick={() => navigate('/dashboard')} className="flex items-center space-x-2 px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-bold transition-all tracking-wider">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>DASHBOARD</span>
          </button>
        </div>

        {/* Settings Form Card */}
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-8">
          <form onSubmit={handleUpdate} className="space-y-6">
            
            {/* Email (Read Only - Kyunki login email change karna complex hota hai) */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Registered Email (Read Only)</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  type="email" value={user?.email || ''} disabled
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-slate-500 font-medium cursor-not-allowed"
                />
              </div>
            </div>

            {/* Editable Name */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Display Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500 w-5 h-5" />
                <input 
                  type="text" required value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl py-3 pl-12 pr-4 text-slate-800 font-bold focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                />
              </div>
            </div>

            {/* Editable Phone */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500 w-5 h-5" />
                <input 
                  type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl py-3 pl-12 pr-4 text-slate-800 font-bold focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button 
                type="submit" disabled={loading}
                className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-400 text-white font-bold rounded-xl shadow-md shadow-indigo-600/20 transition-all flex items-center space-x-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>{loading ? 'Saving Changes...' : 'Save Profile Settings'}</span>
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}