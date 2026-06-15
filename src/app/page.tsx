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
  Zap,
  Check
} from 'lucide-react';

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  
  // --- SCROLLYTELLING SETUP ---
  const scrollyContainerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll through the 400vh container
  const { scrollYProgress } = useScroll({
    target: scrollyContainerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Phase 1: Chaotic Emails (0 to 0.3)
  const rawEmailOpacity = useTransform(smoothProgress, [0, 0.15, 0.25], [1, 1, 0]);
  const rawEmailScale = useTransform(smoothProgress, [0, 0.25], [1, 3]);
  const rawEmailZ = useTransform(smoothProgress, [0, 0.25], [0, 1000]);
  const rawEmailBlur = useTransform(smoothProgress, [0, 0.15, 0.25], ["blur(0px)", "blur(0px)", "blur(20px)"]);

  // Phase 2: AI Laser Sweep (0.2 to 0.5)
  const laserX = useTransform(smoothProgress, [0.2, 0.5], ["-100vw", "100vw"]);
  const laserOpacity = useTransform(smoothProgress, [0.15, 0.2, 0.45, 0.5], [0, 1, 1, 0]);

  // Phase 3: Clean Dashboard Emerging (0.4 to 0.7)
  const cleanCardsOpacity = useTransform(smoothProgress, [0.4, 0.6], [0, 1]);
  const cleanCardsScale = useTransform(smoothProgress, [0.4, 0.6], [0.8, 1]);
  const cleanCardsY = useTransform(smoothProgress, [0.4, 0.6], [100, 0]);
  const cleanCardsRotateX = useTransform(smoothProgress, [0.4, 0.6, 0.8], [-20, 0, 5]);

  // Phase 4: Final Hero CTA (0.6 to 0.9)
  const heroTextOpacity = useTransform(smoothProgress, [0.65, 0.8], [0, 1]);
  const heroTextY = useTransform(smoothProgress, [0.65, 0.8], [50, 0]);
  const bgOrbOpacity = useTransform(smoothProgress, [0.6, 0.8], [0, 1]);

  // --- RESTORED DATA ---
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

  const features = [
    { icon: <Mail className="w-6 h-6 text-[#7C3AED]" />, title: "Read-Only Sync", description: "Direct read-only integration via Google OAuth. Refreshes every 4 hours automatically." },
    { icon: <Sparkles className="w-6 h-6 text-[#F72585]" />, title: "NLP Extractions", description: "Extracts Title, Org, Category, Deadline, Link, and Stipends directly from text walls." },
    { icon: <GraduationCap className="w-6 h-6 text-[#06D6A0]" />, title: "Match Scoring", description: "A composite score matching opportunity requirements with your specific profile skills." },
    { icon: <KanbanSquare className="w-6 h-6 text-[#3A86FF]" />, title: "Kanban Board", description: "Drag-and-drop opportunity tracking through: Interested, Applied, Under Review." },
    { icon: <Clock className="w-6 h-6 text-[#FFC107]" />, title: "Smart Alerts", description: "Automatic alerts 7 days, 3 days, and 24 hours before deadlines expire." },
    { icon: <FileText className="w-6 h-6 text-[#4CC9F0]" />, title: "AI Summaries", description: "Brief, high-impact summaries outlining what the opportunity is and next steps." }
  ];

  const testimonials = [
    { quote: "OpportunityAI completely transformed how I handled placement season. It surfaced an off-campus research internship at IISc Bangalore from an email I had completely archived by mistake.", author: "Aditya Vardhan", role: "CSE, 4th Year Student", avatar: "AV" },
    { quote: "Having SIH, Adobe GenSolve, and Devfolio listings in one dashboard with match scores saved me hours of daily tracking.", author: "Nisha Ramachandran", role: "ECE, 3rd Year Student", avatar: "NR" },
    { quote: "The automated deadline reminders are a lifesaver. The email alerts helped me complete 8 applications this month alone.", author: "Rahul Krishnan", role: "IT, 2nd Year Student", avatar: "RK" }
  ];

  const faqs = [
    { question: "Is OpportunityAI secure? Can you read all my personal emails?", answer: "Yes, it is extremely secure. We use official Google OAuth 2.0 to request only read-only access (gmail.readonly scope). We do not store your raw email content — once our AI extracts the opportunity details, the email body is completely discarded from our servers." },
    { question: "Why is login restricted to @vitstudent.ac.in emails?", answer: "Our system is customized for VIT Vellore and Chennai student templates, including placement cell circulars. To ensure maximum accuracy, we only allow students with active @vitstudent.ac.in accounts to join during this beta phase." },
    { question: "How does the Match Score work?", answer: "The Match Score (0-100) evaluates how well you qualify for an opportunity. It analyzes the skills extracted from the opportunity against the skills listed in your profile, factoring in your year of study, branch constraints, and preferences." },
    { question: "Do I have to pay for OpportunityAI?", answer: "We offer a fully functional Free Tier which allows up to 50 opportunity extractions per month. The Premium Tier (₹199/month) unlocks unlimited extractions, advanced AI summaries, resume skill-gap analysis, and instant push alerts." }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 100, damping: 12 } }
  };

  return (
    <div className="min-h-screen bg-[#030308] overflow-x-hidden relative selection:bg-[#7C3AED]/30 selection:text-white">
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
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#faq" className="hover:text-white transition">FAQ</a>
          </div>

          <div className="flex items-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/auth/signin" className="bg-white text-black px-6 py-2.5 rounded-full text-sm font-bold shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-shadow flex items-center gap-2">
                Launch App <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* =========================================
          THE SCOLLYYTELLING CONTAINER (400vh)
          ========================================= */}
      <section ref={scrollyContainerRef} className="h-[400vh] relative w-full bg-[#030308]">
        
        {/* Sticky Camera Lens */}
        <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center perspective-[1000px]">
          
          {/* Background Grid */}
          <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

          {/* Phase 1: Chaotic Emails Cloud */}
          <motion.div 
            style={{ opacity: rawEmailOpacity, scale: rawEmailScale, z: rawEmailZ, filter: rawEmailBlur }}
            className="absolute inset-0 flex items-center justify-center transform-style-3d pointer-events-none z-10"
          >
            <div className="text-center absolute top-[15%] text-slate-500 font-bold tracking-widest text-sm uppercase">The Problem: Inbox Chaos</div>
            
            {/* Email 1 */}
            <motion.div 
              className="absolute left-[10%] top-[20%] w-[350px] bg-white p-4 rounded shadow-2xl opacity-80"
              animate={{ rotateZ: [-5, 5], rotateX: [10, -10] }}
              transition={{ repeat: Infinity, duration: 4, repeatType: "reverse" }}
            >
              <div className="text-[10px] text-gray-400 mb-2">From: placement@vit.ac.in</div>
              <div className="font-bold text-black text-sm mb-2">FWD: Fwd: Urgent Hiring Circular!</div>
              <div className="text-xs text-gray-600 line-clamp-3">Please find the attached trailing mail for the software engineering requirement. The deadline is tomorrow but the link is buried in the 14th paragraph...</div>
            </motion.div>

            {/* Email 2 */}
            <motion.div 
              className="absolute right-[15%] bottom-[20%] w-[400px] bg-gray-100 p-4 rounded shadow-2xl opacity-90"
              animate={{ rotateZ: [10, -5], y: [-10, 10] }}
              transition={{ repeat: Infinity, duration: 5, repeatType: "reverse" }}
            >
              <div className="text-[10px] text-gray-400 mb-2">From: hackclub@vit.ac.in</div>
              <div className="font-bold text-black text-sm mb-2">Hackathon Registration Open</div>
              <div className="text-xs text-gray-600 line-clamp-3">Join us for a 48 hour hackathon. Teams of 4 allowed. Fill the google form to apply. Required skills: Web3, Solidity, React.</div>
            </motion.div>

            {/* Email 3 (Center) */}
            <motion.div 
              className="absolute left-[35%] top-[40%] w-[450px] bg-white p-5 rounded-lg shadow-2xl z-20"
              animate={{ rotateZ: [-2, 2], scale: [0.95, 1.05] }}
              transition={{ repeat: Infinity, duration: 3, repeatType: "reverse" }}
            >
              <div className="text-xs text-gray-500 mb-2 font-mono">Date: Tue, 15 Jun 2026</div>
              <div className="font-bold text-black text-lg mb-2">Summer Research Internship - IISc</div>
              <div className="text-sm text-gray-700">The department of computer science is offering 2 positions for undergraduate students. Must have strong Python and PyTorch skills. Apply by Friday.</div>
            </motion.div>
          </motion.div>

          {/* Phase 2: The AI Laser Sweep */}
          <motion.div 
            style={{ x: laserX, opacity: laserOpacity }}
            className="absolute top-0 bottom-0 w-[20vw] bg-gradient-to-r from-transparent via-[#F72585]/40 to-transparent z-40 pointer-events-none"
          >
            {/* The core laser beam line */}
            <div className="absolute top-0 bottom-0 left-1/2 w-[2px] bg-white shadow-[0_0_30px_#F72585,0_0_60px_#7C3AED]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#030308] border border-[#F72585] text-[#F72585] px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase shadow-[0_0_20px_#F72585]">
              AI Extraction Engine
            </div>
          </motion.div>

          {/* Phase 3 & 4: The Solution (Clean Cards & Hero Text) */}
          <motion.div 
            style={{ opacity: cleanCardsOpacity, scale: cleanCardsScale, y: cleanCardsY, rotateX: cleanCardsRotateX }}
            className="absolute inset-0 flex flex-col items-center justify-center transform-style-3d z-30 pointer-events-auto max-w-7xl mx-auto px-6"
          >
            {/* Background Orbs */}
            <motion.div style={{ opacity: bgOrbOpacity }} className="absolute w-[600px] h-[600px] bg-[#7C3AED]/20 rounded-full blur-[100px] -top-20 -left-20 pointer-events-none" />
            <motion.div style={{ opacity: bgOrbOpacity }} className="absolute w-[500px] h-[500px] bg-[#F72585]/15 rounded-full blur-[100px] top-[40%] right-[-10%] pointer-events-none" />

            <div className="grid md:grid-cols-12 gap-12 items-center w-full">
              {/* Hero Text Content */}
              <motion.div 
                style={{ opacity: heroTextOpacity, y: heroTextY }}
                className="md:col-span-7 space-y-8"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/50 border border-slate-800 backdrop-blur-md text-xs font-bold text-[#06D6A0] uppercase tracking-widest shadow-inner">
                  <Check className="w-4 h-4" /> Inbox Organized
                </div>
                
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
              </motion.div>

              {/* Clean 3D Dashboard Mockup */}
              <div className="md:col-span-5 relative h-[500px] flex items-center justify-center perspective-[2000px] transform-style-3d">
                
                {/* Top Card */}
                <motion.div 
                  animate={{ y: [0, -15, 0], rotateY: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                  className="w-full max-w-[380px] bg-[#0A0A14]/90 backdrop-blur-xl p-6 rounded-2xl border border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.5),_inset_0_1px_0_rgba(255,255,255,0.1)] absolute z-30"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#3A86FF] flex items-center justify-center shadow-lg">
                        <span className="font-black text-white text-xl">I</span>
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-base">IISc Summer Research</h3>
                        <p className="text-slate-400 text-xs font-medium">Computer Science Dept</p>
                      </div>
                    </div>
                    <div className="w-12 h-12 rounded-full border-[3px] border-[#06D6A0] border-t-transparent flex items-center justify-center animate-spin-slow relative">
                      <span className="absolute text-[#06D6A0] font-black text-xs animate-none">98%</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-[#131320] p-4 rounded-xl border border-slate-800/50">
                      <div className="flex items-center gap-2 text-[#06D6A0] text-xs font-bold mb-2">
                        <Sparkles className="w-3.5 h-3.5" /> AI Extracted Summary
                      </div>
                      <p className="text-slate-300 text-xs leading-relaxed">
                        Undergraduate research position requiring Python and PyTorch skills. Apply by Friday.
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gradient-to-br from-slate-900 to-[#131320] p-3 rounded-xl border border-slate-800 text-center">
                        <p className="text-slate-500 text-[10px] font-bold uppercase mb-1">Extracted Deadline</p>
                        <p className="text-[#F72585] text-sm font-black">Friday</p>
                      </div>
                      <div className="bg-gradient-to-br from-slate-900 to-[#131320] p-3 rounded-xl border border-slate-800 text-center">
                        <p className="text-slate-500 text-[10px] font-bold uppercase mb-1">Match Reason</p>
                        <p className="text-[#06D6A0] text-sm font-black">Python Skill</p>
                      </div>
                    </div>
                    
                    <button className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold py-3 rounded-xl shadow-[0_0_20px_rgba(124,58,237,0.3)] transition flex items-center justify-center gap-2">
                      <KanbanSquare className="w-4 h-4" /> Track Application
                    </button>
                  </div>
                </motion.div>

                {/* Card 2 (Background) */}
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 1 }}
                  className="w-full max-w-[380px] bg-[#0A0A14] p-6 rounded-2xl border border-slate-800 absolute z-20 top-24 scale-95 opacity-60 blur-[1px]"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-slate-800" />
                    <div>
                      <div className="h-4 w-32 bg-slate-800 rounded mb-2" />
                      <div className="h-3 w-20 bg-slate-800/50 rounded" />
                    </div>
                  </div>
                  <div className="h-24 bg-slate-800/30 rounded-xl w-full mb-4" />
                </motion.div>
                
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* =========================================
          RESTORED CONTENT (BELOW SCOLLYYTELLING)
          ========================================= */}
      
      {/* Stats Ticker */}
      <section className="border-y border-slate-900 bg-slate-950/80 backdrop-blur-md relative z-20">
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

      {/* Features Grid */}
      <section id="features" className="py-24 bg-[#030308] px-6 md:px-12 max-w-7xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-4 mb-16"
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
              className="bg-[#0A0A14] border border-slate-800/80 p-8 rounded-2xl transition-all duration-300 shadow-xl"
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

      {/* Social Proof Testimonials */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto relative z-10 bg-slate-950/40 border-y border-slate-900">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-white">Approved By VIT Students</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            See how early career professionals are unlocking hidden value from their student inboxes.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-[#0A0A14] border border-slate-800/50 p-8 rounded-3xl flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <MessageSquare className="w-6 h-6 text-[#7C3AED] opacity-50" />
                <p className="text-sm text-slate-300 italic leading-relaxed">"{t.quote}"</p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-800/80">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#7C3AED] to-[#F72585] flex items-center justify-center text-xs font-bold text-white shadow-lg">
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
      <section id="faq" className="py-24 px-6 md:px-12 max-w-4xl mx-auto relative z-10">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-white">Frequently Asked Questions</h2>
          <p className="text-slate-400">Everything you need to know about our technology and privacy policies.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div key={idx} className="bg-slate-900/40 border border-slate-800/80 rounded-xl overflow-hidden transition hover:border-slate-700">
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-6 text-left font-semibold text-white transition"
                >
                  <span className="text-sm md:text-base">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-[#7C3AED] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                    >
                      <div className="p-6 pt-0 border-t border-slate-800/30 text-sm text-slate-400 leading-relaxed">
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
      <section className="py-24 px-6 md:px-12 max-w-5xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-[#030308] to-[#131320] border border-[#7C3AED]/30 p-12 md:p-20 text-center space-y-8 relative overflow-hidden shadow-[0_0_80px_rgba(124,58,237,0.15)] rounded-[3rem]"
        >
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
          <div className="absolute w-96 h-96 bg-[#7C3AED] -top-20 -left-20 opacity-30 blur-[80px] rounded-full pointer-events-none" />
          <div className="absolute w-96 h-96 bg-[#F72585] -bottom-20 -right-20 opacity-20 blur-[80px] rounded-full pointer-events-none" />
          
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
