import prisma from "@/lib/prisma";
import ChaptersAdminClient from "./ChaptersAdminClient";

export default async function AdminChaptersPage() {
  const chapters = await prisma.chapter.findMany({
    orderBy: { chapterNum: 'asc' }
  });
  
  const novels = await prisma.novel.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return <ChaptersAdminClient initialChapters={chapters} novels={novels} />;
}
