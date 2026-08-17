import prisma from '@/lib/prisma';
import Link from 'next/link';
import { BookOpen, Users, Sparkles, Search } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PageBanner from '@/components/ui/PageBanner';


export const dynamic = 'force-dynamic';

export default async function PublicNovelsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const resolvedParams = await searchParams;
  const query = resolvedParams?.q || '';
  
  const novels = await prisma.novel.findMany({
    where: {
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ]
    },
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { chapters: true, characters: true }
      }
    }
  });

  return (
    <main className="min-h-screen bg-[#050505] flex flex-col relative z-0">
        <Navbar />
        
        <div className="flex-1 pt-32 pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <PageBanner 
              title="مكتبة العوالم"
              subtitle="اكتشف عوالمنا الملحمية، اقرأ الفصول، وتعرف على الشخصيات، أو تحدث مع الذكاء الاصطناعي الخاص بكل رواية."
              icon={<BookOpen className="w-8 h-8 text-[var(--theme-primary)]" />}
              backgroundImage="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2000&auto=format&fit=crop"
            />

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-16 animate-slide-up" style={{ animationDelay: '100ms' }}>
              <form className="relative flex items-center group">
                <input 
                  type="text" 
                  name="q"
                  defaultValue={query}
                  placeholder="ابحث عن رواية أو عالم..." 
                  className="w-full bg-[#111]/80 backdrop-blur-sm border border-white/10 rounded-2xl px-6 py-4 pr-14 text-white focus:outline-none focus:border-[var(--theme-primary)]/50 transition-all shadow-lg group-hover:border-white/20 font-tajawal text-lg"
                />
                <button type="submit" className="absolute right-4 text-gray-400 hover:text-[var(--theme-primary)] transition-colors">
                  <Search className="w-6 h-6" />
                </button>
              </form>
            </div>

            {novels.length === 0 ? (
              <div className="text-center py-20 animate-fade-in">
                <div className="w-24 h-24 bg-[#111] rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5">
                  <Search className="w-10 h-10 text-gray-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 font-cairo">لم يتم العثور على نتائج</h3>
                <p className="text-gray-400">جرب البحث بكلمات مختلفة أو تصفح المكتبة بالكامل.</p>
                <Link href="/novels" className="inline-block mt-6 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-white font-bold transition-colors border border-white/10">
                  عرض كل الروايات
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {novels.map((novel, idx) => (
                  <div key={novel.id} className="stone-card rounded-3xl overflow-hidden group hover:-translate-y-2 transition-all duration-300 animate-slide-up shadow-2xl" style={{ animationDelay: `${(idx % 3) * 100}ms` }}>
                    <div className="relative h-72 overflow-hidden">
                      {novel.coverImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={novel.coverImage} alt={novel.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] flex items-center justify-center">
                          <BookOpen className="w-20 h-20 text-gray-600 opacity-30 group-hover:scale-110 transition-transform duration-700" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90 group-hover:opacity-80 transition-opacity duration-500"></div>
                      <div className="absolute bottom-6 left-6 right-6">
                        <h2 className="text-2xl font-bold font-cairo text-white text-shadow-lg mb-1">{novel.title}</h2>
                        {novel.author && <p className="text-sm text-[var(--color-magma)] font-bold">{novel.author}</p>}
                      </div>
                    </div>

                    <div className="p-6 relative bg-[#0a0a0a]/50 backdrop-blur-sm h-full">
                      <p className="text-gray-400 line-clamp-3 mb-6 text-sm leading-relaxed font-tajawal">
                        {novel.description}
                      </p>

                      <div className="flex items-center justify-between text-xs text-gray-500 font-bold mb-6 border-y border-white/5 py-4">
                        <div className="flex items-center gap-1.5"><BookOpen className="w-4 h-4 text-[var(--theme-primary)]" /> {novel._count.chapters} فصول</div>
                        <div className="flex items-center gap-1.5"><Users className="w-4 h-4 text-[var(--theme-secondary)]" /> {novel._count.characters} شخصيات</div>
                      </div>

                        <div className="flex flex-col gap-3">
                          <div className="grid grid-cols-2 gap-3">
                            <Link href={`/chapters?novelId=${novel.id}`} className="w-full text-center py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold transition-colors border border-white/5 hover:border-white/20 shadow-sm font-cairo text-sm">
                              الفصول
                            </Link>
                            <Link href={`/community?novelId=${novel.id}`} className="w-full text-center py-3 rounded-xl bg-[var(--theme-secondary)]/10 hover:bg-[var(--theme-secondary)]/20 border border-[var(--theme-secondary)]/30 text-[var(--theme-secondary)] hover:text-white font-bold transition-colors shadow-[0_0_15px_var(--theme-secondary)]/10 font-cairo text-sm flex items-center justify-center gap-1.5">
                              <Users className="w-4 h-4" /> مجتمع القراء
                            </Link>
                          </div>
                          <Link href={`/chat?novelId=${novel.id}`} className="w-full text-center py-3 rounded-xl bg-[var(--theme-primary)]/10 hover:bg-[var(--theme-primary)] border border-[var(--theme-primary)]/30 hover:border-[var(--theme-primary)] text-[var(--theme-primary)] hover:text-white font-bold transition-all flex items-center justify-center gap-2 font-cairo group/btn shadow-[0_0_15px_var(--theme-primary)]/10 hover:shadow-[0_0_25px_var(--theme-primary)]/40 text-sm">
                            <Sparkles className="w-5 h-5 group-hover/btn:animate-spin" /> محادثة الذكاء الاصطناعي
                          </Link>
                        </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <Footer />
      </main>
  );
}
