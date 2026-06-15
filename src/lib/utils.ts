import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDeadline(dateStr: string | null | undefined): string {
  if (!dateStr) return 'Not Specified';
  const deadline = new Date(dateStr);
  const now = new Date();
  const diff = deadline.getTime() - now.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

  if (days < 0) return 'Expired';
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  if (days <= 7) return `${days} days left`;
  if (days <= 30) return `${Math.ceil(days / 7)} weeks left`;
  return deadline.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function getUrgencyColor(urgency: string): string {
  switch (urgency) {
    case 'critical': return '#118AB2';
    case 'high': return '#FF6B35';
    case 'medium': return '#FFC107';
    case 'low': return '#06D6A0';
    default: return '#94A3B8';
  }
}

export function getStatusLabel(status: string): string {
  switch (status) {
    case 'interested': return 'Interested';
    case 'applied': return 'Applied';
    case 'under_review': return 'Under Review';
    case 'offer_received': return 'Offer Received';
    case 'rejected': return 'Rejected';
    default: return status;
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'interested': return '#94A3B8';
    case 'applied': return '#3A86FF';
    case 'under_review': return '#FFC107';
    case 'offer_received': return '#06D6A0';
    case 'rejected': return '#118AB2';
    default: return '#94A3B8';
  }
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function extractDeadline(text: string): string | null {
  if (!text) return null;
  const currentYear = new Date().getFullYear();

  // Match DD-MM-YYYY, DD/MM/YYYY, DD.MM.YYYY, DD-MM-YY, etc.
  const dateRegex1 = /\b(\d{1,2})[-/.](\d{1,2})[-/.](\d{2}|\d{4})\b/gi;
  const dateRegex4 = /\b(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})\b/gi;
  // Match Month DD, YYYY or DD Month YYYY
  const dateRegex2 = /\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2}(?:st|nd|rd|th)?(?:,\s+\d{4})?\b/gi;
  const dateRegex3 = /\b\d{1,2}(?:st|nd|rd|th)?\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*(?:\s+\d{4})?\b/gi;

  const dates: { date: string, index: number, str: string }[] = [];

  let match;
  while ((match = dateRegex1.exec(text)) !== null) {
    const day = parseInt(match[1]);
    const month = parseInt(match[2]) - 1;
    let year = parseInt(match[3]);
    if (year < 100) year += 2000;
    const d = new Date(year, month, day);
    if (!isNaN(d.getTime())) dates.push({ date: d.toISOString(), index: match.index, str: match[0] });
  }

  while ((match = dateRegex4.exec(text)) !== null) {
    const year = parseInt(match[1]);
    const month = parseInt(match[2]) - 1;
    const day = parseInt(match[3]);
    const d = new Date(year, month, day);
    if (!isNaN(d.getTime())) dates.push({ date: d.toISOString(), index: match.index, str: match[0] });
  }

  while ((match = dateRegex2.exec(text)) !== null) {
    let dateStr = match[0].replace(/(st|nd|rd|th)/, '');
    if (!/\d{4}/.test(dateStr)) dateStr += ` ${currentYear}`;
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) dates.push({ date: d.toISOString(), index: match.index, str: match[0] });
  }

  while ((match = dateRegex3.exec(text)) !== null) {
    let dateStr = match[0].replace(/(st|nd|rd|th)/, '');
    if (!/\d{4}/.test(dateStr)) dateStr += ` ${currentYear}`;
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) dates.push({ date: d.toISOString(), index: match.index, str: match[0] });
  }

  if (dates.length === 0) return null;

  // NLP Scoring based on proximity to deadline keywords
  // Use a wide 150-char window to catch "Registration Deadline: ...[date]" patterns
  const deadlineKeywords = [
    'deadline', 'last date', 'apply by', 'apply before', 'register by', 
    'registration closes', 'registration deadline', 'submission deadline',
    'on or before', 'closing date', 'last day', 'due date', 'due by',
    'apply on or before', 'last date to apply', 'last date of registration',
    'last date to register', 'applications close', 'entries close',
    'submit by', 'submit before', 'registrations close', 'ends on',
    'before the deadline', 'application deadline', 'final date'
  ];
  const eventKeywords = [
    'from', 'starts on', 'held on', 'conducted on', 'takes place', 
    'session', 'course duration', 'event date', 'starts', 'beginning',
    'commences', 'scheduled on', 'will be held', 'duration',
    'to july', 'to august', 'to september', 'to october', 'to november', 'to december',
    'to january', 'to february', 'to march', 'to april', 'to may', 'to june'
  ];

  let bestDate = dates[0].date;
  let maxScore = -9999;

  for (const d of dates) {
    let score = 0;
    
    // Use a wide 150-char window before and 80 chars after the date
    const start = Math.max(0, d.index - 150);
    const end = Math.min(text.length, d.index + d.str.length + 80);
    const window = text.substring(start, end).toLowerCase();

    for (const kw of deadlineKeywords) {
      if (window.includes(kw)) score += 50;
    }
    for (const kw of eventKeywords) {
      if (window.includes(kw)) score -= 30; // penalize event/camp/course dates
    }

    // Bonus: if an asterisk (*) appears right before the date context, it's likely emphasized as critical
    if (window.includes('*')) score += 10;

    // Tie-break: among equal scores, prefer the earliest future date
    if (score > maxScore || (score === maxScore && new Date(d.date) < new Date(bestDate))) {
      maxScore = score;
      bestDate = d.date;
    }
  }

  return bestDate;
}

