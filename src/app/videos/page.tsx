import type { Metadata } from 'next';
import prisma from '@/lib/prisma';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PageBanner from '@/components/ui/PageBanner';
import VideosClient from './VideosClient';
import { Video } from 'lucide-react';

export const metadata: Metadata = {
  title: 'المرئيات | عهد ألفا: ملحمة الدول المائة',
  description: 'شاهد الفيديوهات الترويجية والموسيقى الملحمية لرواية عهد ألفا.',
};

export default async function VideosPage({ searchParams }: { searchParams: { q?: string; novelId?: string } }) {
  let videos: any[] = [];
  let novels: any[] = [];
  let theme: any = null;
  const query = searchParams?.q || '';
  const novelId = searchParams?.novelId || undefined;

  try {
    const [fetchedVideos, fetchedTheme, fetchedNovels] = await Promise.all([
      prisma.videoMedia.findMany({
        where: {
          ...(novelId && novelId !== 'all' ? { novelId } : {}),
          ...(query ? {
            OR: [
              { title: { contains: query, mode: 'insensitive' } },
              { description: { contains: query, mode: 'insensitive' } }
            ]
          } : {})
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.siteTheme.findUnique({
        where: { id: "default" }
      }),
      prisma.novel.findMany({
        orderBy: { createdAt: 'desc' }
      })
    ]);
    videos = fetchedVideos;
    theme = fetchedTheme;
    novels = fetchedNovels;
  } catch (error) {
    videos = [];
    novels = [];
  }

  const bgImage = theme?.bannerImageUrl || 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2000&auto=format&fit=crop';

  return (
    <main className="bg-[#050505] overflow-x-hidden min-h-screen relative flex flex-col">
        <Navbar />
        
        <PageBanner 
          title="المرئيات"
          subtitle="مكتبة الفيديو والموسيقى الملحمية"
          icon={<Video className="w-8 h-8 text-[var(--color-magma)]" />}
          backgroundImage={bgImage}
        />

        <div className="pb-20 px-4 flex-1 relative">
          <div className="absolute top-0 left-1/4 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-blue-900/10 rounded-full blur-[150px] pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-cyan-900/10 rounded-full blur-[150px] pointer-events-none" />
          
          <div className="max-w-7xl mx-auto relative z-10">
            <VideosClient initialVideos={videos} initialQuery={query} initialNovelId={novelId} novels={novels} />
          </div>
        </div>
        <Footer />
      </main>
  );
}
