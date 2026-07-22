import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ArrowRight, ArrowLeft, Film, Calendar, Clapperboard } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const video = await prisma.videoMedia.findUnique({ where: { id } });
    if (!video) return { title: 'سجل غير موجود' };
    return {
      title: `${video.title} | السجلات المرئية | عهد ألفا`,
      description: video.description?.substring(0, 160) || 'شاهد هذا السجل المرئي من ملحمة عهد ألفا.',
    };
  } catch {
    return { title: 'سجل غير موجود' };
  }
}

export default async function VideoPage({ params }: PageProps) {
  const { id } = await params;
  
  let video;
  let prevVideo;
  let nextVideo;

  try {
    video = await prisma.videoMedia.findUnique({ where: { id } });
    if (!video) notFound();

    prevVideo = await prisma.videoMedia.findFirst({
      where: { createdAt: { lt: video.createdAt } },
      orderBy: { createdAt: 'desc' },
      select: { id: true, title: true },
    });

    nextVideo = await prisma.videoMedia.findFirst({
      where: { createdAt: { gt: video.createdAt } },
      orderBy: { createdAt: 'asc' },
      select: { id: true, title: true },
    });
  } catch {
    notFound();
  }

  if (!video) notFound();

  // Extract YouTube embed URL if applicable
  const getEmbedUrl = (url: string) => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/,
      /youtube\.com\/embed\/([\w-]+)/,
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return `https://www.youtube.com/embed/${match[1]}?rel=0`;
    }
    return null;
  };

  const embedUrl = getEmbedUrl(video.videoUrl);

  return (
    <main className="bg-[#050505] min-h-screen text-gray-300">
      <Navbar />
      
      {/* Ambient Top Glow */}
      <div className="absolute top-0 left-0 right-0 h-[50vh] bg-gradient-to-b from-[var(--theme-primary)]/10 to-transparent pointer-events-none" />

      <article className="pt-32 pb-20 relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <header className="text-center mb-12 max-w-4xl mx-auto">
          <Link href="/videos" className="inline-flex items-center gap-2 text-[var(--theme-primary)] mb-8 hover:text-white transition-colors">
            <Film className="w-4 h-4" />
            <span className="text-sm font-bold tracking-widest">فهرس السجلات</span>
          </Link>
          
          <h1 className="font-amiri font-bold text-4xl md:text-5xl lg:text-6xl text-white mb-6 leading-tight drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
            {video.title}
          </h1>

          <div className="flex items-center justify-center gap-6 text-sm text-gray-500 font-bold border-y border-white/5 py-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <time dateTime={video.createdAt.toISOString()}>{formatDate(video.createdAt)}</time>
            </div>
            <div className="w-1 h-1 rounded-full bg-white/20" />
            <div className="flex items-center gap-2 text-[var(--theme-primary)]">
              <Clapperboard className="w-4 h-4" />
              <span>سجل مرئي</span>
            </div>
          </div>
        </header>

        {/* Video Player (Cinematic View) */}
        <div className="w-full mb-16 group relative">
          {/* Decorative cinematic bars */}
          <div className="absolute -top-4 -bottom-4 -left-4 -right-4 bg-gradient-to-r from-[var(--theme-primary)]/20 via-transparent to-[var(--theme-primary)]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl -z-10 rounded-full" />
          
          <div className="relative w-full aspect-video bg-[#0a0a0a] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
            {embedUrl ? (
              <iframe
                src={embedUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={video.title}
              />
            ) : (
              <video 
                src={video.videoUrl} 
                controls 
                className="w-full h-full object-contain bg-black" 
                poster={video.thumbnail || undefined}
              />
            )}
          </div>
        </div>

        {/* Details and Script */}
        <div className="max-w-4xl mx-auto">
          {video.description && (
            <div className="prose prose-invert max-w-none text-right bg-[#0a0a0a] border border-white/5 p-8 md:p-12 rounded-3xl">
              <h3 className="font-cairo font-bold text-2xl text-white mb-8 flex items-center gap-3">
                <Film className="w-6 h-6 text-[var(--theme-primary)]" />
                تفاصيل السجل
              </h3>
              <div className="font-tajawal text-xl leading-[2.2] text-gray-300">
                {video.description.split('\n').map((paragraph: string, index: number) => (
                  paragraph.trim() && (
                    <p key={index} className="mb-6 text-justify">
                      {paragraph}
                    </p>
                  )
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="mt-16 pt-10 border-t border-white/10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {nextVideo ? (
                <Link
                  href={`/videos/${nextVideo.id}`}
                  className="flex items-center justify-between p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 hover:border-[var(--theme-primary)]/50 group transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_color-mix(in_srgb,var(--theme-primary)_10%,transparent)]"
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-gray-500 font-bold">السجل التالي</span>
                    <span className="font-cairo font-bold text-lg text-gray-200 group-hover:text-white transition-colors">{nextVideo.title}</span>
                  </div>
                  <ArrowRight className="w-6 h-6 text-gray-500 group-hover:text-[var(--theme-primary)] transition-colors" />
                </Link>
              ) : <div />}

              {prevVideo ? (
                <Link
                  href={`/videos/${prevVideo.id}`}
                  className="flex items-center justify-between p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 hover:border-[var(--theme-primary)]/50 group transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_color-mix(in_srgb,var(--theme-primary)_10%,transparent)]"
                >
                  <ArrowLeft className="w-6 h-6 text-gray-500 group-hover:text-[var(--theme-primary)] transition-colors" />
                  <div className="flex flex-col gap-1 text-left">
                    <span className="text-xs text-gray-500 font-bold">السجل السابق</span>
                    <span className="font-cairo font-bold text-lg text-gray-200 group-hover:text-white transition-colors">{prevVideo.title}</span>
                  </div>
                </Link>
              ) : <div />}
            </div>
          </nav>
        </div>
      </article>
      <Footer />
    </main>
  );
}