export const SKILL_DICTIONARY = [
  // Programming Languages
  'Python', 'Java', 'C++', 'C', 'C#', 'JavaScript', 'TypeScript', 'Go', 'Rust', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'R', 'MATLAB', 'Scala', 'Dart', 'Perl', 'Haskell', 'Lua',
  // Web & Mobile
  'React', 'Node.js', 'Next.js', 'Vue.js', 'Angular', 'HTML', 'CSS', 'Tailwind CSS', 'Bootstrap', 'Android', 'iOS', 'Flutter', 'React Native', 'Svelte', 'Express.js', 'Django', 'Flask', 'Spring Boot', 'Laravel', 'ASP.NET', 'GraphQL', 'REST API', 'WebRTC',
  // Data & AI
  'Machine Learning', 'Artificial Intelligence', 'Data Science', 'SQL', 'NoSQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Cassandra', 'TensorFlow', 'PyTorch', 'Keras', 'Scikit-Learn', 'NLP', 'Computer Vision', 'Deep Learning', 'Generative AI', 'Data Analytics', 'Pandas', 'NumPy', 'Apache Spark', 'Hadoop', 'Kafka', 'Tableau', 'Power BI',
  // Cloud & DevOps
  'AWS', 'Docker', 'Kubernetes', 'Azure', 'GCP', 'Linux', 'Git', 'GitHub', 'GitLab', 'CI/CD', 'Jenkins', 'Terraform', 'Ansible', 'Prometheus', 'Grafana', 'Nginx', 'Apache', 'Serverless',
  // Cybersecurity & Networking
  'Cybersecurity', 'Network Security', 'Penetration Testing', 'Cryptography', 'Ethical Hacking', 'Wireshark', 'TCP/IP',
  // Design & Product
  'Figma', 'UI/UX Design', 'Adobe Photoshop', 'Adobe Illustrator', 'Product Management', 'Wireframing', 'Prototyping',
  // Core & Soft Skills
  'Data Structures', 'Algorithms', 'System Design', 'Object-Oriented Programming', 'Problem Solving', 'Agile', 'Scrum', 'Leadership', 'Communication Skills', 'Project Management'
];

export function extractSkills(text: string): string[] {
  if (!text) return [];
  
  const foundSkills: string[] = [];
  
  for (const skill of SKILL_DICTIONARY) {
    const escapedSkill = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Using strict negative lookarounds to emulate \b but safely handle C++ and C# which end in symbols
    const regex = new RegExp(`(^|[^a-zA-Z0-9_])${escapedSkill}([^a-zA-Z0-9_]|$)`, 'i');
    
    if (regex.test(text)) {
      if (!foundSkills.includes(skill)) foundSkills.push(skill);
    }
  }
  
  // Return top 5 found skills or fallback if none found
  return foundSkills.length > 0 ? foundSkills.slice(0, 5) : ['General Requirements'];
}

