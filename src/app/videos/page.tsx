import type { Metadata } from 'next';
import prisma from '@/lib/prisma';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PageBanner from '@/components/ui/PageBanner';
import VideosClient from './VideosClient';

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
    <main className="bg-[#050505]">
      <Navbar />
      
      <PageBanner 
        title="السجلات المرئية"
        subtitle="فيديوهات ترويجية وموسيقى ملحمية تجسد روح الملحمة"
        icon={<Film className="w-8 h-8 text-[var(--theme-primary)]" />}
        backgroundImage={bgImage}
      />

      <div className="pb-20 px-4 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <VideosClient initialVideos={videos} initialQuery={query} />
        </div>
      </div>
      <Footer />
    </main>
  );
}
