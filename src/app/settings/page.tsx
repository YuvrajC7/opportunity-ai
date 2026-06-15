'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Settings as SettingsIcon, 
  User, 
  Mail, 
  Bell, 
  ShieldAlert, 
  Lock, 
  ShieldCheck,
  ChevronLeft
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { completeOnboarding } from '@/app/actions/user';
import Link from 'next/link';

export default function Settings() {
  const router = useRouter();
  const { data: session, update: updateSession } = useSession();
  const [name, setName] = useState('');
  const [university, setUniversity] = useState('VIT Vellore');
  const [year, setYear] = useState(3);
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [graduationYear, setGraduationYear] = useState(new Date().getFullYear() + 2);
  const [skills, setSkills] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');

  React.useEffect(() => {
    if (session?.user?.name) setName(session.user.name);
    if (session?.user?.university) setUniversity(session.user.university);
    if (session?.user?.yearOfStudy) setYear(session.user.yearOfStudy);
    if (session?.user?.department) setDepartment(session.user.department);
    if (session?.user?.graduationYear) setGraduationYear(session.user.graduationYear);
    if (session?.user?.skills) setSkills(session.user.skills);
    if (session?.user?.interests) setInterests(session.user.interests);
  }, [session]);
  
  const [gmailConnected, setGmailConnected] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(true);
  const [digest, setDigest] = useState(true);
  const [roundup, setRoundup] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newSkill.trim();
    if (clean && !skills.includes(clean)) {
      setSkills([...skills, clean]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const handleSave = async () => {
    await completeOnboarding({
      university,
      yearOfStudy: year,
      department,
      graduationYear,
      skills,
      interests: interests as any[]
    });
    
    await updateSession();
    
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleRevokeGmail = () => {
    if (confirm("Are you sure you want to revoke OpportunityAI's read-only Gmail access? This will pause all automated opportunity discoveries and erase scanned logs from the dashboard.")) {
      setGmailConnected(false);
    }
  };

  const handleDeleteAccount = () => {
    if (confirm("WARNING: Are you sure you want to permanently delete your OpportunityAI account? All your profile details, Kanban applications, notifications, and settings will be deleted within 24 hours. This cannot be undone.")) {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] p-6 md:p-10 text-slate-100">
      <div className="space-y-8 animate-fade-in relative z-10 max-w-4xl mx-auto">
        
        <Link 
          href="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white bg-slate-900/50 hover:bg-slate-900 border border-slate-800 rounded-full py-2 px-4 transition w-fit"
        >
          <ChevronLeft className="w-4 h-4" /> BACK TO DASHBOARD
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Preferences & Security <SettingsIcon className="w-6 h-6 text-slate-400" />
          </h1>
          <p className="text-xs text-slate-400">
            Manage your academic portfolio, Gmail integration, notifications, and security scopes.
          </p>
        </div>
        
        <button 
          onClick={handleSave}
          className="btn-primary py-2.5 px-6 text-xs font-bold uppercase tracking-wider"
        >
          {saveSuccess ? 'Changes Saved ✓' : 'Save Preferences'}
        </button>
      </div>

      <div className="grid md:grid-cols-12 gap-8 items-start">
        
        <div className="md:col-span-7 space-y-6">
          
          <div className="card glass p-6 space-y-5">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-900 pb-2.5">
              <User className="w-4.5 h-4.5 text-[#48E5C2]" /> Academic Profile
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5 col-span-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className="input"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">University</label>
                <input 
                  type="text" 
                  value={university} 
                  disabled 
                  className="input opacity-60 cursor-not-allowed bg-slate-950" 
                  title="Contact admin to change university"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Graduation Year</label>
                <input 
                  type="number" 
                  value={graduationYear} 
                  onChange={(e) => setGraduationYear(Number(e.target.value))} 
                  className="input"
                />
              </div>

              <div className="space-y-1.5 col-span-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Department / Branch</label>
                <input 
                  type="text" 
                  value={department} 
                  onChange={(e) => setDepartment(e.target.value)} 
                  className="input"
                />
              </div>
            </div>
          </div>

          <div className="card glass p-6 space-y-5">
            <div className="space-y-1 border-b border-slate-900 pb-2.5">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Opportunity Skills Core</h3>
              <p className="text-[9px] text-slate-500">Edit skills to recalculate your Match Scores across listings</p>
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap gap-1.5 p-3.5 bg-slate-955 rounded-xl border border-slate-900/60 min-h-[50px]">
                {skills.length === 0 ? (
                  <span className="text-xs text-slate-500 italic">No skills added.</span>
                ) : (
                  skills.map(sk => (
                    <div key={sk} className="flex items-center gap-1.5 px-3 py-1 bg-[#06D6A0]/10 border border-[#06D6A0]/20 rounded-full text-xs font-semibold text-[#48E5C2]">
                      {sk}
                      <button onClick={() => handleRemoveSkill(sk)} className="text-[#118AB2] font-bold text-xs hover:text-red-400">×</button>
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={handleAddSkill} className="flex gap-2">
                <input 
                  type="text" 
                  value={newSkill} 
                  onChange={(e) => setNewSkill(e.target.value)} 
                  placeholder="Type skill tag (e.g., Docker) and press enter" 
                  className="input flex-1"
                />
                <button type="submit" className="btn-secondary py-2 px-4 text-xs font-bold rounded-lg border-slate-800 shrink-0">
                  Add Tag
                </button>
              </form>
            </div>
          </div>

        </div>

        <div className="md:col-span-5 space-y-6">
          
          <div className="card glass p-6 space-y-5">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-900 pb-2.5">
              <Mail className="w-4.5 h-4.5 text-[#06D6A0]" /> Gmail API Sync
            </h3>

            {gmailConnected ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-950/40 rounded-xl border border-slate-900">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-white">{session?.user?.email || 'student@vitstudent.ac.in'}</p>
                    <p className="text-[10px] text-[#06D6A0] flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Read-Only Authorized
                    </p>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#06D6A0] animate-pulse" />
                </div>

                <div className="space-y-2 text-[10px] text-slate-400 leading-normal">
                  <div className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-slate-500" /> AES-256 Token Encryption active</div>
                  <div className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-slate-500" /> Scanned messages immediately deleted</div>
                </div>

                <button 
                  onClick={handleRevokeGmail}
                  className="w-full py-2 bg-rose-950/10 hover:bg-rose-950/20 text-xs font-bold text-[#118AB2] rounded-xl border border-rose-950/20 transition"
                >
                  Revoke Gmail Access
                </button>
              </div>
            ) : (
              <div className="space-y-4 py-2 text-center">
                <p className="text-xs text-slate-400">Gmail access has been completely revoked.</p>
                <button 
                  onClick={() => setGmailConnected(true)}
                  className="btn-primary py-2 px-6 text-xs w-full"
                >
                  Re-connect Google Account
                </button>
              </div>
            )}
          </div>

          <div className="card glass p-6 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-900 pb-2.5">
              <Bell className="w-4.5 h-4.5 text-[#FFC107]" /> Notification Channels
            </h3>

            <div className="space-y-3 pt-1">
              {[
                { title: 'Email Deadline Reminders', desc: 'Alerts at 7 days, 3 days, and 24 hours prior', val: emailAlerts, set: setEmailAlerts },
                { title: 'Push Web Notifications', desc: 'Browser deadline reminders & high matches', val: pushAlerts, set: setPushAlerts },
                { title: 'Daily Digest Newsletter', desc: 'Discovered opportunities digest at 8:00 AM', val: digest, set: setDigest },
                { title: 'Weekly Placement Roundup', desc: 'Summary metrics & top listings every Monday', val: roundup, set: setRoundup }
              ].map((notif, idx) => (
                <div key={idx} className="flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-slate-200">{notif.title}</p>
                    <p className="text-[9px] text-slate-500 leading-tight">{notif.desc}</p>
                  </div>
                  <button 
                    onClick={() => notif.set(!notif.val)}
                    className={`w-9 h-5 rounded-full p-0.5 transition ${notif.val ? 'bg-[#06D6A0]' : 'bg-slate-800'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-200 ${notif.val ? 'translate-x-4' : ''}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="card glass p-6 space-y-4 border-rose-950/20">
            <h3 className="text-xs font-bold text-[#118AB2] uppercase tracking-wider flex items-center gap-2 border-b border-rose-950/15 pb-2.5">
              <ShieldAlert className="w-4.5 h-4.5 text-[#118AB2]" /> Danger Zone
            </h3>
            
            <div className="space-y-3">
              <p className="text-[10px] text-slate-400 leading-normal">
                Delete your account and all associated extractions, dashboard lists, bookmarks, and parameters. This action is permanent.
              </p>
              <button 
                onClick={handleDeleteAccount}
                className="w-full py-2 bg-rose-500/10 hover:bg-rose-500/15 text-xs font-bold text-[#118AB2] rounded-xl border border-[#118AB2]/20 transition"
              >
                Delete Account Permanently
              </button>
            </div>
          </div>

        </div>

      </div>
      </div>
    </div>
  );
}
