'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#050505]">
      {/* Sidebar Drawer */}
      <Sidebar 
        mobileOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)} 
      />

      {/* Main Panel wrapper */}
      <div className="lg:pl-[260px] flex flex-col min-h-screen">
        <TopBar 
          onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} 
        />
        
        {/* Scrollable Content Pane */}
        <main className="flex-1 p-6 md:p-10 text-slate-100">
          {children}
        </main>
      </div>
    </div>
  );
}
