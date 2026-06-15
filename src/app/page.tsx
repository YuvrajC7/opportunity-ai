'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { Sparkles as SparklesIcon, Lock, KanbanSquare, MessageSquare, ChevronDown, ChevronUp, Mouse, Mail, GraduationCap, Clock, FileText, ShieldAlert, EyeOff, UserX, Zap, CheckCircle2 } from 'lucide-react';
import SpotlightCard from '@/components/ui/SpotlightCard';

// --- GLOBAL SCROLL TRACKER ---
function useGlobalScroll() {
  const [scrollY, setScrollY] = useState(0);
  const scrollRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      scrollRef.current = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scrollRef;
}

// --- 3D COMPONENTS ---

// Helper to wrap text on the 2D Canvas
function wrapText(context: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const words = text.split(' ');
  let line = '';
  for(let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = context.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      context.fillText(line, x, y);
      line = words[n] + ' ';
      y += lineHeight;
    }
    else {
      line = testLine;
    }
  }
  context.fillText(line, x, y);
}

function EmailMesh({ position, rotation, scale, sender, subject, snippet }: any) {
  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    
    // Create an invisible high-res canvas in memory
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. Solid white background with subtle rounded border illusion
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(10, 10, 1004, 492, 24);
    ctx.fill();

    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 4;
    ctx.strokeRect(10, 10, 1004, 492);

    // 2. Beautiful Gradient Avatar
    const grad = ctx.createLinearGradient(60, 60, 140, 140);
    grad.addColorStop(0, '#3b82f6'); // blue-500
    grad.addColorStop(1, '#06b6d4'); // cyan-500
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(100, 100, 50, 0, Math.PI * 2);
    ctx.fill();

    // 3. Avatar Initial
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 50px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(sender.charAt(0).toUpperCase(), 100, 105);

    // 4. Sender Name
    ctx.fillStyle = '#111827';
    ctx.font = 'bold 44px sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(sender, 180, 95);

    // 5. Metadata
    ctx.fillStyle = '#6b7280';
    ctx.font = '30px sans-serif';
    ctx.fillText('Just now • via Google Workspace', 180, 135);

    // 6. Subject
    ctx.fillStyle = '#1f2937';
    ctx.font = '900 56px sans-serif';
    ctx.fillText(subject, 60, 240);

    // 7. Snippet
    ctx.fillStyle = '#4b5563';
    ctx.font = '36px sans-serif';
    wrapText(ctx, snippet, 60, 310, 900, 48);

    // Bake into WebGL Texture
    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = 16; // Maximum sharpness
    tex.colorSpace = THREE.SRGBColorSpace;
    setTexture(tex);
  }, [sender, subject, snippet]);

  if (!texture) return null;

  return (
    <Float speed={1.5} rotationIntensity={1} floatIntensity={1}>
      <mesh position={position} rotation={rotation} scale={scale} castShadow receiveShadow>
        {/* A thin box to give it physical depth like a real tablet */}
        <boxGeometry args={[4.2, 2.1, 0.05]} />
        {/* Array of materials: sides, front, back */}
        <meshStandardMaterial attach="material-0" color="#f3f4f6" /> {/* right */}
        <meshStandardMaterial attach="material-1" color="#f3f4f6" /> {/* left */}
        <meshStandardMaterial attach="material-2" color="#f3f4f6" /> {/* top */}
        <meshStandardMaterial attach="material-3" color="#f3f4f6" /> {/* bottom */}
        {/* FRONT: The ultra-sharp Canvas UI */}
        <meshStandardMaterial attach="material-4" map={texture} roughness={0.2} metalness={0.1} /> 
        {/* BACK: Plain backing */}
        <meshStandardMaterial attach="material-5" color="#e5e7eb" roughness={0.5} /> 
      </mesh>
    </Float>
  );
}

// Removed procedural data core based on user feedback

