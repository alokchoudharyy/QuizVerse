import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import { User, Phone, Mail, Lock } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', password: '' });
  const { register, loginWithGoogle, loading } = useAuthStore();
  const navigate = useNavigate();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData.email, formData.password, {
        name: formData.name,
        phone: formData.phone
      });
      toast.success('Registration successful! Welcome aboard.');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Registration failed.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsGoogleLoading(true);
      await loginWithGoogle();
    } catch (err) {
      toast.error(err.message || 'Google Sign-Up failed.');
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-slate-200 p-8 rounded-2xl shadow-sm">
        <h2 className="text-2xl font-black text-slate-800 text-center mb-2">Create Account</h2>
        <p className="text-sm text-slate-500 text-center mb-6">Join QuizVerse to test your global skills.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text" required placeholder="John Doe"
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 bg-slate-50"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Phone Number</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="tel" required placeholder="9876543210"
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 bg-slate-50"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email" required placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 bg-slate-50"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password" required placeholder="••••••••" minLength="6"
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 bg-slate-50"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit" disabled={loading || isGoogleLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors shadow-md shadow-indigo-600/10 mt-2 disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        {/* 🌐 DIVIDER */}
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-200"></span></div>
          <div className="relative flex justify-center text-[10px] uppercase font-black tracking-wider"><span className="bg-white px-3 text-slate-400">Or setup with</span></div>
        </div>

        {/* 🌟 GOOGLE SIGN UP BUTTON */}
        <button
          type="button"
          disabled={loading || isGoogleLoading}
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm shadow-sm transition-all active:scale-[0.98] disabled:opacity-50"
        >
          <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
            <path fill="#EA4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.66 1.54 15.02 1 12 1 7.24 1 3.2 3.74 1.25 7.76l3.83 2.97C6.01 7.22 8.76 5.04 12 5.04z"/>
            <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.29 1.48-1.14 2.73-2.42 3.57v2.97h3.91c2.28-2.1 3.54-5.19 3.54-8.69z"/>
            <path fill="#FBBC05" d="M5.08 14.79c-.23-.69-.36-1.43-.36-2.2s.13-1.51.36-2.2L1.25 7.42C.45 9.03 0 10.82 0 12.7s.45 3.67 1.25 5.28l3.83-2.99z"/>
            <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.92l-3.91-2.97c-1.09.73-2.49 1.17-4.05 1.17-3.24 0-5.99-2.18-6.97-5.12L1.2 16.13C3.15 20.17 7.2 23 12 23z"/>
          </svg>
          <span>Sign up with Google</span>
        </button>

        <p className="text-xs text-center text-slate-500 mt-6">
          Already have an account? <Link to="/login" className="text-indigo-600 font-semibold hover:underline">Log In</Link>
        </p>
      </div>
    </div>
  );
}