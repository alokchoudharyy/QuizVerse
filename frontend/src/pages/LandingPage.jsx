import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Bookmark, Mail, Phone, Globe, ChevronRight, Zap, Target, Code2, Heart } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Target className="w-7 h-7 text-indigo-600" />,
      title: "Instant Logic Breakdown",
      desc: "Stuck on a question? Get immediate, detailed explanations of the core logic behind every correct answer.",
      color: "bg-indigo-50 border-indigo-100"
    },
    {
      icon: <Trophy className="w-7 h-7 text-amber-500" />,
      title: "Global Leaderboard",
      desc: "Compete with quizzers worldwide. Rack up points, climb the ranks, and earn your crown.",
      color: "bg-amber-50 border-amber-100"
    },
    {
      icon: <Bookmark className="w-7 h-7 text-emerald-600" />,
      title: "Smart Revision Vault",
      desc: "Bookmark tricky questions and review them later with detailed, in-depth insights to never repeat a mistake.",
      color: "bg-emerald-50 border-emerald-100"
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans flex flex-col selection:bg-indigo-500/30">
      
      {/* 🌟 NAVBAR 🌟 */}
      <nav className="w-full bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="bg-indigo-600 w-3 h-8 rounded-sm"></span>
            <span className="text-2xl font-black tracking-tight text-slate-900">QuizVerse</span>
          </div>
          <div className="hidden md:flex items-center space-x-8 text-sm font-bold text-slate-500">
            <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
            <a href="#about" className="hover:text-indigo-600 transition-colors">About</a>
            <a href="#contact" className="hover:text-indigo-600 transition-colors">Contact</a>
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={() => navigate('/login')} className="text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors hidden sm:block">
              Login
            </button>
            <button onClick={() => navigate('/register')} className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-xl shadow-md transition-all">
              Join for Free
            </button>
          </div>
        </div>
      </nav>

      {/* 🚀 HERO SECTION 🚀 */}
      <main className="flex-grow flex flex-col items-center justify-center text-center px-4 pt-24 pb-16 relative overflow-hidden">
        <div className="absolute top-10 left-10 w-64 h-64 bg-indigo-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-emerald-300/20 rounded-full blur-3xl"></div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6 }}
          className="z-10 max-w-4xl"
        >
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold mb-8 uppercase tracking-wider">
            <Zap className="w-4 h-4" />
            <span>Next-Gen Quiz Platform</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-tight mb-6">
            Challenge Your Brain.<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-teal-500">Master Every Topic.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-500 font-medium mb-10 max-w-2xl mx-auto leading-relaxed">
            Test your knowledge across multiple categories, compete globally, and get real-time detailed insights for every mistake you make.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => navigate('/register')}
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-lg shadow-xl shadow-indigo-600/20 transition-all flex items-center space-x-2 hover:-translate-y-1"
            >
              <span>Play Now</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </main>

      {/* 📊 STATS / HYPE SECTION 📊 */}
      <section className="bg-white border-y border-slate-200 py-10">
        <div className="max-w-5xl mx-auto px-6 flex flex-wrap justify-center gap-12 md:gap-24 text-center">
          <div>
            <h4 className="text-3xl font-black text-slate-800">9+</h4>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mt-1">Categories</p>
          </div>
          <div>
            <h4 className="text-3xl font-black text-slate-800">Global</h4>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mt-1">Leaderboards</p>
          </div>
          <div>
            <h4 className="text-3xl font-black text-slate-800">24/7</h4>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mt-1">Smart Analytics</p>
          </div>
        </div>
      </section>

      {/* ✨ FEATURES SECTION ✨ */}
      <section id="features" className="py-24 bg-[#f8fafc] px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Why QuizVerse?</h2>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-2">Built for the smart learner</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`p-8 rounded-3xl border ${feat.color} hover:shadow-lg transition-all`}
              >
                <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6">
                  {feat.icon}
                </div>
                <h3 className="text-xl font-black text-slate-800 mb-3">{feat.title}</h3>
                <p className="text-sm font-medium text-slate-600 leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

     

      {/* 📞 FOOTER & CONTACT 📞 */}
      <footer id="contact" className="bg-[#f8fafc] text-slate-600 py-12 px-6 border-t border-slate-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="bg-slate-300 w-2 h-6 rounded-sm"></span>
              <span className="text-xl font-black tracking-tight text-slate-800">QuizVerse</span>
            </div>
            <p className="text-sm mb-2 font-medium">Built with <Heart className="w-3 h-3 inline text-rose-500 mx-1" /> and lots of caffeine.</p>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">© 2024 QuizVerse. All rights reserved.</p>
          </div>
          
          <div className="flex flex-col md:items-end space-y-3">
            <h4 className="text-slate-800 font-black mb-1">Let's Connect</h4>
            <a href="mailto:itsalokchoudhary@gmail.com" className="flex items-center space-x-3 hover:text-indigo-600 transition-colors">
              <Mail className="w-4 h-4" />
              <span className="text-sm font-bold">itsalokchoudhary@gmail.com</span>
            </a>
            <a href="tel:+919302188375" className="flex items-center space-x-3 hover:text-indigo-600 transition-colors">
              <Phone className="w-4 h-4" />
              <span className="text-sm font-bold">+91 9302188375</span>
            </a>
            <a href="https://github.com/alokchoudharyy" target="_blank" rel="noreferrer" className="flex items-center space-x-3 hover:text-indigo-600 transition-colors">
              <Globe className="w-4 h-4" />
              <span className="text-sm font-bold">github.com/alokchoudharyy</span>
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}