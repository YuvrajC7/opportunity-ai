"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// Get current user ID from session
async function getUserId() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;
  
  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });
  
  return user?.id || null;
}

// Fetch all opportunities from DB, merged with the user's bookmark status
export async function getOpportunities() {
  const userId = await getUserId();
  if (!userId) return [];
  
  const opps = await prisma.opportunity.findMany({
    where: { userId },
    orderBy: { dateScanned: 'desc' },
    include: {
      bookmarks: {
        where: { userId }
      }
    }
  });

  // Map to frontend Email interface
  return opps.map(opp => {
    const bookmark = userId && (opp as any).bookmarks?.[0];
    
    return {
      emailData: {
        id: opp.sourceEmailId,
        threadId: opp.threadId || opp.sourceEmailId,
        subject: opp.title,
        from: opp.company,
        snippet: opp.snippet || '',
        date: opp.date || '',
        applyLink: opp.applyLink || '',
        deadline: opp.deadline || '',
        category: opp.category || 'other',
        skillsRequired: opp.skillsRequired || [],
        stipend: opp.stipend || ''
      },
      bookmarkStatus: bookmark?.status || null,
      applicationStatus: bookmark?.applicationStatus || null
    };
  });
}

// Toggle or set a bookmark status
export async function toggleBookmark(opportunityId: string, status: 'SAVED' | 'APPLIED' | 'DISCARDED') {
  const userId = await getUserId();
  if (!userId) throw new Error("Unauthorized");

  // opportunityId from frontend is actually sourceEmailId
  const opp = await prisma.opportunity.findUnique({
    where: { sourceEmailId: opportunityId }
  });

  if (!opp || opp.userId !== userId) throw new Error("Opportunity not found");

  // Check if bookmark exists
  const existing = await prisma.bookmark.findUnique({
    where: {
      userId_opportunityId: {
        userId,
        opportunityId: opp.id
      }
    }
  });

  if (existing && existing.status === status) {
    // Toggle off
    await prisma.bookmark.delete({
      where: { id: existing.id }
    });
    return null;
  } else {
    // Upsert
    const bookmark = await prisma.bookmark.upsert({
      where: {
        userId_opportunityId: {
          userId,
          opportunityId: opp.id
        }
      },
      update: { status },
      create: {
        userId,
        opportunityId: opp.id,
        status
      }
    });
    return bookmark.status;
  }
}

export async function updateApplicationStatus(opportunityId: string, applicationStatus: 'interested' | 'applied' | 'under_review' | 'offer_received' | 'rejected' | 'none') {
  const userId = await getUserId();
  if (!userId) throw new Error("Unauthorized");

  const opp = await prisma.opportunity.findUnique({
    where: { sourceEmailId: opportunityId }
  });

  if (!opp || opp.userId !== userId) throw new Error("Opportunity not found");

  const appStatus = applicationStatus === 'none' ? null : applicationStatus;
  
  await prisma.bookmark.upsert({
    where: {
      userId_opportunityId: {
        userId,
        opportunityId: opp.id
      }
    },
    update: { applicationStatus: appStatus },
    create: {
      userId,
      opportunityId: opp.id,
      status: "SAVED",
      applicationStatus: appStatus
    }
  });
}
