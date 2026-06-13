/**
 * OpportunityAI Training Dataset — v1.0
 * 
 * This is the curated training dataset for the OpportunityAI Title Engine.
 * Each entry maps an email subject + body pattern to its ideal short title.
 * 
 * These examples are used as few-shot prompts for the local LLM model
 * to teach it exactly how to generate perfect opportunity titles.
 * 
 * The examples cover the major categories of university opportunity emails:
 * - Internships / Jobs (corporate hiring)
 * - Hackathons / Competitions
 * - Scholarships / Fellowships
 * - Research Programs
 * - Workshops / Conferences
 * - Summer Programs / Exchange Programs
 * - Cultural / Extracurricular Opportunities
 */

export interface TrainingExample {
  subject: string;
  bodySnippet: string;
  idealTitle: string;
  category: string;
}

export const TRAINING_DATASET: TrainingExample[] = [
  // ═══════════════════════════════════════════════════════════════
  // INTERNSHIPS — Corporate Hiring
  // ═══════════════════════════════════════════════════════════════
  {
    subject: "Amazon SDE Internship 2026 - Apply Now",
    bodySnippet: "Amazon is hiring Software Development Engineer interns for Summer 2026. Apply through the careers portal.",
    idealTitle: "Amazon SDE Internship 2026",
    category: "internship"
  },
  {
    subject: "Google STEP Internship Program",
    bodySnippet: "Applications are now open for the Google STEP Internship Program for first and second year students.",
    idealTitle: "Google STEP Internship",
    category: "internship"
  },
  {
    subject: "Microsoft Engage 2026 Internship",
    bodySnippet: "Microsoft India invites students to apply for Engage 2026 mentorship and internship program.",
    idealTitle: "Microsoft Engage 2026",
    category: "internship"
  },
  {
    subject: "Goldman Sachs Engineering Virtual Program",
    bodySnippet: "Goldman Sachs is offering a virtual engineering program for aspiring software engineers.",
    idealTitle: "Goldman Sachs Engineering Program",
    category: "internship"
  },
  {
    subject: "Flipkart GRID 6.0 - SDE Intern Hiring",
    bodySnippet: "Flipkart GRID 6.0 is an engineering campus challenge. Top performers get direct internship offers.",
    idealTitle: "Flipkart GRID 6.0 Hiring",
    category: "internship"
  },
  {
    subject: "Atlassian Internship Opportunities",
    bodySnippet: "Atlassian is looking for bright engineering students for summer internship positions in Bangalore.",
    idealTitle: "Atlassian Summer Internship",
    category: "internship"
  },
  {
    subject: "TCS NQT 2026 Registration Open",
    bodySnippet: "TCS National Qualifier Test 2026 registration is now open for final year engineering students.",
    idealTitle: "TCS NQT 2026 Registration",
    category: "job"
  },
  {
    subject: "Infosys InStep Global Internship",
    bodySnippet: "Infosys InStep is a global internship program offering students hands-on experience.",
    idealTitle: "Infosys InStep Internship",
    category: "internship"
  },
  {
    subject: "JPMorgan Code for Good 2026",
    bodySnippet: "Join JPMorgan's Code for Good hackathon. Selected students get pre-placement interview opportunities.",
    idealTitle: "JPMorgan Code for Good",
    category: "hackathon"
  },
  {
    subject: "Samsung PRISM Research Program",
    bodySnippet: "Samsung PRISM offers research internship opportunities to students in AI, ML, and IoT.",
    idealTitle: "Samsung PRISM Research",
    category: "research"
  },
  {
    subject: "Uber HackTag 2026",
    bodySnippet: "Uber is hosting HackTag 2026, an engineering challenge for top talent across India.",
    idealTitle: "Uber HackTag 2026",
    category: "hackathon"
  },
  {
    subject: "Deloitte USI Internship Drive",
    bodySnippet: "Deloitte USI is conducting an internship hiring drive for technology consulting roles.",
    idealTitle: "Deloitte USI Internship Drive",
    category: "internship"
  },
  {
    subject: "Adobe GenSolve Hackathon",
    bodySnippet: "Adobe GenSolve is an annual hackathon for women in technology. Build creative solutions.",
    idealTitle: "Adobe GenSolve Hackathon",
    category: "hackathon"
  },
  {
    subject: "Cisco ThingQbator Innovation Lab",
    bodySnippet: "Cisco ThingQbator invites students to build IoT solutions and win mentorship from Cisco engineers.",
    idealTitle: "Cisco ThingQbator Innovation",
    category: "competition"
  },
  {
    subject: "Walmart CodeHers 2026",
    bodySnippet: "Walmart's annual CodeHers challenge is open for women in tech. Solve real business problems.",
    idealTitle: "Walmart CodeHers 2026",
    category: "hackathon"
  },
  {
    subject: "Accenture Innovation Challenge",
    bodySnippet: "Accenture invites engineering students to participate in the annual innovation challenge.",
    idealTitle: "Accenture Innovation Challenge",
    category: "competition"
  },
  {
    subject: "Barclays Hire-thon",
    bodySnippet: "Barclays is hosting a hire-thon for engineering graduates. Top performers get job offers.",
    idealTitle: "Barclays Hire-thon",
    category: "job"
  },
  {
    subject: "Intel oneAPI Hackathon",
    bodySnippet: "Intel invites students to build projects using oneAPI toolkit. Prizes worth 5 lakhs.",
    idealTitle: "Intel oneAPI Hackathon",
    category: "hackathon"
  },

  // ═══════════════════════════════════════════════════════════════
  // UNIVERSITY BROADCAST EMAILS (Complex subjects)
  // ═══════════════════════════════════════════════════════════════
  {
    subject: "'Director TBI' via B.Tech. - Comp Sci Engg 2025 Group, Vellore Campus",
    bodySnippet: "Forwarding Dr.A.Balachandran PhD Director VIT-Technology Business Incubator. Full Time Intern for 6 Months.",
    idealTitle: "VIT TBI Full-Time Internship",
    category: "internship"
  },
  {
    subject: "'PROVC VIT, Vellore Campus' via B.Tech. - Comp Sci Engg 2025 Group, Vellore Campus",
    bodySnippet: "Space Summer - Intern Opportunity at Indian Space Research Organisation. Apply before June 30.",
    idealTitle: "ISRO Space Summer Internship",
    category: "internship"
  },
  {
    subject: "'Dean SSI' via B.Tech. - Comp Sci Engg 2025 Group, Vellore Campus",
    bodySnippet: "Dear all students, Master of Social Work (MSW) admission flyer. Revised Last Date to Apply 8-6-2026.",
    idealTitle: "MSW Admission 2026",
    category: "other"
  },
  {
    subject: "'Dr.R.Seenivasan Director (IR)' via B.Tech. - Comp Sci Engg 2025 Group, Vellore Campus",
    bodySnippet: "Kind Attention Undergraduate Students! Ming Chi University of Technology, Taiwan has announced the start of the recruitment process for the 2026 MCUT Language and Culture Summer Camp!",
    idealTitle: "MCUT Taiwan Summer Camp 2026",
    category: "workshop"
  },
  {
    subject: "'Dr.R.Seenivasan Director (IR)' via B.Tech. - Comp Sci Engg 2025 Group, Vellore Campus",
    bodySnippet: "Dear Students, Please apply if you are eligible. Applications have launched for the 2027 cohort of McCall MacBain Scholarships.",
    idealTitle: "McCall MacBain Scholarship 2027",
    category: "scholarship"
  },
  {
    subject: "'VIT Placement' via B.Tech. - Comp Sci Engg 2025 Group, Vellore Campus",
    bodySnippet: "Amazon is conducting campus placements for SDE-1 role. Eligible: CSE students with 8+ CGPA.",
    idealTitle: "Amazon Campus Placement",
    category: "job"
  },
  {
    subject: "'Director TBI' via B.Tech. - Comp Sci Engg 2025 Group, Vellore Campus",
    bodySnippet: "Nitrate Pvt Ltd is looking for research interns in biotechnology and chemical engineering.",
    idealTitle: "Nitrate Research Internship",
    category: "research"
  },
  {
    subject: "Fwd: PROVC VIT, Vellore Campus via B.Tech",
    bodySnippet: "Global Internship opportunity. Apply for the AIESEC Global Volunteer program in 30+ countries.",
    idealTitle: "AIESEC Global Internship",
    category: "internship"
  },
  {
    subject: "'HOD CSE' via B.Tech. - Comp Sci Engg 2025 Group",
    bodySnippet: "Workshop on Full Stack Web Development using MERN Stack. Registration link below.",
    idealTitle: "MERN Stack Workshop",
    category: "workshop"
  },
  {
    subject: "'Dean Academics' via B.Tech. - Comp Sci Engg 2025 Group, Vellore Campus",
    bodySnippet: "IEEE International Conference on Machine Learning and Data Science. Submit your papers by July 15.",
    idealTitle: "IEEE ML Conference Paper Submission",
    category: "research"
  },

  // ═══════════════════════════════════════════════════════════════
  // HACKATHONS & COMPETITIONS
  // ═══════════════════════════════════════════════════════════════
  {
    subject: "Smart India Hackathon 2026 - Registration",
    bodySnippet: "The Smart India Hackathon is back! Form teams of 6 and register before the deadline.",
    idealTitle: "Smart India Hackathon 2026",
    category: "hackathon"
  },
  {
    subject: "HackMIT 2026 Applications Open",
    bodySnippet: "HackMIT is MIT's annual 36-hour hackathon. International students welcome to apply.",
    idealTitle: "HackMIT 2026",
    category: "hackathon"
  },
  {
    subject: "Google Hash Code 2026",
    bodySnippet: "Google's team programming competition Hash Code is open for registrations.",
    idealTitle: "Google Hash Code 2026",
    category: "hackathon"
  },
  {
    subject: "ICPC Asia Regional Contest",
    bodySnippet: "The International Collegiate Programming Contest Asia Regional is accepting registrations.",
    idealTitle: "ICPC Asia Regional 2026",
    category: "competition"
  },
  {
    subject: "Codeforces Round #900 (Div. 2)",
    bodySnippet: "Competitive programming round on Codeforces. Duration 2 hours, 6 problems.",
    idealTitle: "Codeforces Round #900",
    category: "competition"
  },
  {
    subject: "IEEE Xtreme 18.0 Programming Competition",
    bodySnippet: "IEEE Xtreme is a global 24-hour programming competition for IEEE student members.",
    idealTitle: "IEEE Xtreme 18.0",
    category: "competition"
  },
  {
    subject: "LOC 6.0 Hackathon - Google Developer Groups",
    bodySnippet: "Lines of Code 6.0 is a 30-hour hackathon organized by GDG on campus.",
    idealTitle: "LOC 6.0 Hackathon",
    category: "hackathon"
  },
  {
    subject: "AngelHack Global Hackathon Series",
    bodySnippet: "AngelHack hosts hackathons in 100+ cities worldwide. Build your startup idea.",
    idealTitle: "AngelHack Global Hackathon",
    category: "hackathon"
  },
  {
    subject: "ETHIndia 2026 - Asia's Largest Ethereum Hackathon",
    bodySnippet: "ETHIndia is back with a 36-hour hackathon focused on Ethereum and blockchain development.",
    idealTitle: "ETHIndia 2026 Hackathon",
    category: "hackathon"
  },

  // ═══════════════════════════════════════════════════════════════
  // SCHOLARSHIPS & FELLOWSHIPS
  // ═══════════════════════════════════════════════════════════════
  {
    subject: "DAAD Scholarship for Masters in Germany",
    bodySnippet: "The DAAD offers fully funded scholarships for Indian students to pursue Masters in Germany.",
    idealTitle: "DAAD Germany Scholarship",
    category: "scholarship"
  },
  {
    subject: "Rhodes Scholarship 2027 Applications",
    bodySnippet: "Applications for the prestigious Rhodes Scholarship to study at Oxford are now open.",
    idealTitle: "Rhodes Scholarship 2027",
    category: "scholarship"
  },
  {
    subject: "Chevening Scholarship UK 2026-27",
    bodySnippet: "The UK government's Chevening Scholarships are open for applications.",
    idealTitle: "Chevening UK Scholarship",
    category: "scholarship"
  },
  {
    subject: "Fulbright-Nehru Fellowship 2026",
    bodySnippet: "Apply for the Fulbright-Nehru Master's Fellowship to study in the United States.",
    idealTitle: "Fulbright-Nehru Fellowship",
    category: "scholarship"
  },
  {
    subject: "MITACS Globalink Research Internship 2026",
    bodySnippet: "MITACS Globalink offers 12-week research internships at top Canadian universities.",
    idealTitle: "MITACS Research Internship",
    category: "research"
  },
  {
    subject: "Erasmus Mundus Joint Master Degree",
    bodySnippet: "EU-funded Erasmus Mundus scholarships covering tuition, travel, and monthly allowance.",
    idealTitle: "Erasmus Mundus Scholarship",
    category: "scholarship"
  },
  {
    subject: "KVPY Fellowship Programme",
    bodySnippet: "Kishore Vaigyanik Protsahan Yojana fellowship for students pursuing basic sciences.",
    idealTitle: "KVPY Fellowship",
    category: "scholarship"
  },
  {
    subject: "Tata Scholarship for Cornell University",
    bodySnippet: "The Tata Education and Development Trust funds scholarships at Cornell for Indian students.",
    idealTitle: "Tata Cornell Scholarship",
    category: "scholarship"
  },

  // ═══════════════════════════════════════════════════════════════
  // RESEARCH PROGRAMS
  // ═══════════════════════════════════════════════════════════════
  {
    subject: "CERN Summer Student Programme 2026",
    bodySnippet: "CERN invites undergraduate students to spend the summer working on particle physics research.",
    idealTitle: "CERN Summer Research 2026",
    category: "research"
  },
  {
    subject: "IISC Summer Research Fellowship",
    bodySnippet: "Indian Institute of Science offers summer research fellowships for science and engineering students.",
    idealTitle: "IISc Summer Fellowship",
    category: "research"
  },
  {
    subject: "IITB Research Internship Award",
    bodySnippet: "IIT Bombay's research internship program for pre-final year students in all branches.",
    idealTitle: "IIT Bombay Research Internship",
    category: "research"
  },
  {
    subject: "NASA Lucy Student Pipeline Internship",
    bodySnippet: "NASA's Lucy program offers undergraduate internships in space science and engineering.",
    idealTitle: "NASA Lucy Internship",
    category: "research"
  },
  {
    subject: "DRDO Research Fellowship Scheme",
    bodySnippet: "DRDO offers junior research fellowships for postgraduate students in defense research.",
    idealTitle: "DRDO Research Fellowship",
    category: "research"
  },
  {
    subject: "Max Planck Summer Research Program",
    bodySnippet: "Max Planck Institute offers summer research positions for international students.",
    idealTitle: "Max Planck Summer Research",
    category: "research"
  },

  // ═══════════════════════════════════════════════════════════════
  // WORKSHOPS & CONFERENCES
  // ═══════════════════════════════════════════════════════════════
  {
    subject: "AWS Cloud Practitioner Workshop",
    bodySnippet: "Free workshop on AWS Cloud Practitioner certification preparation. Hands-on labs included.",
    idealTitle: "AWS Cloud Workshop",
    category: "workshop"
  },
  {
    subject: "Google Cloud Study Jams 2026",
    bodySnippet: "Join Google Cloud Study Jams to learn cloud computing and earn free certifications.",
    idealTitle: "Google Cloud Study Jams",
    category: "workshop"
  },
  {
    subject: "Docker & Kubernetes Bootcamp",
    bodySnippet: "3-day intensive bootcamp on containerization with Docker and orchestration with Kubernetes.",
    idealTitle: "Docker Kubernetes Bootcamp",
    category: "workshop"
  },
  {
    subject: "NeurIPS 2026 Call for Papers",
    bodySnippet: "The Conference on Neural Information Processing Systems invites paper submissions.",
    idealTitle: "NeurIPS 2026 Paper Submission",
    category: "research"
  },
  {
    subject: "TEDxVIT 2026 Speaker Applications",
    bodySnippet: "TEDxVIT is looking for student speakers and attendees for the 2026 edition.",
    idealTitle: "TEDxVIT 2026",
    category: "workshop"
  },
  {
    subject: "Blockchain Development Workshop by Polygon",
    bodySnippet: "Learn to build dApps on Polygon blockchain. Free workshop with certificate.",
    idealTitle: "Polygon Blockchain Workshop",
    category: "workshop"
  },

  // ═══════════════════════════════════════════════════════════════
  // SUMMER / EXCHANGE PROGRAMS
  // ═══════════════════════════════════════════════════════════════
  {
    subject: "Stanford Summer International Honors Program",
    bodySnippet: "Stanford University's summer program for exceptional international undergraduate students.",
    idealTitle: "Stanford Summer Program",
    category: "workshop"
  },
  {
    subject: "NUS Summer Workshop Singapore",
    bodySnippet: "National University of Singapore offers a 4-week summer workshop in data science.",
    idealTitle: "NUS Summer Workshop",
    category: "workshop"
  },
  {
    subject: "ETH Zurich Student Summer Research Fellowship",
    bodySnippet: "ETH Zurich offers fully funded summer research positions for international students.",
    idealTitle: "ETH Zurich Summer Fellowship",
    category: "research"
  },
  {
    subject: "Semester Exchange at University of Melbourne",
    bodySnippet: "Apply for a semester exchange program at the University of Melbourne, Australia.",
    idealTitle: "Melbourne Semester Exchange",
    category: "other"
  },
  {
    subject: "Cultural Exchange Program - Japan",
    bodySnippet: "MEXT scholarship for cultural exchange and language study in Japan for 6 months.",
    idealTitle: "Japan MEXT Exchange Program",
    category: "scholarship"
  },

  // ═══════════════════════════════════════════════════════════════
  // EDGE CASES — Tricky subjects that must be handled right
  // ═══════════════════════════════════════════════════════════════
  {
    subject: "Fwd: Fwd: Re: Important - Please Apply",
    bodySnippet: "Deloitte Digital is hiring UI/UX design interns. Apply through the official portal.",
    idealTitle: "Deloitte UI/UX Internship",
    category: "internship"
  },
  {
    subject: "URGENT: Last Date Tomorrow",
    bodySnippet: "IIT Delhi summer research program deadline is tomorrow. Apply immediately.",
    idealTitle: "IIT Delhi Summer Research",
    category: "research"
  },
  {
    subject: "Opportunity Alert!",
    bodySnippet: "Wipro is conducting an off-campus drive for 2026 batch graduates. Eligible branches: CSE, IT, ECE.",
    idealTitle: "Wipro Off-Campus Drive 2026",
    category: "job"
  },
  {
    subject: "Don't miss this!",
    bodySnippet: "Registrations open for the Indian startup summit and pitch competition in Bangalore.",
    idealTitle: "Indian Startup Summit",
    category: "competition"
  },
  {
    subject: "allstudents.vellore via B.Tech. - Comp Sci Engg 2025 Group",
    bodySnippet: "Applications invited for Young India Fellowship at Ashoka University. Fully residential, interdisciplinary.",
    idealTitle: "Ashoka Young India Fellowship",
    category: "scholarship"
  },
  {
    subject: "RE: FW: Multiple Openings",
    bodySnippet: "Oracle is hiring for multiple roles including SDE, QA, and Data Engineer positions.",
    idealTitle: "Oracle Multiple Hiring Roles",
    category: "job"
  },
  {
    subject: "Newsletter #45 - Campus Updates",
    bodySnippet: "This week: Cognizant GenC hiring, AWS certification workshop, and IEEE paper submission deadline.",
    idealTitle: "Cognizant Hiring & Campus Updates",
    category: "job"
  },
  {
    subject: "Kind Attention Undergraduate Students!",
    bodySnippet: "Bosch India is offering a 6-month industry internship for mechanical and CSE students.",
    idealTitle: "Bosch Industry Internship",
    category: "internship"
  },
  {
    subject: "Greetings from the Career Development Centre",
    bodySnippet: "Zomato is hiring backend engineers. Walk-in interview on campus next Monday.",
    idealTitle: "Zomato Backend Engineer Hiring",
    category: "job"
  },
  {
    subject: "Important Notice from Placement Cell",
    bodySnippet: "Pre-placement talk by Morgan Stanley on Wednesday. Mandatory for all registered students.",
    idealTitle: "Morgan Stanley Pre-Placement Talk",
    category: "job"
  },

  // ═══════════════════════════════════════════════════════════════
  // MORE CORPORATE INTERNSHIPS
  // ═══════════════════════════════════════════════════════════════
  {
    subject: "Apple WWDC Student Scholarship",
    bodySnippet: "Apple is offering free scholarships to attend WWDC for students who demonstrate coding excellence.",
    idealTitle: "Apple WWDC Scholarship",
    category: "scholarship"
  },
  {
    subject: "Meta (Facebook) University Program",
    bodySnippet: "Meta University is an 8-week internship for first-year CS students. Mentorship + stipend.",
    idealTitle: "Meta University Internship",
    category: "internship"
  },
  {
    subject: "Tesla Autopilot Intern",
    bodySnippet: "Tesla is looking for interns to work on the Autopilot team. Strong ML skills required.",
    idealTitle: "Tesla Autopilot Internship",
    category: "internship"
  },
  {
    subject: "Netflix Tech Internship 2026",
    bodySnippet: "Netflix engineering internship for students passionate about streaming technology.",
    idealTitle: "Netflix Tech Internship",
    category: "internship"
  },
  {
    subject: "Airbnb Software Engineer Intern",
    bodySnippet: "Join Airbnb as an SDE intern. Work on real product features used by millions.",
    idealTitle: "Airbnb SDE Internship",
    category: "internship"
  },
  {
    subject: "Stripe Engineering Residency",
    bodySnippet: "Stripe's engineering residency is a 12-week program for new grads transitioning to industry.",
    idealTitle: "Stripe Engineering Residency",
    category: "internship"
  },
  {
    subject: "Palantir Path Internship",
    bodySnippet: "Palantir Path is an internship for students with non-traditional CS backgrounds.",
    idealTitle: "Palantir Path Internship",
    category: "internship"
  },
  {
    subject: "Two Sigma Quantitative Intern",
    bodySnippet: "Two Sigma is hiring quantitative research interns with strong math and programming skills.",
    idealTitle: "Two Sigma Quant Internship",
    category: "internship"
  },
  {
    subject: "Databricks Engineering Internship",
    bodySnippet: "Databricks summer internship for students interested in data engineering and Apache Spark.",
    idealTitle: "Databricks Engineering Internship",
    category: "internship"
  },
  {
    subject: "Salesforce Futureforce Internship",
    bodySnippet: "Salesforce Futureforce program offers internships across engineering, product, and design.",
    idealTitle: "Salesforce Futureforce Internship",
    category: "internship"
  },

  // ═══════════════════════════════════════════════════════════════
  // INDIAN STARTUP & COMPANY OPPORTUNITIES
  // ═══════════════════════════════════════════════════════════════
  {
    subject: "Razorpay Campus Connect",
    bodySnippet: "Razorpay is hiring SDE interns through their campus connect program.",
    idealTitle: "Razorpay SDE Internship",
    category: "internship"
  },
  {
    subject: "CRED Summer Internship 2026",
    bodySnippet: "CRED is offering product and engineering internships for the summer.",
    idealTitle: "CRED Summer Internship",
    category: "internship"
  },
  {
    subject: "Zerodha Technology Internship",
    bodySnippet: "Zerodha invites engineering students for a 3-month technology internship in Bangalore.",
    idealTitle: "Zerodha Tech Internship",
    category: "internship"
  },
  {
    subject: "PhonePe Engineering Hiring",
    bodySnippet: "PhonePe is looking for full-stack developers and backend engineers for Bangalore office.",
    idealTitle: "PhonePe Engineering Hiring",
    category: "job"
  },
  {
    subject: "Swiggy Campus Recruitment",
    bodySnippet: "Swiggy campus recruitment drive for 2026 batch. Roles: SDE, Data Analyst, Product Manager.",
    idealTitle: "Swiggy Campus Recruitment",
    category: "job"
  },
  {
    subject: "Dream11 Technology Internship",
    bodySnippet: "Dream11 is hiring technology interns. Work on real-time sports technology at scale.",
    idealTitle: "Dream11 Tech Internship",
    category: "internship"
  },

  // ═══════════════════════════════════════════════════════════════
  // GOVERNMENT & PUBLIC SECTOR
  // ═══════════════════════════════════════════════════════════════
  {
    subject: "ISRO Young Scientist Programme",
    bodySnippet: "ISRO YUVIKA program for school students to learn about space science and technology.",
    idealTitle: "ISRO YUVIKA Programme",
    category: "workshop"
  },
  {
    subject: "NTPC Engineering Executive Trainee",
    bodySnippet: "NTPC recruitment for Engineering Executive Trainees through GATE 2026 scores.",
    idealTitle: "NTPC Executive Trainee Hiring",
    category: "job"
  },
  {
    subject: "BARC Scientific Officer Recruitment",
    bodySnippet: "Bhabha Atomic Research Centre is recruiting Scientific Officers through GATE.",
    idealTitle: "BARC Scientific Officer",
    category: "job"
  },
  {
    subject: "Indian Navy SSC Officer Entry",
    bodySnippet: "Indian Navy Short Service Commission officer entry for engineering graduates.",
    idealTitle: "Indian Navy SSC Entry",
    category: "job"
  },

  // ═══════════════════════════════════════════════════════════════
  // MORE EDGE CASES — Very tricky/noisy subjects
  // ═══════════════════════════════════════════════════════════════
  {
    subject: "!!! APPLY NOW - LIMITED SEATS !!!",
    bodySnippet: "GeeksforGeeks is hosting a Data Structures and Algorithms masterclass. 500 seats only.",
    idealTitle: "GFG DSA Masterclass",
    category: "workshop"
  },
  {
    subject: "Reminder: Deadline Approaching",
    bodySnippet: "This is a reminder that the Reliance Foundation Scholarship deadline is in 3 days.",
    idealTitle: "Reliance Foundation Scholarship",
    category: "scholarship"
  },
  {
    subject: "Check this out students!!!",
    bodySnippet: "Hack4Bengal is a 36-hour regional hackathon. Amazing prizes and mentorship opportunities.",
    idealTitle: "Hack4Bengal Hackathon",
    category: "hackathon"
  },
  {
    subject: "Weekly Digest - Opportunities",
    bodySnippet: "This week's top opportunity: Siemens Healthineers is hiring ML engineers for medical imaging.",
    idealTitle: "Siemens Healthineers ML Hiring",
    category: "job"
  },
  {
    subject: "ACTION REQUIRED",
    bodySnippet: "Complete your profile on Unstop to apply for the Tata Steel COMPASS challenge.",
    idealTitle: "Tata Steel COMPASS Challenge",
    category: "competition"
  },
  {
    subject: "New Opportunity on Campus",
    bodySnippet: "McKinsey & Company is conducting a case study competition for business and engineering students.",
    idealTitle: "McKinsey Case Study Competition",
    category: "competition"
  },
  {
    subject: "Dear Students - Please read",
    bodySnippet: "SBI Youth for India Fellowship is accepting applications for rural development projects.",
    idealTitle: "SBI Youth India Fellowship",
    category: "scholarship"
  },
  {
    subject: "FYI - from CDC",
    bodySnippet: "L&T Construction is hiring civil and mechanical engineering interns for site projects.",
    idealTitle: "L&T Construction Internship",
    category: "internship"
  },

  // ═══════════════════════════════════════════════════════════════
  // MORE VARIETY — Different email patterns
  // ═══════════════════════════════════════════════════════════════
  {
    subject: "Call for Applications: AI Research Lab",
    bodySnippet: "The university AI research lab is accepting applications for research assistants. ML experience preferred.",
    idealTitle: "AI Research Lab Applications",
    category: "research"
  },
  {
    subject: "Invitation to Global Leadership Summit",
    bodySnippet: "Join the Global Leadership Summit 2026 in Davos. Scholarships available for select students.",
    idealTitle: "Global Leadership Summit 2026",
    category: "workshop"
  },
  {
    subject: "Open Source Contribution Drive",
    bodySnippet: "Google Summer of Code 2026 registration is open. Contribute to open source projects and get paid.",
    idealTitle: "Google Summer of Code 2026",
    category: "internship"
  },
  {
    subject: "Campus Ambassador Program",
    bodySnippet: "Become a campus ambassador for Coding Ninjas. Earn certificates, goodies, and stipend.",
    idealTitle: "Coding Ninjas Ambassador Program",
    category: "other"
  },
  {
    subject: "Free Certification Course",
    bodySnippet: "Coursera is offering free certification in Google Project Management for students.",
    idealTitle: "Google Project Management Cert",
    category: "workshop"
  },
  {
    subject: "Entrepreneurship Cell - Startup Weekend",
    bodySnippet: "E-Cell presents Startup Weekend VIT. 54 hours to build and pitch your startup idea.",
    idealTitle: "E-Cell Startup Weekend",
    category: "competition"
  },
  {
    subject: "Model United Nations Conference 2026",
    bodySnippet: "VITMUN 2026 registrations are open. Committees include UNSC, WHO, UNHRC, and ECOSOC.",
    idealTitle: "VITMUN 2026 Conference",
    category: "other"
  },
  {
    subject: "International Debate Championship",
    bodySnippet: "World University Debate Championship qualifiers. Represent your university on the global stage.",
    idealTitle: "World University Debate Championship",
    category: "competition"
  },
  {
    subject: "Photography Contest - Nature Theme",
    bodySnippet: "National Geographic Student Photography Contest. Theme: Urban Nature. Submit by August.",
    idealTitle: "NatGeo Photography Contest",
    category: "competition"
  },
  {
    subject: "Blood Donation Camp",
    bodySnippet: "NSS and Red Cross are organizing a blood donation camp on campus. All volunteers welcome.",
    idealTitle: "Campus Blood Donation Camp",
    category: "other"
  },
  {
    subject: "Placement Training Session",
    bodySnippet: "Aptitude and coding practice session for upcoming placement season. Mandatory for final years.",
    idealTitle: "Placement Training Session",
    category: "workshop"
  },
  {
    subject: "Alumni Talk Series #12",
    bodySnippet: "Alumni from Google Brain will share insights on AI career paths. Open to all students.",
    idealTitle: "Google Brain Alumni Talk",
    category: "workshop"
  }
];

