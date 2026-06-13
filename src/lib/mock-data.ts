import { Opportunity, Application, User, AnalyticsData, Notification } from './types';

export const mockOpportunities: Opportunity[] = [];
export const mockApplications: Application[] = [];
export const mockAnalytics: AnalyticsData = {
  totalOpportunities: 127,
  totalApplications: 23,
  bookmarkedCount: 34,
  deadlinesMet: 19,
  deadlinesMissed: 4,
  monthlyTrend: [
    { month: 'Jan', count: 12 },
    { month: 'Feb', count: 18 },
    { month: 'Mar', count: 22 },
    { month: 'Apr', count: 28 },
    { month: 'May', count: 31 },
    { month: 'Jun', count: 16 },
  ],
  categoryBreakdown: [
    { category: 'Internship', count: 38, color: '#7C3AED' },
    { category: 'Hackathon', count: 27, color: '#F72585' },
    { category: 'Scholarship', count: 15, color: '#06D6A0' },
    { category: 'Research', count: 18, color: '#4CC9F0' },
    { category: 'Workshop', count: 12, color: '#FFC107' },
    { category: 'Competition', count: 9, color: '#FF6B35' },
    { category: 'Job', count: 5, color: '#3A86FF' },
    { category: 'Event', count: 3, color: '#9B5DE5' },
  ],
  matchScoreDistribution: [
    { range: '0-20', count: 3 },
    { range: '21-40', count: 8 },
    { range: '41-60', count: 18 },
    { range: '61-80', count: 42 },
    { range: '81-100', count: 56 },
  ],
  applicationFunnel: [
    { stage: 'Discovered', count: 127 },
    { stage: 'Bookmarked', count: 34 },
    { stage: 'Applied', count: 23 },
    { stage: 'Under Review', count: 8 },
    { stage: 'Offer Received', count: 3 },
  ],
  skillGaps: [
    { skill: 'System Design', frequency: 34 },
    { skill: 'Cloud Computing (AWS/GCP)', frequency: 28 },
    { skill: 'Data Structures & Algorithms', frequency: 26 },
    { skill: 'DevOps / CI-CD', frequency: 19 },
    { skill: 'Communication & Presentation', frequency: 15 },
  ],
  upcomingDeadlines: [
    { date: '2026-06-12', title: 'Google Summer of Code 2026', category: 'internship' },
    { date: '2026-06-16', title: 'Adobe GenSolve Hackathon', category: 'hackathon' },
    { date: '2026-06-18', title: 'Smart India Hackathon 2026', category: 'hackathon' },
    { date: '2026-06-19', title: 'Amazon ML Summer School', category: 'workshop' },
    { date: '2026-06-20', title: 'AWS Cloud Workshop', category: 'workshop' },
    { date: '2026-06-22', title: 'TechFest IIT Bombay', category: 'event' },
    { date: '2026-06-25', title: 'Google SDE Intern', category: 'internship' },
  ],
};