function CinematicTunnel() {
  const scrollRef = useGlobalScroll();
  const group = useRef<THREE.Group>(null);
  
  const items = React.useMemo(() => {
    const mockSenders = ["Google Careers", "Placement Cell", "Jane Doe", "Apple HR", "Spam Deals", "GitHub", "Vercel", "Meta Recruiting", "Uber Internships"];
    const mockSubjects = ["Your Application Status", "URGENT: Registration", "Meeting Notes", "Next Steps: Software Engineer", "Buy 1 Get 1 Free", "Security Alert", "Deployment Successful", "Interview Invite", "Please complete assessment"];
    const snippet = "Dear student, we are pleased to inform you that the application window for the software engineering internship is now open. Please review the attached requirements...";
    
    // Create a massive floating vortex of 80 HUGE emails
    const cards = Array.from({ length: 80 }).map((_, i) => {
      const theta = i * 0.6; 
      const radius = 10 + Math.random() * 8;
      const x = Math.cos(theta) * radius;
      const y = Math.sin(theta) * radius;
      const z = -i * 5; // Deep into the screen

      // Face the camera perfectly or with slight cinematic angles
      const rotY = (Math.random() - 0.5) * 0.8;
      const rotX = (Math.random() - 0.5) * 0.5;
      const rotZ = (Math.random() - 0.5) * 0.2;

      return {
        type: 'card',
        position: [x, y, z] as [number, number, number],
        rotation: [rotX, rotY, rotZ] as [number, number, number],
        scale: Math.random() * 1.5 + 1.5, // MASSIVE emails
        sender: mockSenders[Math.floor(Math.random() * mockSenders.length)],
        subject: mockSubjects[Math.floor(Math.random() * mockSubjects.length)],
        snippet
      };
    });

    return [...cards];
  }, []);

  useFrame(() => {
    if (group.current) {
      // Smoothly fly through the entire 300-unit deep tunnel based on scroll
      const maxScroll = window.innerHeight * 4;
      let progress = scrollRef.current / maxScroll;
      if (progress > 1) progress = 1;

      // Z-translation to fly forward
      group.current.position.z = progress * 320; 
      
      // Slight elegant rotation of the entire tunnel
      group.current.rotation.z = progress * Math.PI * 0.5;
      
      // Fade out gracefully at the end
      const fade = Math.max(0, 1 - Math.pow(progress, 8)); 
      group.current.scale.setScalar(fade);
    }
  });

  return (
    <group ref={group}>
      {items.map((p, i) => (
        <EmailMesh key={i} {...p} />
      ))}
    </group>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={1} />
      <directionalLight position={[10, 10, 10]} intensity={3} color="#ffffff" castShadow />
      <pointLight position={[-10, -10, -10]} color="#06D6A0" intensity={5} />
      
      <CinematicTunnel />
      
      {/* Immersive Stardust Field */}
      <Sparkles count={2000} scale={100} size={2} speed={0.2} opacity={0.3} color="#ffffff" />
      <Sparkles count={500} scale={100} size={4} speed={0.5} opacity={0.8} color="#06D6A0" />
      <Environment preset="city" />
    </>
  );
}

// --- HTML COMPONENTS ---

