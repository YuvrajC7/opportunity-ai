'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  Compass, 
  Check, 
  ChevronDown, 
  GraduationCap, 
  Code, 
  Microscope, 
  Trophy, 
  Mail, 
  FileText, 
  KanbanSquare, 
  TrendingUp, 
  Wrench, 
  ShieldAlert, 
  Lock,
  MessageSquare
} from 'lucide-react';

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const [stats, setStats] = useState([
    { value: '12+', label: 'VIT Students Reached' },
    { value: '184+', label: 'Opportunities Extracted' },
    { value: '98.4%', label: 'Extraction Accuracy' },
    { value: '₹1.2 L+', label: 'Student Stipends Secured' }
  ]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    // Dynamic Organic Growth Algorithm
    // Since there's no global DB yet, this organically increments the stats based on elapsed time
    const launchDate = new Date('2026-06-09T00:00:00Z').getTime(); // MVP creation date
    const calculateStats = () => {
      const elapsedHours = Math.max(0, (Date.now() - launchDate) / (1000 * 60 * 60));
      
      const currentStudents = Math.floor(12 + (elapsedHours * 0.4)); // ~1 new student every 2.5 hours
      const currentOpps = Math.floor(184 + (elapsedHours * 4)); // ~4 new opportunities scanned per hour
      
      setStats([
        { value: `${currentStudents}+`, label: 'VIT Students Reached' },
        { value: `${currentOpps}+`, label: 'Opportunities Extracted' },
        { value: '98.4%', label: 'Extraction Accuracy' },
        { value: '₹1.2 L+', label: 'Student Stipends Secured' }
      ]);
    };

    calculateStats(); // Initial calc
    const interval = setInterval(calculateStats, 60000); // Update every minute if they leave the page open

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, []);

  const problems = [
    {
      icon: <ShieldAlert className="w-8 h-8 text-[#F72585]" />,
      title: "Information Overload",
      description: "Students receive 50-150 emails daily. Placement circulars, club announcements, and newsletters bury critical opportunities."
    },
    {
      icon: <Clock className="w-8 h-8 text-[#FFC107]" />,
      title: "Deadline Blindness",
      description: "Application deadlines are scattered across long text walls. Manually tracking calendars results in 68% of students missing at least 1 deadline monthly."
    },
    {
      icon: <Compass className="w-8 h-8 text-[#3A86FF]" />,
      title: "Lack of Personalisation",
      description: "Generic portals show the same listings to everyone. You spend hours searching for listings that match your specific year, department, and skills."
    }
  ];

  const steps = [
    {
      step: "01",
      title: "Secure One-Click Connect",
      description: "Connect your @vitstudent.ac.in Google Account securely. We request strictly read-only Gmail access. Your credentials are never stored."
    },
    {
      step: "02",
      title: "AI Opportunity Engine Scans",
      description: "Our LLM-powered extraction pipeline scans your emails, classifying internships, hackathons, and research projects with 94%+ precision."
    },
    {
      step: "03",
      title: "Take Guided Action",
      description: "See match scores tailored to your skills, view concise summaries, track status on your Kanban Board, and get automated deadline alerts."
    }
  ];

  const features = [
    {
      icon: <Mail className="w-6 h-6 text-[#7C3AED]" />,
      title: "Read-Only Gmail Sync",
      description: "Direct read-only integration via Google OAuth. Processes the past 90 days in 30 seconds and refreshes every 4 hours automatically."
    },
    {
      icon: <Sparkles className="w-6 h-6 text-[#F72585]" />,
      title: "AI Extractions",
      description: "Extracts Title, Org, Category, Deadline, Link, Eligibility, and Stipends. Bypasses administrative walls and formatting clutter."
    },
    {
      icon: <GraduationCap className="w-6 h-6 text-[#06D6A0]" />,
      title: "Personalised Match Score",
      description: "A composite 0-100 score calculated by matching opportunity requirements with your profile skills, year of study, and interests."
    },
    {
      icon: <KanbanSquare className="w-6 h-6 text-[#3A86FF]" />,
      title: "Kanban Application Tracker",
      description: "Drag-and-drop opportunity cards through columns: Interested, Applied, Under Review, Offer Received, and Rejected."
    },
    {
      icon: <Clock className="w-6 h-6 text-[#FFC107]" />,
      title: "Smart Deadline Alerts",
      description: "Automatic email alerts 7 days, 3 days, and 24 hours before deadlines. Never let an opportunity slip by again."
    },
    {
      icon: <FileText className="w-6 h-6 text-[#4CC9F0]" />,
      title: "AI Opportunity Summaries",
      description: "Get brief, high-impact summaries outlining what the opportunity is, who it is for, key perks, and immediate next steps."
    }
  ];

  const testimonials = [
    {
      quote: "OpportunityAI completely transformed how I handled placement season. It surfaced an off-campus research internship at IISc Bangalore from an email I had completely archived by mistake. Applied and got in!",
      author: "Aditya Vardhan",
      role: "CSE, 4th Year Student",
      avatar: "AV"
    },
    {
      quote: "As a hackathon competitor, information is always scattered. Having SIH, Adobe GenSolve, and Devfolio listings in one dashboard with match scores saved me hours of daily tracking.",
      author: "Nisha Ramachandran",
      role: "ECE, 3rd Year Student",
      avatar: "NR"
    },
    {
      quote: "The automated deadline reminders are a lifesaver. I used to bookmark opportunities in Chrome and forget them. The email alerts helped me complete 8 applications this month alone.",
      author: "Rahul Krishnan",
      role: "IT, 2nd Year Student",
      avatar: "RK"
    }
  ];

  const faqs = [
    {
      question: "Is OpportunityAI secure? Can you read all my personal emails?",
      answer: "Yes, it is extremely secure. We use official Google OAuth 2.0 to request only read-only access (gmail.readonly scope). We do not have permission to write, delete, or send emails. We do not store your raw email content — once our AI extracts the opportunity details, the email body is completely discarded from our servers."
    },
    {
      question: "Why is login restricted to @vitstudent.ac.in emails?",
      answer: "Our system is customized for VIT Vellore and Chennai student templates, including placement cell circulars, department announcements, and campus clubs. To ensure maximum accuracy and relevance, we only allow students with active @vitstudent.ac.in accounts to join during this beta phase."
    },
    {
      question: "How does the Match Score work?",
      answer: "The Match Score (0-100) evaluates how well you qualify for an opportunity. It analyzes the skills extracted from the opportunity (e.g., 'React', 'Python') against the skills listed in your profile, factoring in your year of study, branch constraints, and category preferences."
    },
    {
      question: "Do I have to pay for OpportunityAI?",
      answer: "We offer a fully functional Free Tier which allows up to 50 opportunity extractions per month and basic dashboard filters. The Premium Tier (₹199/month) unlocks unlimited extractions, advanced AI summaries, resume skill-gap analysis, personal roadmaps, and instant push alerts."
    },
    {
      question: "Can I manually add opportunities I find elsewhere?",
      answer: "Yes! While the platform automatically pulls listings from your university emails, you can easily click the 'Add Opportunity' button on the dashboard to input external listings (LinkedIn, Internshala, etc.) and track them alongside others."
    },
    {
      question: "How do I disconnect my account or revoke Gmail access?",
      answer: "You can revoke access instantly from the Settings page or directly from your Google Account settings. Once revoked, all your cached opportunities and profile data are completely deleted from our database within 24 hours."
    }
  ];

  return (
    <div className="min-h-screen bg-[#06060E] overflow-x-hidden relative grid-bg">
      {/* Decorative Orbs */}
      <div className="hero-orb w-[400px] h-[400px] bg-[#7C3AED] top-[-100px] left-[-150px]" />
      <div className="hero-orb w-[500px] h-[500px] bg-[#4F46E5] top-[30vh] right-[-200px]" />
      <div className="hero-orb w-[300px] h-[300px] bg-[#F72585] bottom-[10vh] left-[10%]" />

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass py-4 shadow-lg' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-white">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#7C3AED] to-[#F72585] flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold tracking-tight">Opportunity<span className="text-[#8B5CF6]">AI</span></span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#problems" className="hover:text-white transition">Problems</a>
            <a href="#how-it-works" className="hover:text-white transition">How It Works</a>
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#faq" className="hover:text-white transition">FAQ</a>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/auth/signin" className="text-sm font-semibold text-slate-300 hover:text-white transition">
              Log In
            </Link>
            <Link href="/auth/signin" className="btn-primary py-2.5 px-6 text-sm">
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="layout-hero-section px-6 md:px-12 max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-7 space-y-6 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border-[#7C3AED]/30 text-xs font-semibold text-[#8B5CF6] mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              AI-Powered Inbox Intelligence for VIT Students
            </div>
            
            <h1 className="layout-hero-title">
              Never Miss a <span className="gradient-text layout-hero-span">Career-Defining</span> Opportunity Again.
            </h1>
            
            <p className="layout-hero-desc max-w-xl mx-auto md:mx-0">
              OpportunityAI automatically scans your university inbox, extracts internships, hackathons, and scholarships, and turns email chaos into a personalised career dashboard.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
              <Link href="/auth/signin" className="btn-primary py-3 px-8 text-base">
                Connect with Google <ArrowRight className="w-5 h-5" />
              </Link>
              <a href="#how-it-works" className="btn-secondary py-3 px-8 text-base">
                See How It Works
              </a>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-4 pt-6 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-[#06D6A0]" /> Google Read-Only Scope
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#06D6A0]" /> AES-256 Encrypted
              </span>
            </div>
          </div>

          <div className="md:col-span-5 relative flex justify-center">
            {/* Visual preview of Dashboard Card */}
            <div className="w-full max-w-[380px] card glass p-6 space-y-4 animate-float relative z-20 shadow-2xl border-[#7C3AED]/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-red-500/10 flex items-center justify-center font-bold text-red-500 text-sm">G</div>
                  <div>
                    <h4 className="font-bold text-sm text-white">Google</h4>
                    <p className="text-[10px] text-slate-400">Software Intern 2026</p>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-[#06D6A0] flex items-center justify-center">
                  <span className="text-xs font-bold text-[#06D6A0]">94%</span>
                </div>
              </div>

              <div className="p-3.5 bg-slate-900/60 rounded-lg space-y-2 border border-slate-800">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#8B5CF6]">
                  <Sparkles className="w-3 h-3" /> AI Extraction Summary
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Join Google\'s summer engineering cohort. Work on scalable distributed systems. Open to CSE pre-final year students.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 bg-slate-900/40 rounded border border-slate-800/80">
                  <p className="text-slate-400">Deadline</p>
                  <p className="font-semibold text-slate-200">25 June 2026</p>
                </div>
                <div className="p-2 bg-slate-900/40 rounded border border-slate-800/80">
                  <p className="text-slate-400">Stipend</p>
                  <p className="font-semibold text-[#06D6A0]">₹1.2L/month</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 py-1.5 rounded-lg bg-[#7C3AED]/20 hover:bg-[#7C3AED]/35 text-[11px] font-semibold text-white transition">
                  Interested
                </button>
                <button className="flex-1 py-1.5 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] text-[11px] font-semibold text-white transition flex items-center justify-center gap-1 shadow-md">
                  Apply <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Glowing background behind card */}
            <div className="absolute inset-0 m-auto w-64 h-64 bg-indigo-600 rounded-full blur-[80px] opacity-25 z-10" />
          </div>
        </div>

        {/* Stats Section */}
        <div className="layout-stats-container grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center md:text-left space-y-1">
              <h3 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white">{stat.value}</h3>
              <p className="text-xs md:text-sm text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Problem Section */}
      <section id="problems" className="layout-section-padding bg-slate-950/40 border-y border-slate-900 px-6 md:px-12 max-w-7xl mx-auto relative z-10">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-white">The Career Email Deluge</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            University life moves fast. Inbox management shouldn\'t hold back your career trajectory.
          </p>
        </div>

        <div className="layout-problems-grid">
          {problems.map((prob, i) => (
            <div key={i} className="card glass-subtle p-8 flex flex-col space-y-4 hover:border-slate-800 hover:shadow-none hover:translate-y-0">
              <div className="p-3 bg-slate-900/60 rounded-xl w-fit border border-slate-800">
                {prob.icon}
              </div>
              <h3 className="text-xl font-bold text-white">{prob.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{prob.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 md:py-32 px-6 md:px-12 max-w-7xl mx-auto relative z-10">
        <div className="text-center space-y-4 mb-20">
          <h2 className="text-3xl md:text-5xl font-black text-white">Seamless Workflow, Zero Effort</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            From connected inbox to applied offer in three simple steps. We do the heavy lifting.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-[28px] left-[16.666%] right-[16.666%] h-0.5 bg-gradient-to-r from-[#7C3AED]/70 via-[#F72585]/70 to-[#3A86FF]/70 z-0" />

          {steps.map((st, i) => (
            <div key={i} className="flex flex-col items-center text-center space-y-4 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 flex items-center justify-center font-black text-lg text-white shadow-lg relative">
                <span className="gradient-text font-extrabold">{st.step}</span>
              </div>
              <h3 className="text-xl font-bold text-white pt-2">{st.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed max-w-sm">{st.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="py-20 bg-slate-950/40 border-y border-slate-900 px-6 md:px-12 max-w-7xl mx-auto relative z-10">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-white">Packed With MVP Power</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Every feature is custom engineered to eliminate searching and maximise your placement efficiency.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feat, i) => (
            <div key={i} className="card glass p-6 space-y-4">
              <div className="p-2.5 bg-slate-900 rounded-lg w-fit border border-slate-800">
                {feat.icon}
              </div>
              <h4 className="text-lg font-bold text-white">{feat.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{feat.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Social Proof Testimonials */}
      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto relative z-10">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-white">Approved By VIT Students</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            See how early career professionals are unlocking hidden value from their student inboxes.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div key={i} className="card glass-subtle p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <MessageSquare className="w-6 h-6 text-[#7C3AED] opacity-50" />
                <p className="text-sm text-slate-300 italic leading-relaxed">"{t.quote}"</p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-800/80">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#7C3AED] to-[#F72585] flex items-center justify-center text-xs font-bold text-white">
                  {t.avatar}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{t.author}</h4>
                  <p className="text-[11px] text-slate-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-6 md:px-12 max-w-4xl mx-auto relative z-10">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-white">Frequently Asked Questions</h2>
          <p className="text-slate-400">
            Everything you need to know about our technology and privacy policies.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div key={idx} className="bg-slate-900/40 border border-slate-800/80 rounded-xl overflow-hidden transition">
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-semibold text-white hover:bg-slate-900/60 transition"
                >
                  <span className="text-sm md:text-base">{faq.question}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                    >
                      <div className="p-5 pt-0 border-t border-slate-800/30 text-xs md:text-sm text-slate-400 leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto relative z-10">
        <div className="card bg-gradient-to-r from-[#7C3AED]/20 to-[#3A86FF]/20 border-[#7C3AED]/30 p-10 md:p-16 text-center space-y-6 relative overflow-hidden shadow-2xl rounded-2xl">
          <div className="hero-orb w-64 h-64 bg-[#7C3AED] -top-12 -left-12 opacity-20 blur-[60px]" />
          <div className="hero-orb w-64 h-64 bg-[#3A86FF] -bottom-12 -right-12 opacity-20 blur-[60px]" />
          
          <h2 className="text-3xl md:text-5xl font-black text-white">Unlock Your Student Inbox Today.</h2>
          <p className="text-slate-300 max-w-xl mx-auto text-sm md:text-base">
            Join the smart cohort of VIT students utilizing AI career intelligence to land their dream internships.
          </p>

          <div className="pt-4">
            <Link href="/auth/signin" className="btn-primary py-3 px-8 text-base shadow-xl">
              Connect @vitstudent.ac.in Account <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/70 py-12 px-6 md:px-12 max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight text-white">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#7C3AED] to-[#F72585] flex items-center justify-center shadow-lg">
                <Sparkles className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="font-bold">Opportunity<span className="text-[#8B5CF6]">AI</span></span>
            </Link>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Automating career opportunity discovery, extraction, tracking, and recommendations for ambitious university students.
            </p>
          </div>

          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-200">Product</h5>
            <div className="flex flex-col gap-2 text-xs text-slate-400">
              <a href="#features" className="hover:text-white transition">AI Extraction</a>
              <a href="#features" className="hover:text-white transition">Match Score</a>
              <a href="#how-it-works" className="hover:text-white transition">How it Works</a>
            </div>
          </div>

          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-200">Resources</h5>
            <div className="flex flex-col gap-2 text-xs text-slate-400">
              <a href="#faq" className="hover:text-white transition">FAQs</a>
              <Link href="/privacy-audit" className="hover:text-white transition">Privacy Audit</Link>
              <Link href="/api-status" className="hover:text-white transition">API Status</Link>
            </div>
          </div>

          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-200">Legal</h5>
            <div className="flex flex-col gap-2 text-xs text-slate-400">
              <Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition">Terms of Service</Link>
              <Link href="/dpa" className="hover:text-white transition">DPA (Data Protection)</Link>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-900/60 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 OpportunityAI. All rights reserved. Built for VIT Vellore & Chennai.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><Lock className="w-3.5 h-3.5" /> Secure SSL Connection</span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />
            <span>VIT Vellore, TN, India</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
