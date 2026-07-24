import type { Metadata } from 'next';
import prisma from '@/lib/prisma';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PageBanner from '@/components/ui/PageBanner';
import ChapterCard from '@/components/chapters/ChapterCard';
import SearchInput from '@/components/ui/SearchInput';
import { BookOpen } from 'lucide-react';

export const metadata: Metadata = {
  title: 'الفصول | عهد ألفا: ملحمة الدول المائة',
  description: 'اقرأ جميع فصول رواية عهد ألفا: ملحمة الدول المائة.',
};

export const dynamic = 'force-dynamic';

export default async function ChaptersPage({ searchParams }: { searchParams: { q?: string } }) {
  let chapters: any[] = [];
  let theme: any = null;
  const query = searchParams?.q || '';

  try {
    const [fetchedChapters, fetchedTheme] = await Promise.all([
      prisma.chapter.findMany({
        where: query ? {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { content: { contains: query, mode: 'insensitive' } },
            ...(isNaN(Number(query)) ? [] : [{ chapterNum: Number(query) }])
          ]
        } : undefined,
        orderBy: { chapterNum: 'asc' },
      }),
      prisma.siteTheme.findUnique({
        where: { id: "default" }
      })
    ]);
    chapters = fetchedChapters;
    theme = fetchedTheme;
  } catch (error) {
    chapters = [];
  }

  const bgImage = theme?.bannerImageUrl || 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=2000&auto=format&fit=crop';

  return (
    <main className="bg-[#050505]">
      <Navbar />
      
      <PageBanner 
        title="مخطوطات الملحمة"
        subtitle="اقرأ فصول عهد ألفا بالترتيب وانغمس في صراع الدول المائة"
        icon={<BookOpen className="w-8 h-8 text-[var(--theme-primary)]" />}
        backgroundImage={bgImage}
      />

      <div className="pb-20 px-4 min-h-screen relative">
        {/* Ambient background glows */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[var(--theme-primary)]/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[150px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          
          <div className="relative group mb-12">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--theme-primary)]/20 to-transparent blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            <SearchInput placeholder="ابحث عن مخطوطة باسمها أو رقمها..." />
          </div>

          {chapters.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
            <div className="text-center py-24 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl">
              <BookOpen className="w-16 h-16 text-gray-500 mx-auto mb-6" />
              <p className="text-white text-xl font-bold font-cairo">
                {query ? "لم يتم العثور على أي مخطوطات تطابق بحثك" : "لم تُنشر أي مخطوطات بعد"}
              </p>
              {!query && <p className="text-gray-400 mt-3">تأكد من اتصال قاعدة البيانات وتشغيل البيانات التجريبية</p>}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}
