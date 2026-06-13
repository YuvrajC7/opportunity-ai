'use server';

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getUserNotifications() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return [];

  return await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: 50
  });
}

export async function createNotification(data: {
  title: string;
  message: string;
  type: string;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return;

  await prisma.notification.create({
    data: {
      ...data,
      userId: session.user.id
    }
  });
  
  revalidatePath('/', 'layout');
}

export async function clearAllNotifications() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return;

  await prisma.notification.deleteMany({
    where: { userId: session.user.id }
  });

  revalidatePath('/', 'layout');
}

export async function markNotificationRead(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return;

  await prisma.notification.update({
    where: { id },
    data: { read: true }
  });

  revalidatePath('/', 'layout');
}
