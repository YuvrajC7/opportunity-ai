"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, SearchCheck } from 'lucide-react';

export default function PrivacyAudit() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#06060E] text-slate-300 py-20 px-6 md:px-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <button onClick={() => router.back()} className="inline-flex items-center gap-2 text-sm text-[#8B5CF6] hover:text-[#7C3AED] transition cursor-pointer bg-transparent border-none p-0">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>
        
        <div className="space-y-4">
          <div className="w-12 h-12 rounded-xl bg-[#7C3AED]/10 flex items-center justify-center mb-6">
            <SearchCheck className="w-6 h-6 text-[#8B5CF6]" />
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white">Privacy Audit Logs</h1>
          <p className="text-sm text-slate-500">Public transparency report</p>
        </div>

        <div className="prose prose-invert max-w-none space-y-6 text-sm leading-relaxed">
          <p>
            We believe in radical transparency. Here you can find our latest internal privacy audit reports verifying our zero-retention policy for user emails.
          </p>
          
          <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
            <h3 className="text-white font-bold mb-2">Audit Q2 2026</h3>
            <p className="text-slate-400 mb-4">Conducted internally to verify data flows and model privacy.</p>
            <ul className="list-disc pl-5 space-y-2 text-slate-300">
              <li>Verified: OAuth tokens encrypted at rest.</li>
              <li>Verified: No raw email payloads stored in persistent databases.</li>
              <li>Verified: AI extraction endpoints do not log Personally Identifiable Information (PII).</li>
              <li>Status: <span className="text-[#06D6A0] font-bold">PASSED</span></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
