'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ScrollControls, Scroll, useScroll, Float, Sparkles, Environment, ContactShadows, Text } from '@react-three/drei';
import * as THREE from 'three';
import { Sparkles as SparklesIcon, Lock, KanbanSquare } from 'lucide-react';

// --- 3D COMPONENTS ---

function Vortex() {
  const scroll = useScroll();
  const group = useRef<THREE.Group>(null);
  
  // Create 60 random glass panes representing "Emails"
  const panes = React.useMemo(() => {
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
      scale: Math.random() * 1.5 + 0.5
    }));
  }, []);

  useFrame((state, delta) => {
    if (group.current) {
      const r1 = scroll.offset; // 0 to 1
      // Fly through the vortex as we scroll
      group.current.position.z = r1 * 50; 
      // Barrel roll
      group.current.rotation.z = r1 * Math.PI * 1.5;
    }
  });

  return (
    <group ref={group}>
      {panes.map((p, i) => (
        <Float key={i} speed={2} rotationIntensity={3} floatIntensity={3}>
          <mesh position={p.position} rotation={p.rotation} scale={p.scale}>
            <boxGeometry args={[3, 4, 0.1]} />
            <meshPhysicalMaterial 
              color="#ffffff" 
              transmission={0.9} 
              opacity={1} 
              metalness={0.8} 
              roughness={0.1} 
              ior={1.5} 
              thickness={1} 
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

function CommandCenter() {
  const scroll = useScroll();
  const ref = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const r = scroll.offset; 
    if (ref.current && ringRef.current) {
      // The Command Center emerges only at the end of the scroll
      const scale = Math.max(0, (r - 0.7) * 4); // Scales up from 0 to 1.2
      ref.current.scale.setScalar(scale);
      ref.current.rotation.y += 0.01;
      ref.current.rotation.x += 0.005;

      ringRef.current.scale.setScalar(scale * 1.5);
      ringRef.current.rotation.x = Math.PI / 2;
      ringRef.current.rotation.z -= 0.02;
    }
  });

  return (
    <group position={[0, 0, -10]}>
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
      
      {/* 3D Elements */}
      <Vortex />
      <CommandCenter />
      
      <Sparkles count={500} scale={30} size={2} speed={0.4} opacity={0.5} color="#06D6A0" />
      <Environment preset="city" />
    </>
  );
}

// --- MAIN PAGE ---

export default function Home() {
  return (
    <div className="w-full h-screen bg-[#050505] overflow-hidden selection:bg-[#06D6A0]/30 selection:text-white">
      
      {/* Static Navigation overlay */}
      <nav className="fixed top-0 left-0 right-0 z-50 p-6 md:p-12 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center pointer-events-auto">
            <SparklesIcon className="w-6 h-6 text-black" />
          </div>
          <span className="font-black text-2xl tracking-tighter text-white uppercase hidden sm:block">
            Opportunity<span className="opacity-50">AI</span>
          </span>
        </div>
        <Link href="/auth/signin" className="bg-white text-black px-8 py-3.5 rounded-full text-sm font-black uppercase tracking-widest hover:bg-gray-200 transition-colors pointer-events-auto">
          Launch App
        </Link>
      </nav>

      {/* The 3D WebGL Canvas */}
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }} className="w-full h-full">
        <ScrollControls pages={5} damping={0.1}>
          
          <Scene />

          {/* HTML Overlay synced with scroll */}
          <Scroll html style={{ width: '100vw' }}>
            
            {/* Page 1 */}
            <div className="h-screen w-full flex flex-col items-center justify-center text-center px-4">
              <h1 className="text-[15vw] leading-none font-black text-transparent -webkit-text-stroke-[2px] -webkit-text-stroke-white/20 uppercase tracking-tighter mix-blend-difference">
                SCROLL
              </h1>
              <p className="text-white/50 text-xl font-bold tracking-widest uppercase mt-4">To Enter the Vortex</p>
            </div>

            {/* Page 2 */}
            <div className="h-screen w-full flex items-center px-12 md:px-32">
              <div className="max-w-2xl">
                <h2 className="text-[8vw] leading-none font-black text-white uppercase tracking-tighter">
                  10,000 EMAILS.
                </h2>
                <p className="text-2xl text-white/60 font-medium mt-6">
                  Your inbox is a chaotic vortex of spam, circulars, and announcements. Hidden inside are career-defining internships.
                </p>
              </div>
            </div>

            {/* Page 3 */}
            <div className="h-screen w-full flex items-center justify-end px-12 md:px-32 text-right">
              <div className="max-w-2xl">
                <h2 className="text-[8vw] leading-none font-black text-white uppercase tracking-tighter">
                  WE EXTRACT.
                </h2>
                <p className="text-2xl text-white/60 font-medium mt-6">
                  OpportunityAI securely scans your University Gmail, using NLP to pull out precise roles, companies, links, and deadlines.
                </p>
              </div>
            </div>

            {/* Page 4 */}
            <div className="h-screen w-full flex items-center justify-center text-center px-4">
              <h2 className="text-[12vw] leading-none font-black text-transparent -webkit-text-stroke-[2px] -webkit-text-stroke-[#06D6A0] uppercase tracking-tighter mix-blend-screen drop-shadow-[0_0_30px_rgba(6,214,160,0.5)]">
                NEVER MISS OUT.
              </h2>
            </div>

            {/* Page 5 (The End - Command Center) */}
            <div className="h-screen w-full flex flex-col items-center justify-end pb-32 px-4 pointer-events-none">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-12 rounded-[3rem] text-center max-w-4xl w-full pointer-events-auto">
                <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter mb-6">
                  THE COMMAND CENTER
                </h2>
                <p className="text-xl text-white/60 font-medium mb-12">
                  All your extracted internships, perfectly organized on a beautiful Kanban board with automated deadline alerts.
                </p>
                <Link href="/auth/signin" className="inline-flex bg-white text-black py-5 px-12 rounded-full text-lg font-black uppercase tracking-widest hover:scale-105 transition-transform items-center gap-4">
                  <KanbanSquare className="w-6 h-6" />
                  Connect Google Workspace
                </Link>
                <div className="flex items-center justify-center gap-2 mt-8 text-white/30 font-bold text-sm tracking-widest uppercase">
                  <Lock className="w-4 h-4" /> Secure Read-Only Access
                </div>
              </div>
            </div>

          </Scroll>
        </ScrollControls>
      </Canvas>
    </div>
  );
}