export function cleanSubject(subject: string): string {
  if (!subject) return 'Opportunity Details';
  
  // Remove common email prefixes and generic lead-ins
  let cleaned = subject.replace(/^(fwd|fw|re|regarding|about):\s*/gi, '');
  cleaned = cleaned.replace(/^(fwd|fw|re|regarding|about):\s*/gi, ''); // run again in case of "Fwd: Re:"
  
  if (cleaned.toLowerCase().startsWith('regarding ')) {
    cleaned = cleaned.substring(10);
  }
  
  // Clean up extra spaces
  cleaned = cleaned.trim();
  
  // Capitalize first letter if needed
  if (cleaned.length > 0) {
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }
  
  return cleaned || 'Opportunity Details';
}

export function generateTitle(subject: string, body: string, fromName: string): string {
  let cleaned = cleanSubject(subject);
  
  // Identify if the subject is completely generic junk that needs replacing
  const isJunkSubject = cleaned.toLowerCase().includes('internship opportunity') && cleaned.length < 25 ||
                        cleaned === cleaned.toUpperCase() && cleaned.length > 15;
  
  let entity = '';
  const combinedContext = (cleaned + ' ' + (body || '')).toLowerCase();
  
  // 1. Look for known top companies
  const companies = ['Amazon', 'Google', 'Microsoft', 'Atlassian', 'TCS', 'Infosys', 'Wipro', 'Cognizant', 'Accenture', 'IBM', 'Oracle', 'Intel', 'Cisco', 'Goldman Sachs', 'JPMorgan', 'Morgan Stanley', 'Barclays', 'Walmart', 'Target', 'Flipkart', 'Samsung', 'Apple', 'Meta', 'Netflix', 'Tesla', 'Uber', 'Airbnb', 'Nutralipid3', 'DRDO', 'ISRO'];
  
  for (const comp of companies) {
    if (combinedContext.includes(comp.toLowerCase())) {
      entity = comp;
      break;
    }
  }

  // 2. Try to extract from "Greetings from XYZ" or "Welcome to XYZ"
  if (!entity) {
    const bodyRegex = /(?:greetings from|welcome to|hiring at|opportunities at|join|from)\s+([A-Z][a-zA-Z0-9\s&]{2,25}?)(?:\n|\r|\.|,|PRIVATE|LTD|LIMITED|INC|LLC)/i;
    const match = (body || '').match(bodyRegex);
    if (match && match[1]) {
      entity = match[1].trim();
    }
  }
  
  // 3. Look for phrases like "XYZ Internship", "XYZ Hiring"
  if (!entity) {
    const hiringRegex = /([A-Z][a-zA-Z0-9\s&]{2,20}?)\s+(?:Internship|Hiring|Opportunity|Recruitment|Drive|Program)/i;
    const match = combinedContext.match(hiringRegex);
    if (match && match[1]) {
       // Only accept it if it's somewhat capitalized properly in the original text, to avoid matching junk
       const originalMatch = (cleaned + ' ' + (body || '')).substring(match.index || 0, (match.index || 0) + match[0].length);
       if (originalMatch.match(/^[A-Z]/)) {
          entity = match[1].trim();
       }
    }
  }

  // Determine Role
  let role = 'Opportunity';
  const roles = ['Software Engineer', 'SDE', 'Data Scientist', 'Analyst', 'Developer', 'Designer', 'Manager', 'Consultant', 'Research', 'Intern', 'Full Time', 'Part Time', 'Hackathon', 'Workshop', 'Admission'];
  for (const r of roles) {
    if (combinedContext.includes(r.toLowerCase())) {
      role = r;
      if (role.toLowerCase() === 'intern' || role.toLowerCase() === 'full time' || role.toLowerCase() === 'part time' || role.toLowerCase() === 'research') {
        role = role + ' Opportunity';
      }
      break;
    }
  }
  
  // 4. Use extracted entity + role if we found an entity
  if (entity) {
    // Clean up entity (Title Case)
    entity = entity.replace(/^(the|a|an)\s+/i, '');
    entity = entity.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
    return `${entity} — ${role}`;
  }
  
  // 5. If no entity found, but subject has separators like || or | or -
  if (!isJunkSubject) {
    if (cleaned.includes('||')) {
      const parts = cleaned.split('||').map(p => p.trim()).filter(p => p.length > 3);
      if (parts.length > 0) return parts.find(p => !p.toLowerCase().includes('open') && !p.toLowerCase().includes('registration')) || parts[0];
    }
    if (cleaned.includes('|')) {
      const parts = cleaned.split('|').map(p => p.trim()).filter(p => p.length > 3);
      if (parts.length > 0) return parts[0];
    }
    
    // If the subject has substantive information, just use the subject!
    if (cleaned.length > 10) {
      // Truncate cleanly if absurdly long, but 150 chars is fine
      return cleaned.length > 100 ? cleaned.substring(0, 97) + '...' : cleaned;
    }
  }
  
  // 6. Extreme Fallback: grab the sender's actual name if possible
  if (fromName && fromName.length > 2 && !fromName.includes('Group') && !fromName.includes('Campus')) {
    return `${fromName} Opportunity`;
  }

  return `General ${role}`;
}

