import type { Metadata } from 'next';
import prisma from "@/lib/prisma";
import CharactersClient from "./CharactersClient";
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PageBanner from '@/components/ui/PageBanner';
import { Users } from 'lucide-react';

export const metadata: Metadata = {
  title: "الشخصيات | عهد ألفا",
  description: "استعرض شخصيات ملحمة الدول المائة",
};

export default async function CharactersPage({ searchParams }: { searchParams: Promise<{ q?: string; novelId?: string }> }) {
  const resolvedParams = await searchParams;
  const query = resolvedParams?.q || '';
  const novelId = resolvedParams?.novelId || undefined;
  
  let characters: any[] = [];
  let novels: any[] = [];
  let theme: any = null;

  try {
    const [fetchedCharacters, fetchedTheme, fetchedNovels] = await Promise.all([
      prisma.character.findMany({
        where: {
          ...(novelId && novelId !== 'all' ? { novelId } : {}),
          ...(query ? {
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { description: { contains: query, mode: 'insensitive' } },
              { faction: { contains: query, mode: 'insensitive' } },
            ]
          } : {})
        },
        orderBy: [
          { sortOrder: 'asc' },
          { createdAt: 'desc' }
        ]
      }),
      prisma.siteTheme.findUnique({
        where: { id: "default" }
      }),
      prisma.novel.findMany({
        orderBy: { createdAt: 'desc' }
      })
    ]);
    characters = fetchedCharacters;
    theme = fetchedTheme;
    novels = fetchedNovels;
  } catch (error) {
    characters = [];
    novels = [];
  }

  const bgImage = theme?.bannerImageUrl || 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=2000&auto=format&fit=crop';

  return (
    <main className="bg-[#050505] overflow-x-hidden min-h-screen relative flex flex-col">
        <Navbar />
        
        <PageBanner 
          title="شخصيات الملحمة"
          subtitle="تعرف على أبطال وأشرار عهد ألفا وتاريخهم"
          icon={<Users className="w-8 h-8 text-[var(--color-magma)]" />}
          backgroundImage={bgImage}
        />

        <div className="pb-20 px-4 flex-1 relative">
          <div className="absolute top-0 left-1/4 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-purple-900/10 rounded-full blur-[150px] pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-red-900/10 rounded-full blur-[150px] pointer-events-none" />
          
          <div className="max-w-7xl mx-auto relative z-10">
            <CharactersClient characters={characters} initialQuery={query} initialNovelId={novelId} novels={novels} />
          </div>
        </div>
        <Footer />
      </main>
  );
}
