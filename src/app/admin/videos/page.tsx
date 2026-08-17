import prisma from "@/lib/prisma";
import VideosAdminClient from "./VideosAdminClient";

export default async function AdminVideosPage() {
  const videos = await prisma.videoMedia.findMany({
    orderBy: { createdAt: 'desc' }
  });
  
  const novels = await prisma.novel.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return <VideosAdminClient initialVideos={videos} novels={novels} />;
}