function FAQItem({ question, answer }: { question: string, answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/10 group">
      <button 
        onClick={() => setOpen(!open)} 
        className="w-full py-8 flex items-center justify-between text-left hover:text-[#06D6A0] transition-colors"
      >
        <span className="font-bold text-2xl md:text-3xl tracking-tight">{question}</span>
        {open ? <ChevronUp className="w-8 h-8 opacity-50" /> : <ChevronDown className="w-8 h-8 opacity-50" />}
      </button>
      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${open ? 'max-h-96 pb-8 opacity-100' : 'max-h-0 opacity-0'}`}>
        <p className="text-white/60 font-medium text-xl leading-relaxed max-w-3xl">{answer}</p>
      </div>
    </div>
  );
}

// --- MAIN PAGE ---

export default function Home() {
  return (
    <div className="w-full bg-[#050505] selection:bg-[#06D6A0]/30 selection:text-white">
      
      <nav className="fixed top-0 left-0 right-0 z-[100] p-6 md:p-12 flex items-center justify-between pointer-events-none mix-blend-difference">
        <Link href="/" className="flex items-center gap-3 pointer-events-auto group">
          <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center group-hover:scale-105 transition-transform">
            <SparklesIcon className="w-6 h-6 text-black" />
          </div>
          <span className="font-black text-2xl tracking-tighter text-white uppercase hidden sm:block">
            Opportunity<span className="opacity-50">AI</span>
          </span>
        </Link>
        <Link href="/auth/signin" className="bg-white text-black px-8 py-3.5 rounded-full text-sm font-black uppercase tracking-widest hover:scale-105 transition-transform pointer-events-auto">
          ACCESS PORTAL
        </Link>
      </nav>

      <div className="fixed inset-0 z-0 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 10], fov: 50 }} shadows>
          <Scene />
        </Canvas>
      </div>

      <div className="relative z-10 w-full">
        
        {/* 3D Intro Padding Spacer */}
        <div className="w-full pointer-events-none flex flex-col">
          
          <div className="h-screen w-full flex flex-col items-center justify-center text-center px-4 mix-blend-difference text-white">
            <h1 className="text-[12vw] leading-none font-black text-transparent -webkit-text-stroke-[2px] -webkit-text-stroke-white/50 uppercase tracking-tighter">
              SCROLL
            </h1>
            <div className="flex flex-col items-center mt-4">
              <Mouse className="w-8 h-8 text-white/50 mb-2 animate-bounce" />
              <p className="text-white/50 text-xl font-bold tracking-widest uppercase">To Be Free of Chaos</p>
            </div>
          </div>

          <div className="h-[150vh] w-full flex items-center justify-center px-12 md:px-32 mix-blend-difference text-white">
            <h2 className="text-[10vw] leading-none font-black uppercase tracking-tighter text-transparent -webkit-text-stroke-[2px] -webkit-text-stroke-white/50">
              10,000 EMAILS.
            </h2>
          </div>

          {/* Sticky Command Center Section */}
          <div className="h-[200vh] relative w-full pointer-events-auto">
            <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center px-4">
              <motion.div 
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true, amount: 0.5 }}
                className="bg-[#050505]/80 backdrop-blur-3xl border border-white/10 p-10 md:p-14 rounded-[3rem] text-center max-w-5xl w-full shadow-2xl"
              >
                <h2 className="text-4xl md:text-6xl font-black text-[#06D6A0] uppercase tracking-tighter mb-10 drop-shadow-[0_0_30px_rgba(6,214,160,0.5)]">
                  THE COMMAND CENTER
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                  <div className="bg-white/5 p-8 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors">
                    <h3 className="text-sm font-black text-white/50 mb-4 uppercase tracking-widest">The Problem</h3>
                    <p className="text-lg text-white/80 font-medium leading-relaxed">
                      Your university inbox is a chaotic mess of thousands of emails. Critical internship deadlines, assessment links, and OA tests get buried and missed every single day.
                    </p>
                  </div>
                  <div className="bg-[#06D6A0]/10 p-8 rounded-3xl border border-[#06D6A0]/20 hover:bg-[#06D6A0]/20 transition-colors shadow-[inset_0_0_20px_rgba(6,214,160,0.1)]">
                    <h3 className="text-sm font-black text-[#06D6A0] mb-4 uppercase tracking-widest">The Solution</h3>
                    <p className="text-lg text-[#06D6A0]/90 font-medium leading-relaxed">
                      Our AI securely scans your inbox in the background, extracts every hidden opportunity, and organizes them perfectly on a beautiful Kanban board with automated deadline alerts.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

        </div>

        <main className="w-full bg-[#050505] relative z-20 border-t border-white/10 shadow-[0_-30px_100px_rgba(0,0,0,1)]">
          
          {/* 1. The Career Email Deluge */}
          <section className="py-56 px-6 md:px-12 max-w-[1600px] mx-auto overflow-hidden">
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-24"
            >
              <h2 className="text-[5vw] leading-[1] font-black tracking-tighter text-[#06D6A0] mb-6">
                The Career Email Deluge
              </h2>
              <p className="text-xl text-white/50 font-medium max-w-2xl mx-auto">
                University life moves fast. Inbox management shouldn't hold back your career trajectory.
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: "Information Overload", text: "Students receive 50-150 emails daily. Placement circulars, club announcements, and newsletters bury critical opportunities.", icon: ShieldAlert },
                { title: "Deadline Blindness", text: "Application deadlines are scattered across long text walls. Manually tracking calendars results in 68% of students missing at least 1 deadline monthly.", icon: Clock },
                { title: "Lack of Personalisation", text: "Generic portals show the same listings to everyone. You spend hours searching for listings that match your specific year, department, and skills.", icon: EyeOff }
              ].map((feat, i) => (
                <SpotlightCard key={i} className="h-full rounded-3xl" spotlightColor="rgba(255, 255, 255, 0.05)">
                  <div className="bg-white/5 border border-white/10 p-10 h-full relative overflow-hidden group hover:border-white/20 transition-colors">
                    <div 
                      className="w-14 h-14 rounded-2xl flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(255,255,255,0.05)] border border-white/10 bg-white/5 text-white group-hover:text-[#06D6A0] group-hover:border-[#06D6A0]/30 transition-colors"
                    >
                      <feat.icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-2xl font-black text-white mb-4 tracking-tight group-hover:text-[#06D6A0] transition-colors">{feat.title}</h3>
                    <p className="text-lg text-white/50 font-medium leading-relaxed">{feat.text}</p>
                  </div>
                </SpotlightCard>
              ))}
            </div>
          </section>

          {/* 2. Seamless Workflow */}
          <section className="py-32 px-6 md:px-12 max-w-[1600px] mx-auto overflow-hidden">
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-32"
            >
              <h2 className="text-[5vw] leading-[1] font-black tracking-tighter text-[#06D6A0] mb-6">
                Seamless Workflow, Zero Effort
              </h2>
              <p className="text-xl text-white/50 font-medium max-w-2xl mx-auto">
                From connected inbox to applied offer in three simple steps. We do the heavy lifting.
              </p>
            </motion.div>

            <div className="relative max-w-5xl mx-auto">
              <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-transparent via-[#06D6A0]/50 to-transparent" />
              <div className="grid md:grid-cols-3 gap-16 relative">
                {[
                  { step: "01", title: "Secure One-Click Connect", text: "Connect your Google Account securely. We request strictly read-only Gmail access. Your credentials are never stored." },
                  { step: "02", title: "AI Opportunity Engine Scans", text: "Our LLM-powered extraction pipeline scans your emails, classifying internships, hackathons, and research projects with 94%+ precision." },
                  { step: "03", title: "Take Guided Action", text: "See match scores tailored to your skills, view concise summaries, track status on your Kanban Board, and get automated deadline alerts." }
                ].map((step, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.2, type: "spring", stiffness: 100 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center text-center relative z-10"
                  >
                    <div className="w-24 h-24 rounded-full bg-[#050505] border-2 border-[#06D6A0] flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(6,214,160,0.3)]">
                      <span className="text-3xl font-black text-[#06D6A0]">{step.step}</span>
                    </div>
                    <h3 className="text-2xl font-black text-white mb-4 tracking-tight">{step.title}</h3>
                    <p className="text-lg text-white/50 font-medium leading-relaxed">{step.text}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* 3. Packed With MVP Power */}
          <section className="py-56 px-6 md:px-12 max-w-[1600px] mx-auto overflow-hidden">
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-24"
            >
              <h2 className="text-[5vw] leading-[1] font-black tracking-tighter text-[#06D6A0] mb-6">
                Packed With MVP Power
              </h2>
              <p className="text-xl text-white/50 font-medium max-w-2xl mx-auto">
                Every feature is custom engineered to eliminate searching and maximise your placement efficiency.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { title: "Read-Only Gmail Sync", text: "Direct read-only integration via Google OAuth. Processes the past 90 days in 30 seconds and refreshes every 4 hours automatically.", icon: Mail },
                { title: "AI Extractions", text: "Extracts Title, Org, Category, Deadline, Link, Eligibility, and Stipends. Bypasses administrative walls and formatting clutter.", icon: SparklesIcon },
                { title: "Personalised Match Score", text: "A composite 0-100 score calculated by matching opportunity requirements with your profile skills, year of study, and interests.", icon: GraduationCap },
                { title: "Kanban Application Tracker", text: "Drag-and-drop opportunity cards through columns: Interested, Applied, Under Review, Offer Received, and Rejected.", icon: KanbanSquare },
                { title: "Smart Deadline Alerts", text: "Automatic email alerts 7 days, 3 days, and 24 hours before deadlines. Never let an opportunity slip by again.", icon: Clock },
                { title: "AI Opportunity Summaries", text: "Get brief, high-impact summaries outlining what the opportunity is, who it is for, key perks, and immediate next steps.", icon: FileText }
              ].map((feat, i) => (
                <SpotlightCard key={i} className="h-full rounded-[2rem]" spotlightColor="rgba(6, 214, 160, 0.15)">
                  <div className="bg-[#111111] border border-white/5 p-10 h-full relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="relative z-10">
                      <div 
                        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8 shadow-lg border border-white/10 bg-white/5 text-white group-hover:text-[#06D6A0] group-hover:border-[#06D6A0]/30 transition-colors"
                      >
                        <feat.icon className="w-8 h-8" />
                      </div>
                      <h3 className="text-3xl font-black text-white mb-4 tracking-tight group-hover:text-[#06D6A0] transition-colors">{feat.title}</h3>
                      <p className="text-xl text-white/50 font-medium leading-relaxed">{feat.text}</p>
                    </div>
                  </div>
                </SpotlightCard>
              ))}
            </div>
          </section>

          <section className="py-40 bg-white text-black px-6 md:px-12 overflow-hidden">
            <div className="max-w-[1600px] mx-auto">
              <motion.h2 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-[5vw] leading-[0.9] font-black uppercase tracking-tighter mb-24"
              >
                APPROVED BY <br/>THE BEST.
              </motion.h2>
              <div className="grid md:grid-cols-3 gap-12">
                {[
                  { quote: "It surfaced an off-campus research internship I had completely archived by mistake.", author: "Aditya Vardhan", role: "CSE, 4th Year Student", avatar: "AV" },
                  { quote: "Having SIH and Devfolio listings in one dashboard with match scores saved me hours.", author: "Nisha Ramachandran", role: "ECE, 3rd Year Student", avatar: "NR" },
                  { quote: "The automated deadline reminders are a lifesaver. Completed 8 apps this month.", author: "Rahul Krishnan", role: "IT, 2nd Year Student", avatar: "RK" }
                ].map((t, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: i * 0.2 }}
                    viewport={{ once: true }}
                    className="space-y-8"
                  >
                    <MessageSquare className="w-12 h-12 text-black/20" />
                    <p className="text-2xl text-black/80 font-medium leading-relaxed">"{t.quote}"</p>
                    <div className="flex items-center gap-4 pt-8 border-t border-black/10">
                      <div className="w-14 h-14 rounded-full bg-black flex items-center justify-center text-white font-black text-xl">
                        {t.avatar}
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-black uppercase tracking-tight">{t.author}</h4>
                        <p className="text-sm text-black/50 font-bold uppercase tracking-widest mt-1">{t.role}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          <section className="py-40 px-6 md:px-12 max-w-[1200px] mx-auto text-white overflow-hidden">
            <motion.h2 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-[5vw] leading-[0.9] font-black uppercase tracking-tighter mb-24 text-center text-[#06D6A0]"
            >
              FREQUENTLY ASKED <br/>QUESTIONS.
            </motion.h2>
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="border-t border-white/10"
            >
              <FAQItem 
                question="Is OpportunityAI secure? Can you read all my personal emails?" 
                answer="We use Google OAuth to securely request read-only access. We specifically filter only for emails related to internships, careers, and college placement cells. We cannot send emails on your behalf, and we do not store the full contents of your emails—only the extracted metadata (Role, Company, Deadline)."
              />
              <FAQItem 
                question="Why is login restricted to @vitstudent.ac.in emails?" 
                answer="During our closed beta, the AI is fine-tuned specifically for the formats and structures of VIT Vellore and Chennai placement circulars. This ensures maximum accuracy before we expand to other universities."
              />
              <FAQItem 
                question="How does the Match Score work?" 
                answer="When you onboard, we build a customized profile for you. The AI cross-references the requirements of every extracted internship against your specific year, department, and technical skills to calculate a highly personalized Match Score."
              />
              <FAQItem 
                question="Do I have to pay for OpportunityAI?" 
                answer="No! OpportunityAI is completely free for students during our beta phase. Our core mission is to democratize access to career opportunities."
              />
              <FAQItem 
                question="Can I manually add opportunities I find elsewhere?" 
                answer="Yes! While the AI handles the bulk of the work from your inbox, your Command Center features a 'New Application' button allowing you to manually add and track off-campus links you find on LinkedIn, Twitter, or Discord."
              />
              <FAQItem 
                question="How do I disconnect my account or revoke Gmail access?" 
                answer="You have total control. You can revoke read-access at any time directly from your Google Account Security settings, or delete your account entirely from the OpportunityAI Settings page. We do not retain data after deletion."
              />
            </motion.div>
          </section>

          <footer className="bg-[#020202] py-20 px-6 md:px-12 border-t border-white/10 text-white flex flex-col items-center gap-16">
            
            <div className="text-center max-w-3xl flex flex-col items-center gap-8">
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white">
                READY TO ENTER THE VORTEX?
              </h2>
              <p className="text-xl text-white/60 font-medium">
                Connect your Google Workspace in one click and let the AI extract every hidden opportunity from your inbox instantly.
              </p>
              <Link href="/auth/signin" className="inline-flex bg-[#06D6A0] text-black py-5 px-12 rounded-full text-lg font-black uppercase tracking-widest hover:scale-105 hover:bg-white transition-all items-center gap-4 shadow-[0_0_30px_rgba(6,214,160,0.4)]">
                <KanbanSquare className="w-6 h-6" />
                Connect Google Workspace
              </Link>
            </div>

            <div className="w-full h-px bg-white/10"></div>

            <div className="max-w-[1600px] w-full mx-auto flex flex-col md:flex-row items-center justify-between text-sm font-bold text-white/40 uppercase tracking-widest gap-6">
              <Link href="/" className="flex items-center gap-3 text-2xl font-black tracking-tighter text-white hover:opacity-80 transition-opacity">
                <SparklesIcon className="w-6 h-6 text-[#06D6A0]" />
                <span className="tracking-tighter">OPPORTUNITY<span className="opacity-50">AI</span></span>
              </Link>
              <p>© 2026. THE FUTURE OF RECRUITMENT.</p>
              <div className="flex items-center gap-8">
                <span className="flex items-center gap-2"><Lock className="w-4 h-4" /> SECURE OAUTH</span>
                <Link href="/privacy" className="hover:text-white transition">PRIVACY</Link>
                <Link href="/terms" className="hover:text-white transition">TERMS</Link>
              </div>
            </div>
          </footer>

        </main>
      </div>
    </div>
  );
}
