import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "OpportunityAI — AI-Powered Student Career Intelligence",
  description:
    "OpportunityAI scans your university inbox, extracts career-critical opportunities — internships, hackathons, scholarships — and turns email chaos into a smart, personalised dashboard. Never miss a deadline again.",
  keywords: [
    "student opportunities",
    "AI career assistant",
    "internship finder",
    "hackathon alerts",
    "scholarship tracker",
    "career intelligence",
    "university email scanner",
  ],
  authors: [{ name: "OpportunityAI" }],
  openGraph: {
    title: "OpportunityAI — AI-Powered Student Career Intelligence",
    description:
      "Your university inbox is full of career gold — internships, hackathons, scholarships — buried under thousands of emails. OpportunityAI finds them for you.",
    url: "https://opportunityai.in",
    siteName: "OpportunityAI",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "OpportunityAI — Never Miss a Career-Defining Opportunity Again",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OpportunityAI — AI-Powered Student Career Intelligence",
    description:
      "Your university inbox is full of career gold. OpportunityAI finds it for you.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`} style={{ scrollBehavior: 'smooth' }} data-scroll-behavior="smooth">
      <body className="min-h-screen bg-[#050505] text-[#F8F9FA] antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
