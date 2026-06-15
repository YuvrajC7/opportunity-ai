'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Bookmark, 
  Calendar, 
  Coins, 
  AlertTriangle, 
  GraduationCap, 
  Clock, 
  X, 
  Plus,
  LayoutGrid,
  List,
  SlidersHorizontal,
  Search
} from 'lucide-react';
import { Opportunity, OpportunityCategory, CATEGORY_CONFIG } from '@/lib/types';
import { formatDeadline, SKILL_DICTIONARY } from '@/lib/utils';
import { calculateMatchScore } from '@/lib/utils';
import { getOpportunities, toggleBookmark as toggleBookmarkAction } from '@/app/actions/opportunities';
import { updateUserSkills, recordLoginTimestamp } from '@/app/actions/user';
import { useSession, signOut } from 'next-auth/react';
import ScanningOverlay from '@/components/ui/ScanningOverlay';

export default function Dashboard() {
  const { data: session, update: updateSession } = useSession();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'deadline' | 'match'>('deadline');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [newSkill, setNewSkill] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const [showOverlay, setShowOverlay] = useState(false);
  const overlayStartTime = useRef<number>(0);

  useEffect(() => {
    if (isScanning) {
      setShowOverlay(true);
      overlayStartTime.current = Date.now();
    } else {
      const elapsed = Date.now() - overlayStartTime.current;
      const remaining = overlayStartTime.current > 0 ? Math.max(0, 3500 - elapsed) : 0;
      const timeout = setTimeout(() => {
        setShowOverlay(false);
        if (remaining > 0) overlayStartTime.current = 0;
      }, remaining);
      return () => clearTimeout(timeout);
    }
  }, [isScanning]);

  // Extract profile from session
  const userProfile = useMemo(() => ({
    skills: session?.user?.skills || [],
    interests: session?.user?.interests || ['internship'],
    department: session?.user?.department || 'CSE'
  }), [session?.user]);
  
  // Autocomplete filtering
  const filteredSkills = useMemo(() => {
    if (!newSkill.trim()) return [];
    return SKILL_DICTIONARY.filter(sk => 
      sk.toLowerCase().includes(newSkill.toLowerCase()) && 
      (!userProfile.skills.some((s: string) => s.toLowerCase() === sk.toLowerCase()))
    ).slice(0, 5);
  }, [newSkill, userProfile]);

  useEffect(() => {
    async function fetchEmails(forceRefresh = false) {
      if (!session) return;
      try {
        setIsLoading(true);
        if (forceRefresh) setIsScanning(true);
        
        if (forceRefresh) {
          const res = await fetch('/api/internships');
          if (res.status === 401) {
            setError('SESSION_EXPIRED');
            setIsLoading(false);
            if (forceRefresh) setIsScanning(false);
            return;
          }
        }
        
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
              category: (e.category || 'internship') as OpportunityCategory,
              matchScore: calculateMatchScore(e.skillsRequired || [], e.category || 'internship', userProfile.skills, userProfile.interests, e.id),
              isBookmarked: opp.bookmarkStatus === 'SAVED',
              skillsRequired: e.skillsRequired || ['General Requirements'],
              location: 'Remote',
              stipendValue: e.stipend || 'Varies',
              applyLink: e.applyLink,
              createdAt: e.date || new Date().toISOString(),
              applicationStatus: opp.applicationStatus || 'none'
            } as unknown as Opportunity;
          });
          setOpportunities(mappedOpps);
        }
        
        // Record login time
        await recordLoginTimestamp();

      } catch (err) {
        console.error('Failed to fetch internships:', err);
      } finally {
        setIsLoading(false);
        setIsScanning(false);
      }
    }
    const hasScannedThisSession = sessionStorage.getItem('hasScannedThisSession');
    if (!hasScannedThisSession) {
      sessionStorage.setItem('hasScannedThisSession', 'true');
      fetchEmails(true);
    } else {
      fetchEmails(false);
    }
    
    (window as any).triggerRescan = () => {
      fetchEmails(true);
    };
  }, [session, userProfile.skills, userProfile.interests]);

  const handleRescan = () => {
    if (typeof window !== 'undefined' && (window as any).triggerRescan) {
      (window as any).triggerRescan();
    }
  };

  const handleAddSkill = async (skillToAdd: string) => {
    if (!skillToAdd.trim()) return;
    
    if (userProfile.skills.some((s: string) => s.toLowerCase() === skillToAdd.trim().toLowerCase())) {
      setNewSkill('');
      setShowDropdown(false);
      return;
    }
    
    const newSkills = [...userProfile.skills, skillToAdd.trim()];
    setNewSkill('');
    setShowDropdown(false);
    
    // Server action
    await updateUserSkills(newSkills);
    // Force session to update to get fresh skills locally
    await updateSession();
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAddSkill(newSkill);
  };

  const handleRemoveSkill = async (skillToRemove: string) => {
    const newSkills = userProfile.skills.filter((s: string) => s !== skillToRemove);
    await updateUserSkills(newSkills);
    await updateSession();
  };

  // Stats derived from opportunities state
  const stats = useMemo(() => {
    const totalFound = opportunities.length;
    const activeApplications = opportunities.filter(o => o.applicationStatus && o.applicationStatus !== 'rejected').length;
    const bookmarks = opportunities.filter(o => o.isBookmarked).length;
    
    const thisWeek = opportunities.filter(o => {
      const diff = new Date(o.deadline).getTime() - new Date().getTime();
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
      return days >= 0 && days <= 7;
    }).length;

    return { totalFound, activeApplications, bookmarks, thisWeek };
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
    return opportunities
      .filter(o => {
        const matchesSearch = 
          o.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          o.organisation.toLowerCase().includes(searchQuery.toLowerCase()) ||
          o.skillsRequired.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesCategory = selectedCategory === 'all' || o.category === selectedCategory;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === 'deadline') {
          const categorizeDeadline = (deadline: string) => {
            if (!deadline || deadline === 'Not Specified') return { tier: 1, time: Infinity };
            const t = new Date(deadline).getTime();
            if (isNaN(t)) return { tier: 1, time: Infinity };
            const isExpired = t < new Date().setHours(0, 0, 0, 0);
            if (isExpired) return { tier: 2, time: t };
            return { tier: 0, time: t };
          };

          const aVal = categorizeDeadline(a.deadline);
          const bVal = categorizeDeadline(b.deadline);

          if (aVal.tier !== bVal.tier) return aVal.tier - bVal.tier;
          if (aVal.tier === 0) return aVal.time - bVal.time;
          if (aVal.tier === 2) return bVal.time - aVal.time;
          return b.matchScore - a.matchScore;
        } else {
          return b.matchScore - a.matchScore;
        }
      });
  }, [opportunities, searchQuery, selectedCategory, sortBy]);

  const recommendedOpps = useMemo(() => [...opportunities].sort((a, b) => b.matchScore - a.matchScore).slice(0, 3), [opportunities]);
  const upcomingDeadlines = useMemo(() => [...opportunities].filter(o => new Date(o.deadline).getTime() >= new Date().getTime()).sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()).slice(0, 4), [opportunities]);

  const categoryPills = [
    { key: 'all', label: 'All Listings' },
    { key: 'internship', label: 'Internships' },
    { key: 'hackathon', label: 'Hackathons' },
    { key: 'scholarship', label: 'Scholarships' },
    { key: 'research', label: 'Research' },
    { key: 'workshop', label: 'Workshops' },
    { key: 'competition', label: 'Competitions' },
    { key: 'job', label: 'Jobs' },
  ];

  if (error === 'SESSION_EXPIRED') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 animate-fade-in relative z-10">
        <div className="w-20 h-20 bg-[#118AB2]/10 rounded-full flex items-center justify-center border border-[#118AB2]/30 shadow-[0_0_30px_rgba(247,37,133,0.2)]">
          <Clock className="w-10 h-10 text-[#118AB2]" />
        </div>
        <div className="text-center space-y-2 max-w-md">
          <h2 className="text-2xl font-black text-white">Session Expired</h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            For security reasons, Google requires us to refresh your inbox connection every 1 hour. Your session has timed out.
          </p>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="px-6 py-3 bg-[#06D6A0] hover:bg-[#04A77B] text-white font-bold rounded-xl shadow-lg transition flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" /> Sign In Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in relative z-10">
      <ScanningOverlay isVisible={showOverlay} />
      
      <div className="block md:hidden relative w-full mb-4">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input 
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search opportunities..."
          className="w-full pl-10 pr-4 py-2.5 bg-[#0A0A0A] border border-slate-900 rounded-full text-xs text-white outline-none focus:border-[#06D6A0]"
        />
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Welcome, {session?.user?.name?.split(' ')[0] || 'Student'} <Sparkles className="w-5.5 h-5.5 text-[#FFC107] animate-pulse" />
          </h1>
          <p className="text-xs text-slate-400">
            {session?.user?.email} • {session?.user?.graduationYear ? `Class of ${session?.user?.graduationYear}` : 'Verified VIT Student'}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-[10px] text-slate-500 font-mono bg-slate-950/40 p-2.5 rounded-xl border border-slate-900 inline-flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${isLoading ? 'bg-[#FFC107] animate-pulse' : 'bg-[#06D6A0] animate-ping'}`} />
            {isLoading ? 'Scanning live inbox...' : `Scan complete (found ${opportunities.length} opportunities)`}
          </div>
          <button 
            onClick={handleRescan}
            disabled={isLoading}
            className="flex items-center gap-2 px-3 py-2 bg-[#06D6A0]/10 hover:bg-[#06D6A0]/20 border border-[#06D6A0]/20 rounded-xl text-xs font-bold text-[#06D6A0] transition disabled:opacity-50"
          >
            {isLoading ? <Clock className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span>Rescan Inbox</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Opportunities Extracted', value: stats.totalFound, desc: 'scanned in past 90 days', border: 'border-[#06D6A0]/20' },
          { label: 'Active Applications', value: stats.activeApplications, desc: 'tracked on board', border: 'border-[#3A86FF]/20' },
          { label: 'Bookmarks Saved', value: stats.bookmarks, desc: 'priority notifications enabled', border: 'border-[#06D6A0]/20' },
          { label: 'Deadlines This Week', value: stats.thisWeek, desc: 'expiring in next 7 days', border: 'border-[#118AB2]/20' }
        ].map((s, idx) => (
          <div key={idx} className={`card glass-subtle p-5 space-y-1.5 border-l-4 ${s.border} flex flex-col justify-between`}>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{s.label}</p>
            <h3 className="text-2xl md:text-3xl font-black text-white">{s.value}</h3>
            <p className="text-[9px] text-slate-500">{s.desc}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        <div className="lg:col-span-8 space-y-6">
          
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 pb-2">
              {categoryPills.map(p => {
                const isActive = selectedCategory === p.key;
                const baseColor = p.key === 'all' ? '#FFFFFF' : (CATEGORY_CONFIG[p.key as OpportunityCategory]?.color || '#06D6A0');
                const activeTextColor = p.key === 'all' ? '#000000' : '#FFFFFF';
                
                return (
                  <button
                    key={p.key}
                    onClick={() => setSelectedCategory(p.key)}
                    className="px-3 py-1.5 rounded-full text-[10px] font-bold border transition whitespace-nowrap uppercase tracking-wider"
                    style={{
                      backgroundColor: isActive ? baseColor : '#0A0A0A',
                      borderColor: isActive ? baseColor : '#0f172a',
                      color: isActive ? activeTextColor : '#94a3b8',
                      boxShadow: isActive ? `0 4px 15px ${baseColor}30` : 'none'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.color = baseColor;
                        e.currentTarget.style.borderColor = baseColor;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.color = '#94a3b8';
                        e.currentTarget.style.borderColor = '#0f172a';
                      }
                    }}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between border-t border-slate-900 pt-3 text-xs text-slate-400">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" /> Sort by:
                </div>
                <button 
                  onClick={() => setSortBy('deadline')}
                  className={`font-semibold transition ${sortBy === 'deadline' ? 'text-white underline decoration-2 decoration-[#06D6A0] underline-offset-4' : 'hover:text-slate-200'}`}
                >
                  Deadline
                </button>
                <button 
                  onClick={() => setSortBy('match')}
                  className={`font-semibold transition ${sortBy === 'match' ? 'text-white underline decoration-2 decoration-[#06D6A0] underline-offset-4' : 'hover:text-slate-200'}`}
                >
                  Match Score
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded transition ${viewMode === 'grid' ? 'text-white bg-slate-900' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded transition ${viewMode === 'list' ? 'text-white bg-slate-900' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {filteredOpps.length === 0 ? (
            <div className="card glass-subtle p-12 text-center space-y-4">
              <AlertTriangle className="w-8 h-8 text-[#FFC107] mx-auto" />
              <div>
                <h3 className="font-bold text-white text-base">No matching opportunities found</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed pt-1">
                  Try tweaking your search term, resetting your category filters, or check settings to re-run Gmail scans.
                </p>
              </div>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid md:grid-cols-2 gap-4">
              {filteredOpps.map((opp) => {
                const conf = CATEGORY_CONFIG[opp.category];
                return (
                  <div key={opp.id} className="card glass p-5 flex flex-col justify-between space-y-4 hover:border-[#06D6A0]/30">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span 
                          className="badge font-bold uppercase" 
                          style={{ color: conf.color, backgroundColor: conf.bgColor }}
                        >
                          {conf.label}
                        </span>
                        
                        <div className="match-ring w-9 h-9">
                          <svg className="w-full h-full" viewBox="0 0 36 36">
                            <path className="text-slate-800" strokeWidth="2.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                            <path 
                              className="transition-all"
                              strokeWidth="2.5" 
                              strokeDasharray={`${opp.matchScore}, 100`} 
                              strokeLinecap="round" 
                              stroke="#06D6A0" 
                              fill="none" 
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                            />
                          </svg>
                          <span className="score-text text-[10px] text-white font-bold">{opp.matchScore}%</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <h3 className="font-extrabold text-sm text-white line-clamp-1 group-hover:text-[#48E5C2]">{opp.title}</h3>
                      </div>

                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
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
                          className={`p-2 rounded-lg border transition ${
                            opp.isBookmarked 
                              ? 'bg-[#06D6A0]/10 border-[#06D6A0]/25 text-[#06D6A0]' 
                              : 'bg-slate-905 border-slate-900 text-slate-500 hover:text-white'
                          }`}
                        >
                          <Bookmark className="w-4 h-4 fill-current" />
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
          ) : (
            <div className="space-y-2">
              {filteredOpps.map((opp) => {
                const conf = CATEGORY_CONFIG[opp.category];
                return (
                  <div key={opp.id} className="card glass p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-[#06D6A0]/30">
                    <div className="flex items-center gap-4 flex-1">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs" 
                        style={{ color: conf.color, backgroundColor: conf.bgColor }}
                      >
                        {conf.label[0]}
                      </div>

                      <div className="space-y-1">
                        <h4 className="font-extrabold text-sm text-white line-clamp-1">{opp.title}</h4>
                        <p className="text-[10px] text-slate-400">
                          <span className="font-bold text-slate-300">{opp.organisation}</span> • Exp: {formatDeadline(opp.deadline)} • Match: <strong className="text-[#06D6A0]">{opp.matchScore}%</strong>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-center">
                      <button 
                        onClick={() => toggleBookmark(opp.id)}
                        className={`p-2.5 rounded-lg border transition ${
                          opp.isBookmarked 
                            ? 'bg-[#06D6A0]/10 border-[#06D6A0]/20 text-[#06D6A0]' 
                            : 'bg-slate-905 border-slate-900 text-slate-500 hover:text-white'
                        }`}
                      >
                        <Bookmark className="w-3.5 h-3.5 fill-current" />
                      </button>
                      <Link 
                        href={`/opportunity/${opp.id}`}
                        className="btn-primary py-2 px-4 text-[10px] font-bold uppercase tracking-wider"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="lg:col-span-4 space-y-6">
          
          <div className="card glass-subtle p-5 space-y-4 relative z-50">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5"><GraduationCap className="w-4 h-4 text-[#48E5C2]" /> Skill Alignment</span>
            </h3>
            
            <div className="flex flex-wrap gap-1.5">
              {userProfile.skills.map((sk: string) => (
                <span key={sk} className="group flex items-center gap-1 px-2.5 py-1 rounded bg-[#06D6A0]/10 text-[9px] font-semibold text-[#48E5C2] uppercase border border-[#06D6A0]/15 transition hover:border-[#06D6A0]/50 hover:bg-[#06D6A0]/20">
                  {sk}
                  <button onClick={() => handleRemoveSkill(sk)} className="opacity-50 hover:opacity-100 transition p-0.5 rounded-full hover:bg-[#48E5C2]/20">
                    <X className="w-2.5 h-2.5" />
                  </button>
                </span>
              ))}
              {userProfile.skills.length === 0 && (
                <span className="text-[10px] text-slate-500 italic">No skills added yet</span>
              )}
            </div>
            
            <form onSubmit={handleFormSubmit} className="flex gap-2 relative">
              <input 
                type="text" 
                value={newSkill}
                onChange={(e) => {
                  setNewSkill(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                placeholder="Add a new skill (e.g. Python)"
                className="flex-1 bg-slate-900/50 border border-slate-800 rounded px-3 py-1.5 text-[11px] text-white focus:outline-none focus:border-[#06D6A0]/50 placeholder-slate-600"
              />
              <button 
                type="submit"
                disabled={!newSkill.trim()}
                className="bg-slate-800 hover:bg-[#06D6A0] disabled:opacity-50 disabled:hover:bg-slate-800 text-white rounded px-2.5 py-1.5 transition flex items-center justify-center"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
              
              {showDropdown && filteredSkills.length > 0 && (
                <div className="absolute top-full left-0 right-10 mt-1 bg-slate-900 border border-slate-700 rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden z-[100]">
                  {filteredSkills.map(sk => (
                    <button
                      key={sk}
                      type="button"
                      onMouseDown={() => handleAddSkill(sk)}
                      className="w-full text-left px-3 py-2 text-[11px] text-slate-300 hover:bg-[#06D6A0]/20 hover:text-white transition"
                    >
                      {sk}
                    </button>
                  ))}
                </div>
              )}
            </form>

            <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-900 text-[10px] text-slate-400 leading-normal">
              Based on your {userProfile.department}, listings requiring your specific skills currently hold your highest match recommendations.
            </div>
          </div>

          <div className="card glass-subtle p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Top Recommended Matches</h3>
            <div className="space-y-3">
              {recommendedOpps.map(opp => (
                <Link 
                  key={opp.id} 
                  href={`/opportunity/${opp.id}`}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-900 bg-slate-950/20 hover:bg-[#06D6A0]/5 hover:border-[#06D6A0]/20 transition group"
                >
                  <div className="space-y-1 overflow-hidden pr-2">
                    <h4 className="font-bold text-xs text-white truncate group-hover:text-[#48E5C2]">{opp.title}</h4>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{opp.organisation}</p>
                  </div>
                  <div className="w-8 h-8 shrink-0 rounded-full border border-[#06D6A0]/30 bg-[#06D6A0]/10 flex items-center justify-center text-[10px] font-extrabold text-[#06D6A0]">
                    {opp.matchScore}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="card glass-subtle p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Upcoming Deadlines</h3>
            <div className="space-y-3.5 relative pl-4 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-900">
              {upcomingDeadlines.map(opp => {
                const isUrgent = new Date(opp.deadline).getTime() - new Date().getTime() <= (1000 * 60 * 60 * 24 * 3);
                return (
                  <div key={opp.id} className="relative space-y-1">
                    <span className={`absolute -left-[18.5px] top-1.5 w-2 h-2 rounded-full border border-slate-950 ${isUrgent ? 'bg-[#118AB2]' : 'bg-[#FFC107]'}`} />
                    <Link href={`/opportunity/${opp.id}`} className="block font-bold text-xs text-slate-200 hover:text-white transition line-clamp-1">{opp.title}</Link>
                    <p className="text-[9px] text-slate-500 flex items-center gap-1.5">
                      {opp.organisation} • <span className={isUrgent ? 'text-[#118AB2] font-bold' : 'text-slate-400 font-medium'}>{formatDeadline(opp.deadline)}</span>
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
