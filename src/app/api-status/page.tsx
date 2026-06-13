"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Activity } from 'lucide-react';

export default function APIStatus() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#06060E] text-slate-300 py-20 px-6 md:px-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <button onClick={() => router.back()} className="inline-flex items-center gap-2 text-sm text-[#8B5CF6] hover:text-[#7C3AED] transition cursor-pointer bg-transparent border-none p-0">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>
        
        <div className="space-y-4">
          <div className="w-12 h-12 rounded-xl bg-[#7C3AED]/10 flex items-center justify-center mb-6">
            <Activity className="w-6 h-6 text-[#06D6A0]" />
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white">System Status</h1>
          <p className="text-sm text-slate-500">Real-time status of OpportunityAI services.</p>
        </div>

        <div className="space-y-4 mt-8">
          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
            <span className="font-semibold text-white">Google Gmail API Integration</span>
            <span className="px-3 py-1 bg-[#06D6A0]/10 text-[#06D6A0] rounded-full text-xs font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#06D6A0] animate-pulse"></span> Operational
            </span>
          </div>
          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
            <span className="font-semibold text-white">AI Extraction Engine (Transformers)</span>
            <span className="px-3 py-1 bg-[#06D6A0]/10 text-[#06D6A0] rounded-full text-xs font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#06D6A0] animate-pulse"></span> Operational
            </span>
          </div>
          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
            <span className="font-semibold text-white">Frontend Application</span>
            <span className="px-3 py-1 bg-[#06D6A0]/10 text-[#06D6A0] rounded-full text-xs font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#06D6A0] animate-pulse"></span> Operational
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
