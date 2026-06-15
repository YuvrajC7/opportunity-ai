'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, MotionValue } from 'framer-motion';
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

// ==========================================
// SCROLLYTELLING COMPONENT (THE HERO MOVIE)
// ==========================================
const CinematicHero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll over 600vh
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 25,
    restDelta: 0.001
  });

  // --- PHASE 1 & 2: VANISHING EMAILS (0% to 50%) ---
  // Background emails fly off to the left and right
  const flyLeft = useTransform(smoothProgress, [0.1, 0.4], [0, -2000]);
  const flyRight = useTransform(smoothProgress, [0.1, 0.4], [0, 2000]);
  const bgOpacity = useTransform(smoothProgress, [0.3, 0.45], [1, 0]);

  // --- PHASE 3: THE SURVIVOR & TRANSFORMATION (40% to 70%) ---
  // The central email scales up slightly
  const centerScale = useTransform(smoothProgress, [0, 0.3, 0.5, 0.7], [0.8, 1, 1.2, 1]);
  // The 3D Flip (180 degrees)
  const centerRotateY = useTransform(smoothProgress, [0.45, 0.65], [0, 180]);
  
  // Front of card (Messy Email) fades out at 90deg, Back of card (Solution) fades in
  const frontOpacity = useTransform(smoothProgress, [0.5, 0.55], [1, 0]);
  const backOpacity = useTransform(smoothProgress, [0.5, 0.55], [0, 1]);

  // --- PHASE 4: FINAL REVEAL (65% to 100%) ---
  // Hero text fades in around the flipped card
  const heroTextOpacity = useTransform(smoothProgress, [0.65, 0.8], [0, 1]);
  const heroTextY = useTransform(smoothProgress, [0.65, 0.8], [50, 0]);
  
  // The card shifts to the right to make room for text on desktop
  const centerShiftX = useTransform(smoothProgress, [0.65, 0.85], ["0%", "50%"]);
  // Background glows appear
  const glowOpacity = useTransform(smoothProgress, [0.7, 0.9], [0, 1]);

  // Generate 20 fake background emails
  const bgEmails = Array.from({ length: 20 }).map((_, i) => {
    const isLeft = i % 2 === 0;
    const randomY = Math.floor(Math.random() * 100) - 50; // -50% to 50%
    const randomX = isLeft ? Math.floor(Math.random() * -40) - 10 : Math.floor(Math.random() * 40) + 10;
    const randomScale = 0.5 + Math.random() * 0.5;
    const randomDelay = Math.random() * 2;
    
    return (
      <motion.div
        key={i}
        style={{ 
          x: isLeft ? flyLeft : flyRight,
          opacity: bgOpacity
        }}
        className="absolute w-[300px] bg-slate-900/80 backdrop-blur-sm border border-slate-800 p-4 rounded-xl shadow-2xl"
        initial={{ top: `${50 + randomY}%`, left: `calc(50% + ${randomX}vw)`, scale: randomScale, rotateZ: Math.random() * 20 - 10 }}
        animate={{ y: [0, 15, 0], rotateZ: (Math.random() * 20 - 10) + (Math.random() * 5) }}
        transition={{ repeat: Infinity, duration: 4 + randomDelay, ease: "easeInOut" }}
      >
        <div className="h-3 w-24 bg-slate-800 rounded mb-3" />
        <div className="h-4 w-full bg-slate-700 rounded mb-2" />
        <div className="h-2 w-full bg-slate-800 rounded mb-1" />
        <div className="h-2 w-3/4 bg-slate-800 rounded" />
      </motion.div>
    );
  });

  return (
    <section ref={containerRef} className="h-[600vh] relative w-full bg-[#030308]">
      {/* The sticky camera lens */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center perspective-[2000px]">
        
        {/* Deep Background Grid */}
        <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

        {/* Phase 4 Glows */}
        <motion.div style={{ opacity: glowOpacity }} className="absolute w-[600px] h-[600px] bg-[#7C3AED]/20 rounded-full blur-[100px] left-[-10%] top-[-10%] pointer-events-none" />
        <motion.div style={{ opacity: glowOpacity }} className="absolute w-[500px] h-[500px] bg-[#F72585]/15 rounded-full blur-[100px] right-[-10%] bottom-[-10%] pointer-events-none" />

        {/* Phase 1 & 2: Background Chaos */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 transform-style-3d">
          {bgEmails}
        </div>

        {/* Phase 3: The Central Transforming Element */}
        <motion.div 
          style={{ 
            scale: centerScale, 
            rotateY: centerRotateY,
            x: centerShiftX
          }}
          className="relative z-30 transform-style-3d w-full max-w-[380px] h-[450px]"
        >
          {/* FRONT FACE: The Messy "Survivor" Email */}
          <motion.div 
            style={{ opacity: frontOpacity }}
            className="absolute inset-0 bg-white p-6 rounded-2xl shadow-[0_0_50px_rgba(255,255,255,0.1)] backface-hidden"
          >
            <div className="flex items-center gap-2 mb-4 border-b pb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold">M</div>
              <div>
                <p className="text-xs text-gray-500">From: placement.cell@vit.ac.in</p>
                <p className="text-sm font-bold text-black">FWD: Urgent Requirement</p>
              </div>
            </div>
            <div className="space-y-3 text-sm text-gray-600 leading-relaxed font-serif">
              <p>Dear Students,</p>
              <p>Please find attached the trailing mail regarding the summer internship requirement for 2026 batch. The company is looking for strong coders.</p>
              <p>Please note the deadline is strictly tomorrow 5PM. Fill the google form embedded below.</p>
              <p className="text-blue-600 underline break-all text-xs">https://docs.google.com/forms/d/e/1FAIpQLSc_xyz123/viewform</p>
              <p>Warm Regards,<br/>Placement Team</p>
            </div>
          </motion.div>

          {/* BACK FACE: The Clean Dashboard Card (Rotated 180deg by default) */}
          <motion.div 
            style={{ opacity: backOpacity, rotateY: 180 }}
            className="absolute inset-0 bg-[#0A0A14]/90 backdrop-blur-xl p-6 rounded-2xl border border-slate-800 shadow-[0_20px_50px_rgba(124,58,237,0.3),_inset_0_1px_0_rgba(255,255,255,0.1)] backface-hidden flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#3A86FF] flex items-center justify-center shadow-lg">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-base">Software Intern 2026</h3>
                    <p className="text-slate-400 text-xs font-medium">Top Tier Tech Company</p>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full border-[3px] border-[#06D6A0] border-t-transparent flex items-center justify-center relative">
                  <span className="absolute text-[#06D6A0] font-black text-xs">98%</span>
                </div>
              </div>

              <div className="bg-[#131320] p-4 rounded-xl border border-slate-800/50 mb-4">
                <div className="flex items-center gap-2 text-[#06D6A0] text-xs font-bold mb-2">
                  <Sparkles className="w-3.5 h-3.5" /> AI Extracted Summary
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Summer internship for 2026 batch. Strong coding skills required. 
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-gradient-to-br from-slate-900 to-[#131320] p-3 rounded-xl border border-slate-800 text-center">
                  <p className="text-slate-500 text-[10px] font-bold uppercase mb-1">Extracted Deadline</p>
                  <p className="text-[#F72585] text-sm font-black">Tomorrow 5PM</p>
                </div>
                <div className="bg-gradient-to-br from-slate-900 to-[#131320] p-3 rounded-xl border border-slate-800 text-center">
                  <p className="text-slate-500 text-[10px] font-bold uppercase mb-1">Match Reason</p>
                  <p className="text-[#06D6A0] text-sm font-black">Coding Skill</p>
                </div>
              </div>
            </div>
            
            <button className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold py-3 rounded-xl shadow-[0_0_20px_rgba(124,58,237,0.3)] transition flex items-center justify-center gap-2">
              <KanbanSquare className="w-4 h-4" /> 1-Click Apply
            </button>
          </motion.div>
        </motion.div>

        {/* Phase 4: The Hero Text (Shifts in from left) */}
        <motion.div 
          style={{ opacity: heroTextOpacity, y: heroTextY }}
          className="absolute left-[10%] max-w-[500px] z-40 hidden md:block"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/50 border border-slate-800 backdrop-blur-md text-xs font-bold text-[#06D6A0] uppercase tracking-widest shadow-inner mb-6">
            <Check className="w-4 h-4" /> Inbox Organized
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1] tracking-tight mb-6">
            Turn your inbox into a <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] via-[#F72585] to-[#3A86FF] animate-gradient-x">
              Career Command Center
            </span>
          </h1>
          
          <p className="text-lg text-slate-400 font-medium leading-relaxed mb-8">
            OpportunityAI securely scans your university inbox, extracts hidden internships, and builds a personalised tracking dashboard automatically.
          </p>

          <Link href="/auth/signin" className="inline-flex bg-gradient-to-r from-[#7C3AED] to-[#F72585] text-white py-4 px-8 rounded-full text-base font-bold shadow-[0_0_40px_rgba(124,58,237,0.4)] hover:shadow-[0_0_60px_rgba(124,58,237,0.6)] transition-all items-center gap-2 border border-white/10">
            Connect Google Workspace <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>

        {/* Mobile Hero Text (Centered) */}
        <motion.div 
          style={{ opacity: heroTextOpacity }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 z-40 md:hidden bg-[#030308]/80 backdrop-blur-md"
        >
           <h1 className="text-4xl font-black text-white leading-[1.1] tracking-tight mb-4">
            Turn your inbox into a <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] via-[#F72585] to-[#3A86FF]">
              Command Center
            </span>
          </h1>
          <Link href="/auth/signin" className="bg-[#7C3AED] text-white py-3 px-6 rounded-full text-sm font-bold shadow-[0_0_30px_rgba(124,58,237,0.4)] flex items-center gap-2">
            Get Started <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

      </div>
    </section>
  );
};


// ==========================================
// MAIN PAGE COMPONENT
// ==========================================
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
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);

    const launchDate = new Date('2026-06-09T00:00:00Z').getTime();
    const calculateStats = () => {
      const elapsedHours = Math.max(0, (Date.now() - launchDate) / (1000 * 60 * 60));
      setStats([
        { value: `${Math.floor(12 + (elapsedHours * 0.4))}+`, label: 'VIT Students Reached' },
        { value: `${Math.floor(184 + (elapsedHours * 4))}+`, label: 'Opportunities Extracted' },
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
    { icon: <Mail className="w-6 h-6 text-[#7C3AED]" />, title: "Read-Only Sync", description: "Direct read-only integration via Google OAuth. Refreshes automatically." },
    { icon: <Sparkles className="w-6 h-6 text-[#F72585]" />, title: "NLP Extractions", description: "Extracts Title, Org, Category, Deadline, Link, and Stipends." },
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

  return (
    <div className="min-h-screen bg-[#030308] text-slate-200 font-sans selection:bg-[#7C3AED]/30 selection:text-white">
      
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 backdrop-blur-xl border-b ${scrolled ? 'bg-[#030308]/80 border-slate-800/50 py-4 shadow-2xl' : 'bg-transparent border-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#7C3AED] to-[#F72585] flex items-center justify-center shadow-lg group-hover:shadow-[#7C3AED]/50 transition-all duration-500">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-xl tracking-tight text-white hidden sm:block">Opportunity<span className="text-[#8B5CF6]">AI</span></span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/auth/signin" className="bg-white text-black px-6 py-2.5 rounded-full text-sm font-bold shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-shadow flex items-center gap-2">
              Launch App <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* The 600vh Cinematic Scrollytelling Sequence */}
      <CinematicHero />

      {/* =========================================
          RESTORED 3D SECTIONS
          ========================================= */}
      
      {/* Stats Ticker */}
      <section className="relative z-20 border-y border-slate-900 bg-[#030308]">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-slate-800/50">
            {stats.map((stat, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, rotateX: -90, y: 50 }}
                whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
                className="text-center pl-4 first:pl-0 transform-style-3d"
              >
                <h3 className="text-3xl md:text-5xl font-black text-white mb-2 tracking-tight">{stat.value}</h3>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3D Features Grid */}
      <section id="features" className="py-32 bg-[#0A0A14] px-6 md:px-12 max-w-7xl mx-auto relative z-10 perspective-[2000px]">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-4 mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight">The ultimate <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-400 to-slate-600">career weapon.</span></h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 transform-style-3d">
          {features.map((feat, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, rotateY: 45, z: -200 }}
              whileInView={{ opacity: 1, rotateY: 0, z: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              whileHover={{ scale: 1.05, rotateY: 5, z: 50 }}
              transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
              className="bg-[#030308] border border-slate-800/80 p-8 rounded-3xl shadow-2xl transform-style-3d"
            >
              <div className="p-4 bg-slate-900 rounded-2xl w-fit border border-slate-800 mb-6 shadow-inner">
                {feat.icon}
              </div>
              <h4 className="text-xl font-bold text-white mb-3 tracking-tight">{feat.title}</h4>
              <p className="text-sm text-slate-400 leading-relaxed font-medium">{feat.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Social Proof Testimonials */}
      <section className="py-32 px-6 md:px-12 max-w-7xl mx-auto relative z-10 bg-[#030308] border-y border-slate-900 perspective-[1000px]">
        <div className="text-center space-y-4 mb-20">
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">Approved By VIT Students</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, rotateX: 45, y: 100 }}
              whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, type: "spring" }}
              className="bg-gradient-to-b from-[#0A0A14] to-[#030308] border border-slate-800 p-8 rounded-[2rem] flex flex-col justify-between space-y-8 shadow-xl"
            >
              <div className="space-y-4">
                <MessageSquare className="w-8 h-8 text-[#7C3AED] opacity-40" />
                <p className="text-base text-slate-300 italic leading-relaxed font-serif">"{t.quote}"</p>
              </div>
              <div className="flex items-center gap-4 pt-6 border-t border-slate-800/80">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#7C3AED] to-[#F72585] flex items-center justify-center text-sm font-black text-white shadow-lg">
                  {t.avatar}
                </div>
                <div>
                  <h4 className="text-base font-bold text-white tracking-tight">{t.author}</h4>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mt-1">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-32 px-6 md:px-12 max-w-4xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-4 mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">Frequently Asked Questions</h2>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-slate-900/20 border border-slate-800/80 rounded-2xl overflow-hidden transition hover:border-slate-700 hover:bg-slate-900/40"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-6 md:p-8 text-left font-bold text-white transition"
                >
                  <span className="text-base md:text-lg">{faq.question}</span>
                  <ChevronDown className={`w-6 h-6 text-[#7C3AED] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <div className="p-6 md:p-8 pt-0 border-t border-slate-800/30 text-base text-slate-400 leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-32 px-6 md:px-12 max-w-5xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, rotateX: 30, scale: 0.9 }}
          whileInView={{ opacity: 1, rotateX: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 80 }}
          className="bg-gradient-to-r from-[#0A0A14] to-[#131320] border border-[#7C3AED]/30 p-12 md:p-24 text-center space-y-8 relative overflow-hidden shadow-[0_0_100px_rgba(124,58,237,0.15)] rounded-[3rem] transform-style-3d"
        >
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
          <div className="absolute w-[500px] h-[500px] bg-[#7C3AED] -top-32 -left-32 opacity-20 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute w-[500px] h-[500px] bg-[#F72585] -bottom-32 -right-32 opacity-10 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="relative z-10 space-y-8">
            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-tight">
              Ready to automate your <br/>internship hunt?
            </h2>

            <div className="pt-8">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
                <Link href="/auth/signin" className="bg-white text-black py-5 px-12 rounded-full text-xl font-black shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_80px_rgba(255,255,255,0.6)] transition-all flex items-center justify-center gap-4">
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-6 h-6" />
                  Connect Inbox Now
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-[#030308] py-16 px-6 md:px-12 max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between text-sm font-medium text-slate-500 gap-6">
          <Link href="/" className="flex items-center gap-3 text-xl font-black tracking-tight text-white grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all">
            <Sparkles className="w-5 h-5 text-[#7C3AED]" /> OpportunityAI
          </Link>
          <p>© 2026 OpportunityAI. Built for VIT Vellore.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2"><Lock className="w-4 h-4" /> Secure SSL</span>
            <Link href="/privacy" className="hover:text-white transition">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
