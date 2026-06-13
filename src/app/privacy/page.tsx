"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Shield } from 'lucide-react';

export default function PrivacyPolicy() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#06060E] text-slate-300 py-20 px-6 md:px-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <button onClick={() => router.back()} className="inline-flex items-center gap-2 text-sm text-[#8B5CF6] hover:text-[#7C3AED] transition cursor-pointer bg-transparent border-none p-0">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>
        
        <div className="space-y-4">
          <div className="w-12 h-12 rounded-xl bg-[#7C3AED]/10 flex items-center justify-center mb-6">
            <Shield className="w-6 h-6 text-[#8B5CF6]" />
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white">Privacy Policy</h1>
          <p className="text-sm text-slate-500">Last updated: June 2026</p>
        </div>

        <div className="prose prose-invert max-w-none space-y-6 text-sm leading-relaxed">
          <p>
            At OpportunityAI, we take your privacy extremely seriously. We built this platform specifically for VIT students, and our core philosophy is that your data belongs to you.
          </p>
          
          <h2 className="text-xl font-bold text-white mt-8">1. Information We Collect</h2>
          <p>
            We only collect the absolute minimum information required to operate the service. When you connect your Google account, we request read-only access to your Gmail. We do not store your emails on our servers. Our AI models process the emails ephemerally to extract internship and career opportunities, generate a summary, and immediately discard the original email content.
          </p>

          <h2 className="text-xl font-bold text-white mt-8">2. How We Use Your Information</h2>
          <p>
            We use the extracted data solely to populate your personal dashboard. We do not sell, rent, or share your personal information or email contents with any third parties, recruiters, or advertisers.
          </p>

          <h2 className="text-xl font-bold text-white mt-8">3. Data Security</h2>
          <p>
            All data in transit is encrypted using industry-standard TLS. Your Google OAuth tokens are securely stored and never exposed. You can revoke our access at any time directly from your Google Account settings.
          </p>
        </div>
      </div>
    </div>
  );
}
