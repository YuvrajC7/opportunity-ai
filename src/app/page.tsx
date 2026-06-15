'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  Compass, 
  ChevronDown, 
  GraduationCap, 
  Mail, 
  FileText, 
  KanbanSquare, 
  ShieldAlert, 
  Lock,
  MessageSquare,
  Cpu,
  BrainCircuit,
  Zap
} from 'lucide-react';

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const containerRef = useRef(null);

  // High-performance smooth scrolling for parallax
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // 3D Parallax Transforms
  const yHeroText = useTransform(smoothProgress, [0, 0.2], [0, -100]);
  const yHeroMockup = useTransform(smoothProgress, [0, 0.2], [0, -50]);
  const rotateXHero = useTransform(smoothProgress, [0, 0.1], [0, 15]);
  const scaleHero = useTransform(smoothProgress, [0, 0.2], [1, 0.9]);
  
  const bgOrbY1 = useTransform(smoothProgress, [0, 1], [0, 500]);
  const bgOrbY2 = useTransform(smoothProgress, [0, 1], [0, -400]);

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

    const launchDate = new Date('2026-06-09T00:00:00Z').getTime();
    const calculateStats = () => {
      const elapsedHours = Math.max(0, (Date.now() - launchDate) / (1000 * 60 * 60));
      const currentStudents = Math.floor(12 + (elapsedHours * 0.4));
      const currentOpps = Math.floor(184 + (elapsedHours * 4));
      
      setStats([
        { value: `${currentStudents}+`, label: 'VIT Students Reached' },
        { value: `${currentOpps}+`, label: 'Opportunities Extracted' },
        { value: '98.4%', label: 'Extraction Accuracy' },
        { value: '₹1.2 L+', label: 'Stipends Secured' }
      ]);
    };

    calculateStats();
    const interval = setInterval(calculateStats, 60000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, []);

  const problems = [
    {
      icon: <ShieldAlert className="w-8 h-8 text-[#F72585]" />,
      title: "Information Overload",
      description: "Students receive 50-150 emails daily. Placement circulars and announcements bury critical opportunities."
    },
    {
      icon: <Clock className="w-8 h-8 text-[#FFC107]" />,
      title: "Deadline Blindness",
      description: "Application deadlines are scattered. Manually tracking calendars results in 68% of students missing deadlines."
    },
    {
      icon: <Compass className="w-8 h-8 text-[#3A86FF]" />,
      title: "Lack of Personalisation",
      description: "Generic portals show the same listings to everyone. Spend hours searching for listings that match your skills."
    }
  ];

  const steps = [
    {
      step: "01",
      icon: <Lock className="w-6 h-6 text-[#7C3AED]" />,
      title: "Secure Connect",
      description: "Connect your @vitstudent Google Account securely via read-only OAuth."
    },
    {
      step: "02",
      icon: <BrainCircuit className="w-6 h-6 text-[#F72585]" />,
      title: "AI Extraction",
      description: "Our LLM pipeline scans emails, extracting internships and hackathons with 98% precision."
    },
    {
      step: "03",
      icon: <Zap className="w-6 h-6 text-[#06D6A0]" />,
      title: "Take Action",
      description: "See match scores, view concise summaries, and get automated deadline alerts."
    }
  ];

  const features = [
    {
      icon: <Mail className="w-6 h-6 text-[#7C3AED]" />,
      title: "Read-Only Sync",
      description: "Direct read-only integration via Google OAuth. Refreshes every 4 hours automatically."
    },
    {
      icon: <Sparkles className="w-6 h-6 text-[#F72585]" />,
      title: "NLP Extractions",
      description: "Extracts Title, Org, Category, Deadline, Link, and Stipends directly from text walls."
    },
    {
      icon: <GraduationCap className="w-6 h-6 text-[#06D6A0]" />,
      title: "Match Scoring",
      description: "A composite score matching opportunity requirements with your specific profile skills."
    },
    {
      icon: <KanbanSquare className="w-6 h-6 text-[#3A86FF]" />,
      title: "Kanban Board",
      description: "Drag-and-drop opportunity tracking through: Interested, Applied, Under Review."
    },
    {
      icon: <Clock className="w-6 h-6 text-[#FFC107]" />,
      title: "Smart Alerts",
      description: "Automatic alerts 7 days, 3 days, and 24 hours before deadlines expire."
    },
    {
      icon: <FileText className="w-6 h-6 text-[#4CC9F0]" />,
      title: "AI Summaries",
      description: "Brief, high-impact summaries outlining what the opportunity is and next steps."
    }
  ];

  const faqs = [
    {
      question: "Is OpportunityAI secure? Can you read all my personal emails?",
      answer: "We use official Google OAuth to request ONLY read-only access (gmail.readonly scope). We do not store your raw email content — once our AI extracts the opportunity details, the email body is completely discarded."
    },
    {
      question: "Why is login restricted to @vitstudent.ac.in emails?",
      answer: "Our system is fine-tuned specifically for VIT Vellore and Chennai templates. To ensure maximum accuracy, we only allow VIT students during this beta."
    },
    {
      question: "How does the Match Score work?",
      answer: "It evaluates how well you qualify by analyzing the skills extracted from the opportunity against your profile, factoring in your year of study and branch."
    }
  ];

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring" as const, stiffness: 100, damping: 12 }
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-[#030308] overflow-x-hidden relative selection:bg-[#7C3AED]/30 selection:text-white">
      {/* 3D Background Grid */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      
      {/* Parallax Orbs */}
      <motion.div style={{ y: bgOrbY1 }} className="absolute w-[600px] h-[600px] bg-[#7C3AED]/20 rounded-full blur-[120px] top-[-10%] left-[-10%] z-0 pointer-events-none" />
      <motion.div style={{ y: bgOrbY2 }} className="absolute w-[500px] h-[500px] bg-[#F72585]/10 rounded-full blur-[100px] top-[40%] right-[-10%] z-0 pointer-events-none" />

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-xl border-b ${scrolled ? 'bg-[#030308]/80 border-slate-800/50 py-4 shadow-2xl shadow-[#7C3AED]/5' : 'bg-transparent border-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#7C3AED] to-[#F72585] flex items-center justify-center shadow-lg group-hover:shadow-[#7C3AED]/50 transition-all duration-500">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-xl tracking-tight text-white">Opportunity<span className="text-[#8B5CF6]">AI</span></span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-400">
            <a href="#how-it-works" className="hover:text-white transition">Engine</a>
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#faq" className="hover:text-white transition">FAQ</a>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/auth/signin" className="text-sm font-bold text-slate-300 hover:text-white transition">
              Sign In
            </Link>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/auth/signin" className="bg-white text-black px-6 py-2.5 rounded-full text-sm font-bold shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-shadow flex items-center gap-2">
                Launch App <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* 3D Hero Section */}
      <section className="pt-40 pb-20 px-6 md:px-12 max-w-7xl mx-auto relative z-10 perspective-[1000px]">
        <div className="grid md:grid-cols-12 gap-12 items-center">
          <motion.div 
            style={{ y: yHeroText }}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="md:col-span-7 space-y-8"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/50 border border-slate-800 backdrop-blur-md text-xs font-bold text-[#8B5CF6] uppercase tracking-widest shadow-inner shadow-white/5"
            >
              <Cpu className="w-4 h-4" /> NLP Extractor v2.0 Live
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1] tracking-tight">
              Turn your inbox into a <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] via-[#F72585] to-[#3A86FF] animate-gradient-x">
                Career Command Center
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-400 max-w-xl font-medium leading-relaxed">
              OpportunityAI securely scans your university inbox, extracts hidden internships, and builds a personalised tracking dashboard automatically.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/auth/signin" className="bg-gradient-to-r from-[#7C3AED] to-[#F72585] text-white py-4 px-8 rounded-full text-base font-bold shadow-[0_0_40px_rgba(124,58,237,0.4)] flex items-center justify-center gap-2 border border-white/10">
                  Connect Google Workspace <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
            </div>

            <div className="flex items-center gap-6 pt-4 text-xs font-semibold text-slate-500">
              <span className="flex items-center gap-2"><Lock className="w-4 h-4 text-[#06D6A0]" /> Read-Only Access</span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
              <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-[#06D6A0]" /> AES-256 Encrypted</span>
            </div>
          </motion.div>

          {/* 3D Floating Mockup Stack */}
          <motion.div 
            style={{ y: yHeroMockup, rotateX: rotateXHero, scale: scaleHero }}
            className="md:col-span-5 relative h-[500px] flex items-center justify-center perspective-[2000px] transform-style-3d"
          >
            {/* Top Card (In Focus) */}
            <motion.div 
              animate={{ y: [0, -15, 0], rotateY: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="w-full max-w-[380px] bg-[#0A0A14]/90 backdrop-blur-xl p-6 rounded-2xl border border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.5),_inset_0_1px_0_rgba(255,255,255,0.1)] absolute z-30 transform-gpu"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4285F4] to-[#34A853] flex items-center justify-center shadow-lg shadow-[#4285F4]/20">
                    <span className="font-black text-white text-xl">G</span>
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-base">Software Eng Intern</h3>
                    <p className="text-slate-400 text-xs font-medium">Google • Summer 2026</p>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full border-[3px] border-[#06D6A0] border-t-transparent flex items-center justify-center animate-spin-slow relative">
                  <span className="absolute text-[#06D6A0] font-black text-xs animate-none">94%</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-[#131320] p-4 rounded-xl border border-slate-800/50">
                  <div className="flex items-center gap-2 text-[#F72585] text-xs font-bold mb-2">
                    <Sparkles className="w-3.5 h-3.5" /> AI Extracted Summary
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    Join Google's summer engineering cohort. Work on scalable distributed systems using Go and C++.
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gradient-to-br from-slate-900 to-[#131320] p-3 rounded-xl border border-slate-800 text-center">
                    <p className="text-slate-500 text-[10px] font-bold uppercase mb-1">Extracted Deadline</p>
                    <p className="text-white text-sm font-black">Oct 15, 2026</p>
                  </div>
                  <div className="bg-gradient-to-br from-slate-900 to-[#131320] p-3 rounded-xl border border-slate-800 text-center">
                    <p className="text-slate-500 text-[10px] font-bold uppercase mb-1">Match Reason</p>
                    <p className="text-[#06D6A0] text-sm font-black">C++ Skill</p>
                  </div>
                </div>
                
                <button className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold py-3 rounded-xl shadow-[0_0_20px_rgba(124,58,237,0.3)] transition flex items-center justify-center gap-2">
                  <KanbanSquare className="w-4 h-4" /> Track Application
                </button>
              </div>
            </motion.div>

            {/* Middle Card (Blurred) */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 1 }}
              className="w-full max-w-[380px] bg-[#0A0A14] p-6 rounded-2xl border border-slate-800 absolute z-20 top-24 scale-95 opacity-60 blur-[2px]"
            >
              <div className="h-12 bg-slate-800/50 rounded-xl w-3/4 mb-4" />
              <div className="h-24 bg-slate-800/30 rounded-xl w-full mb-4" />
              <div className="h-10 bg-slate-800/50 rounded-xl w-full" />
            </motion.div>

            {/* Bottom Card (Blurred) */}
            <motion.div 
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 2 }}
              className="w-full max-w-[380px] bg-[#0A0A14] p-6 rounded-2xl border border-slate-800 absolute z-10 top-36 scale-90 opacity-30 blur-[4px]"
            >
              <div className="h-32 bg-slate-800/20 rounded-xl w-full" />
            </motion.div>

            {/* Dynamic Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#7C3AED] rounded-full blur-[100px] opacity-20 animate-pulse-slow z-0" />
          </motion.div>
        </div>
      </section>

      {/* Stats Ticker */}
      <section className="border-y border-slate-900 bg-slate-950/30 backdrop-blur-sm relative z-20">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-slate-800/50">
            {stats.map((stat, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center pl-4 first:pl-0"
              >
                <h3 className="text-3xl md:text-4xl font-black text-white mb-1 tracking-tight">{stat.value}</h3>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem -> Solution Scroll Sequence */}
      <section id="how-it-works" className="py-32 px-6 md:px-12 max-w-7xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center space-y-4 mb-20"
        >
          <div className="inline-flex items-center gap-2 text-[#F72585] text-xs font-bold uppercase tracking-widest bg-[#F72585]/10 px-4 py-1.5 rounded-full mb-2 border border-[#F72585]/20">
            <BrainCircuit className="w-4 h-4" /> The Engine
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">How the AI pipeline works</h2>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-3 gap-8 relative"
        >
          {steps.map((st, i) => (
            <motion.div 
              key={i} 
              variants={itemVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              className="bg-slate-900/40 border border-slate-800/60 p-8 rounded-3xl backdrop-blur-xl shadow-2xl relative overflow-hidden group"
            >
              {/* Dynamic hover gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#7C3AED]/0 to-[#F72585]/0 group-hover:from-[#7C3AED]/10 group-hover:to-[#F72585]/10 transition-colors duration-500" />
              
              <div className="relative z-10 space-y-6">
                <div className="flex justify-between items-start">
                  <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center shadow-inner group-hover:bg-slate-700 transition-colors">
                    {st.icon}
                  </div>
                  <span className="text-5xl font-black text-white/5 group-hover:text-white/10 transition-colors">{st.step}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-3">{st.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed font-medium">{st.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 bg-slate-950/40 border-y border-slate-900 px-6 md:px-12 max-w-7xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-4 mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">Everything you need. <br/><span className="text-slate-500">Nothing you don't.</span></h2>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-6"
        >
          {features.map((feat, i) => (
            <motion.div 
              key={i} 
              variants={itemVariants}
              whileHover={{ scale: 1.02, backgroundColor: "rgba(30, 41, 59, 0.4)" }}
              className="bg-[#030308] border border-slate-800/80 p-8 rounded-2xl transition-all duration-300 shadow-xl"
            >
              <div className="p-3 bg-slate-900 rounded-xl w-fit border border-slate-800 mb-6 shadow-inner">
                {feat.icon}
              </div>
              <h4 className="text-lg font-bold text-white mb-2 tracking-tight">{feat.title}</h4>
              <p className="text-sm text-slate-400 leading-relaxed font-medium">{feat.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 md:px-12 max-w-5xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-[#030308] to-[#131320] border border-[#7C3AED]/30 p-12 md:p-20 text-center space-y-8 relative overflow-hidden shadow-[0_0_80px_rgba(124,58,237,0.15)] rounded-[3rem]"
        >
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
          <div className="hero-orb w-96 h-96 bg-[#7C3AED] -top-20 -left-20 opacity-30 blur-[80px]" />
          <div className="hero-orb w-96 h-96 bg-[#F72585] -bottom-20 -right-20 opacity-20 blur-[80px]" />
          
          <div className="relative z-10 space-y-6">
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
              Ready to automate your <br/>internship hunt?
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-lg font-medium">
              Join the cohort of smart students utilizing AI to land their dream roles.
            </p>

            <div className="pt-8">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
                <Link href="/auth/signin" className="bg-white text-black py-4 px-10 rounded-full text-lg font-black shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] transition-shadow flex items-center justify-center gap-3">
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                  Continue with Google
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-[#030308] py-12 px-6 md:px-12 max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between text-xs font-medium text-slate-500 gap-4">
          <Link href="/" className="flex items-center gap-2 text-lg font-black tracking-tight text-white grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all">
            <Sparkles className="w-4 h-4 text-[#7C3AED]" /> OpportunityAI
          </Link>
          <p>© 2026 OpportunityAI. Built for VIT Vellore.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><Lock className="w-3.5 h-3.5" /> Secure SSL</span>
            <Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
