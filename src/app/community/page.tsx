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

  if (!novelId) {
    return (
      <main className="bg-[#050505] overflow-x-hidden min-h-screen relative flex flex-col">
          <Navbar />
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="text-center bg-[#111] p-10 rounded-3xl border border-white/10 max-w-lg">
              <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-6" />
              <h2 className="text-2xl font-bold font-cairo text-white mb-4">يجب اختيار رواية أولاً</h2>
              <p className="text-gray-400 mb-8 font-tajawal">لكي تتمكن من الدخول إلى مجتمع القراء، يجب عليك اختيار الرواية التي ترغب في مناقشتها.</p>
              <Link href="/novels" className="bg-[var(--theme-primary)] text-white px-8 py-3 rounded-xl font-bold hover:bg-[var(--theme-primary)]/80 transition-colors shadow-[0_0_15px_var(--theme-primary)]/30 hover:shadow-[0_0_25px_var(--theme-primary)]/50">
                تصفح الروايات
              </Link>
            </div>
          </div>
          <Footer />
        </main>
    );
  }

  let novel = null;
  let theme = null;

  try {
    const [fetchedNovel, fetchedTheme] = await Promise.all([
      prisma.novel.findUnique({ where: { id: novelId } }),
      prisma.siteTheme.findUnique({ where: { id: "default" } })
    ]);
    novel = fetchedNovel;
    theme = fetchedTheme;
  } catch (error) {
    console.error(error);
  }

  if (!novel) {
    return (
      <main className="bg-[#050505] overflow-x-hidden min-h-screen relative flex flex-col">
          <Navbar />
          <div className="flex-1 flex items-center justify-center p-4 text-white">الرواية غير موجودة.</div>
          <Footer />
        </main>
    );
  }

  const bgImage = novel.coverImage || theme?.bannerImageUrl || 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=2000&auto=format&fit=crop';

  return (
    <main className="bg-[#050505] overflow-x-hidden w-full max-w-[100vw] min-h-screen relative flex flex-col">
        <Navbar />
        
        <PageBanner 
          title={`مجتمع ${novel.title}`}
          subtitle="مساحة حرة لنقاش النظريات، تبادل الآراء، ومشاركة حب الرواية."
          icon={<Users className="w-8 h-8 text-[var(--theme-primary)]" />}
          backgroundImage={bgImage}
        />

        <div className="pb-20 px-4 flex-1 relative w-full">
          {/* Ambient background glows */}
          <div className="absolute top-0 left-1/4 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-[var(--theme-primary)]/10 rounded-full blur-[150px] pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-[var(--theme-secondary)]/10 rounded-full blur-[150px] pointer-events-none" />
          
          <div className="max-w-4xl mx-auto relative z-10 w-full mt-[-40px]">
            <CommunityClient novel={novel} user={session?.user} />
          </div>
        </div>
        <Footer />
      </main>
  );
}
