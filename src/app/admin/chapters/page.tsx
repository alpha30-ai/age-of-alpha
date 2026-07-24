import prisma from "@/lib/prisma";
import ChaptersAdminClient from "./ChaptersAdminClient";

export default async function AdminChaptersPage() {
  const chapters = await prisma.chapter.findMany({
    orderBy: { chapterNum: 'asc' }
  });

  return <ChaptersAdminClient initialChapters={chapters} />;
}
