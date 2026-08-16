import prisma from '@/lib/prisma';
import Link from 'next/link';
import { BookOpen, Users, Sparkles } from 'lucide-react';

export const revalidate = 60; // revalidate every minute

export default async function PublicNovelsPage() {
  const novels = await prisma.novel.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { chapters: true, characters: true }
      }
    }
  });

  return (
    <main className="min-h-screen bg-[#050505] pt-32 pb-24 relative z-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16 animate-slide-up">
          <h1 className="text-4xl md:text-5xl font-bold font-cairo text-white mb-4">
            مكتبة الروايات
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            اكتشف عوالمنا الملحمية، اقرأ الفصول، وتعرف على الشخصيات، أو تحدث مع الذكاء الاصطناعي الخاص بكل رواية.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {novels.map((novel, idx) => (
            <div key={novel.id} className="stone-card rounded-3xl overflow-hidden group hover:-translate-y-2 transition-all duration-300 animate-slide-up" style={{ animationDelay: `${idx * 100}ms` }}>
              <div className="relative h-64 overflow-hidden">
                {novel.coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={novel.coverImage} alt={novel.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] flex items-center justify-center">
                    <BookOpen className="w-20 h-20 text-gray-600 opacity-30 group-hover:scale-110 transition-transform duration-700" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h2 className="text-2xl font-bold font-cairo text-white text-shadow-lg">{novel.title}</h2>
                  <p className="text-sm text-magma font-bold">{novel.author}</p>
                </div>
              </div>

              <div className="p-6">
                <p className="text-gray-400 line-clamp-3 mb-6 text-sm leading-relaxed">
                  {novel.description}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-500 font-bold mb-6">
                  <div className="flex items-center gap-1"><BookOpen className="w-4 h-4 text-magma" /> {novel._count.chapters} فصول</div>
                  <div className="flex items-center gap-1"><Users className="w-4 h-4 text-milky-blue" /> {novel._count.characters} شخصيات</div>
                </div>

                <div className="flex flex-col gap-3">
                  <Link href={`/chapters`} className="w-full text-center py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold transition-colors">
                    تصفح الفصول
                  </Link>
                  <Link href={`/chat`} className="w-full text-center py-3 rounded-xl bg-magma/10 hover:bg-magma border border-magma/30 hover:border-magma text-magma hover:text-white font-bold transition-all flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4" /> محادثة الذكاء الاصطناعي
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}
