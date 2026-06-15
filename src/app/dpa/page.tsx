"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, FileKey } from 'lucide-react';

export default function DPAPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#050505] text-slate-300 py-20 px-6 md:px-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <button onClick={() => router.back()} className="inline-flex items-center gap-2 text-sm text-[#48E5C2] hover:text-[#06D6A0] transition cursor-pointer bg-transparent border-none p-0">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>
        
        <div className="space-y-4">
          <div className="w-12 h-12 rounded-xl bg-[#06D6A0]/10 flex items-center justify-center mb-6">
            <FileKey className="w-6 h-6 text-[#48E5C2]" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-[#06D6A0]">Data Protection Agreement</h1>
          <p className="text-base text-slate-500">Last updated: June 2026</p>
        </div>

        <div className="prose prose-invert max-w-none space-y-6 text-lg leading-relaxed">
          <p>
            Our commitment to protecting your personal data is unwavering. This Data Protection Agreement (DPA) outlines how we comply with modern data protection standards.
          </p>
          
          <h2 className="text-2xl font-bold text-[#06D6A0] mt-8">1. Ephemeral Processing</h2>
          <p>
            OpportunityAI operates on a strict ephemeral processing model for your emails. We do not persist raw email bodies in any database. Data exists in memory only for the duration of the AI extraction pipeline.
          </p>

          <h2 className="text-2xl font-bold text-[#06D6A0] mt-8">2. Third-Party Subprocessors</h2>
          <p>
            We utilize secure, SOC-2 compliant cloud providers for hosting. Our AI models are entirely open-source and run locally or on secure isolated infrastructure without using your data to train public models.
          </p>

          <h2 className="text-2xl font-bold text-[#06D6A0] mt-8">3. Right to Erasure</h2>
          <p>
            You have the right to request the deletion of your account and all associated metadata. Because we do not store your emails, disconnecting your Google Account immediately terminates our access to your inbox.
          </p>
        </div>
      </div>
    </div>
  );
}
