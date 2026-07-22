import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    redirect("/login");
  }

  // We can fetch recent chapters or reading history here if we had a relation
  const recentChapters = await prisma.chapter.findMany({
    take: 3,
    orderBy: { chapterNum: 'asc' },
    select: { id: true, title: true, chapterNum: true }
  });

  return (
    <DashboardClient 
      user={{
        name: user.name || "بطل مجهول",
        email: user.email || "",
        image: user.image || null,
        role: user.role,
        createdAt: user.createdAt,
        savedChapterId: user.savedChapterId
      }}
      recentChapters={recentChapters}
    />
  );
}
