'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Bookmark, 
  KanbanSquare, 
  BarChart3, 
  Settings, 
  LogOut, 
  Sparkles,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';

interface SidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ mobileOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const menuItems = [
    { label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, href: '/dashboard' },
    { label: 'Bookmarks', icon: <Bookmark className="w-5 h-5" />, href: '/bookmarks' },
    { label: 'Applications', icon: <KanbanSquare className="w-5 h-5" />, href: '/applications' },
    { label: 'Analytics', icon: <BarChart3 className="w-5 h-5" />, href: '/analytics' },
    { label: 'Settings', icon: <Settings className="w-5 h-5" />, href: '/settings' },
  ];

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      <aside className={`fixed top-0 bottom-0 left-0 w-[260px] bg-[#0F0F23] border-r border-slate-900 z-50 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="space-y-8 pt-6">
          {/* Logo */}
          <div className="px-6">
            <Link href="/dashboard" className="flex items-center gap-2 text-lg font-bold tracking-tight text-white">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#7C3AED] to-[#F72585] flex items-center justify-center">
                <Sparkles className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="font-extrabold">Opportunity<span className="text-[#8B5CF6]">AI</span></span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 px-3">
            {menuItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold transition group ${
                    active 
                      ? 'bg-[#7C3AED]/10 text-white border-l-2 border-[#7C3AED]' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={active ? 'text-[#8B5CF6]' : 'text-slate-400 group-hover:text-slate-300'}>
                      {item.icon}
                    </span>
                    {item.label}
                  </div>
                  {active && <ChevronRight className="w-3.5 h-3.5 text-[#8B5CF6]" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card */}
        <div className="p-4 border-t border-slate-900 space-y-4 bg-slate-950/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#7C3AED] to-[#F72585] flex items-center justify-center font-bold text-xs text-white uppercase">
              {session?.user?.name 
                ? session.user.name.split(' ').slice(0, 2).map((n: string) => n[0]).join('').toUpperCase() 
                : 'ST'}
            </div>
            <div className="overflow-hidden">
              <h5 className="text-xs font-bold text-white truncate flex items-center gap-1.5">
                {session?.user?.name || 'Student'}
              </h5>
              <p className="text-[10px] text-slate-500 truncate">{session?.user?.email || 'student@vitstudent.ac.in'}</p>
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-500 bg-slate-950/40 p-2.5 rounded-xl border border-slate-900">
            <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-[#06D6A0]" /> Read-Only Sync</span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />
            <span className="text-[#06D6A0]">Active</span>
          </div>

          <button 
            onClick={() => signOut({ callbackUrl: '/auth/signin' })}
            className="flex items-center justify-center gap-2 py-2 rounded-xl border border-slate-900 hover:bg-[#F72585]/10 hover:border-[#F72585]/20 text-[10px] font-bold text-slate-400 hover:text-[#F72585] transition w-full"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
