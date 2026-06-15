"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Scale } from 'lucide-react';

export default function TermsOfService() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#050505] text-slate-300 py-20 px-6 md:px-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <button onClick={() => router.back()} className="inline-flex items-center gap-2 text-sm text-[#48E5C2] hover:text-[#06D6A0] transition cursor-pointer bg-transparent border-none p-0">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>
        
        <div className="space-y-4">
          <div className="w-12 h-12 rounded-xl bg-[#06D6A0]/10 flex items-center justify-center mb-6">
            <Scale className="w-6 h-6 text-[#48E5C2]" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-[#06D6A0]">Terms of Service</h1>
          <p className="text-base text-slate-500">Last updated: June 2026</p>
        </div>

        <div className="prose prose-invert max-w-none space-y-6 text-lg leading-relaxed">
          <p>
            Welcome to OpportunityAI. By using our service, you agree to these terms.
          </p>
          
          <h2 className="text-2xl font-bold text-[#06D6A0] mt-8">1. Acceptance of Terms</h2>
          <p>
            By connecting your Google account and accessing the OpportunityAI dashboard, you agree to be bound by these Terms of Service. This service is designed for educational and career advancement purposes.
          </p>

          <h2 className="text-2xl font-bold text-[#06D6A0] mt-8">2. Service Description</h2>
          <p>
            OpportunityAI is an automated intelligence tool that scans your inbox for internship and career opportunities. We do not guarantee the accuracy, completeness, or availability of any extracted opportunity. You are responsible for verifying application deadlines and requirements independently.
          </p>

          <h2 className="text-2xl font-bold text-[#06D6A0] mt-8">3. User Conduct</h2>
          <p>
            You agree not to misuse our services or help anyone else do so. You must only connect accounts that you legally own and have the right to access.
          </p>
        </div>
      </div>
    </div>
  );
}
