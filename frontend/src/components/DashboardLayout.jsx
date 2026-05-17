import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Menu, X } from 'lucide-react';

export default function DashboardLayout({ children }) {
  // Mobile sidebar ka state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex overflow-hidden w-full">
      
      {/* 🌑 Mobile Sidebar Overlay (Background dark karne ke liye) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 🚀 Sidebar Box (Mobile pe slide hoga, PC pe fix rahega) */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Mobile par sidebar band karne ka 'X' button */}
        <div className="absolute top-4 right-4 lg:hidden">
          <button 
            type="button"
            onClick={() => setIsSidebarOpen(false)}
            className="p-1.5 bg-slate-100 text-slate-500 rounded-lg hover:bg-slate-200 active:bg-slate-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Tumhara Asli Sidebar Component */}
        <Sidebar closeMobileMenu={() => setIsSidebarOpen(false)} />
      </aside>

      {/* 📊 Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen h-screen overflow-hidden">
        
        {/* 📱 Mobile Top Navbar (Sirf mobile par dikhega) */}
        <div className="lg:hidden flex items-center justify-between bg-white border-b border-slate-200 p-4 shrink-0 z-30">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-indigo-500 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white font-black text-lg leading-none">Q</span>
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900">QuizVerse</span>
          </div>
          
          {/* EK LAUTA Menu Button (Fixed) */}
          <button 
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setIsSidebarOpen(prev => !prev);
            }}
            className="p-2 rounded-xl bg-slate-50 text-slate-600 border border-slate-200 active:bg-slate-200 shadow-sm transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* 📄 Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 w-full">
          <div className="max-w-7xl mx-auto w-full">
            {/* React Router Outlet ya Normal Children dono support karega */}
            {children || <Outlet />}
          </div>
        </main>
        
      </div>
    </div>
  );
}