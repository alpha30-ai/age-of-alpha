import type { Metadata } from 'next';
import prisma from "@/lib/prisma";
import CharactersClient from "./CharactersClient";
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PageBanner from '@/components/ui/PageBanner';
import { Users } from 'lucide-react';

export const metadata: Metadata = {
  title: "الشخصيات | عهد ألفا: ملحمة الدول المائة",
  description: "استعرض شخصيات ملحمة الدول المائة",
};

export default async function CharactersPage() {
  let characters: any[] = [];
  let theme: any = null;

  try {
    const [fetchedCharacters, fetchedTheme] = await Promise.all([
      prisma.character.findMany({
        orderBy: [
          { sortOrder: 'asc' },
          { createdAt: 'desc' }
        ]
      }),
      prisma.siteTheme.findUnique({
        where: { id: "default" }
      })
    ]);
    characters = fetchedCharacters;
    theme = fetchedTheme;
  } catch (error) {
    characters = [];
  }

  const bgImage = theme?.bannerImageUrl || 'https://images.unsplash.com/photo-1542451313056-b7c8e626645f?q=80&w=2000&auto=format&fit=crop';

  return (
    <main className="bg-[#050505]">
      <Navbar />
      
      <PageBanner 
        title="أبطال الملحمة"
        subtitle="تعرف على أبرز الشخصيات في عالم الدول المائة، حيث تتصادم الإرادات وتُنسج مصائر الأمم بالدم والحديد والسحر."
        icon={<Users className="w-8 h-8 text-[var(--theme-primary)]" />}
        backgroundImage={bgImage}
      />

      <div className="pb-20 px-4 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <CharactersClient characters={characters} />
        </div>
      </div>
      <Footer />
    </main>
  );
}
