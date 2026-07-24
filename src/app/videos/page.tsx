import type { Metadata } from 'next';
import prisma from '@/lib/prisma';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PageBanner from '@/components/ui/PageBanner';
import VideosClient from './VideosClient';
import { Film } from 'lucide-react';

export const metadata: Metadata = {
  title: 'السجلات المرئية | عهد ألفا: ملحمة الدول المائة',
  description: 'شاهد الفيديوهات الترويجية والموسيقى الملحمية لرواية عهد ألفا.',
};

export default async function VideosPage({ searchParams }: { searchParams: { q?: string } }) {
  let videos: any[] = [];
  let theme: any = null;
  const query = searchParams?.q || '';

  try {
    const [fetchedVideos, fetchedTheme] = await Promise.all([
      prisma.videoMedia.findMany({
        where: query ? {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } }
          ]
        } : undefined,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.siteTheme.findUnique({
        where: { id: "default" }
      })
    ]);
    videos = fetchedVideos;
    theme = fetchedTheme;
  } catch (error) {
    videos = [];
  }

  const bgImage = theme?.bannerImageUrl || 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=2000&auto=format&fit=crop';

  return (
    <main className="bg-[#050505] overflow-x-hidden w-full max-w-[100vw] min-h-screen relative flex flex-col">
      <Navbar />
      
      <PageBanner 
        title="السجلات المرئية"
        subtitle="شاهد فيديوهات وملخصات عهد ألفا وتعرف على عالم الرواية"
        icon={<Film className="w-8 h-8 text-blue-400" />}
        backgroundImage={bgImage}
        themeColor="blue"
      />

      <div className="pb-20 px-4 flex-1 relative w-full">
        <div className="absolute top-0 left-1/4 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-blue-900/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-cyan-900/10 rounded-full blur-[150px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10 w-full">
          <VideosClient initialVideos={videos} initialQuery={query} />
        </div>
      </div>
      <Footer />
    </main>
  );
}
