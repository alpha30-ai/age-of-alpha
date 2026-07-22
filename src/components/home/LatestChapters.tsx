import prisma from '@/lib/prisma';
import SectionTitle from '@/components/ui/SectionTitle';
import ChapterCard from '@/components/chapters/ChapterCard';
import GlowButton from '@/components/ui/GlowButton';
import { BookOpen } from 'lucide-react';

export default async function LatestChapters() {
  let chapters: any[] = [];
  
  try {
    chapters = await prisma.chapter.findMany({
      orderBy: { chapterNum: 'desc' },
      take: 3,
    });
  } catch (error) {
    // Database not available - show placeholder
    chapters = [];
  }

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <SectionTitle
          title="أحدث الفصول"
          subtitle="تابع أحدث فصول الملحمة المظلمة"
          accent="magma"
        />

        {chapters.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {chapters.map((chapter) => (
              <ChapterCard
                key={chapter.id}
                id={chapter.id}
                chapterNum={chapter.chapterNum}
                title={chapter.title}
                content={chapter.content}
                createdAt={chapter.createdAt}
                audioUrl={chapter.audioUrl}
                imageUrl={chapter.imageUrl}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 stone-card rounded-xl">
            <BookOpen className="w-12 h-12 text-stone-light mx-auto mb-4" />
            <p className="text-stone-light text-lg">لم تُنشر أي فصول بعد</p>
            <p className="text-stone-light/60 text-sm mt-2">تأكد من اتصال قاعدة البيانات وتشغيل البيانات التجريبية</p>
          </div>
        )}

        <div className="text-center mt-12">
          <GlowButton href="/chapters" variant="ghost" size="md">
            عرض جميع الفصول
          </GlowButton>
        </div>
      </div>
    </section>
  );
}