/**
 * Build a few-shot prompt from the training dataset.
 * Selects the most relevant examples for the given email content.
 */
export function buildFewShotPrompt(subject: string, bodySnippet: string, maxExamples: number = 12): string {
  // Select diverse examples across categories
  const categories = [...new Set(TRAINING_DATASET.map(e => e.category))];
  const selected: TrainingExample[] = [];
  
  // Pick 2 examples from each category for diversity
  for (const cat of categories) {
    const catExamples = TRAINING_DATASET.filter(e => e.category === cat);
    const shuffled = catExamples.sort(() => Math.random() - 0.5);
    selected.push(...shuffled.slice(0, 2));
    if (selected.length >= maxExamples) break;
  }
  
  // Always include tricky VIT broadcast examples since those are the hardest
  const vitExamples = TRAINING_DATASET.filter(e => 
    e.subject.includes('via B.Tech') || 
    e.subject.includes('Director') ||
    e.subject.includes('VIT')
  );
  for (const ex of vitExamples) {
    if (!selected.includes(ex) && selected.length < maxExamples + 4) {
      selected.push(ex);
    }
  }

  const examplesText = selected.map(ex => 
    `Subject: ${ex.subject}\nBody: ${ex.bodySnippet}\nTitle: ${ex.idealTitle}`
  ).join('\n\n');

  return `You are an expert at reading university opportunity emails and generating short, professional titles.

Rules:
- Output ONLY the title, nothing else
- Title must be 2-6 words maximum
- Include the organization/company name if mentioned
- Include the program type (Internship, Hackathon, Scholarship, Workshop, etc.)
- Include the year if mentioned
- Never include email forwarding prefixes like "Fwd:", "Re:", "via B.Tech"
- Never include university internal routing like "Director TBI", "Dean SSI", "PROVC"
- Focus on WHAT the opportunity IS, not WHO forwarded it

Examples:

${examplesText}

Now generate the title for this email:

Subject: ${subject}
Body: ${bodySnippet}
Title:`;
}
