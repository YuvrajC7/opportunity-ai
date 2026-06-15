'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { Canvas, useFrame } from '@react-three/fiber';
import { ScrollControls, Scroll, useScroll, Float, Sparkles, Environment, Text } from '@react-three/drei';
import * as THREE from 'three';
import { Sparkles as SparklesIcon, Lock, KanbanSquare, MessageSquare, ChevronDown, ChevronUp, Mouse } from 'lucide-react';

// --- 3D COMPONENTS ---

function Vortex() {
  const scroll = useScroll();
  const group = useRef<THREE.Group>(null);
  
  const panes = React.useMemo(() => {
    const mockSenders = ["Google Careers", "Placement Cell", "Jane Doe", "Apple HR", "Spam Deals", "GitHub", "Vercel", "Meta Recruiting", "Uber Internships"];
    const mockSubjects = ["Your Application Status", "URGENT: Registration", "Meeting Notes", "Next Steps: Software Engineer", "Buy 1 Get 1 Free", "Security Alert", "Deployment Successful", "Interview Invite", "Please complete assessment"];
    
    return Array.from({ length: 60 }).map(() => ({
      position: [
        (Math.random() - 0.5) * 30, 
        (Math.random() - 0.5) * 30, 
        (Math.random() - 0.5) * 60 - 20
      ] as [number, number, number],
      rotation: [
        Math.random() * Math.PI, 
        Math.random() * Math.PI, 
        0
      ] as [number, number, number],
      scale: Math.random() * 1.5 + 0.5,
      sender: mockSenders[Math.floor(Math.random() * mockSenders.length)],
      subject: mockSubjects[Math.floor(Math.random() * mockSubjects.length)]
    }));
  }, []);

  useFrame(() => {
    if (group.current) {
      // Map scroll progress (only the first 50% of the total page scroll)
      const r1 = Math.min(1, scroll.offset * 2); 
      group.current.position.z = r1 * 50; 
      group.current.rotation.z = r1 * Math.PI * 1.5;
      
      // Fade out the vortex as we enter the HTML sections
      const fade = Math.max(0, 1 - (scroll.offset - 0.4) * 10);
      group.current.scale.setScalar(fade);
    }
  });

  return (
    <group ref={group}>
      {panes.map((p, i) => (
        <Float key={i} speed={2} rotationIntensity={3} floatIntensity={3}>
          <group position={p.position} rotation={p.rotation} scale={p.scale}>
            <mesh>
              <boxGeometry args={[4, 2.5, 0.1]} />
              <meshPhysicalMaterial 
                color="#ffffff" 
                transmission={0.9} 
                opacity={1} 
                metalness={0.5} 
                roughness={0.2} 
                ior={1.5} 
                thickness={0.5} 
              />
            </mesh>
            {/* Sender */}
            <Text position={[-1.8, 0.8, 0.06]} fontSize={0.3} color="black" anchorX="left" anchorY="middle" maxWidth={3.6} font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2">
              {p.sender}
            </Text>
            {/* Subject */}
            <Text position={[-1.8, 0.2, 0.06]} fontSize={0.2} color="#333333" anchorX="left" anchorY="middle" maxWidth={3.6} font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2">
              {p.subject}
            </Text>
            {/* Snippet */}
            <Text position={[-1.8, -0.4, 0.06]} fontSize={0.15} color="#666666" anchorX="left" anchorY="middle" maxWidth={3.6} font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2">
              {"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}
            </Text>
          </group>
        </Float>
      ))}
    </group>
  );
}

function CommandCenter() {
  const scroll = useScroll();
  const ref = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    // Reveal around 30-50% scroll (Pages 4 and 5)
    const r = scroll.offset; 
    
    if (ref.current && ringRef.current && groupRef.current) {
      // Show up near the end of the 3D sequence, disappear after passing page 5
      let scale = 0;
      if (r > 0.3 && r < 0.6) {
        scale = Math.sin((r - 0.3) * (Math.PI / 0.3)) * 1.5;
      }
      scale = Math.max(0, scale);

      ref.current.scale.setScalar(scale);
      ref.current.rotation.y += 0.01;
      ref.current.rotation.x += 0.005;

      ringRef.current.scale.setScalar(scale * 1.5);
      ringRef.current.rotation.x = Math.PI / 2;
      ringRef.current.rotation.z -= 0.02;

      // Move it up as we scroll past it
      groupRef.current.position.y = (r - 0.5) * 20;
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
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} intensity={2} color="#ffffff" />
      <pointLight position={[-10, -10, -10]} color="#06D6A0" intensity={5} />
      
      <Vortex />
      <CommandCenter />
      
      <Sparkles count={500} scale={30} size={2} speed={0.4} opacity={0.5} color="#06D6A0" />
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
    <div className="w-full h-screen bg-[#050505] overflow-hidden selection:bg-[#06D6A0]/30 selection:text-white">
      
      {/* Static Navigation overlay */}
      <nav className="fixed top-0 left-0 right-0 z-[100] p-6 md:p-12 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center pointer-events-auto">
            <SparklesIcon className="w-6 h-6 text-black" />
          </div>
          <span className="font-black text-2xl tracking-tighter text-white uppercase hidden sm:block shadow-black drop-shadow-lg">
            Opportunity<span className="opacity-50">AI</span>
          </span>
        </div>
        <Link href="/auth/signin" className="bg-white text-black px-8 py-3.5 rounded-full text-sm font-black uppercase tracking-widest hover:bg-gray-200 transition-colors pointer-events-auto">
          Launch App
        </Link>
      </nav>

      {/* The 3D WebGL Canvas */}
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }} className="w-full h-full">
        {/* We use 10 pages: first 5 are the 3D scroll, the last 5 are the solid HTML content */}
        <ScrollControls pages={10} damping={0.1}>
          
          <Scene />

          {/* HTML Overlay synced with scroll */}
          <Scroll html style={{ width: '100vw' }}>
            
            {/* --- THE 3D SEQUENCE (PAGES 1 to 5) --- */}
            
            {/* Page 1 */}
            <div className="h-screen w-full flex flex-col items-center justify-center text-center px-4 pointer-events-none">
              <h1 className="text-[15vw] leading-none font-black text-transparent -webkit-text-stroke-[2px] -webkit-text-stroke-white/20 uppercase tracking-tighter mix-blend-difference">
                SCROLL
              </h1>
              <div className="flex flex-col items-center mt-4">
                <Mouse className="w-8 h-8 text-white/50 mb-2 animate-bounce" />
                <p className="text-white/50 text-xl font-bold tracking-widest uppercase">To Be Free of Chaos</p>
              </div>
            </div>

            {/* Page 2 */}
            <div className="h-screen w-full flex items-center px-12 md:px-32 pointer-events-none">
              <div className="max-w-2xl">
                <h2 className="text-[8vw] leading-none font-black text-white uppercase tracking-tighter drop-shadow-2xl">
                  10,000 EMAILS.
                </h2>
                <p className="text-2xl text-white/60 font-medium mt-6 drop-shadow-md">
                  Your inbox is a chaotic vortex of spam, circulars, and announcements. Hidden inside are career-defining internships.
                </p>
              </div>
            </div>

            {/* Page 3 */}
            <div className="h-screen w-full flex items-center justify-end px-12 md:px-32 text-right pointer-events-none">
              <div className="max-w-2xl">
                <h2 className="text-[8vw] leading-none font-black text-white uppercase tracking-tighter drop-shadow-2xl">
                  WE EXTRACT.
                </h2>
                <p className="text-2xl text-white/60 font-medium mt-6 drop-shadow-md">
                  OpportunityAI securely scans your University Gmail, using NLP to pull out precise roles, companies, links, and deadlines.
                </p>
              </div>
            </div>

            {/* Page 4 */}
            <div className="h-screen w-full flex items-center justify-center text-center px-4 pointer-events-none">
              <h2 className="text-[12vw] leading-none font-black text-transparent -webkit-text-stroke-[2px] -webkit-text-stroke-[#06D6A0] uppercase tracking-tighter drop-shadow-[0_0_30px_rgba(6,214,160,0.5)]">
                NEVER MISS OUT.
              </h2>
            </div>

            {/* Page 5 (The End of 3D Sequence - Command Center) */}
            <div className="h-screen w-full flex flex-col items-center justify-end pb-32 px-4 pointer-events-none">
              <div className="bg-[#050505]/60 backdrop-blur-3xl border border-white/10 p-12 rounded-[3rem] text-center max-w-4xl w-full pointer-events-auto">
                <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter mb-6">
                  THE COMMAND CENTER
                </h2>
                <p className="text-xl text-white/60 font-medium mb-12">
                  All your extracted internships, perfectly organized on a beautiful Kanban board with automated deadline alerts.
                </p>
                <Link href="/auth/signin" className="inline-flex bg-[#06D6A0] text-black py-5 px-12 rounded-full text-lg font-black uppercase tracking-widest hover:scale-105 transition-transform items-center gap-4">
                  <KanbanSquare className="w-6 h-6" />
                  Connect Google Workspace
                </Link>
                <div className="flex items-center justify-center gap-2 mt-8 text-white/40 font-bold text-sm tracking-widest uppercase">
                  <Lock className="w-4 h-4" /> Secure Read-Only Access
                </div>
              </div>
            </div>


            {/* --- THE SOLID HTML SECTIONS (PAGES 6 to 10) --- */}
            <div className="w-full bg-[#050505] relative z-50 border-t border-white/10 pointer-events-auto">
              
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

            </div>

          </Scroll>
        </ScrollControls>
      </Canvas>
    </div>
  );
}
