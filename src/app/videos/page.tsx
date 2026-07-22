import type { Metadata } from 'next';
import prisma from '@/lib/prisma';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PageBanner from '@/components/ui/PageBanner';
import VideoCard from '@/components/videos/VideoCard';
import { Film } from 'lucide-react';

export const metadata: Metadata = {
  title: 'السجلات المرئية | عهد ألفا: ملحمة الدول المائة',
  description: 'شاهد الفيديوهات الترويجية والموسيقى الملحمية لرواية عهد ألفا.',
};

export default async function VideosPage() {
  let videos: any[] = [];
  let theme: any = null;

  try {
    const [fetchedVideos, fetchedTheme] = await Promise.all([
      prisma.videoMedia.findMany({
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
          {videos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <VideoCard
                  key={video.id}
                  id={video.id}
                  title={video.title}
                  description={video.description}
                  videoUrl={video.videoUrl}
                  thumbnail={video.thumbnail}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl">
              <Film className="w-16 h-16 text-gray-500 mx-auto mb-6" />
              <p className="text-white text-xl font-bold font-cairo">لا توجد سجلات مرئية بعد</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}
