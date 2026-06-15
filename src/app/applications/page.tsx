'use client';

import React, { useState, useMemo } from 'react';
import { 
  KanbanSquare, 
  Sparkles, 
  Calendar, 
  Award, 
  X, 
  Trash2, 
  Save, 
  ArrowLeftRight, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  CheckCircle2, 
  FileText
} from 'lucide-react';
import { Application, ApplicationStatus } from '@/lib/types';
import { formatDeadline } from '@/lib/utils';
import Link from 'next/link';

export default function Applications() {
  const [applications, setApplications] = useState<any[]>([]);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [notesInput, setNotesInput] = useState('');
  
  // Columns Definition
  const columns: { status: ApplicationStatus; label: string; color: string; border: string }[] = [
    { status: 'interested', label: 'Interested', color: 'text-slate-400', border: 'border-t-slate-500' },
    { status: 'applied', label: 'Applied', color: 'text-blue-400', border: 'border-t-blue-500' },
    { status: 'under_review', label: 'Under Review', color: 'text-amber-400', border: 'border-t-amber-500' },
    { status: 'offer_received', label: 'Offer Received', color: 'text-emerald-400', border: 'border-t-emerald-500' },
    { status: 'rejected', label: 'Rejected', color: 'text-rose-400', border: 'border-t-rose-500' }
  ];

  // Move Application Status
  const moveStatus = (appId: string, currentStatus: ApplicationStatus, direction: 'left' | 'right') => {
    const statusOrder: ApplicationStatus[] = ['interested', 'applied', 'under_review', 'offer_received', 'rejected'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    
    let newIndex = currentIndex;
    if (direction === 'left' && currentIndex > 0) newIndex--;
    if (direction === 'right' && currentIndex < statusOrder.length - 1) newIndex++;
    
    if (newIndex === currentIndex) return;
    
    const newStatus = statusOrder[newIndex];
    setApplications(prev => prev.map(app => {
      if (app.id === appId) {
        return {
          ...app,
          status: newStatus,
          updatedAt: new Date().toISOString(),
          appliedAt: newStatus === 'applied' ? new Date().toISOString() : app.appliedAt
        };
      }
      return app;
    }));
  };

  // Open Modal Card details
  const openCardDetails = (app: Application) => {
    setSelectedApp(app);
    setNotesInput(app.notes || '');
  };

  // Save notes inside detail card
  const saveNotes = () => {
    if (!selectedApp) return;
    setApplications(prev => prev.map(app => {
      if (app.id === selectedApp.id) {
        return { ...app, notes: notesInput, updatedAt: new Date().toISOString() };
      }
      return app;
    }));
    setSelectedApp(null);
  };

  // Delete application from Kanban
  const deleteApplication = (id: string) => {
    setApplications(prev => prev.filter(app => app.id !== id));
    setSelectedApp(null);
  };

  // Funnel analytics derived stats
  const stats = useMemo(() => {
    const total = applications.length;
    const offers = applications.filter(a => a.status === 'offer_received').length;
    const applied = applications.filter(a => a.status !== 'interested').length;
    
    const rate = applied > 0 ? Math.round((offers / applied) * 100) : 0;
    return { total, offers, applied, rate };
  }, [applications]);

  return (
    <div className="min-h-screen bg-[#050505] p-6 md:p-10 text-slate-100">
      <div className="space-y-8 animate-fade-in relative z-10 max-w-[1600px] mx-auto">
        
        {/* Back Button */}
        <Link 
          href="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white bg-slate-900/50 hover:bg-slate-900 border border-slate-800 rounded-full py-2 px-4 transition w-fit"
        >
          <ChevronLeft className="w-4 h-4" /> BACK TO DASHBOARD
        </Link>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              Application Funnel <KanbanSquare className="w-6 h-6 text-[#3A86FF]" />
            </h1>
            <p className="text-xs text-slate-400">
              Track placements, internships, and hackathons through progressive milestones.
            </p>
          </div>
        </div>

      {/* Summary KPI row */}
      <div className="grid grid-cols-3 gap-4 max-w-2xl">
        <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-900 text-center space-y-1">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Tracked</p>
          <h4 className="text-xl font-extrabold text-white">{stats.total}</h4>
        </div>
        <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-900 text-center space-y-1">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active Applications</p>
          <h4 className="text-xl font-extrabold text-white">{stats.applied}</h4>
        </div>
        <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-900 text-center space-y-1">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Acceptance Rate</p>
          <h4 className="text-xl font-extrabold text-[#06D6A0]">{stats.rate}%</h4>
        </div>
      </div>

      {/* Kanban Board Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {columns.map(col => {
          const colApps = applications.filter(a => a.status === col.status);
          return (
            <div key={col.status} className={`kanban-column flex flex-col space-y-3.5 border-t-2 ${col.border}`}>
              {/* Column header */}
              <div className="flex items-center justify-between border-b border-slate-900/60 pb-2">
                <span className="text-xs font-bold text-slate-200">{col.label}</span>
                <span className="text-[10px] font-bold bg-slate-900 px-2 py-0.5 rounded text-slate-400">
                  {colApps.length}
                </span>
              </div>

              {/* Column Body Cards */}
              <div className="flex-1 space-y-3 overflow-y-auto max-h-[50vh] pr-1">
                {colApps.length === 0 ? (
                  <p className="text-[10px] text-slate-600 italic text-center pt-8">No cards here.</p>
                ) : (
                  colApps.map(app => (
                    <div 
                      key={app.id} 
                      className="card glass p-3.5 space-y-3 hover:border-slate-800 hover:shadow-none hover:translate-y-0 cursor-pointer relative"
                    >
                      <div className="space-y-1.5" onClick={() => openCardDetails(app)}>
                        <h4 className="font-bold text-xs text-white line-clamp-1">{app.opportunity.title}</h4>
                        <p className="text-[9px] font-bold text-slate-400">{app.opportunity.organisation}</p>
                      </div>

                      {/* Info / controllers */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-950/60">
                        <span className="text-[8px] text-slate-500 font-mono">
                          Exp: {formatDeadline(app.opportunity.deadline)}
                        </span>
                        
                        {/* Quick switch arrows */}
                        <div className="flex items-center gap-1">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              moveStatus(app.id, app.status, 'left');
                            }}
                            className="p-1 rounded bg-slate-950 hover:bg-slate-900 text-slate-500 hover:text-white transition disabled:opacity-20"
                            disabled={app.status === 'interested'}
                          >
                            <ChevronLeft className="w-3 h-3" />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              moveStatus(app.id, app.status, 'right');
                            }}
                            className="p-1 rounded bg-slate-950 hover:bg-slate-900 text-slate-500 hover:text-white transition disabled:opacity-20"
                            disabled={app.status === 'rejected'}
                          >
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Card Details Overlay Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            onClick={() => setSelectedApp(null)}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          <div className="w-full max-w-[480px] card glass p-6 space-y-5 z-10 relative border-slate-800">
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="font-extrabold text-base text-white">{selectedApp.opportunity.title}</h3>
                <p className="text-xs font-bold text-slate-400">{selectedApp.opportunity.organisation}</p>
              </div>
              <button 
                onClick={() => setSelectedApp(null)}
                className="p-1.5 rounded-lg hover:bg-slate-900 text-slate-500 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick overview */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-950/40 p-3.5 rounded-xl border border-slate-900">
              <div>
                <p className="text-slate-500">Stipend/Compensation</p>
                <p className="font-bold text-slate-200">{selectedApp.opportunity.stipendValue || 'Unspecified'}</p>
              </div>
              <div>
                <p className="text-slate-500">Match score</p>
                <p className="font-bold text-[#06D6A0]">{selectedApp.opportunity.matchScore}% Match</p>
              </div>
            </div>

            {/* Notes Section */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <FileText className="w-3.5 h-3.5" /> Notes & Follow-ups
              </label>
              <textarea 
                rows={4}
                value={notesInput}
                onChange={(e) => setNotesInput(e.target.value)}
                placeholder="Paste interview questions, recruiter links, team requirements, etc."
                className="w-full p-3 bg-slate-950 border border-slate-900 rounded-xl text-xs text-slate-200 outline-none focus:border-[#06D6A0] leading-relaxed resize-none"
              />
            </div>

            {/* Timestamps */}
            <div className="text-[9px] text-slate-500 space-y-1 font-mono">
              <p>Timeline tracker:</p>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3 h-3 text-[#06D6A0]" />
                <span>Last updated: {new Date(selectedApp.updatedAt).toLocaleDateString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2.5 pt-2 border-t border-slate-900">
              <button 
                onClick={() => deleteApplication(selectedApp.id)}
                className="py-2.5 px-4 rounded-xl border border-rose-950/20 bg-rose-950/10 hover:bg-rose-950/25 text-xs text-rose-500 transition flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" /> Remove Application
              </button>
              <button 
                onClick={saveNotes}
                className="flex-1 py-2.5 rounded-xl bg-[#06D6A0] hover:bg-[#04A77B] text-xs font-bold text-white shadow-lg transition flex items-center justify-center gap-1.5"
              >
                <Save className="w-4 h-4" /> Save changes
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
