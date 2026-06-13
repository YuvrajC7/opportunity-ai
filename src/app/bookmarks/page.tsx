'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Bookmark, 
  Calendar, 
  Coins, 
  Search,
  AlertTriangle,
  BookmarkX,
  ArrowRight,
  ChevronLeft
} from 'lucide-react';
import { Opportunity, CATEGORY_CONFIG } from '@/lib/types';
import { formatDeadline, calculateMatchScore } from '@/lib/utils';
import { getOpportunities, toggleBookmark as toggleBookmarkAction } from '@/app/actions/opportunities';
import { useSession } from 'next-auth/react';

export default function Bookmarks() {
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState('');
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);

  const userProfile = useMemo(() => ({
    skills: session?.user?.skills || [],
    interests: session?.user?.interests || ['internship']
  }), [session?.user]);

  useEffect(() => {
    async function fetchData() {
      if (!session) return;
      try {
        const dbOpps = await getOpportunities();
        if (dbOpps && dbOpps.length > 0) {
          const mappedOpps: Opportunity[] = dbOpps.map((opp: any) => {
            const e = opp.emailData;
            return {
              id: e.id,
              title: e.subject.length > 40 ? e.subject.substring(0, 40) + '...' : e.subject,
              organisation: e.from.split('<')[0].trim() || e.from,
              summary: e.snippet,
              deadline: e.deadline || "",
              category: (e.category || 'internship') as any,
              matchScore: calculateMatchScore(e.skillsRequired || [], e.category || 'internship', userProfile.skills, userProfile.interests, e.id),
              isBookmarked: opp.bookmarkStatus === 'SAVED' || opp.bookmarkStatus === 'APPLIED',
              skillsRequired: e.skillsRequired || ['General Requirements'],
              location: 'Remote',
              stipendValue: e.stipend || 'Varies',
              applyLink: e.applyLink
            } as unknown as Opportunity;
          });
          setOpportunities(mappedOpps);
        }
      } catch (err) {
        console.error("Failed to load bookmarks:", err);
      }
    }
    fetchData();
  }, [session, userProfile.skills, userProfile.interests]);

  const bookmarkedOpps = useMemo(() => {
    return opportunities.filter(o => o.isBookmarked);
  }, [opportunities]);

  const toggleBookmark = async (id: string) => {
    setOpportunities(prev => prev.map(o => o.id === id ? { ...o, isBookmarked: !o.isBookmarked } : o));
    try {
      await toggleBookmarkAction(id, 'SAVED');
    } catch (err) {
      setOpportunities(prev => prev.map(o => o.id === id ? { ...o, isBookmarked: !o.isBookmarked } : o));
    }
  };

  const filteredOpps = useMemo(() => {
    return bookmarkedOpps.filter(o => {
      const matchesSearch = 
        o.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.organisation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.skillsRequired.some((s: string) => s.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return matchesSearch;
    });
  }, [bookmarkedOpps, searchQuery]);

  return (
    <div className="min-h-screen bg-[#06060E] p-6 md:p-10 text-slate-100">
      <div className="space-y-8 animate-fade-in relative z-10 max-w-[1600px] mx-auto">
        
        <Link 
          href="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white bg-slate-900/50 hover:bg-slate-900 border border-slate-800 rounded-full py-2 px-4 transition w-fit"
        >
          <ChevronLeft className="w-4 h-4" /> BACK TO DASHBOARD
        </Link>

        <div className="block md:hidden relative w-full mb-4">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search bookmarked items..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#0F0F23] border border-slate-900 rounded-full text-xs text-white outline-none focus:border-[#7C3AED]"
          />
        </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Priority Bookmarks <Bookmark className="w-6 h-6 text-[#06D6A0]" />
          </h1>
          <p className="text-xs text-slate-400">
            These opportunities will send push notifications and email alerts based on deadlines.
          </p>
        </div>
      </div>

      <div className="relative max-w-md hidden md:block">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input 
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search bookmarks by company, title, or skills..."
          className="w-full pl-10 pr-4 py-2 bg-[#0F0F23] border border-slate-900 rounded-full text-xs text-white placeholder-slate-500 outline-none focus:border-[#7C3AED]/40"
        />
      </div>

      {filteredOpps.length === 0 ? (
        <div className="card glass p-16 text-center space-y-4 max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-slate-900/60 flex items-center justify-center mx-auto border border-slate-800">
            <BookmarkX className="w-8 h-8 text-slate-500" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base">No bookmarks found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed pt-1">
              {searchQuery ? 'No bookmarks match your search criteria. Try typing a different keyword.' : 'Go to the Dashboard page and click the bookmark icon on any opportunity card to track it here.'}
            </p>
          </div>
          {!searchQuery && (
            <Link href="/dashboard" className="btn-primary py-2 px-6 text-xs inline-flex items-center gap-1.5">
              Go to Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOpps.map((opp) => {
            const conf = CATEGORY_CONFIG[opp.category];
            return (
              <div key={opp.id} className="card glass p-5 flex flex-col justify-between space-y-4 hover:border-[#7C3AED]/30">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span 
                      className="badge font-bold uppercase" 
                      style={{ color: conf.color, backgroundColor: conf.bgColor }}
                    >
                      {conf.label}
                    </span>
                    
                    <div className="text-[10px] font-bold text-[#06D6A0] bg-[#06D6A0]/10 border border-[#06D6A0]/15 px-2 py-0.5 rounded-full uppercase">
                      {opp.matchScore}% Match
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-extrabold text-sm text-white line-clamp-1">{opp.title}</h3>
                    <p className="text-[10px] text-slate-400 font-bold">{opp.organisation} • <span className="font-normal">{opp.location || 'Remote'}</span></p>
                  </div>

                  <p className="text-[10px] text-slate-400 line-clamp-3 leading-relaxed">
                    {opp.summary}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-900/60">
                  <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>Exp: <strong className="text-slate-200">{formatDeadline(opp.deadline)}</strong></span>
                    </div>
                    {opp.stipendValue && (
                      <div className="flex items-center gap-1.5 truncate">
                        <Coins className="w-3.5 h-3.5 text-[#06D6A0]" />
                        <span className="truncate text-slate-300 font-medium">{opp.stipendValue}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button 
                      onClick={() => toggleBookmark(opp.id)}
                      className="p-2 rounded-lg bg-[#F72585]/10 border border-[#F72585]/20 text-[#F72585] hover:bg-slate-900 hover:text-slate-400 transition"
                      title="Remove bookmark"
                    >
                      <BookmarkX className="w-4 h-4" />
                    </button>
                    <Link 
                      href={`/opportunity/${opp.id}`}
                      className="btn-primary py-2 flex-1 text-center justify-center text-[10px] font-bold uppercase tracking-wider"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      </div>
    </div>
  );
}
