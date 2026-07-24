import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AudioPlayer from '@/components/chapters/AudioPlayer';
import CommentsSection from '@/components/chapters/CommentsSection';
import ReadingTools from '@/components/chapters/ReadingTools';
import { ArrowRight, ArrowLeft, BookOpen, Calendar, Clock } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const chapter = await prisma.chapter.findUnique({ where: { id } });
    if (!chapter) return { title: 'فصل غير موجود' };
    return {
      title: `${chapter.title} — الفصل ${chapter.chapterNum} | عهد ألفا`,
      description: chapter.content.substring(0, 160),
    };
  } catch {
    return { title: 'فصل غير موجود' };
  }
}

export default async function ChapterPage({ params }: PageProps) {
  const { id } = await params;
  
  let chapter;
  let prevChapter;
  let nextChapter;

  try {
    chapter = await prisma.chapter.findUnique({ where: { id } });
    if (!chapter) notFound();

    prevChapter = await prisma.chapter.findFirst({
      where: { chapterNum: { lt: chapter.chapterNum } },
      orderBy: { chapterNum: 'desc' },
      select: { id: true, title: true, chapterNum: true },
    });

    nextChapter = await prisma.chapter.findFirst({
      where: { chapterNum: { gt: chapter.chapterNum } },
      orderBy: { chapterNum: 'asc' },
      select: { id: true, title: true, chapterNum: true },
    });
  } catch {
    notFound();
  }

  if (!chapter) notFound();

  // Estimate reading time
  const wordCount = chapter.content.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);

  return (
    <main className="bg-[#050505] min-h-screen text-gray-300">
      <Navbar />
      <ReadingTools />
      
      {/* Ambient Top Glow */}
      <div className="absolute top-0 left-0 right-0 h-[50vh] bg-gradient-to-b from-[var(--theme-primary)]/10 to-transparent pointer-events-none" />

      <article className="pt-32 pb-20 relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Chapter Header */}
        <header className="text-center mb-12">
          <Link href="/chapters" className="inline-flex items-center gap-2 text-[var(--theme-primary)] mb-8 hover:text-white transition-colors">
            <BookOpen className="w-4 h-4" />
            <span className="text-sm font-bold tracking-widest">العودة للفهرس</span>
          </Link>
          
          <div className="mb-4">
            <span className="inline-block border border-[var(--theme-primary)]/30 text-[var(--theme-primary)] bg-[var(--theme-primary)]/10 px-4 py-1.5 rounded-full text-sm font-bold shadow-[0_0_15px_color-mix(in_srgb,var(--theme-primary)_20%,transparent)]">
              الفصل {chapter.chapterNum}
            </span>
          </div>
          
          <h1 className="font-amiri font-bold text-5xl md:text-6xl lg:text-7xl text-white mb-8 leading-tight drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
            {chapter.title}
          </h1>

          <div className="flex items-center justify-center gap-6 text-sm text-gray-500 font-bold border-y border-white/5 py-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <time dateTime={chapter.createdAt.toISOString()}>{formatDate(chapter.createdAt)}</time>
            </div>
            <div className="w-1 h-1 rounded-full bg-white/20" />
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{readingTime} دقائق قراءة</span>
            </div>
          </div>
        </header>

        {/* Chapter Banner Image */}
        {chapter.imageUrl && (
          <div className="w-full mb-16 relative aspect-[21/9] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent z-10 opacity-60" />
            <img 
              src={chapter.imageUrl} 
              alt={chapter.title} 
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Audio Player if exists */}
        {chapter.audioUrl && (
          <div className="mb-16">
            <AudioPlayer
              audioUrl={chapter.audioUrl}
              title="استمع للفصل مع موسيقى ملحمية"
            />
          </div>
        )}

        <div className="flex justify-center items-center gap-4 mb-12 opacity-70 mt-8">
          <div className="w-32 h-px bg-gradient-to-r from-transparent to-[var(--theme-primary)]" />
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[var(--theme-primary)] animate-pulse">
            <path d="M12 2L15 8L22 9L17 14L18 21L12 17L6 21L7 14L2 9L9 8L12 2Z" fill="currentColor" opacity="0.8"/>
          </svg>
          <div className="w-32 h-px bg-gradient-to-l from-transparent to-[var(--theme-primary)]" />
        </div>

        {/* Chapter Content (Reading Mode) */}
        <div className="prose prose-invert max-w-none text-right relative">
          <div id="chapter-reader-content" className="font-tajawal text-[1.5rem] leading-[2.4] text-gray-300 transition-all duration-300">
            {chapter.content.split('\n').map((paragraph: string, index: number) => {
              if (!paragraph.trim()) return null;
              
              // Apply Drop Cap style to the first word of the first paragraph
              if (index === 0) {
                const firstWord = paragraph.trim().split(' ')[0];
                const restOfParagraph = paragraph.trim().substring(firstWord.length);
                return (
                  <p key={index} className="mb-8 text-justify text-gray-200">
                    <span className="float-right text-6xl md:text-7xl font-amiri font-bold text-[var(--theme-primary)] ml-4 mt-2 mb-2 leading-none drop-shadow-[0_0_15px_rgba(230,74,25,0.4)] border-b-2 border-[var(--theme-primary)]">
                      {firstWord[0]}
                    </span>
                    <span className="font-bold text-white text-2xl">{firstWord.substring(1)}</span>
                    {restOfParagraph}
                  </p>
                );
              }

              return (
                <p key={index} className="mb-8 text-justify">
                  {paragraph}
                </p>
              );
            })}
          </div>
        </div>

        {/* Decorative Divider End */}
        <div className="flex justify-center items-center gap-4 mt-16 mb-8 opacity-30">
          <div className="w-16 h-px bg-gradient-to-r from-transparent to-white" />
          <div className="w-2 h-2 rounded-full bg-white rotate-45" />
          <div className="w-2 h-2 rounded-full bg-[var(--theme-primary)] rotate-45" />
          <div className="w-2 h-2 rounded-full bg-white rotate-45" />
          <div className="w-16 h-px bg-gradient-to-l from-transparent to-white" />
        </div>

        {/* Navigation */}
        <nav className="mt-20 pt-10 border-t border-white/10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {nextChapter ? (
              <Link
                href={`/chapters/${nextChapter.id}`}
                className="flex items-center justify-between p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 hover:border-[var(--theme-primary)]/50 group transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_color-mix(in_srgb,var(--theme-primary)_10%,transparent)]"
              >
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500 font-bold">الفصل التالي</span>
                  <span className="font-cairo font-bold text-lg text-gray-200 group-hover:text-white transition-colors">{nextChapter.title}</span>
                </div>
                <ArrowRight className="w-6 h-6 text-gray-500 group-hover:text-[var(--theme-primary)] transition-colors" />
              </Link>
            ) : <div />}

            {prevChapter ? (
              <Link
                href={`/chapters/${prevChapter.id}`}
                className="flex items-center justify-between p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 hover:border-[var(--theme-primary)]/50 group transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_color-mix(in_srgb,var(--theme-primary)_10%,transparent)]"
              >
                <ArrowLeft className="w-6 h-6 text-gray-500 group-hover:text-[var(--theme-primary)] transition-colors" />
                <div className="flex flex-col gap-1 text-left">
                  <span className="text-xs text-gray-500 font-bold">الفصل السابق</span>
                  <span className="font-cairo font-bold text-lg text-gray-200 group-hover:text-white transition-colors">{prevChapter.title}</span>
                </div>
              </Link>
            ) : <div />}
          </div>
        </nav>

        {/* Comments Section */}
        <CommentsSection chapterId={chapter.id} />

      </article>
      <Footer />
    </main>
  );
}
