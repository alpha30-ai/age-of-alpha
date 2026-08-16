import { PrismaClient } from "@prisma/client";
import CommunityAdminClient from "./CommunityAdminClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export default async function AdminCommunityPage() {
  const session = await getServerSession(authOptions);
  
  const posts = await prisma.communityPost.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { name: true, email: true, image: true } },
      novel: { select: { title: true } }
    }
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 font-cairo">مجتمع القراء</h1>
        <p className="text-gray-400 font-tajawal">مراقبة وإدارة منشورات الفانز والمحبين في جميع الروايات.</p>
      </div>

      <CommunityAdminClient initialPosts={posts} currentUser={session?.user} />
    </div>
  );
}
