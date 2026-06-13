function extractDeadline(text) {
  if (!text) return null;
  const currentYear = new Date().getFullYear();

  // Match DD-MM-YYYY, DD/MM/YYYY, DD.MM.YYYY, DD-MM-YY, YYYY-MM-DD
  const dateRegex1 = /\b(\d{1,2})[-/.](\d{1,2})[-/.](\d{2}|\d{4})\b/gi;
  const dateRegex4 = /\b(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})\b/gi;
  // Match Month DD, YYYY or DD Month YYYY
  const dateRegex2 = /\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2}(?:st|nd|rd|th)?(?:,\s+\d{4})?\b/gi;
  const dateRegex3 = /\b\d{1,2}(?:st|nd|rd|th)?\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*(?:\s+\d{4})?\b/gi;

  const dates = [];

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
  const deadlineKeywords = ['deadline', 'last date', 'apply by', 'apply before', 'register by', 'registration closes', 'on or before', 'closing date'];
  const eventKeywords = ['from', 'starts on', 'held on', 'conducted on', 'takes place', 'session', 'camp dates'];

  let bestDate = dates[0].date;
  let maxScore = -9999;

  for (const d of dates) {
    let score = 0;
    
    // Check text around the date (50 chars before and after)
    const start = Math.max(0, d.index - 60);
    const end = Math.min(text.length, d.index + d.str.length + 60);
    const window = text.substring(start, end).toLowerCase();

    for (const kw of deadlineKeywords) {
      if (window.includes(kw)) score += 50;
    }
    for (const kw of eventKeywords) {
      if (window.includes(kw)) score -= 30; // penalize event dates
    }

    if (score > maxScore) {
      maxScore = score;
      bestDate = d.date;
    }
  }

  return bestDate;
}

const email = `The summer camp will be held from 6 Jul 2026 to 20 Jul 2026. 
Important Deadlines:
Application Deadline: June 14, 2026
Register your interest on or before 10th June, 2026.`;

console.log(extractDeadline(email));
