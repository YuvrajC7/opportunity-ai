'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import Lenis from 'lenis';
import { 
  Sparkles, 
  ArrowRight, 
  Mail, 
  KanbanSquare, 
  Lock,
  MessageSquare,
  Check
} from 'lucide-react';

export default function Home() {
  const [scrolled, setScrolled] = useState(false);

  // --- INIT BUTTERY SMOOTH SCROLL (LENIS) ---
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.05, // Lower is smoother/heavier
      wheelMultiplier: 0.8,
      touchMultiplier: 1.5,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      lenis.destroy();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // --- KFC STYLE PARALLAX ENGINE ---
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 50,
    damping: 20,
    restDelta: 0.001
  });

  // 1. The Massive Central Object (Twists, Scales, and Rotates)
  const objectScale = useTransform(smoothProgress, [0, 0.5, 1], [0.5, 1.2, 0.8]);
  const objectRotateX = useTransform(smoothProgress, [0, 0.5, 1], [40, 0, -20]);
  const objectRotateY = useTransform(smoothProgress, [0, 0.5, 1], [-30, 0, 20]);
  const objectRotateZ = useTransform(smoothProgress, [0, 0.5, 1], [-10, 0, 5]);
  const objectY = useTransform(smoothProgress, [0, 0.5, 1], [100, 0, -100]);
  
  // 2. Parallax Background Typography
  const textLeftToRight = useTransform(smoothProgress, [0, 1], ["-20%", "20%"]);
  const textRightToLeft = useTransform(smoothProgress, [0, 1], ["20%", "-20%"]);
  const textTopToBottom = useTransform(smoothProgress, [0, 1], ["-50%", "50%"]);
  const textOpacity = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  // Restored Content
  const testimonials = [
    { quote: "It surfaced an off-campus research internship I had completely archived by mistake.", author: "Aditya Vardhan", role: "CSE, 4th Year Student", avatar: "AV" },
    { quote: "Having SIH and Devfolio listings in one dashboard with match scores saved me hours.", author: "Nisha Ramachandran", role: "ECE, 3rd Year Student", avatar: "NR" },
    { quote: "The automated deadline reminders are a lifesaver. Completed 8 apps this month.", author: "Rahul Krishnan", role: "IT, 2nd Year Student", avatar: "RK" }
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-slate-200 selection:bg-[#E4002B]/30 selection:text-white overflow-hidden font-sans">
      
      {/* Heavy Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 border-b ${scrolled ? 'bg-[#0A0A0A]/90 border-white/5 py-4 backdrop-blur-xl' : 'bg-transparent border-transparent py-8'}`}>
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.2)]">
              <Sparkles className="w-6 h-6 text-black" />
            </div>
            <span className="font-black text-2xl tracking-tighter text-white uppercase hidden sm:block">
              Opportunity<span className="opacity-50">AI</span>
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/auth/signin" className="bg-white text-black px-8 py-3.5 rounded-full text-sm font-black uppercase tracking-widest hover:bg-gray-200 transition-colors flex items-center gap-2">
              Launch App
            </Link>
          </div>
        </div>
      </nav>

      {/* =========================================
          THE MASSIVE KFC-STYLE HERO (500vh)
          ========================================= */}
      <section ref={heroRef} className="h-[500vh] relative w-full bg-[#0A0A0A]">
        
        <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center perspective-[2000px]">
          
          {/* Background Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)] z-0" />

          {/* PARALLAX TYPOGRAPHY BACKGROUND */}
          <div className="absolute inset-0 flex flex-col justify-between py-20 pointer-events-none z-10 overflow-hidden">
            <motion.h1 
              style={{ x: textLeftToRight, opacity: textOpacity }}
              className="text-[12vw] font-black text-transparent -webkit-text-stroke-[2px] -webkit-text-stroke-white/10 uppercase tracking-tighter whitespace-nowrap leading-none"
            >
              EXTRACT INTERNSHIPS
            </motion.h1>
            <motion.h1 
              style={{ x: textRightToLeft, opacity: textOpacity }}
              className="text-[12vw] font-black text-white/5 uppercase tracking-tighter whitespace-nowrap leading-none text-right"
            >
              NEVER MISS DEADLINES
            </motion.h1>
          </div>

          <motion.h1 
            style={{ y: textTopToBottom, opacity: textOpacity }}
            className="absolute left-[-20vw] top-[20%] text-[20vw] font-black text-white/5 uppercase tracking-tighter whitespace-nowrap rotate-90 pointer-events-none z-10"
          >
            AUTOMATE
          </motion.h1>

          {/* THE MASSIVE CENTRAL 3D OBJECT */}
          <motion.div 
            style={{ 
              scale: objectScale, 
              rotateX: objectRotateX, 
              rotateY: objectRotateY,
              rotateZ: objectRotateZ,
              y: objectY
            }}
            className="relative z-30 transform-style-3d w-[90vw] md:w-[600px] h-auto aspect-[4/3] rounded-[2rem] border border-white/20 bg-gradient-to-br from-black/80 to-[#111] backdrop-blur-2xl shadow-[0_0_100px_rgba(255,255,255,0.1),_inset_0_2px_0_rgba(255,255,255,0.2)] p-8 flex flex-col"
          >
            {/* The 3D UI Details */}
            <div className="flex justify-between items-center mb-10 border-b border-white/10 pb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-black" />
                </div>
                <div>
                  <h3 className="text-white font-black text-2xl tracking-tight uppercase">Top Tier Internship</h3>
                  <p className="text-white/50 text-sm font-bold uppercase tracking-widest mt-1">AI Extracted from Gmail</p>
                </div>
              </div>
              <div className="w-20 h-20 rounded-full border-4 border-[#06D6A0] border-t-transparent flex items-center justify-center relative">
                <span className="absolute text-[#06D6A0] font-black text-xl">98%</span>
              </div>
            </div>

            <div className="flex-1 space-y-6">
              <div className="bg-white/5 p-6 rounded-2xl border border-white/5 transform-style-3d translate-z-[50px] shadow-2xl">
                <div className="flex items-center gap-2 text-[#06D6A0] text-sm font-black uppercase tracking-widest mb-3">
                  <Sparkles className="w-4 h-4" /> AI Summary
                </div>
                <p className="text-white/80 text-lg leading-relaxed font-medium">
                  We found a hidden software engineering internship application deep in a forwarded college circular. 
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white/5 p-6 rounded-2xl border border-white/5 text-center transform-style-3d translate-z-[30px]">
                  <p className="text-white/40 text-xs font-black uppercase tracking-widest mb-2">Deadline</p>
                  <p className="text-red-500 text-2xl font-black uppercase">TOMORROW</p>
                </div>
                <div className="bg-white/5 p-6 rounded-2xl border border-white/5 text-center transform-style-3d translate-z-[30px]">
                  <p className="text-white/40 text-xs font-black uppercase tracking-widest mb-2">Match</p>
                  <p className="text-[#06D6A0] text-2xl font-black uppercase">REACT.JS</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center transform-style-3d translate-z-[80px]">
              <span className="text-white/40 font-black text-sm tracking-widest uppercase">Status: Not Applied</span>
              <button className="bg-white hover:bg-gray-200 text-black font-black text-sm uppercase tracking-widest py-4 px-8 rounded-full transition flex items-center gap-2 shadow-[0_0_40px_rgba(255,255,255,0.2)]">
                <KanbanSquare className="w-5 h-5" /> Move to Board
              </button>
            </div>
          </motion.div>

          {/* Foreground Parallax Text */}
          <motion.h1 
            style={{ x: textRightToLeft, opacity: textOpacity }}
            className="absolute bottom-[10%] text-[8vw] font-black text-white uppercase tracking-tighter whitespace-nowrap leading-none pointer-events-none z-40"
          >
            THE CAREER COMMAND CENTER
          </motion.h1>

        </div>
      </section>

      {/* =========================================
          MASSIVE IMPACT SECTIONS (POST-HERO)
          ========================================= */}
      
      <section className="py-40 bg-white text-black relative z-20">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12">
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-[6vw] leading-[0.9] font-black uppercase tracking-tighter max-w-5xl mb-12">
              STOP LOSING <br/>OPPORTUNITIES IN <br/>THE NOISE.
            </h2>
            <p className="text-2xl md:text-4xl font-medium text-black/60 max-w-3xl leading-tight">
              OpportunityAI securely connects to your university inbox, extracts hidden internships using NLP, and builds a personalized tracking board.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mt-32">
            {[
              { title: "Direct Sync", text: "Secure, read-only OAuth integration. Refreshes automatically." },
              { title: "Smart Extractions", text: "Pulls the Role, Company, Link, and Deadline from text walls." },
              { title: "Skill Matching", text: "A 0-100 score matching the job to your specific profile." },
              { title: "Push Alerts", text: "Get notified before deadlines expire. Never miss out." }
            ].map((feat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="bg-gray-100 p-12 md:p-16 rounded-[3rem]"
              >
                <div className="w-16 h-16 bg-black rounded-full text-white flex items-center justify-center font-black text-2xl mb-8">
                  {i + 1}
                </div>
                <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-4">{feat.title}</h3>
                <p className="text-xl text-black/60 font-medium">{feat.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section (Dark Mode) */}
      <section className="py-40 bg-[#0A0A0A] border-t border-white/10">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12">
          <h2 className="text-[5vw] leading-[0.9] font-black uppercase tracking-tighter text-white mb-24">
            APPROVED BY <br/>THE BEST.
          </h2>

          <div className="grid md:grid-cols-3 gap-12">
            {testimonials.map((t, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-8"
              >
                <MessageSquare className="w-12 h-12 text-white/20" />
                <p className="text-2xl text-white/80 font-medium leading-relaxed">"{t.quote}"</p>
                <div className="flex items-center gap-4 pt-8 border-t border-white/10">
                  <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-black font-black text-xl">
                    {t.avatar}
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-white uppercase tracking-tight">{t.author}</h4>
                    <p className="text-sm text-white/40 font-bold uppercase tracking-widest mt-1">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Giant CTA */}
      <section className="py-40 bg-[#06D6A0] text-black overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 relative z-10 text-center">
          <h2 className="text-[10vw] leading-[0.8] font-black uppercase tracking-tighter mb-12">
            START NOW.
          </h2>
          <Link href="/auth/signin" className="inline-flex bg-black text-white py-6 px-16 rounded-full text-2xl font-black uppercase tracking-widest hover:scale-105 transition-transform items-center gap-4 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-8 h-8" />
            Connect Google
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0A0A0A] py-12 px-6 md:px-12 border-t border-white/10">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between text-sm font-bold text-white/40 uppercase tracking-widest gap-6">
          <Link href="/" className="flex items-center gap-3 text-2xl font-black tracking-tighter text-white">
            <Sparkles className="w-6 h-6 text-white" /> OPPORTUNITY<span className="opacity-50">AI</span>
          </Link>
          <p>© 2026. BUILT FOR VIT.</p>
          <div className="flex items-center gap-8">
            <span className="flex items-center gap-2"><Lock className="w-4 h-4" /> SECURE</span>
            <Link href="/privacy" className="hover:text-white transition">PRIVACY</Link>
            <Link href="/terms" className="hover:text-white transition">TERMS</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
