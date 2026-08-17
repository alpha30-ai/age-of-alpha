import type { Metadata } from 'next';
import prisma from '@/lib/prisma';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PageBanner from '@/components/ui/PageBanner';
import ChaptersClient from './ChaptersClient';
import { BookOpen } from 'lucide-react';


export const metadata: Metadata = {
  title: 'الفصول | عهد ألفا: ملحمة الدول المائة',
  description: 'اقرأ جميع فصول رواية عهد ألفا: ملحمة الدول المائة.',
};

export const dynamic = 'force-dynamic';

export default async function ChaptersPage({ searchParams }: { searchParams: { q?: string; novelId?: string } }) {
  let chapters: any[] = [];
  let theme: any = null;
  const query = searchParams?.q || '';
  const novelId = searchParams?.novelId || undefined;

  try {
    const [fetchedChapters, fetchedTheme] = await Promise.all([
      prisma.chapter.findMany({
        where: {
          ...(novelId ? { novelId } : {}),
          ...(query ? {
            OR: [
              { title: { contains: query, mode: 'insensitive' } },
              { content: { contains: query, mode: 'insensitive' } },
              ...(isNaN(Number(query)) ? [] : [{ chapterNum: Number(query) }])
            ]
          } : {})
        },
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
    <main className="bg-[#050505] overflow-x-hidden w-full max-w-[100vw] min-h-screen relative flex flex-col">
        <Navbar />
        
        <PageBanner 
          title="مخطوطات الملحمة"
          subtitle="اقرأ فصول عهد ألفا بالترتيب وانغمس في صراع الدول المائة"
          icon={<BookOpen className="w-8 h-8 text-[var(--color-magma)]" />}
          backgroundImage={bgImage}
        />

        <div className="pb-20 px-4 flex-1 relative w-full">
          {/* Ambient background glows */}
          <div className="absolute top-0 left-1/4 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-[var(--color-magma)]/10 rounded-full blur-[150px] pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-blue-900/10 rounded-full blur-[150px] pointer-events-none" />
          
          <div className="max-w-7xl mx-auto relative z-10 w-full">
            <ChaptersClient initialChapters={chapters} initialQuery={query} novelId={novelId} />
          </div>
        </div>
        <Footer />
      </main>
  );
}
