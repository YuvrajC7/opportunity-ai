'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Bell, Menu, Clock, AlertCircle } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { getUserNotifications, markNotificationRead, clearAllNotifications } from '@/app/actions/notifications';

interface TopBarProps {
  onMenuToggle: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export default function TopBar({ onMenuToggle, searchQuery = '', onSearchChange }: TopBarProps) {
  const { data: session } = useSession();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (!session) return;
    
    const loadNotifications = async () => {
      const data = await getUserNotifications();
      if (data) setNotifications(data);
    };

    loadNotifications();

    const handleNewNotifications = () => {
      loadNotifications();
    };

    window.addEventListener('new_notifications', handleNewNotifications);
    return () => window.removeEventListener('new_notifications', handleNewNotifications);
  }, [session]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = async () => {
    const unread = notifications.filter(n => !n.read);
    // Optimistic update
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    for (const n of unread) {
      await markNotificationRead(n.id);
    }
  };

  const handleClearAll = async () => {
    setNotifications([]);
    await clearAllNotifications();
  };

  return (
    <header className="sticky top-0 right-0 z-40 bg-[#06060E]/80 backdrop-blur-md border-b border-slate-900/60 py-4 px-6 md:px-10 flex items-center justify-between">
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <button 
          onClick={onMenuToggle}
          className="p-2 text-slate-400 hover:text-white bg-slate-900 rounded-lg lg:hidden transition"
        >
          <Menu className="w-5 h-5" />
        </button>

        {onSearchChange && (
          <div className="relative w-full hidden md:block">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search opportunity title, company, or skills..."
              className="w-full pl-10 pr-4 py-2 bg-[#0F0F23] border border-slate-900 rounded-full text-xs text-white placeholder-slate-500 outline-none focus:border-[#7C3AED]/40 focus:ring-1 focus:ring-[#7C3AED]/30 transition"
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">

        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 bg-[#0F0F23] border border-slate-900 hover:border-slate-800 rounded-full text-slate-400 hover:text-white transition relative"
          >
            <Bell className="w-4.5 h-4.5" />
            {unreadCount > 0 && (
              <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-[#F72585] text-[8px] font-bold text-white flex items-center justify-center border-2 border-[#0F0F23]">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <>
              <div onClick={() => setShowNotifications(false)} className="fixed inset-0 z-30" />
              
              <div className="absolute right-0 mt-3 w-80 bg-[#0F0F23] border border-slate-900 rounded-2xl shadow-2xl p-4 z-40 space-y-3 animate-fade-in-up">
                <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                  <h4 className="text-xs font-bold text-white flex items-center gap-1">
                    Notifications <span className="text-[10px] text-slate-500 font-normal">({unreadCount} new)</span>
                  </h4>
                  <div className="flex items-center gap-3">
                    {unreadCount > 0 && (
                      <button onClick={handleMarkAllRead} className="text-[10px] font-bold text-[#8B5CF6] hover:text-[#7C3AED] transition">
                        Mark read
                      </button>
                    )}
                    {notifications.length > 0 && (
                      <button onClick={handleClearAll} className="text-[10px] font-bold text-[#F72585] hover:text-[#D11A6A] transition">
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-slate-500 italic text-center py-4">No notifications yet.</p>
                  ) : (
                    notifications.map((n) => {
                      const inner = (
                        <div 
                          className={`p-3 rounded-xl border transition flex items-start gap-2.5 hover:border-[#8B5CF6]/50 hover:bg-slate-900/60 cursor-pointer ${
                            n.read 
                              ? 'bg-slate-950/20 border-slate-950 text-slate-400' 
                              : 'bg-[#7C3AED]/5 border-[#7C3AED]/20 text-slate-200'
                          }`}
                        >
                          <div className="mt-0.5">
                            {n.type === 'DEADLINE_REMINDER' ? (
                              <AlertCircle className="w-4 h-4 text-[#F72585]" />
                            ) : (
                              <Clock className="w-4 h-4 text-[#8B5CF6]" />
                            )}
                          </div>
                          <div className="space-y-0.5 flex-1">
                            <p className="text-xs font-bold leading-tight">{n.title}</p>
                            <p className="text-[10px] text-slate-400 leading-normal">{n.message}</p>
                            <p className="text-[8px] text-slate-500 font-mono pt-1">
                              {new Date(n.createdAt).toLocaleDateString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      );

                      if (n.opportunityId) {
                        return (
                          <Link 
                            key={n.id} 
                            href={`/opportunity/${n.opportunityId}`}
                            onClick={() => {
                              if (!n.read) markNotificationRead(n.id);
                              setShowNotifications(false);
                            }}
                            className="block"
                          >
                            {inner}
                          </Link>
                        );
                      }

                      return <div key={n.id} onClick={() => !n.read && markNotificationRead(n.id)}>{inner}</div>;
                    })
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        <Link href="/settings" className="flex items-center gap-2 hover:opacity-80 transition cursor-pointer" title="Settings">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#7C3AED] to-[#F72585] flex items-center justify-center font-bold text-[11px] text-white">
            {session?.user?.name 
              ? session.user.name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
              : 'U'
            }
          </div>
        </Link>
      </div>
    </header>
  );
}
