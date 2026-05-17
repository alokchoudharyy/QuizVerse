import React from 'react';
import Sidebar from './Sidebar';

export default function DashboardLayout({ children }) {
  return (
    <div className="w-full min-h-screen flex bg-[#f8fafc] overflow-hidden">
      {/* Fixed Screen Height Sidebar */}
      <Sidebar />
      
      {/* Right Side Content Area - Sirf yeh section scroll hoga */}
      <div className="flex-1 h-screen overflow-y-auto flex flex-col">
        <main className="flex-grow">
          {children}
        </main>
      </div>
    </div>
  );
}