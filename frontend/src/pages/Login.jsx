import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, User, Phone, ArrowRight, BookOpenCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, loginWithGoogle, user } = useAuthStore();
  
  const [isLoginMode, setIsLoginMode] = useState(location.pathname !== '/register');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLoginMode) {
        await login(email, password);
        toast.success('Authenticated successfully.');
        navigate('/dashboard');
      } else {
        if (name.trim().length < 3) throw new Error('Name must be at least 3 characters.');
        
        await register(email, password, {
          name: name.trim(),
          phone: phone.trim()
        });
        
        toast.success('Account created! Welcome to QuizVerse.');
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error(err.message || 'Authentication failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      await loginWithGoogle();
    } catch (err) {
      toast.error(err.message || 'Google Auth failed.');
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    window.history.pushState(null, '', isLoginMode ? '/register' : '/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#f8fafc]">
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white border border-slate-200 p-8 rounded-3xl shadow-xl z-10"
      >
        <div className="flex flex-col items-center mb-6">
          <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-2xl mb-3 text-indigo-600">
            <BookOpenCheck className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">QUIZ<span className="text-indigo-600">VERSE</span></h1>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-1">
            {isLoginMode ? 'Account Access Gateway' : 'Create System Account'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence mode="wait" initial={false}>
            {!isLoginMode && (
              <motion.div
                key="register-fields"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4 overflow-hidden"
              >
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input 
                      type="text" required={!isLoginMode} value={name} onChange={e => setName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-slate-800 focus:outline-none focus:border-indigo-500 text-sm transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input 
                      type="tel" required={!isLoginMode} value={phone} onChange={e => setPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-slate-800 focus:outline-none focus:border-indigo-500 text-sm transition-all"
                      placeholder="9876543210"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="email" required value={email} onChange={e => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-slate-800 focus:outline-none focus:border-indigo-500 text-sm transition-all"
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Security Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="password" required value={password} onChange={e => setPassword(e.target.value)} minLength="6"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-slate-800 focus:outline-none focus:border-indigo-500 text-sm transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit" disabled={isLoading}
            className="w-full mt-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-400 text-white font-bold py-3 rounded-xl flex justify-center items-center space-x-2 transition-all shadow-md shadow-indigo-600/10 group text-sm"
          >
            <span>{isLoading ? 'Processing...' : (isLoginMode ? 'Sign In' : 'Create Account')}</span>
            {!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />}
          </button>
        </form>

        {/* 🌐 DECENT DIVIDER */}
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-200"></span></div>
          <div className="relative flex justify-center text-[10px] uppercase font-black tracking-wider"><span className="bg-white px-3 text-slate-400">Or continue with</span></div>
        </div>

        {/* 🌟 NEW SUPABASE GOOGLE BUTTON */}
        <button
          type="button"
          disabled={isLoading}
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm shadow-sm transition-all active:scale-[0.98] disabled:opacity-50"
        >
          <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
            <path fill="#EA4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.66 1.54 15.02 1 12 1 7.24 1 3.2 3.74 1.25 7.76l3.83 2.97C6.01 7.22 8.76 5.04 12 5.04z"/>
            <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.29 1.48-1.14 2.73-2.42 3.57v2.97h3.91c2.28-2.1 3.54-5.19 3.54-8.69z"/>
            <path fill="#FBBC05" d="M5.08 14.79c-.23-.69-.36-1.43-.36-2.2s.13-1.51.36-2.2L1.25 7.42C.45 9.03 0 10.82 0 12.7s.45 3.67 1.25 5.28l3.83-2.99z"/>
            <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.92l-3.91-2.97c-1.09.73-2.49 1.17-4.05 1.17-3.24 0-5.99-2.18-6.97-5.12L1.2 16.13C3.15 20.17 7.2 23 12 23z"/>
          </svg>
          <span>Continue with Google</span>
        </button>

        <div className="mt-6 text-center border-t border-slate-100 pt-4">
          <p className="text-xs text-slate-500">
            {isLoginMode ? "Don't have an account yet?" : "Already have an account?"}
            <button 
              type="button" onClick={toggleMode}
              className="ml-1.5 text-indigo-600 hover:text-indigo-500 font-bold transition-colors focus:outline-none"
            >
              {isLoginMode ? "Sign Up" : "Log In"}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}