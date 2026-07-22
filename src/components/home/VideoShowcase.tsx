import prisma from '@/lib/prisma';
import SectionTitle from '@/components/ui/SectionTitle';
import VideoCard from '@/components/videos/VideoCard';
import GlowButton from '@/components/ui/GlowButton';
import { Film } from 'lucide-react';

export default async function VideoShowcase() {
  let videos: any[] = [];

  try {
    videos = await prisma.videoMedia.findMany({
      orderBy: { createdAt: 'desc' },
      take: 3,
    });
  } catch (error) {
    videos = [];
  }

  return (
    <section className="py-20 px-4 bg-abyss-light/30">
      <div className="max-w-7xl mx-auto">
        <SectionTitle
          title="السجلات المرئية"
          subtitle="شاهد الفيديوهات الترويجية والموسيقى الملحمية"
          accent="blue"
        />

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
          <div className="text-center py-16 stone-card rounded-xl">
            <Film className="w-12 h-12 text-stone-light mx-auto mb-4" />
            <p className="text-stone-light text-lg">لا توجد فيديوهات بعد</p>
          </div>
        )}

        <div className="text-center mt-12">
          <GlowButton href="/videos" variant="ghost" size="md">
            عرض جميع الفيديوهات
          </GlowButton>
        </div>
      </div>
    </section>
  );
}