export function extractEligibility(text: string): string {
  if (!text) return "Not explicitly mentioned in the email.";
  
  const lowerText = text.toLowerCase();
  
  // Look for keywords
  const keywords = [
    'eligibility', 'requirements', 'criteria', 'who can apply', 
    'qualifications', 'prerequisites', 'whom we are looking for', 
    'looking for', 'ideal candidate', 'candidate profile',
    'skills required', 'what you need'
  ];
  let foundIndex = -1;
  let foundKeyword = '';
  
  for (const kw of keywords) {
    const idx = lowerText.indexOf(kw);
    if (idx !== -1) {
      foundIndex = idx;
      foundKeyword = kw;
      break;
    }
  }
  
  if (foundIndex !== -1) {
    let end = text.indexOf('\n\n', foundIndex);
    if (end === -1) end = text.indexOf('\r\n\r\n', foundIndex);
    if (end === -1) end = foundIndex + 400;
    
    let snippet = text.substring(foundIndex, end).trim();
    if (snippet.length > 400) snippet = snippet.substring(0, 400) + '...';
    snippet = snippet.replace(/\s+/g, ' ');
    return snippet;
  }
  
  return "Not explicitly mentioned in the email.";
}

export function extractCategory(subject: string, body: string): string {
  const text = (subject + ' ' + body).toLowerCase();
  
  if (text.match(/\b(hackathon|hack league|hackfest|hack)\b/)) return 'hackathon';
  if (text.match(/\b(scholarship|fellowship)\b/)) return 'scholarship';
  if (text.match(/\b(workshop|seminar|webinar|bootcamp|masterclass)\b/)) return 'workshop';
  if (text.match(/\b(competition|contest|challenge|championship|tournament)\b/)) return 'competition';
  
  if (text.match(/\b(internship|intern|summer trainee)\b/)) return 'internship';
  if (text.match(/\b(research|phd|postdoc)\b/)) return 'research';
  if (text.match(/\b(full time|job|placement|hiring|recruitment|sde)\b/)) return 'job';
  
  if (text.match(/\b(event|conference|symposium|summit|session|talk)\b/)) return 'event';
  
  if (text.match(/\b(exchange|study abroad|program|camp)\b/)) return 'program';
  
  return 'other';
}

export function calculateMatchScore(
  oppSkills: string[], 
  oppCategory: string, 
  userSkills: string[], 
  userInterests: string[], 
  idString: string
): number {
  let score = 0;
  
  // 1. Generate a stable base score between 40 and 55 using the ID string
  let hash = 0;
  for (let i = 0; i < idString.length; i++) {
    hash = idString.charCodeAt(i) + ((hash << 5) - hash);
  }
  const stableRandom = Math.abs(hash) % 16; 
  score += 40 + stableRandom;
  
  // 2. Add category match boost (+15)
  if (userInterests.includes(oppCategory)) {
    score += 15;
  }
  
  // 3. Add skill match boost
  if (oppSkills && oppSkills.length > 0) {
    let matchCount = 0;
    const lowerUserSkills = userSkills.map(s => s.toLowerCase());
    for (const skill of oppSkills) {
      if (lowerUserSkills.includes(skill.toLowerCase())) {
        matchCount++;
      }
    }
    // Boost score based on percentage of skills matched
    score += Math.min(30, (matchCount / oppSkills.length) * 30);
  } else {
    // If no specific skills required, slight generic bump
    score += 10;
  }
  
  // 4. Ensure score is between 40 and 99
  return Math.floor(Math.min(99, Math.max(40, score)));
}

