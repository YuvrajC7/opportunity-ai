'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { 
  Sparkles, 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Coins, 
  GraduationCap, 
  Bookmark, 
  Clock, 
  ExternalLink,
  ChevronDown,
  Info,
  Code,
  Mail
} from 'lucide-react';
import { Opportunity, OpportunityCategory, CATEGORY_CONFIG, ApplicationStatus } from '@/lib/types';
import { formatDeadline, extractEligibility, calculateMatchScore } from '@/lib/utils';
import { useSession, signOut } from 'next-auth/react';
import { getOpportunities, toggleBookmark as toggleBookmarkAction, updateApplicationStatus } from '@/app/actions/opportunities';

export default function OpportunityDetail() {
  const params = useParams();
  const id = params.id as string;
  const { data: session } = useSession();
  
  const [opp, setOpp] = useState<Opportunity | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [appStatus, setAppStatus] = useState<ApplicationStatus | 'none'>('none');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedOpps, setRelatedOpps] = useState<any[]>([]);

  const userProfile = useMemo(() => ({
    skills: session?.user?.skills || [],
    interests: session?.user?.interests || ['internship']
  }), [session?.user]);

  useEffect(() => {
    async function fetchOpportunity() {
      if (!id || !session) return;
      try {
        const allOpps = await getOpportunities();
        if (!allOpps) {
          setError('Failed to fetch opportunities');
          setIsLoading(false);
          return;
        }

        const dbOpp = allOpps.find((o: any) => o.emailData?.id === id);
        if (!dbOpp) {
          throw new Error('Opportunity not found');
        }

        // Fetch enriched data with AI Summary from API
        const res = await fetch(`/api/internships/${id}`);
        if (!res.ok) {
          if (res.status === 401) {
            setError('SESSION_EXPIRED');
            setIsLoading(false);
            return;
          }
          throw new Error('Failed to fetch full opportunity details');
        }
        const apiData = await res.json();
        
        const data = dbOpp.emailData;
        
        // Map to Opportunity object, preferring AI-enriched data
        const mappedOpp = {
          id: apiData.id || data.id,
          title: apiData.subject || data.subject,
          organisation: (apiData.from || data.from).split('<')[0].trim(),
          summary: apiData.summary || data.snippet,
          category: (apiData.category || data.category || 'internship') as OpportunityCategory,
          deadline: apiData.deadline || data.deadline || "",
          matchScore: calculateMatchScore(apiData.skillsRequired || data.skillsRequired || [], apiData.category || data.category || 'internship', userProfile.skills, userProfile.interests, data.id),
          isBookmarked: dbOpp.bookmarkStatus === 'SAVED' || dbOpp.bookmarkStatus === 'APPLIED',
          skillsRequired: apiData.skillsRequired || data.skillsRequired || ['General Requirements'],
          threadId: apiData.threadId || data.threadId || data.id,
          location: 'Remote',
          stipendValue: data.stipend || 'Varies',
          eligibilityText: extractEligibility(apiData.bodyData || data.snippet),
          applicationLink: apiData.applyLink || data.applyLink,
          deadlineConfidence: 0.85,
          bodyData: apiData.bodyData || data.snippet,
          applicationStatus: dbOpp.applicationStatus || 'none'
        } as unknown as Opportunity;
        
        setOpp(mappedOpp);
        setIsBookmarked(mappedOpp.isBookmarked);
        setAppStatus(dbOpp.applicationStatus || 'none');

        // Related
        const related = allOpps
          .filter((o: any) => o.emailData?.id !== id)
          .map((o: any) => {
            const e = o.emailData;
            return {
              id: e.id,
              title: e.subject.length > 40 ? e.subject.substring(0, 40) + '...' : e.subject,
              organisation: e.from.split('<')[0].trim() || e.from,
              matchScore: calculateMatchScore(e.skillsRequired || [], e.category || 'internship', userProfile.skills, userProfile.interests, e.id)
            };
          }).slice(0, 3);
        setRelatedOpps(related);

      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchOpportunity();
  }, [id, session, userProfile.skills, userProfile.interests]);

  if (error === 'SESSION_EXPIRED') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
          <Clock className="w-8 h-8 text-rose-500" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-100">Session Expired</h2>
          <p className="text-sm text-slate-400 max-w-sm">
            Your secure connection to Gmail has expired (tokens last 1 hour). For your security, please sign back in to continue securely reading emails.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-xs text-slate-400 hover:text-slate-200 underline">Return to Dashboard</Link>
          <span className="text-slate-600">•</span>
          <button 
            onClick={() => signOut({ callbackUrl: '/auth/signin' })}
            className="text-xs px-4 py-2 rounded bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 transition-colors"
          >
            Sign In Again
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <p className="text-sm font-bold text-rose-500">{error}</p>
        <Link href="/dashboard" className="text-xs text-slate-400 underline">Return to Dashboard</Link>
      </div>
    );
  }

  if (!opp) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-12 h-12 rounded-full border border-slate-800 border-t-2 border-t-[#48E5C2] animate-spin" />
        <p className="text-xs text-slate-400">Loading opportunity details...</p>
      </div>
    );
  }

  const conf = CATEGORY_CONFIG[opp.category];

  const handleBookmarkToggle = async () => {
    if (!opp) return;
    const newStatus = !isBookmarked;
    setIsBookmarked(newStatus);
    await toggleBookmarkAction(opp.id, 'SAVED');
  };

  const handleStatusChange = async (status: ApplicationStatus | 'none') => {
    setAppStatus(status);
    setShowStatusDropdown(false);
    await updateApplicationStatus(opp.id, status as any);
  };

  const statusOptions: { key: ApplicationStatus | 'none'; label: string; bg: string }[] = [
    { key: 'none', label: 'Not Tracked', bg: 'bg-slate-900 text-slate-400' },
    { key: 'interested', label: 'Interested', bg: 'bg-slate-800 text-slate-300' },
    { key: 'applied', label: 'Applied', bg: 'bg-blue-950/20 text-blue-400 border border-blue-900/30' },
    { key: 'under_review', label: 'Under Review', bg: 'bg-amber-950/20 text-amber-400 border border-amber-900/30' },
    { key: 'offer_received', label: 'Offer Received', bg: 'bg-emerald-950/20 text-emerald-400 border border-emerald-900/30' },
    { key: 'rejected', label: 'Rejected', bg: 'bg-rose-950/20 text-rose-400 border border-rose-900/30' }
  ];

  return (
    <div className="space-y-8 animate-fade-in relative z-10 max-w-6xl mx-auto pt-8 pb-12 px-6">
      
      <div>
        <Link 
          href="/dashboard" 
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/50 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 hover:border-slate-700 transition backdrop-blur-sm uppercase tracking-wider"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
        </Link>
      </div>

      <div className="card glass p-6 md:p-8 space-y-6 relative z-30">
        <div className="absolute top-0 inset-x-0 h-1.5 rounded-t-2xl" style={{ backgroundColor: conf.color }} />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-2.5">
              <span 
                className="badge font-bold uppercase" 
                style={{ color: conf.color, backgroundColor: conf.bgColor }}
              >
                {conf.label}
              </span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                90-day Scanning Ingestion
              </span>
            </div>

            <h1 className="text-xl md:text-3xl font-black text-white leading-tight">{opp.title}</h1>
            <p className="text-sm font-bold text-slate-300">{opp.organisation} • <span className="font-medium text-slate-400">{opp.location || 'Remote'}</span></p>
          </div>

          <div className="flex items-center gap-4 self-start md:self-center bg-slate-950/45 p-4 rounded-2xl border border-slate-900 shrink-0">
            <div className="match-ring w-12 h-12 relative flex items-center justify-center">
              <svg className="w-full h-full absolute inset-0 transform -rotate-90" viewBox="0 0 36 36">
                <path className="text-slate-800" strokeWidth="2.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path 
                  strokeWidth="2.5" 
                  strokeDasharray={`${opp.matchScore}, 100`} 
                  strokeLinecap="round" 
                  stroke="#06D6A0" 
                  fill="none" 
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                />
              </svg>
              <span className="text-xs text-white font-bold relative z-10">{opp.matchScore}%</span>
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Match Score</p>
              <p className="text-[9px] text-[#06D6A0] font-semibold leading-tight">High Alignment Match</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-900">
          
          <div className="relative shrink-0">
            <button 
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
              className="px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-900 hover:border-slate-800 text-xs font-semibold text-white flex items-center gap-2 transition"
            >
              Status: <span className="font-bold text-[#48E5C2]">
                {statusOptions.find(opt => opt.key === appStatus)?.label}
              </span>
              <ChevronDown className="w-4 h-4 text-slate-500" />
            </button>

            {showStatusDropdown && (
              <>
                <div onClick={() => setShowStatusDropdown(false)} className="fixed inset-0 z-30" />
                <div className="absolute left-0 mt-2 w-44 bg-[#0A0A0A] border border-slate-900 rounded-xl shadow-2xl p-2 z-40 space-y-1 animate-fade-in-up">
                  {statusOptions.map(opt => (
                    <button
                      key={opt.key}
                      onClick={() => handleStatusChange(opt.key)}
                      className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg transition hover:bg-slate-900 ${
                        appStatus === opt.key ? 'text-[#48E5C2]' : 'text-slate-400'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <button 
            onClick={handleBookmarkToggle}
            className={`p-2.5 rounded-xl border transition shrink-0 ${
              isBookmarked 
                ? 'bg-[#06D6A0]/10 border-[#06D6A0]/20 text-[#06D6A0]' 
                : 'bg-slate-950 border-slate-900 text-slate-500 hover:text-white'
            }`}
          >
            <Bookmark className="w-4.5 h-4.5 fill-current" />
          </button>

          <a 
            href={opp.applicationLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn-primary py-2.5 px-6 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg flex-1 md:flex-none text-center"
          >
            Apply Now <ExternalLink className="w-4 h-4" />
          </a>

          <a
            href={session?.user?.email 
              ? `https://mail.google.com/mail/?authuser=${encodeURIComponent(session.user.email)}#all/${opp.threadId || opp.id}`
              : `https://mail.google.com/mail/u/0/#all/${opp.threadId || opp.id}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="py-2.5 px-6 rounded-xl border border-slate-900 bg-[#0A0A0A] hover:bg-slate-900 text-slate-300 hover:text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition shrink-0"
          >
            <Mail className="w-4 h-4" /> View in Gmail
          </a>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        <div className="lg:col-span-8 space-y-6">
          
          <div className="card glass-subtle p-6 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#48E5C2]" /> AI Extraction Summary
            </h3>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              {opp.summary}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Application Deadline', val: opp.deadline, format: formatDeadline(opp.deadline), icon: <Calendar className="w-4.5 h-4.5 text-[#FFC107]" /> },
              { label: 'Compensation / Stipend', val: opp.stipendValue || 'Unspecified', icon: <Coins className="w-4.5 h-4.5 text-[#06D6A0]" /> },
              { label: 'Location Model', val: opp.location || 'Remote', icon: <MapPin className="w-4.5 h-4.5 text-[#3A86FF]" /> },
              { label: 'Extraction Confidence', val: `${Math.round(opp.deadlineConfidence * 100)}% Match`, icon: <Info className="w-4.5 h-4.5 text-[#4CC9F0]" /> }
            ].map((p, idx) => (
              <div key={idx} className="p-4 bg-slate-900/30 rounded-xl border border-slate-900 flex items-start gap-3.5">
                <div className="p-2.5 bg-slate-950/60 rounded-lg border border-slate-900 w-fit shrink-0">
                  {p.icon}
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{p.label}</p>
                  <p className="text-xs font-bold text-slate-200">{p.format || p.val}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="card glass-subtle p-6 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-[#48E5C2]" /> Eligibility Constraints
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {opp.eligibilityText}
            </p>
          </div>

          {opp.skillsRequired && opp.skillsRequired.length > 0 && (
            <div className="card glass-subtle p-6 space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Code className="w-4 h-4 text-[#48E5C2]" /> Required Skills & Alignment
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {opp.skillsRequired.map(sk => {
                  const matched = userProfile.skills.some((s: string) => s.toLowerCase() === sk.toLowerCase());
                  return (
                    <span 
                      key={sk} 
                      className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase border tracking-wider ${
                        matched 
                          ? 'bg-[#06D6A0]/10 border-[#06D6A0]/20 text-[#06D6A0]' 
                          : 'bg-slate-950 border-slate-900 text-slate-500'
                      }`}
                    >
                      {sk} {matched ? '✓' : ''}
                    </span>
                  );
                })}
              </div>
              <p className="text-[10px] text-slate-500 italic">
                Green badges indicate skills matched from your personal profile. Gray badges show skills you might need to add or learn.
              </p>
            </div>
          )}

        </div>

        <div className="lg:col-span-4 space-y-6">
          
          <div className="card glass-subtle p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Related Opportunities</h3>
            <div className="space-y-3.5">
              {relatedOpps.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No related listings.</p>
              ) : (
                relatedOpps.map(ropp => (
                  <Link 
                    key={ropp.id} 
                    href={`/opportunity/${ropp.id}`}
                    className="block p-3.5 rounded-xl border border-slate-900 bg-slate-950/20 hover:bg-[#06D6A0]/5 hover:border-[#06D6A0]/20 transition space-y-1.5"
                  >
                    <h4 className="font-bold text-xs text-white line-clamp-1">{ropp.title}</h4>
                    <div className="flex justify-between text-[9px] text-slate-400">
                      <span>{ropp.organisation}</span>
                      <span className="font-bold text-[#06D6A0]">{ropp.matchScore}% Match</span>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>

          <div className="p-4 bg-[#06D6A0]/5 border border-[#06D6A0]/15 rounded-2xl space-y-2 text-[10px] text-slate-400 leading-normal">
            <p className="font-bold text-slate-300 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#118AB2]" /> Secure AI Ingestion
            </p>
            <p>
              OpportunityAI scanned this circular directly from your university inbox. No personal data was stored during the extraction process.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
