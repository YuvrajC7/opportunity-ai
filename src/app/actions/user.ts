'use server';

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateUserSkills(skills: string[]) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Not authenticated");

  await prisma.user.update({
    where: { email: session.user.email },
    data: { skills }
  });

  revalidatePath('/dashboard');
  revalidatePath('/settings');
}

export async function completeOnboarding(data: {
  university: string;
  department: string;
  yearOfStudy: number;
  graduationYear: number;
  skills: string[];
  interests: string[];
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Not authenticated");

  await prisma.user.update({
    where: { email: session.user.email },
    data: {
      ...data,
      onboarded: true
    }
  });

  revalidatePath('/dashboard');
}

export async function recordLoginTimestamp() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return;

  await prisma.user.update({
    where: { email: session.user.email },
    data: { lastLoginAt: new Date() }
  });
}
