import type { Metadata } from 'next';
import prisma from '@/lib/prisma';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PageBanner from '@/components/ui/PageBanner';
import CommunityClient from './CommunityClient';
import { Users, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'مجتمع الرواية | عهد ألفا',
  description: 'شارك نظرياتك وتوقعاتك مع محبي الرواية.',
};

export const dynamic = 'force-dynamic';

export default async function CommunityPage({ searchParams }: { searchParams: { novelId?: string } }) {
  const novelId = searchParams?.novelId;
  const session = await getServerSession(authOptions);

  let novel = null;
  let theme = null;
  let allNovels = [];

  try {
    const promises: Promise<any>[] = [
      prisma.siteTheme.findUnique({ where: { id: "default" } }),
      prisma.novel.findMany({ select: { id: true, title: true } })
    ];
    if (novelId) {
      promises.push(prisma.novel.findUnique({ where: { id: novelId } }));
    }
    
    const results = await Promise.all(promises);
    theme = results[0];
    allNovels = results[1];
    if (novelId) {
      novel = results[2];
    }
  } catch (error) {
    console.error(error);
  }

  if (novelId && !novel) {
    return (
      <main className="bg-[#050505] overflow-x-hidden min-h-screen relative flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4 text-white">الرواية غير موجودة.</div>
        <Footer />
      </main>
    );
  }

  const bgImage = novel?.coverImage || theme?.bannerImageUrl || 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=2000&auto=format&fit=crop';
  const pageTitle = novel ? `مجتمع ${novel.title}` : 'مجتمع القراء';
  const pageSubtitle = novel ? "مساحة حرة لنقاش النظريات، تبادل الآراء، ومشاركة حب الرواية." : "الساحة العامة لجميع نقاشات ومراجعات روايات عهد ألفا.";

  // We pass a dummy novel object with id empty string if no novel selected, 
  // so CommunityClient can fetch all posts. But CommunityClient expects a full Novel object.
  // We can pass undefined or null, let's update CommunityClient.tsx.
  // Wait, let's just pass `novel` and change CommunityClient to accept `novel: Novel | null`.
  
  return (
    <main className="bg-[#050505] overflow-x-hidden w-full max-w-[100vw] min-h-screen relative flex flex-col">
      <Navbar />
      
      <PageBanner 
        title={pageTitle}
        subtitle={pageSubtitle}
        icon={<Users className="w-8 h-8 text-[var(--color-magma)]" />}
        backgroundImage={bgImage}
      />

      <div className="pb-20 px-4 flex-1 relative w-full">
        {/* Ambient background glows */}
        <div className="absolute top-0 left-1/4 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-[var(--color-magma)]/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-[var(--color-milky-blue)]/10 rounded-full blur-[150px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto relative z-10 w-full mt-[-40px]">
          <CommunityClient novel={novel} user={session?.user} novels={allNovels} />
        </div>
      </div>
      <Footer />
    </main>
  );
}
