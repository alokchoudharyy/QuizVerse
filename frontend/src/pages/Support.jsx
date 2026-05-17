import React, { useState } from 'react';
import { LifeBuoy, ArrowLeft, Send, MessageSquare, Plus, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Support() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);

  // Frontend Static Database (No actual backend needed for this!)
  const faqs = [
    { q: "How is the quiz score calculated?", a: "Each correct answer awards you 1 point. An incorrect answer deducts 0.25 points. Unattempted questions carry no penalty." },
    { q: "Can I pause a quiz and resume later?", a: "Currently, quizzes must be completed in a single session. The timer runs continuously for 10 minutes." },
    { q: "Where can I see my global ranking?", a: "Click on 'Global Rankings' in the sidebar to see the top performers across the entire QuizVerse platform." },
    { q: "How do I change my display name?", a: "You can update your display name and phone number in the 'Profile Settings' tab." },
  ];

  const handleSupportSubmit = (e) => {
    e.preventDefault();
    toast.success("Message sent! Our support team will contact you soon.");
    e.target.reset(); // Form clear kar do
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-10 text-slate-800">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-2xl text-indigo-600">
              <LifeBuoy className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800">Help & Support</h1>
              <p className="text-xs text-slate-500 font-bold mt-1 tracking-wider uppercase">We are here to assist you</p>
            </div>
          </div>
          <button onClick={() => navigate('/dashboard')} className="flex items-center space-x-2 px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-bold transition-all tracking-wider">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>DASHBOARD</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* FAQ Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-black text-slate-800 mb-4 flex items-center">
              <MessageSquare className="w-5 h-5 mr-2 text-indigo-600" /> Frequently Asked Questions
            </h2>
            
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm transition-all">
                <button 
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-4 text-left focus:outline-none"
                >
                  <span className="font-bold text-sm text-slate-700">{faq.q}</span>
                  {openFaq === idx ? <Minus className="w-4 h-4 text-indigo-500" /> : <Plus className="w-4 h-4 text-slate-400" />}
                </button>
                {openFaq === idx && (
                  <div className="p-4 pt-0 text-sm text-slate-500 font-medium leading-relaxed bg-slate-50 border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Contact Admin Form */}
          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6">
            <h2 className="text-lg font-black text-slate-800 mb-2">Contact Admin</h2>
            <p className="text-xs text-slate-500 font-bold mb-6 tracking-wider uppercase">Send us a direct message</p>
            
            <form onSubmit={handleSupportSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Subject</label>
                <input type="text" required placeholder="Issue regarding..." className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-slate-800 text-sm focus:border-indigo-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Message</label>
                <textarea required rows="4" placeholder="Describe your problem in detail..." className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-800 text-sm focus:border-indigo-500 focus:outline-none resize-none"></textarea>
              </div>
              <button type="submit" className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center space-x-2">
                <span>Send Message</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}