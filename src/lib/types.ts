export type OpportunityCategory =
  | 'internship'
  | 'hackathon'
  | 'scholarship'
  | 'research'
  | 'workshop'
  | 'competition'
  | 'job'
  | 'event'
  | 'program'
  | 'other';

export type ApplicationStatus =
  | 'interested'
  | 'applied'
  | 'under_review'
  | 'offer_received'
  | 'rejected';

export type NotificationType =
  | 'deadline_reminder'
  | 'new_opportunity'
  | 'digest'
  | 'system';

export type UrgencyLevel = 'low' | 'medium' | 'high' | 'critical';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  university: string;
  yearOfStudy: number;
  department: string;
  skills: string[];
  interests: OpportunityCategory[];
  createdAt: string;
  isPremium: boolean;
}

export interface Opportunity {
  id: string;
  title: string;
  organisation: string;
  category: OpportunityCategory;
  deadline: string;
  deadlineConfidence: number;
  applicationLink: string;
  summary: string;
  matchScore: number;
  skillsRequired: string[];
  stipendValue?: string;
  eligibilityText: string;
  logoUrl?: string;
  location?: string;
  isBookmarked: boolean;
  applicationStatus?: ApplicationStatus;
  createdAt: string;
  urgency: UrgencyLevel;
  threadId?: string;
  bodyData?: string;
}

export interface Application {
  id: string;
  opportunityId: string;
  opportunity: Opportunity;
  status: ApplicationStatus;
  appliedAt?: string;
  notes: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  opportunityId?: string;
  isRead: boolean;
  createdAt: string;
}

export interface AnalyticsData {
  totalOpportunities: number;
  totalApplications: number;
  bookmarkedCount: number;
  deadlinesMet: number;
  deadlinesMissed: number;
  monthlyTrend: { month: string; count: number }[];
  categoryBreakdown: { category: string; count: number; color: string }[];
  matchScoreDistribution: { range: string; count: number }[];
  applicationFunnel: { stage: string; count: number }[];
  skillGaps: { skill: string; frequency: number }[];
  upcomingDeadlines: { date: string; title: string; category: OpportunityCategory }[];
}

export const CATEGORY_CONFIG: Record<OpportunityCategory, { label: string; color: string; bgColor: string; icon: string }> = {
  internship: { label: 'Internship', color: '#7C3AED', bgColor: 'rgba(124,58,237,0.15)', icon: 'Briefcase' },
  hackathon: { label: 'Hackathon', color: '#F72585', bgColor: 'rgba(247,37,133,0.15)', icon: 'Code' },
  scholarship: { label: 'Scholarship', color: '#06D6A0', bgColor: 'rgba(6,214,160,0.15)', icon: 'GraduationCap' },
  research: { label: 'Research', color: '#4CC9F0', bgColor: 'rgba(76,201,240,0.15)', icon: 'Microscope' },
  workshop: { label: 'Workshop', color: '#FFC107', bgColor: 'rgba(255,193,7,0.15)', icon: 'Wrench' },
  competition: { label: 'Competition', color: '#FF6B35', bgColor: 'rgba(255,107,53,0.15)', icon: 'Trophy' },
  job: { label: 'Job', color: '#3A86FF', bgColor: 'rgba(58,134,255,0.15)', icon: 'Building2' },
  event: { label: 'Event', color: '#9B5DE5', bgColor: 'rgba(155,93,229,0.15)', icon: 'Calendar' },
  program: { label: 'Program', color: '#E85D04', bgColor: 'rgba(232,93,4,0.15)', icon: 'Globe' },
  other: { label: 'Other', color: '#94A3B8', bgColor: 'rgba(148,163,184,0.15)', icon: 'Sparkles' },
};