export function extractApplyLink(bodyData: string, snippet: string): string {
  const urlRegex = /(https?:\/\/[^\s"'<>\)]+)/gi;
  let urls = bodyData.match(urlRegex) || [];
  if (urls.length === 0) urls = snippet.match(urlRegex) || [];
  
  if (urls.length === 0) return '#';

  // Filter out junk domains, schemas, image extensions, tracking pixels, and university homepages
  const junkDomains = [
    'w3.org', 'schema.org', 'google.com/schemas', 'googlegroups.com', 'w3c', 
    'fonts.googleapis.com', 'gstatic', 'openxmlformats', 'microsoft.com', 
    '.png', '.jpg', '.jpeg', '.gif', 'vit.ac.in', 'vittbi.com', 'youtube.com', 
    'schemas.microsoft.com', 'twitter.com', 'facebook.com', 'instagram.com', 
    'linkedin.com/company', 't.co', 'zoom.us', 'webex.com'
  ];
  
  // Deduplicate and filter
  const cleanUrls = Array.from(new Set(urls.filter(url => {
    const lower = url.toLowerCase();
    return !junkDomains.some(junk => lower.includes(junk));
  })));
  
  if (cleanUrls.length === 0) return urls[0] || '#';

  // Score each URL based on context and domain
  let bestUrl = cleanUrls[0];
  let highestScore = -1;

  for (const url of cleanUrls) {
    let score = 0;
    const lowerUrl = url.toLowerCase();

    // 1. Domain scoring (Bonus for form/platform providers)
    if (lowerUrl.includes('form') || lowerUrl.includes('typeform') || lowerUrl.includes('zfrmz')) score += 10;
    if (lowerUrl.includes('register') || lowerUrl.includes('apply')) score += 10;
    if (lowerUrl.includes('unstop.com') || lowerUrl.includes('hackerearth.com') || lowerUrl.includes('devfolio.co') || lowerUrl.includes('ycombinator.com/apply')) score += 15;
    
    // 2. Context scoring (Analyze the 60 characters preceding the URL in the email body)
    const idx = bodyData.indexOf(url);
    if (idx !== -1) {
      const contextBefore = bodyData.substring(Math.max(0, idx - 60), idx).toLowerCase();
      
      if (contextBefore.includes('application link') || contextBefore.includes('apply link')) score += 25;
      if (contextBefore.includes('register here') || contextBefore.includes('apply here') || contextBefore.includes('apply at')) score += 20;
      if (contextBefore.includes('registration')) score += 15;
      if (contextBefore.includes('fill')) score += 10; // e.g. "fill this form"
      if (contextBefore.includes('click here')) score += 5;
    }

    if (score > highestScore) {
      highestScore = score;
      bestUrl = url;
    }
  }

  return bestUrl;
}

export function extractEmailBody(payload: any): { plain: string, html: string } {
  let plain = '';
  let html = '';

  if (!payload) return { plain, html };

  if (payload.mimeType === 'text/plain' && payload.body?.data) {
    plain = Buffer.from(payload.body.data, 'base64').toString('utf8');
  } else if (payload.mimeType === 'text/html' && payload.body?.data) {
    html = Buffer.from(payload.body.data, 'base64').toString('utf8');
  }

  if (payload.parts && payload.parts.length > 0) {
    for (const part of payload.parts) {
      const extracted = extractEmailBody(part);
      if (extracted.plain) plain += extracted.plain + '\n';
      if (extracted.html) html += extracted.html + '\n';
    }
  }

  return { plain: plain.trim(), html: html.trim() };
}
