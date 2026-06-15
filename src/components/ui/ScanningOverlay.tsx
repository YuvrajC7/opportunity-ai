'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Terminal, Activity, ShieldCheck, Database, Zap } from 'lucide-react';

const tasks = [
  { text: "Authenticating secure connection...", icon: ShieldCheck },
  { text: "Establishing encrypted tunnel...", icon: LockIcon },
  { text: "Querying Gmail API...", icon: Database },
  { text: "Fetching unread messages...", icon: Activity },
  { text: "Running NLP intent extraction...", icon: Terminal },
  { text: "Identifying opportunities...", icon: Sparkles },
  { text: "Calculating ML match scores...", icon: Zap },
  { text: "Finalising dataset...", icon: Database }
];

function LockIcon(props: any) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
  );
}

export default function ScanningOverlay({ isVisible }: { isVisible: boolean }) {
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);

  useEffect(() => {
    if (!isVisible) {
      setCurrentTaskIndex(0);
      return;
    }

    // Cycle through tasks rapidly to simulate fast AI processing
    const interval = setInterval(() => {
      setCurrentTaskIndex(prev => {
        if (prev < tasks.length - 1) return prev + 1;
        return prev;
      });
    }, 400); // 400ms per task

    return () => clearInterval(interval);
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#050505]/90 backdrop-blur-xl p-6"
        >
          {/* Radar / Core Animation */}
          <div className="relative w-48 h-48 mb-12 flex items-center justify-center">
            {/* Pulsing rings */}
            <motion.div 
              animate={{ scale: [1, 1.5, 2], opacity: [0.8, 0.3, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border-2 border-[#06D6A0]"
            />
            <motion.div 
              animate={{ scale: [1, 1.5, 2], opacity: [0.8, 0.3, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 1 }}
              className="absolute inset-0 rounded-full border-2 border-[#06D6A0]"
            />
            
            {/* Center Core */}
            <div className="w-20 h-20 bg-[#111111] border border-[#06D6A0]/40 rounded-full shadow-[0_0_50px_rgba(6,214,160,0.4)] flex items-center justify-center z-10 relative overflow-hidden">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-[#06D6A0]/30"
              />
              <Sparkles className="w-8 h-8 text-[#06D6A0] relative z-20 animate-pulse" />
            </div>
          </div>

          {/* Terminal Box */}
          <div className="w-full max-w-md bg-[#111111] border border-[#06D6A0]/20 rounded-xl p-6 shadow-2xl relative overflow-hidden font-mono">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#06D6A0] to-transparent opacity-50" />
            
            <div className="flex items-center gap-2 mb-4 text-[#06D6A0]">
              <Terminal className="w-4 h-4" />
              <span className="text-xs font-bold tracking-widest uppercase opacity-70">Extraction Sequence</span>
            </div>

            <div className="space-y-3">
              {tasks.map((task, idx) => {
                const Icon = task.icon;
                const isCurrent = idx === currentTaskIndex;
                const isPast = idx < currentTaskIndex;
                
                if (idx > currentTaskIndex) return null; // Don't show future tasks
                
                return (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex items-center gap-3 text-xs ${isPast ? 'text-[#06D6A0]/50' : 'text-[#06D6A0]'}`}
                  >
                    {isPast ? (
                      <div className="w-3 h-3 rounded-full bg-[#06D6A0]/20 flex items-center justify-center shrink-0">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#06D6A0]" />
                      </div>
                    ) : (
                      <Icon className="w-3.5 h-3.5 animate-pulse shrink-0" />
                    )}
                    <span className="truncate">{task.text}</span>
                    {isCurrent && (
                      <motion.span 
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                        className="w-1.5 h-3.5 bg-[#06D6A0] inline-block ml-1"
                      />
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
