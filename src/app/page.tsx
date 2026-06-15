'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, Environment, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Sparkles as SparklesIcon, Lock, KanbanSquare, MessageSquare, ChevronDown, ChevronUp, Mouse } from 'lucide-react';

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

function PremiumGmailCard({ position, rotation, scale, sender, subject }: any) {
  return (
    <Float speed={2} rotationIntensity={2} floatIntensity={2}>
      <group position={position} rotation={rotation} scale={scale}>
        {/* Physical Backing Plate */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[4.2, 2.2, 0.05]} />
          <meshPhysicalMaterial 
            color="#ffffff" 
            metalness={0.1} 
            roughness={0.4} 
            clearcoat={1} 
            clearcoatRoughness={0.1}
          />
        </mesh>
        
        {/* The HTML UI perfectly synced to the 3D plane */}
        <Html transform position={[0, 0, 0.026]} distanceFactor={1.5} className="w-[380px] bg-white rounded-lg shadow-sm p-4 flex flex-col gap-2 font-sans border border-gray-100 pointer-events-none">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 text-white flex items-center justify-center font-black text-xl shadow-inner">
              {sender.charAt(0)}
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-gray-900 text-[15px] leading-tight">{sender}</span>
              <span className="text-xs text-gray-400 font-medium">Just now • via College Portal</span>
            </div>
          </div>
          <div className="font-black text-gray-800 text-[16px] leading-snug">{subject}</div>
          <div className="text-gray-500 text-[13px] leading-relaxed line-clamp-2">
            "Dear student, we are pleased to inform you that the application window for the software engineering internship is now open. Please review the attached requirements..."
          </div>
        </Html>
      </group>
    </Float>
  );
}

function Vortex() {
  const scrollRef = useGlobalScroll();
  const group = useRef<THREE.Group>(null);
  
  const items = React.useMemo(() => {
    const mockSenders = ["Google Careers", "Placement Cell", "Jane Doe", "Apple HR", "Spam Deals", "GitHub", "Vercel", "Meta Recruiting", "Uber Internships"];
    const mockSubjects = ["Your Application Status", "URGENT: Registration", "Meeting Notes", "Next Steps: Software Engineer", "Buy 1 Get 1 Free", "Security Alert", "Deployment Successful", "Interview Invite", "Please complete assessment"];
    
    // 20 Premium Gmail Cards
    const cards = Array.from({ length: 20 }).map((_, i) => ({
      type: 'card',
      position: [
        (Math.random() - 0.5) * 30, 
        (Math.random() - 0.5) * 30, 
        (Math.random() - 0.5) * 80 - 10
      ] as [number, number, number],
      rotation: [
        Math.random() * Math.PI, 
        Math.random() * Math.PI, 
        0
      ] as [number, number, number],
      scale: Math.random() * 0.8 + 0.6,
      sender: mockSenders[Math.floor(Math.random() * mockSenders.length)],
      subject: mockSubjects[Math.floor(Math.random() * mockSubjects.length)]
    }));

    // 40 Glowing Primitives (Rings, Octahedrons)
    const primitives = Array.from({ length: 40 }).map((_, i) => ({
      type: i % 2 === 0 ? 'ring' : 'crystal',
      position: [
        (Math.random() - 0.5) * 40, 
        (Math.random() - 0.5) * 40, 
        (Math.random() - 0.5) * 80 - 10
      ] as [number, number, number],
      rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0] as [number, number, number],
      scale: Math.random() * 1.5 + 0.5,
    }));

    return [...cards, ...primitives];
  }, []);

  useFrame(() => {
    if (group.current) {
      // Calculate scroll progress relative to the 500vh 3D section
      // window.innerHeight * 4 is roughly where the 3D scene ends
      const maxScroll = window.innerHeight * 4;
      let progress = scrollRef.current / maxScroll;
      if (progress > 1) progress = 1;

      // Fly through the vortex as we scroll
      group.current.position.z = progress * 60; 
      // Barrel roll
      group.current.rotation.z = progress * Math.PI * 1.5;
      
      // Fade out the vortex as we scroll past the 3D section into the HTML features
      const fade = Math.max(0, 1 - (progress - 0.8) * 5); // Fades quickly between 0.8 and 1.0
      group.current.scale.setScalar(fade);
    }
  });

  return (
    <group ref={group}>
      {items.map((p, i) => {
        if (p.type === 'card') {
          return <PremiumGmailCard key={i} {...p} />;
        }
        if (p.type === 'ring') {
          return (
            <Float key={i} speed={3} rotationIntensity={5} floatIntensity={5}>
              <mesh position={p.position as any} rotation={p.rotation as any} scale={p.scale}>
                <torusGeometry args={[1, 0.05, 16, 50]} />
                <meshStandardMaterial color="#06D6A0" emissive="#06D6A0" emissiveIntensity={2} />
              </mesh>
            </Float>
          );
        }
        return (
          <Float key={i} speed={1} rotationIntensity={2} floatIntensity={2}>
            <mesh position={p.position as any} rotation={p.rotation as any} scale={p.scale}>
              <octahedronGeometry args={[0.5, 0]} />
              <meshPhysicalMaterial color="#ffffff" transmission={1} opacity={1} roughness={0} ior={1.5} thickness={2} />
            </mesh>
          </Float>
        );
      })}
    </group>
  );
}

