'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ShieldCheck, Mail, Lock, AlertTriangle, RefreshCw } from 'lucide-react';
import { signIn } from 'next-auth/react';

export default function SignIn() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const error = searchParams.get('error');
    if (error === 'AccessDeniedDomain') {
      setErrorMessage(
        "OpportunityAI is currently in a closed beta phase and is only available to VIT students. Please log in using your official @vitstudent.ac.in student email address."
      );
      setShowErrorModal(true);
    } else if (error) {
      setErrorMessage("An authentication error occurred. Please try again.");
      setShowErrorModal(true);
    }
  }, [searchParams]);

  const handleGoogleClick = () => {
    signIn('google', { callbackUrl: '/onboarding' });
  };

  return (
    <div className="min-h-screen bg-[#06060E] flex flex-col items-center justify-center p-6 relative dots-bg">
      {/* Decorative Orbs */}
      <div className="hero-orb w-[300px] h-[300px] bg-[#7C3AED] -top-20 opacity-20 blur-[80px]" />
      <div className="hero-orb w-[400px] h-[400px] bg-[#4F46E5] -bottom-20 opacity-20 blur-[80px]" />

      <div className="w-full max-w-[420px] z-10 space-y-6">
        {/* Logo */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold tracking-tight text-white">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#7C3AED] to-[#F72585] flex items-center justify-center shadow-lg">
              <Sparkles className="w-5.5 h-5.5 text-white" />
            </div>
            <span className="font-extrabold">Opportunity<span className="text-[#8B5CF6]">AI</span></span>
          </Link>
          <p className="text-xs text-slate-400">Student Career Intelligence Operating System</p>
        </div>

        {/* Card */}
        <div className="card glass p-8 space-y-6 relative overflow-hidden">
          <div className="space-y-6 animate-fade-in">
            <div className="text-center space-y-2">
              <h2 className="text-xl font-bold text-white">Connect Your Account</h2>
              <p className="text-xs text-slate-400 max-w-[280px] mx-auto leading-relaxed">
                Sign in with Google using your official university email.
              </p>
            </div>

            {/* Google Sign-in Button */}
            <button 
              onClick={handleGoogleClick}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-full bg-white hover:bg-slate-100 text-slate-900 font-semibold text-sm transition shadow-lg"
            >
              {/* Google Icon */}
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114A5.96 5.96 0 0 1 8 12.557a5.96 5.96 0 0 1 5.991-5.957c1.625 0 3.023.634 4.093 1.663l3.223-3.223C19.346 3.125 16.887 2 13.99 2 8.125 2 3.333 6.792 3.333 12.557S8.125 23.114 13.99 23.114c6.113 0 10.37-4.148 10.37-10.318 0-.698-.08-1.353-.22-1.954H12.24Z" />
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" />
              </svg>
              Continue with Google
            </button>

            <div className="p-3.5 bg-slate-950/50 rounded-xl border border-slate-800 text-[10px] text-slate-400 space-y-1.5">
              <p className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#8B5CF6]" />
                Why VIT Student Domain?
              </p>
              <p className="leading-relaxed">
                OpportunityAI is fine-tuned for VIT Vellore and Chennai placement formats. Only emails ending with <span className="font-mono text-white">@vitstudent.ac.in</span> are allowed during beta.
              </p>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-slate-800/80">
              <div className="space-y-1">
                <ShieldCheck className="w-4 h-4 mx-auto text-[#06D6A0]" />
                <p className="text-[9px] font-semibold text-slate-300">Read-Only</p>
                <p className="text-[8px] text-slate-500">No write scope</p>
              </div>
              <div className="space-y-1">
                <Lock className="w-4 h-4 mx-auto text-[#3A86FF]" />
                <p className="text-[9px] font-semibold text-slate-300">AES-256</p>
                <p className="text-[8px] text-slate-500">Encrypted tokens</p>
              </div>
              <div className="space-y-1">
                <RefreshCw className="w-4 h-4 mx-auto text-[#FFC107]" />
                <p className="text-[9px] font-semibold text-slate-300">Revokable</p>
                <p className="text-[8px] text-slate-500">Delete anytime</p>
              </div>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center">
          <Link href="/" className="text-xs text-slate-400 hover:text-white transition inline-flex items-center gap-1">
            Back to landing page
          </Link>
        </div>
      </div>

      {/* Error Restrictive Modal */}
      <AnimatePresence>
        {showErrorModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowErrorModal(false)}
              className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            />
            
            {/* Modal Body */}
            <motion.div 
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              className="w-full max-w-[400px] card glass p-8 border-[#F72585]/40 space-y-6 z-10 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 inset-x-0 h-1.5 bg-[#F72585]" />
              
              <div className="flex flex-col items-center gap-3.5 text-center">
                <div className="w-12 h-12 rounded-full bg-[#F72585]/10 border border-[#F72585]/30 flex items-center justify-center shadow-lg">
                  <AlertTriangle className="w-6 h-6 text-[#F72585]" />
                </div>
                <h3 className="font-extrabold text-lg text-white">Access Restricted</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {errorMessage}
                </p>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setShowErrorModal(false)}
                  className="flex-1 py-2.5 bg-slate-900 border border-slate-800 hover:bg-slate-850 text-xs font-semibold rounded-lg text-slate-300 transition"
                >
                  Close Notice
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
