'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, ArrowLeft, Check, BookOpen, Brain, Star, CheckCircle } from 'lucide-react';
import { OpportunityCategory } from '@/lib/types';
import { useSession } from 'next-auth/react';
import { completeOnboarding } from '@/app/actions/user';

export default function Onboarding() {
  const router = useRouter();
  const { data: session, update: updateSession } = useSession();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [university, setUniversity] = useState('VIT Vellore');
  const [year, setYear] = useState(3);
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [graduationYear, setGraduationYear] = useState<number>(new Date().getFullYear() + 2);

  React.useEffect(() => {
    // Skip if already onboarded according to Supabase DB session
    if (session?.user?.onboarded) {
      router.push('/dashboard');
      return;
    }

    if (session?.user?.name) {
      setName(session.user.name);
      
      // Auto-parse VIT registration number (e.g., 25BCE2561)
      const regMatch = session.user.name.match(/(\d{2})([A-Z]{3})/i);
      if (regMatch) {
        const joinYearStr = regMatch[1]; // "25" -> 2025
        const branchCode = regMatch[2].toUpperCase();
        
        const joinYear = 2000 + parseInt(joinYearStr, 10);
        const currentYear = new Date().getFullYear();
        // Calculate current year of study based on batch join year
        const calculatedYear = Math.max(1, Math.min(4, currentYear - joinYear + 1));
        setYear(calculatedYear);
        
        // Map common VIT branch codes
        if (branchCode === 'BCE' || branchCode === 'BCC') setDepartment('Computer Science & Engineering');
        else if (branchCode === 'BEC') setDepartment('Electronics & Communication Engineering');
        else if (branchCode === 'BEE') setDepartment('Electrical & Electronics Engineering');
        else if (branchCode === 'BME') setDepartment('Mechanical Engineering');
        else if (branchCode === 'BIT') setDepartment('Information Technology');
        else if (branchCode === 'BCG') setDepartment('Computer Science (Specialisations)');
        else if (branchCode === 'BAI') setDepartment('Artificial Intelligence & Machine Learning');
      }

      // If we caught graduation year at login, prefill it
      if (session.user.graduationYear) {
        setGraduationYear(session.user.graduationYear);
      }
    }
  }, [session, router]);

  const [skills, setSkills] = useState<string[]>(['Python', 'React', 'Machine Learning']);
  const [customSkill, setCustomSkill] = useState('');
  const [interests, setInterests] = useState<OpportunityCategory[]>(['internship', 'hackathon', 'research']);

  const popularSkills = [
    'Python', 'React', 'Machine Learning', 'TypeScript', 'Node.js', 'SQL', 
    'Java', 'C++', 'Git', 'Docker', 'AWS', 'Data Structures', 'UI/UX Design'
  ];

  const categories: { key: OpportunityCategory; label: string; icon: string; desc: string }[] = [
    { key: 'internship', label: 'Internships', icon: 'Briefcase', desc: 'Summer & semester work placements' },
    { key: 'hackathon', label: 'Hackathons', icon: 'Code', desc: 'Coding and building competitions' },
    { key: 'scholarship', label: 'Scholarships', icon: 'GraduationCap', desc: 'Academic funding & grants' },
    { key: 'research', label: 'Research Programs', icon: 'Microscope', desc: 'Fellowships and lab openings' },
    { key: 'workshop', label: 'Workshops', icon: 'Wrench', desc: 'Technical bootcamps & training' },
    { key: 'competition', label: 'Competitions', icon: 'Trophy', desc: 'Case studies & non-code tests' },
  ];

  const handleAddSkill = (skill: string) => {
    if (skill && !skills.includes(skill)) {
      setSkills([...skills, skill]);
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const handleCustomSkillAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = customSkill.trim();
    if (clean) {
      handleAddSkill(clean);
      setCustomSkill('');
    }
  };

  const handleToggleInterest = (category: OpportunityCategory) => {
    if (interests.includes(category)) {
      setInterests(interests.filter(i => i !== category));
    } else {
      setInterests([...interests, category]);
    }
  };

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleFinish = async () => {
    // Save to Database via Server Action
    await completeOnboarding({
      university,
      department,
      yearOfStudy: year,
      graduationYear,
      skills,
      interests
    });
    
    // Refresh the local session so it knows we are onboarded
    await updateSession();
    
    // Navigate to dashboard
    router.push('/dashboard');
  };

  // Onboarding Step Animation Variants
  const slideVariants: any = {
    initial: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0
    }),
    animate: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -100 : 100,
      opacity: 0,
      transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] }
    })
  };

  const [direction, setDirection] = useState(1);

  const setStepWithDirection = (newStep: number) => {
    setDirection(newStep > step ? 1 : -1);
    setStep(newStep);
  };

  return (
    <div className="min-h-screen bg-[#06060E] flex flex-col items-center justify-center p-6 relative dots-bg">
      <div className="hero-orb w-[400px] h-[400px] bg-[#7C3AED] top-10 opacity-15 blur-[90px]" />
      <div className="hero-orb w-[300px] h-[300px] bg-[#F72585] bottom-10 opacity-10 blur-[80px]" />

      <div className="w-full max-w-[580px] z-10 space-y-6">
        <div className="flex items-center justify-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#7C3AED] to-[#F72585] flex items-center justify-center">
            <Sparkles className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="font-extrabold text-white text-lg">Opportunity<span className="text-[#8B5CF6]">AI</span></span>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>Step {step} of 4</span>
            <span className="font-semibold text-slate-200">
              {step === 1 && 'Personal Information'}
              {step === 2 && 'Skill Selection'}
              {step === 3 && 'Career Interests'}
              {step === 4 && 'Complete Profile'}
            </span>
          </div>
          <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#7C3AED] to-[#F72585] transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        <div className="card glass p-8 relative overflow-hidden min-h-[400px] flex flex-col justify-between">
          <AnimatePresence mode="wait" custom={direction}>
            {step === 1 && (
              <motion.div
                key="step1"
                custom={direction}
                variants={slideVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-5"
              >
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-[#8B5CF6]" /> Let&apos;s get you set up
                  </h3>
                  <p className="text-xs text-slate-400">Tell us a bit about your university status.</p>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                    <input 
                      type="text" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      className="input" 
                      placeholder="Enter your name"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">University</label>
                      <select 
                        value={university} 
                        onChange={(e) => setUniversity(e.target.value)} 
                        className="input bg-[#0F0F23] text-white outline-none"
                      >
                        <option>VIT Vellore</option>
                        <option>VIT Chennai</option>
                        <option>VIT Bhopal</option>
                        <option>VIT AP</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Graduation Year</label>
                      <input 
                        type="number" 
                        value={graduationYear} 
                        onChange={(e) => setGraduationYear(Number(e.target.value))} 
                        className="input" 
                        placeholder="2025"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Department / Branch</label>
                    <select 
                      value={department} 
                      onChange={(e) => setDepartment(e.target.value)} 
                      className="input bg-[#0F0F23] text-white outline-none"
                    >
                      <option>Computer Science & Engineering</option>
                      <option>Information Technology</option>
                      <option>Computer Science (Specialisations)</option>
                      <option>Artificial Intelligence & Machine Learning</option>
                      <option>Data Science</option>
                      <option>Electronics & Communication Engineering</option>
                      <option>Electrical & Electronics Engineering</option>
                      <option>Mechanical Engineering</option>
                      <option>Civil Engineering</option>
                      <option>Aerospace Engineering</option>
                      <option>Biotechnology</option>
                      <option>Chemical Engineering</option>
                      <option>Robotics</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                custom={direction}
                variants={slideVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-5"
              >
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Brain className="w-5 h-5 text-[#F72585]" /> What are your skills?
                  </h3>
                  <p className="text-xs text-slate-400">These tags drive your opportunity match score recommendations.</p>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="flex flex-wrap gap-1.5 p-3.5 bg-slate-950/60 rounded-xl border border-slate-900 min-h-[50px]">
                    {skills.length === 0 ? (
                      <span className="text-xs text-slate-500 italic">No skills added yet. Click suggestions below.</span>
                    ) : (
                      skills.map(sk => (
                        <div key={sk} className="flex items-center gap-1.5 px-3 py-1 bg-[#7C3AED]/10 border border-[#7C3AED]/20 rounded-full text-xs font-semibold text-[#8B5CF6]">
                          {sk}
                          <button onClick={() => handleRemoveSkill(sk)} className="text-[#F72585] font-bold text-xs hover:text-red-400">×</button>
                        </div>
                      ))
                    )}
                  </div>

                  <form onSubmit={handleCustomSkillAdd} className="flex gap-2">
                    <input 
                      type="text" 
                      value={customSkill} 
                      onChange={(e) => setCustomSkill(e.target.value)} 
                      placeholder="Add custom skill (e.g., PyTorch)" 
                      className="input flex-1"
                    />
                    <button type="submit" className="btn-secondary py-2 px-4 text-xs font-bold rounded-lg border-slate-800">
                      Add
                    </button>
                  </form>

                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Popular Suggestions</p>
                    <div className="flex flex-wrap gap-1.5 max-h-[110px] overflow-y-auto pr-1">
                      {popularSkills.map(sk => {
                        const isAdded = skills.includes(sk);
                        return (
                          <button
                            key={sk}
                            type="button"
                            onClick={() => isAdded ? handleRemoveSkill(sk) : handleAddSkill(sk)}
                            className={`px-2.5 py-1 text-xs rounded-full border transition font-medium ${
                              isAdded 
                                ? 'bg-[#7C3AED] border-[#7C3AED] text-white' 
                                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                            }`}
                          >
                            {isAdded ? '✓ ' : ''}{sk}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                custom={direction}
                variants={slideVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-5"
              >
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Star className="w-5 h-5 text-[#FFC107]" /> Select Interests
                  </h3>
                  <p className="text-xs text-slate-400">Choose categories you want prioritized on your feed.</p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  {categories.map((c) => {
                    const selected = interests.includes(c.key);
                    return (
                      <button
                        key={c.key}
                        onClick={() => handleToggleInterest(c.key)}
                        className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition ${
                          selected 
                            ? 'bg-[#7C3AED]/10 border-[#7C3AED] shadow-md shadow-[#7C3AED]/5' 
                            : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:bg-slate-900/60'
                        }`}
                      >
                        <div className={`mt-0.5 w-4.5 h-4.5 rounded flex items-center justify-center border text-[10px] ${
                          selected 
                            ? 'bg-[#7C3AED] border-[#7C3AED] text-white' 
                            : 'border-slate-800 bg-slate-950'
                        }`}>
                          {selected && '✓'}
                        </div>
                        <div>
                          <p className={`text-xs font-bold ${selected ? 'text-white' : 'text-slate-300'}`}>{c.label}</p>
                          <p className="text-[10px] text-slate-500 leading-tight pt-0.5">{c.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                custom={direction}
                variants={slideVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-5 text-center py-4"
              >
                <div className="w-16 h-16 rounded-full bg-[#06D6A0]/10 border border-[#06D6A0]/30 flex items-center justify-center mx-auto shadow-lg">
                  <CheckCircle className="w-8 h-8 text-[#06D6A0]" />
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-xl font-bold text-white">Profile Ready!</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                    We have created a tailored portfolio for you based on your branch and skills.
                  </p>
                </div>

                <div className="max-w-xs mx-auto p-4 bg-slate-950/60 rounded-2xl border border-slate-900 space-y-2.5 text-left text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Student</span>
                    <span className="font-semibold text-slate-200">{name} (Class of {graduationYear})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Department</span>
                    <span className="font-semibold text-slate-200 truncate max-w-[160px]">{department}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Interests</span>
                    <span className="font-semibold text-slate-200">{interests.length} Categories</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Skills Core</span>
                    <span className="font-semibold text-slate-200">{skills.slice(0, 3).join(', ')}{skills.length > 3 ? '...' : ''}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between pt-6 border-t border-slate-900/60 mt-4">
            {step > 1 && step < 4 ? (
              <button 
                onClick={() => setStepWithDirection(step - 1)}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            ) : (
              <div /> // Spacer
            )}

            {step < 4 ? (
              <button 
                onClick={() => setStepWithDirection(step + 1)}
                className="btn-primary py-2 px-6 text-xs font-bold"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button 
                onClick={handleFinish}
                className="btn-primary w-full py-3 text-sm font-bold flex items-center justify-center gap-1.5"
              >
                Start Discovering Opportunities <Check className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