function CommandCenter() {
  const scrollRef = useGlobalScroll();
  const ref = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    const maxScroll = window.innerHeight * 4;
    const progress = scrollRef.current / maxScroll;
    
    if (ref.current && ringRef.current && groupRef.current) {
      // Emerges at progress 0.6, peaks at 0.8, fades by 1.0
      let scale = 0;
      if (progress > 0.5 && progress < 1.0) {
        scale = Math.sin((progress - 0.5) * (Math.PI / 0.5)) * 1.5;
      }
      scale = Math.max(0, scale);

      ref.current.scale.setScalar(scale);
      ref.current.rotation.y += 0.01;
      ref.current.rotation.x += 0.005;

      ringRef.current.scale.setScalar(scale * 1.5);
      ringRef.current.rotation.x = Math.PI / 2;
      ringRef.current.rotation.z -= 0.02;

      // Moves up as we scroll past it
      groupRef.current.position.y = (progress - 0.8) * 15;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, -10]}>
      <mesh ref={ref}>
        <icosahedronGeometry args={[2, 1]} />
        <meshStandardMaterial color="#06D6A0" wireframe />
      </mesh>
      <mesh ref={ringRef}>
        <torusGeometry args={[3, 0.05, 16, 100]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={2} />
      </mesh>
    </group>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={1} />
      <directionalLight position={[10, 10, 10]} intensity={3} color="#ffffff" castShadow />
      <pointLight position={[-10, -10, -10]} color="#06D6A0" intensity={5} />
      
      <Vortex />
      <CommandCenter />
      
      <Sparkles count={800} scale={40} size={3} speed={0.4} opacity={0.5} color="#06D6A0" />
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
      
      {/* Static Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-[100] p-6 md:p-12 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto">
          <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">
            <SparklesIcon className="w-6 h-6 text-black" />
          </div>
          <span className="font-black text-2xl tracking-tighter text-white uppercase hidden sm:block shadow-black drop-shadow-lg">
            Opportunity<span className="opacity-50">AI</span>
          </span>
        </div>
        <Link href="/auth/signin" className="bg-white text-black px-8 py-3.5 rounded-full text-sm font-black uppercase tracking-widest hover:bg-gray-200 transition-colors pointer-events-auto shadow-[0_0_20px_rgba(255,255,255,0.2)]">
          Launch App
        </Link>
      </nav>

      {/* The FIXED 3D WebGL Canvas Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 10], fov: 45 }} shadows>
          <Scene />
        </Canvas>
      </div>

      {/* 
        NATIVE SCROLLING HTML OVERLAY 
        The first 500vh is mostly transparent, allowing interaction with the 3D scene.
        The actual solid content begins after 500vh.
      */}
      <div className="relative z-10 w-full">
        
        {/* --- 3D SEQUENCE OVERLAYS (400vh total scroll space for the intro) --- */}
        <div className="h-screen w-full flex flex-col items-center justify-center text-center px-4 pointer-events-none sticky top-0 -z-10">
           {/* We just let the canvas be the star here */}
        </div>

        {/* Floating Text Checkpoints within the 3D intro */}
        <div className="h-[400vh] w-full pointer-events-none flex flex-col justify-between pt-[50vh] pb-[50vh]">
          
          <div className="w-full flex flex-col items-center text-center px-4 mix-blend-difference text-white">
            <h1 className="text-[12vw] leading-none font-black text-transparent -webkit-text-stroke-[2px] -webkit-text-stroke-white/50 uppercase tracking-tighter">
              SCROLL
            </h1>
            <div className="flex flex-col items-center mt-4">
              <Mouse className="w-8 h-8 text-white/50 mb-2 animate-bounce" />
              <p className="text-white/50 text-xl font-bold tracking-widest uppercase">To Be Free of Chaos</p>
            </div>
          </div>

          <div className="w-full flex items-center px-12 md:px-32 mix-blend-difference text-white">
            <div className="max-w-2xl">
              <h2 className="text-[8vw] leading-none font-black uppercase tracking-tighter text-transparent -webkit-text-stroke-[2px] -webkit-text-stroke-white/50">
                10,000 EMAILS.
              </h2>
            </div>
          </div>

          <div className="w-full flex items-center justify-end px-12 md:px-32 text-right mix-blend-difference text-white">
            <div className="max-w-2xl">
              <h2 className="text-[8vw] leading-none font-black uppercase tracking-tighter text-transparent -webkit-text-stroke-[2px] -webkit-text-stroke-white/50">
                WE EXTRACT.
              </h2>
            </div>
          </div>

          <div className="w-full flex flex-col items-center justify-end pb-12 px-4 pointer-events-auto">
            <div className="bg-[#050505]/80 backdrop-blur-3xl border border-white/10 p-12 rounded-[3rem] text-center max-w-4xl w-full">
              <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter mb-6 drop-shadow-lg">
                THE COMMAND CENTER
              </h2>
              <p className="text-xl text-white/60 font-medium mb-12">
                All your extracted internships, perfectly organized on a beautiful Kanban board with automated deadline alerts.
              </p>
              <Link href="/auth/signin" className="inline-flex bg-[#06D6A0] text-black py-5 px-12 rounded-full text-lg font-black uppercase tracking-widest hover:scale-105 transition-transform items-center gap-4 shadow-[0_0_30px_rgba(6,214,160,0.3)]">
                <KanbanSquare className="w-6 h-6" />
                Connect Google Workspace
              </Link>
            </div>
          </div>

        </div>

        {/* --- SOLID HTML SECTIONS (Standard DOM flow, hides the 3D scene behind solid bg) --- */}
        <main className="w-full bg-[#050505] relative z-20 border-t border-white/10 shadow-[0_-30px_100px_rgba(0,0,0,1)]">
          
          {/* Feature Grid */}
          <section className="py-40 px-6 md:px-12 max-w-[1600px] mx-auto">
            <h2 className="text-[6vw] leading-[0.9] font-black uppercase tracking-tighter text-white mb-24">
              THE COMPLETE <br/> ARSENAL.
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                { title: "Direct Sync", text: "Secure, read-only OAuth integration. Refreshes automatically in the background." },
                { title: "Smart NLP", text: "Pulls the exact Job Role, Company, Apply Link, and Deadline from massive text walls." },
                { title: "Skill Matching", text: "A 0-100 score matching the extracted job requirements to your specific profile." },
                { title: "Push Alerts", text: "Get notified via dashboard before deadlines expire. Never miss a hidden opportunity." }
              ].map((feat, i) => (
                <div key={i} className="bg-white/5 border border-white/10 p-12 md:p-16 rounded-[3rem] hover:bg-white/10 transition-colors">
                  <div className="w-16 h-16 bg-[#06D6A0] rounded-full text-black flex items-center justify-center font-black text-2xl mb-8">
                    {i + 1}
                  </div>
                  <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-white mb-4">{feat.title}</h3>
                  <p className="text-xl text-white/60 font-medium">{feat.text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Testimonials */}
          <section className="py-40 bg-white text-black px-6 md:px-12">
            <div className="max-w-[1600px] mx-auto">
              <h2 className="text-[5vw] leading-[0.9] font-black uppercase tracking-tighter mb-24">
                APPROVED BY <br/>THE BEST.
              </h2>
              <div className="grid md:grid-cols-3 gap-12">
                {[
                  { quote: "It surfaced an off-campus research internship I had completely archived by mistake.", author: "Aditya Vardhan", role: "CSE, 4th Year Student", avatar: "AV" },
                  { quote: "Having SIH and Devfolio listings in one dashboard with match scores saved me hours.", author: "Nisha Ramachandran", role: "ECE, 3rd Year Student", avatar: "NR" },
                  { quote: "The automated deadline reminders are a lifesaver. Completed 8 apps this month.", author: "Rahul Krishnan", role: "IT, 2nd Year Student", avatar: "RK" }
                ].map((t, i) => (
                  <div key={i} className="space-y-8">
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
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* FAQs */}
          <section className="py-40 px-6 md:px-12 max-w-[1200px] mx-auto text-white">
            <h2 className="text-[5vw] leading-[0.9] font-black uppercase tracking-tighter mb-24 text-center">
              FREQUENTLY ASKED <br/>QUESTIONS.
            </h2>
            <div className="border-t border-white/10">
              <FAQItem 
                question="How does the email extraction work?" 
                answer="We use Google OAuth to securely request read-only access to your inbox. We specifically filter for emails related to internships, careers, and college placement cells. A massive LLM then parses the text to extract the core details like deadlines and links."
              />
              <FAQItem 
                question="Is my data secure?" 
                answer="Absolutely. We only ask for read-only access. We cannot send emails on your behalf, and we do not store the full contents of your emails. We only store the extracted internship metadata (Role, Company, Deadline) in our secure database."
              />
              <FAQItem 
                question="Can I manually add internships?" 
                answer="Yes! While the AI handles the bulk of the work from your inbox, your Command Center features a 'New Application' button allowing you to manually add off-campus links you find on LinkedIn or Twitter."
              />
              <FAQItem 
                question="Do I need a specific college email?" 
                answer="No. As long as you sign in with the Google Account that receives your internship alerts (whether personal or university-issued), the AI will be able to scan and extract the opportunities."
              />
            </div>
          </section>

          {/* Footer */}
          <footer className="bg-[#020202] py-12 px-6 md:px-12 border-t border-white/10 text-white">
            <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between text-sm font-bold text-white/40 uppercase tracking-widest gap-6">
              <Link href="/" className="flex items-center gap-3 text-2xl font-black tracking-tighter text-white">
                <SparklesIcon className="w-6 h-6 text-[#06D6A0]" /> OPPORTUNITY<span className="opacity-50">AI</span>
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
