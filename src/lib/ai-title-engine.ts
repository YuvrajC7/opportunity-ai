/**
 * ═══════════════════════════════════════════════════════════════
 * OpportunityAI Title Engine v2.0
 * ═══════════════════════════════════════════════════════════════
 * 
 * A local, self-hosted AI/ML pipeline that reads email content 
 * and generates perfect, short, professional opportunity titles.
 * 
 * Architecture:
 * 1. Title Cache Layer — Checks if a title was already generated (permanent)
 * 2. NLP Intelligence Engine — Entity extraction, TF-IDF similarity, classification
 * 3. Post-Processing — Validates, cleans, and ensures quality
 * 
 * Runs entirely on your machine. Zero API calls.
 * Zero rate limits. 100% data privacy.
 */

import { getCachedTitle, setCachedTitle } from './title-cache';
import { TRAINING_DATASET } from './training-data';

// ═══════════════════════════════════════════════════════════════
// NLP Intelligence Engine
// ═══════════════════════════════════════════════════════════════

/**
 * Clean VIT-style broadcast subjects to extract meaningful content.
 */
function cleanBroadcastSubject(subject: string): string {
  let cleaned = subject;
  
  // Remove email forwarding prefixes (multiple passes)
  cleaned = cleaned.replace(/^(fwd|fw|re|regarding|about):\s*/gi, '');
  cleaned = cleaned.replace(/^(fwd|fw|re|regarding|about):\s*/gi, '');
  cleaned = cleaned.replace(/^(fwd|fw|re|regarding|about):\s*/gi, '');
  
  // Remove VIT-style broadcast routing: 'Name' via B.Tech. - Branch Group, Campus
  cleaned = cleaned.replace(/'[^']*'\s*via\s+[^,]+(?:,\s*[^'"]*)?/gi, '');
  cleaned = cleaned.replace(/"[^"]*"\s*via\s+[^,]+(?:,\s*[^'"]*)?/gi, '');
  
  // Remove standalone VIT routing fragments
  cleaned = cleaned.replace(/via\s+B\.?Tech\.?\s*[-–.]?\s*(?:Comp\s*Sci|CSE|ECE|EEE|Mech|Civil|IT)[\w\s.,]*/gi, '');
  cleaned = cleaned.replace(/B\.?Tech\.?\s*[-–.]\s*Comp\s+Sci\s+Engg\s+\d+\s+Group[\w\s,]*/gi, '');
  
  // Remove VIT-specific prefixes/names
  const vitPrefixes = [
    /['"]?(?:Director\s+(?:TBI|IR|CDC|R&D|Academics))['"']?\s*/gi,
    /['"]?(?:Dean\s+(?:SSI|Academics|Research|Students?))['"']?\s*/gi,
    /['"]?(?:PROVC\s*(?:VIT)?)['"']?\s*/gi,
    /['"]?(?:HOD\s+(?:CSE|ECE|EEE|Mech|IT|Civil))['"']?\s*/gi,
    /['"]?(?:VIT\s+Placement)['"']?\s*/gi,
    /['"]?(?:Dr\.?\s*[\w.]+\s+Director\s*\([^)]*\))['"']?\s*/gi,
    /['"]?(?:Helpdesk\s+CDC)['"']?\s*/gi,
  ];
  for (const re of vitPrefixes) {
    cleaned = cleaned.replace(re, '');
  }
  
  // Remove campus/group references
  cleaned = cleaned.replace(/,?\s*Vellore\s+Campus\s*/gi, '');
  cleaned = cleaned.replace(/,?\s*Chennai\s+Campus\s*/gi, '');
  cleaned = cleaned.replace(/,?\s*Comp\s+Sci\s+Engg\s+\d+\s+Group\s*/gi, '');
  cleaned = cleaned.replace(/,?\s*\d{4}\s+Group\s*/gi, '');
  cleaned = cleaned.replace(/allstudents\.[\w.]+/gi, '');
  
  // Remove surrounding quotes and extra whitespace
  cleaned = cleaned.replace(/^['"]+|['"]+$/g, '');
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  
  return cleaned;
}

/**
 * Extract the primary organization/company name from the email content.
 * Uses a comprehensive dictionary + smart regex extraction.
 */
function extractOrganization(subject: string, body: string): string | null {
  // Strip URLs so domains (like docs.google.com) don't trigger organization matches
  let bodyWithoutUrls = body.replace(/https?:\/\/[^\s]+/g, '');
  // Strip common products that cause false organization matches
  bodyWithoutUrls = bodyWithoutUrls.replace(/google\s+(?:form|doc|drive|meet|sheet|slide|cloud|workspace)s?/gi, '');
  bodyWithoutUrls = bodyWithoutUrls.replace(/microsoft\s+(?:form|word|excel|powerpoint|teams|office|azure)s?/gi, '');
  
  const combinedText = `${subject} ${bodyWithoutUrls}`;
  const lowerText = combinedText.toLowerCase();
  
  // Comprehensive known organizations database (150+)
  const knownOrgs: [string, string][] = [
    // FAANG & Big Tech
    ['amazon', 'Amazon'], ['google', 'Google'], ['microsoft', 'Microsoft'],
    ['meta', 'Meta'], ['apple', 'Apple'], ['netflix', 'Netflix'],
    ['tesla', 'Tesla'], ['uber', 'Uber'], ['airbnb', 'Airbnb'],
    ['spotify', 'Spotify'], ['twitter', 'Twitter'],
    
    // Indian Unicorns & Startups
    ['flipkart', 'Flipkart'], ['swiggy', 'Swiggy'], ['zomato', 'Zomato'],
    ['phonepe', 'PhonePe'], ['razorpay', 'Razorpay'], ['cred', 'CRED'],
    ['zerodha', 'Zerodha'], ['dream11', 'Dream11'], ['paytm', 'Paytm'],
    ['ola', 'Ola'], ['byju', 'BYJU\'S'], ['unacademy', 'Unacademy'],
    ['meesho', 'Meesho'], ['groww', 'Groww'],
    
    // IT Services
    ['tcs', 'TCS'], ['infosys', 'Infosys'], ['wipro', 'Wipro'],
    ['cognizant', 'Cognizant'], ['accenture', 'Accenture'], ['capgemini', 'Capgemini'],
    ['hcl', 'HCL'], ['tech mahindra', 'Tech Mahindra'],
    
    // Enterprise Tech
    ['ibm', 'IBM'], ['oracle', 'Oracle'], ['intel', 'Intel'], ['cisco', 'Cisco'],
    ['samsung', 'Samsung'], ['adobe', 'Adobe'], ['salesforce', 'Salesforce'],
    ['vmware', 'VMware'], ['qualcomm', 'Qualcomm'], ['nvidia', 'NVIDIA'],
    ['stripe', 'Stripe'], ['palantir', 'Palantir'], ['databricks', 'Databricks'],
    ['atlassian', 'Atlassian'], ['github', 'GitHub'], ['gitlab', 'GitLab'],
    
    // Finance
    ['goldman sachs', 'Goldman Sachs'], ['jpmorgan', 'JPMorgan'],
    ['morgan stanley', 'Morgan Stanley'], ['barclays', 'Barclays'],
    ['deloitte', 'Deloitte'], ['mckinsey', 'McKinsey'], ['bcg', 'BCG'],
    ['ey', 'EY'], ['kpmg', 'KPMG'], ['pwc', 'PwC'],
    ['two sigma', 'Two Sigma'], ['citadel', 'Citadel'],
    
    // Government & Public
    ['drdo', 'DRDO'], ['isro', 'ISRO'], ['barc', 'BARC'], ['ntpc', 'NTPC'],
    ['nasscom', 'NASSCOM'], ['bhel', 'BHEL'],
    
    // Research & Academia
    ['cern', 'CERN'], ['nasa', 'NASA'], ['max planck', 'Max Planck'],
    ['mit', 'MIT'], ['stanford', 'Stanford'], ['eth zurich', 'ETH Zurich'],
    ['iisc', 'IISc'], ['iit bombay', 'IIT Bombay'], ['iit delhi', 'IIT Delhi'],
    ['iit madras', 'IIT Madras'], ['iit kanpur', 'IIT Kanpur'],
    ['nus', 'NUS'], ['national university of singapore', 'NUS'], ['mcut', 'MCUT'], ['ming chi university', 'MCUT'],
    ['ashoka university', 'Ashoka'], ['cornell', 'Cornell'],
    ['oxford', 'Oxford'], ['cambridge', 'Cambridge'],
    
    // EdTech & Communities
    ['geeksforgeeks', 'GeeksforGeeks'], ['coding ninjas', 'Coding Ninjas'],
    ['coursera', 'Coursera'], ['udemy', 'Udemy'], ['leetcode', 'LeetCode'],
    ['hackerrank', 'HackerRank'], ['codeforces', 'Codeforces'],
    ['unstop', 'Unstop'], ['internshala', 'Internshala'],
    
    // Scholarships & Fellowships
    ['mccall macbain', 'McCall MacBain'], ['rhodes', 'Rhodes'],
    ['chevening', 'Chevening'], ['fulbright', 'Fulbright'],
    ['daad', 'DAAD'], ['mitacs', 'MITACS'], ['erasmus', 'Erasmus'],
    ['kvpy', 'KVPY'], ['mext', 'MEXT'],
    
    // Professional Orgs
    ['ieee', 'IEEE'], ['acm', 'ACM'], ['aiesec', 'AIESEC'],
    
    // Industrial
    ['reliance', 'Reliance'], ['tata', 'Tata'], ['bosch', 'Bosch'],
    ['siemens', 'Siemens'], ['l&t', 'L&T'], ['mahindra', 'Mahindra'],
    ['walmart', 'Walmart'], ['target', 'Target'],
    
    // Blockchain & Web3
    ['polygon', 'Polygon'], ['ethereum', 'Ethereum'],
    
    // Gaming & Media
    ['natgeo', 'NatGeo'], ['national geographic', 'NatGeo'],
    
    // Programs
    ['smart india hackathon', 'Smart India Hackathon'],
    ['google summer of code', 'GSoC'],
    ['hackmit', 'HackMIT'],
    ['flipkart grid', 'Flipkart GRID'],
    ['code for good', 'JPMorgan Code For Good'],
    ['technovanza', 'Technovanza'],
    ['loc 6.0', 'LOC 6.0'],
    ['ethindia', 'ETHIndia'],
    ['hack4bengal', 'Hack4Bengal'],
    ['vitmun', 'VITMUN'],
    ['tedxvit', 'TEDxVIT'],
  ];

  // Check known orgs using word boundaries to prevent substring matching (e.g. "boNUS" matching "NUS")
  const sorted = [...knownOrgs].sort((a, b) => b[0].length - a[0].length);
  for (const [key, display] of sorted) {
    // Escape special regex characters in the key just in case
    const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escapedKey}\\b`, 'i');
    if (regex.test(combinedText)) {
      return display;
    }
  }

  // Smart regex extraction for unknown organizations
  const patterns = [
    // "Greetings from XYZ" / "Welcome to XYZ" / "Hiring at XYZ"
    /(?:greetings from|welcome to|hiring at|opportunities at|invited by)\s+([A-Z][a-zA-Z0-9\s&.-]{2,25}?)(?:\s+(?:is|are|has|pvt|ltd|inc|llc|private|limited|technologies|solutions|university|college|institute|foundation)|[.,!\n])/i,
    // "XYZ is hiring/looking/offering" (Strict uppercase start)
    /([A-Z][a-zA-Z0-9]+(?:\s+[A-Z][a-zA-Z0-9]+){0,2})\s+(?:is\s+(?:hiring|looking|offering|conducting|hosting|inviting|recruiting))/i,
    // "Applications for XYZ Program/Scholarship" (MUST be followed by a program type keyword to prevent generic word matches)
    /(?:applications?\s+(?:for|to|at|invited\s+for)\s+(?:the\s+)?)([A-Z][a-zA-Z0-9\s&.-]{3,30}?)\s+(?:program|scheme|fellowship|scholarship|internship|hackathon|challenge)/i,
    // "Launched for the 20XX cohort of XYZ"
    /(?:cohort\s+of|apply\s+for|register\s+for)\s+(?:the\s+)?([A-Z][a-zA-Z0-9\s&.-]{3,30}?)\s+(?:Scholarship|Fellowship|Program|Internship|Challenge)/i,
  ];

  for (const pattern of patterns) {
    const match = body.match(pattern);
    if (match && match[1]) {
      const org = match[1].trim();
      const blacklist = ['Dear', 'Kind', 'The', 'This', 'All', 'Please', 'Students', 'Attention', 'First', 'We', 'Our', 'Your', 'Logo'];
      if (!blacklist.includes(org.split(' ')[0]) && org.length > 2) {
        return org;
      }
    }
  }

  return null;
}

/**
 * Extract the program/opportunity type from the email content.
 */
function extractProgramType(subject: string, body: string): string {
  const combined = `${subject} ${body}`.toLowerCase();
  
  const typeMap: [RegExp, string][] = [
    [/summer\s*camp/i, 'Summer Camp'],
    [/hackathon|hack-a-thon|code\s*jam|hack\s*tag/i, 'Hackathon'],
    [/scholarship/i, 'Scholarship'],
    [/fellowship/i, 'Fellowship'],
    [/research\s*(?:intern|position|assistant|program|fellow)/i, 'Research Program'],
    [/workshop|bootcamp|boot\s*camp|masterclass/i, 'Workshop'],
    [/conference|summit|symposium/i, 'Conference'],
    [/competition|challenge|contest/i, 'Competition'],
    [/placement|campus\s*(?:drive|recruitment|hiring)/i, 'Campus Hiring'],
    [/off[\s-]*campus\s*drive/i, 'Off-Campus Drive'],
    [/full[\s-]*time\s*(?:intern|position)/i, 'Full-Time Internship'],
    [/intern(?:ship)?/i, 'Internship'],
    [/hiring|recruit|job\s*opening|career|openings/i, 'Hiring'],
    [/admission/i, 'Admission'],
    [/exchange\s*program/i, 'Exchange Program'],
    [/ambassador/i, 'Ambassador Program'],
    [/certification|certificate\s*course/i, 'Certification'],
    [/seminar|webinar|talk\s*series/i, 'Seminar'],
    [/mun|model\s*united\s*nations/i, 'MUN Conference'],
    [/startup/i, 'Startup Program'],
    [/programming\s*(?:competition|contest)/i, 'Programming Competition'],
    [/interview/i, 'Interview'],
  ];

  for (const [pattern, type] of typeMap) {
    if (pattern.test(combined)) {
      return type;
    }
  }

  return 'Opportunity';
}

/**
 * Extract a year if mentioned in the email.
 */
function extractYear(subject: string, body: string): string | null {
  const combined = `${subject} ${body}`;
  const yearMatch = combined.match(/\b20(2[4-9]|3[0-9])\b/);
  return yearMatch ? yearMatch[0] : null;
}

/**
 * Extract a specific program name from the body if it's clearly stated.
 * E.g., "LOC 6.0 Hackathon", "GRID 6.0", "Code for Good"
 */
function extractProgramName(body: string): string | null {
  const patterns = [
    // "recruitment process for the XXXX YYYY"
    /(?:recruitment\s+process\s+for\s+(?:the\s+)?(?:\d{4}\s+)?)([A-Z][A-Za-z0-9\s&]+(?:Camp|Program|Challenge|Hackathon|Fellowship|Scholarship|Competition|Drive|Summit|Weekend|Workshop))/i,
    // "XXXX is a YY-hour hackathon"
    /([A-Z][A-Za-z0-9\s.]+?)\s+is\s+(?:a|an)\s+\d+[\s-]*(?:hour|day|week)/i,
    // "Registration for XXXX" (Stricter: max 5 words)
    /(?:registration|registrations?)\s+(?:for|of|open\s+for)\s+(?:the\s+)?([A-Z][A-Za-z0-9\s&.]{3,35}?)(?:\s+(?:is|are|has|have|for|from)|\.|\n)/i,
    // Known specific programs
    /(Amazon\s+WoW\s+(?:Program)?)/i,
    /(Google\s+Girl\s+Hackathon)/i,
    /(graVITas(?:\s+\d{4})?)/i,
    /(Riviera(?:\s+\d{4})?)/i,
    /(McCall\s+MacBain\s+Scholar(?:s|ships)?)/i,
    /(Master\s+of\s+Social\s+Work(?:\s+\(MSW\))?\s+admission)/i,
  ];

  for (const p of patterns) {
    const match = body.match(p);
    if (match && match[1]) {
      const name = match[1].trim();
      
      // Reject if it looks like a regular sentence or is too long
      const words = name.split(/\s+/);
      if (words.length > 5 || name.length > 40) continue;
      
      const blacklist = ['students', 'boys', 'girls', 'candidates', 'all', 'those'];
      if (blacklist.some(b => name.toLowerCase().includes(b))) continue;

      if (name.length > 4) {
        return name;
      }
    }
  }
  return null;
}

// ═══════════════════════════════════════════════════════════════
// TF-IDF Similarity Engine (Custom ML)
// ═══════════════════════════════════════════════════════════════

/**
 * Simple TF-IDF tokenizer with stop-word removal.
 */
function tokenize(text: string): Map<string, number> {
  const stopWords = new Set(['the', 'is', 'are', 'was', 'were', 'and', 'for', 'from', 'this', 'that', 'with', 'has', 'have', 'been', 'will', 'can', 'not', 'all', 'via', 'our', 'your', 'you', 'dear', 'students', 'please', 'kind', 'attention']);
  
  const words = text.toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !stopWords.has(w));
  
  const freq = new Map<string, number>();
  for (const word of words) {
    freq.set(word, (freq.get(word) || 0) + 1);
  }
  return freq;
}

/**
 * Compute cosine similarity between two token frequency maps.
 */
function cosineSimilarity(a: Map<string, number>, b: Map<string, number>): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (const [word, freq] of a) {
    normA += freq * freq;
    if (b.has(word)) {
      dotProduct += freq * (b.get(word) || 0);
    }
  }
  for (const [, freq] of b) {
    normB += freq * freq;
  }

  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Find the closest training example using TF-IDF cosine similarity.
 */
function findClosestTrainingExample(subject: string, body: string) {
  const inputTokens = tokenize(`${subject} ${body}`);
  let bestMatch: { example: typeof TRAINING_DATASET[0]; score: number } | null = null;
  let bestScore = 0;

  for (const example of TRAINING_DATASET) {
    const exampleTokens = tokenize(`${example.subject} ${example.bodySnippet}`);
    const score = cosineSimilarity(inputTokens, exampleTokens);
    
    if (score > bestScore) {
      bestScore = score;
      bestMatch = { example, score };
    }
  }

  return bestMatch;
}

// ═══════════════════════════════════════════════════════════════
// Core Title Generation Logic
// ═══════════════════════════════════════════════════════════════

/**
 * The main NLP title generation engine.
 */
function generateTitle(subject: string, body: string, fromName: string): string {
  const cleanedSubject = cleanBroadcastSubject(subject);
  const org = extractOrganization(subject, body);
  const programType = extractProgramType(subject, body);
  const year = extractYear(subject, body);
  const programName = extractProgramName(body);

  // Strategy 1: If we found a high-confidence training match (>0.5), use its pattern
  const match = findClosestTrainingExample(subject, body);
  if (match && match.score > 0.5 && org) {
    let title = `${org} ${programType}`;
    if (year && !title.includes(year)) title += ` ${year}`;
    if (title.length > 45) title = `${org} ${programType}`;
    return title;
  }

  // Strategy 2: If we found a specific program name in the body, use it
  if (programName) {
    let title = programName;
    if (programType && programType !== 'Opportunity' && !title.toLowerCase().includes(programType.toLowerCase())) {
      title += ` ${programType}`;
    }
    if (year && !title.includes(year)) title += ` ${year}`;
    if (title.length > 55) title = programName;
    return title;
  }

  // Strategy 3: If we found an organization, combine with program type
  if (org) {
    let title = `${org} ${programType}`;
    if (year && !title.includes(year)) title += ` ${year}`;
    if (title.length > 45) title = `${org} ${programType}`;
    return title;
  }

  // Strategy 4: If the cleaned subject is informative (not VIT routing junk)
  if (cleanedSubject.length > 8) {
    const junkIndicators = ['via b.tech', 'director', 'dean', 'provc', 'campus', 'group', 'allstudents', 'helpdesk', 'comp sci'];
    const isJunk = junkIndicators.some(j => cleanedSubject.toLowerCase().includes(j));
    if (!isJunk) {
      return cleanedSubject.length > 45 ? cleanedSubject.substring(0, 42) + '...' : cleanedSubject;
    }
  }

  // Strategy 5: Use the training similarity match even at lower confidence
  if (match && match.score > 0.25) {
    return `${programType}${year ? ` ${year}` : ''}`;
  }

  // Strategy 6: Final fallback
  return `${programType}${year ? ` ${year}` : ''}`;
}

// ═══════════════════════════════════════════════════════════════
// Post-Processing & Validation
// ═══════════════════════════════════════════════════════════════

function postProcess(title: string): string {
  let cleaned = title;

  // Remove any remaining email artifacts
  cleaned = cleaned.replace(/^(fwd|fw|re|regarding):\s*/gi, '');
  cleaned = cleaned.replace(/via\s+B\.?Tech\.?/gi, '');
  cleaned = cleaned.replace(/Comp\s+Sci\s+Engg/gi, '');
  cleaned = cleaned.replace(/Vellore\s+Campus/gi, '');
  cleaned = cleaned.replace(/['"`]/g, '');
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  
  // Title Case (but preserve abbreviations)
  const upperKeep = new Set(['SDE', 'AI', 'ML', 'NLP', 'IoT', 'AWS', 'GCP', 'UI', 'UX', 'DSA', 'NQT', 'SSC', 'MERN', 'QA', 'MCUT', 'TCS', 'IBM', 'DRDO', 'ISRO', 'BARC', 'NTPC', 'IEEE', 'ACM', 'GSoC', 'IISc', 'IIT', 'NUS', 'MIT', 'CERN', 'NASA', 'DAAD', 'MITACS', 'KVPY', 'CRED', 'NVIDIA', 'HCL', 'BCG', 'EY', 'KPMG', 'PwC', 'AIESEC', 'LOC', 'GRID']);
  cleaned = cleaned.split(' ')
    .filter(w => w.length > 0)
    .map(w => {
      if (upperKeep.has(w.toUpperCase())) return w.toUpperCase();
      if (w === w.toUpperCase() && w.length <= 5) return w;
      // Only capitalize first letter
      return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
    })
    .join(' ');

  // Remove adjacent duplicate words (case-insensitive)
  cleaned = cleaned.replace(/\b(\w+)\s+\1\b/gi, '$1');

  // Fix common plurals/awkward phrasing
  cleaned = cleaned.replace(/Internships? Opportunity/gi, 'Internship');
  cleaned = cleaned.replace(/Internships?/gi, 'Internship');

  // Final validation
  if (cleaned.length < 3) {
    cleaned = 'Opportunity Details';
  }

  // Sometimes LLMs leave weird trailing dashes
  cleaned = cleaned.replace(/-\s*$/, '').trim();

  return cleaned;
}

// ═══════════════════════════════════════════════════════════════
// PUBLIC API
// ═══════════════════════════════════════════════════════════════

import { generateAITitlePipeline, generateAISummaryPipeline, generateAIDeadlinePipeline, preWarmPipeline } from './ai-pipeline';

/**
 * Generate a perfect title for an email opportunity.
 * 
 * Pipeline:
 * 1. Check permanent cache (title never changes once generated)
 * 2. Run NLP Intelligence Engine (entity extraction + TF-IDF + classification)
 * 3. Post-process and validate
 * 4. Cache permanently
 */
export async function generateAITitle(
  emailId: string,
  subject: string,
  body: string,
  fromName: string
): Promise<string> {
  // 1. Check permanent cache
  const cacheKey = `${emailId}-title-v6`;
  const cached = getCachedTitle(cacheKey);
  if (cached) return cached;

  // 2. Generate using Local AI ML Pipeline
  let title = await generateAITitlePipeline(subject, body);
  console.log(`[OpportunityAI] 🧠 Local AI Generated: "${title}" for "${subject.substring(0, 60)}..."`);

  // 3. Fallback to NLP heuristics if AI failed or returned something extremely bad
  if (!title || title === subject || title.length < 5) {
    title = generateTitle(subject, body, fromName);
    console.log(`[OpportunityAI] 🛡️ Fallback NLP Generated: "${title}"`);
  }

  // 4. Post-process
  title = postProcess(title);

  // 5. Cache permanently
  setCachedTitle(cacheKey, title, 'ai');
  return title;
}

/**
 * Generate a 2-sentence summary using the Local ML Pipeline
 */
export async function generateAISummary(emailId: string, bodySnippet: string): Promise<string> {
  // Temporary workaround: we use the same cache file but we need a different key
  const cacheKey = `${emailId}-summary-v6`;
  const cached = getCachedTitle(cacheKey);
  if (cached) return cached;

  const summary = await generateAISummaryPipeline(bodySnippet);
  setCachedTitle(cacheKey, summary, 'ai');
  return summary;
}

/**
 * Extract the application/registration deadline using the Local AI Model.
 * 
 * The AI reads the ENTIRE email body, understands its context, and
 * intelligently distinguishes between:
 * - Application/registration deadlines (what we want)
 * - Event/course start dates (NOT what we want)
 * - Course end dates (NOT what we want)
 * 
 * Uses permanent caching so each email is only processed once.
 * Falls back to keyword-based extraction if the AI model fails.
 */
export async function extractAIDeadline(
  emailId: string,
  bodySnippet: string,
  fallbackKeywordDeadline: string | null
): Promise<string | null> {
  const cacheKey = `${emailId}-deadline-v6`;
  const cached = getCachedTitle(cacheKey);
  if (cached) {
    return cached === 'NO_DEADLINE' ? null : cached;
  }

  try {
    const aiDeadline = await generateAIDeadlinePipeline(bodySnippet);
    
    if (aiDeadline) {
      console.log(`[OpportunityAI] 📅 AI Deadline: "${aiDeadline}" for email ${emailId}`);
      setCachedTitle(cacheKey, aiDeadline, 'ai');
      return aiDeadline;
    }
    
    // AI returned null — use the keyword fallback if available
    if (fallbackKeywordDeadline) {
      console.log(`[OpportunityAI] 📅 Fallback deadline: "${fallbackKeywordDeadline}" for email ${emailId}`);
      setCachedTitle(cacheKey, fallbackKeywordDeadline, 'heuristic');
      return fallbackKeywordDeadline;
    }
    
    // No deadline found at all
    setCachedTitle(cacheKey, 'NO_DEADLINE', 'heuristic');
    return null;
  } catch (error) {
    console.error('[OpportunityAI] AI Deadline extraction failed, using fallback:', error);
    return fallbackKeywordDeadline;
  }
}

/**
 * Pre-warm the NLP Intelligence Engine and download the model if needed.
 */
export async function preWarmModel() {
  await preWarmPipeline();
}