import React from 'react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/40 bg-[#070A13] py-6 text-center text-xs font-mono text-slate-500">
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>© {new Date().getFullYear()} QuizVerse Platform. All rights reserved.</p>
        <div className="flex space-x-4">
          <a href="#" className="hover:text-indigo-400 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-indigo-400 transition-colors">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
}