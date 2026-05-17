import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Award, History, Medal, 
  BookOpen, Settings, LifeBuoy, LogOut, Menu, X,
  BarChart3, Bookmark
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function Sidebar() {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false); // Mobile menu state

  const displayName = user?.user_metadata?.name || user?.email?.split('@')[0] || "User";

  // 🔥 UPDATE MENU ITEMS WITH ANALYTICS AND REVISION VAULT
  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { name: 'Advanced Analytics', path: '/analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { name: 'Global Rankings', path: '/leaderboard', icon: <Award className="w-4 h-4" /> },
    { name: 'My Results', path: '/history', icon: <History className="w-4 h-4" /> },
    { name: 'Revision Vault', path: '/vault', icon: <Bookmark className="w-4 h-4" /> },
    { name: 'Badges & Rewards', path: '/badges', icon: <Medal className="w-4 h-4" /> },
    { name: 'Study Resources', path: '/resources', icon: <BookOpen className="w-4 h-4" /> },
    { name: 'Profile Settings', path: '/settings', icon: <Settings className="w-4 h-4" /> },
    { name: 'Help & Support', path: '/support', icon: <LifeBuoy className="w-4 h-4" /> },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* 🔥 TOP-LEFT Mobile Menu Button 🔥 */}
      <button 
        onClick={toggleSidebar}
        className={`md:hidden fixed top-3 left-4 z-[60] p-2.5 rounded-xl transition-all shadow-md ${
          isOpen 
            ? 'bg-slate-100 text-slate-700 border border-slate-200' 
            : 'bg-indigo-600 text-white border border-indigo-500 shadow-indigo-600/20' 
        }`}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Overlay Background */}
      {isOpen && (
        <div 
          onClick={closeSidebar} 
          className="md:hidden fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40"
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 h-screen sticky top-0 flex flex-col justify-between 
        transform transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none md:sticky md:top-0 md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 overflow-y-auto custom-scrollbar mt-12 md:mt-0">
          <div className="text-lg font-bold tracking-tight text-slate-900 mb-8 flex items-center space-x-2">
            <span className="bg-indigo-600 w-2 h-5 rounded-sm"></span>
            <span>QuizVerse</span>
          </div>
          
          <nav className="space-y-1.5">
            {menuItems.map((item, i) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={i}
                  to={item.path}
                  onClick={closeSidebar}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-all ${
                    isActive 
                      ? 'bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                  }`}
                >
                  <span className={isActive ? 'text-indigo-600' : 'text-slate-400'}>{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50/80 m-4 rounded-xl space-y-3 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-black text-sm border border-indigo-200 shadow-sm">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-slate-800 truncate">{displayName}</p>
              <p className="text-[10px] text-slate-400 font-bold truncate">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={logout}
            className="flex items-center space-x-2 px-2.5 py-2 w-full rounded-lg text-xs font-bold text-slate-500 hover:bg-red-50 hover:text-red-600 hover:border-red-100 border border-transparent transition-all text-left"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out System</span>
          </button>
        </div>
      </aside>
    </>
  );
}