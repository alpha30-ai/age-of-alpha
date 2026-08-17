import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { BookOpen, Users, Video, Sparkles, MessageCircle, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const novel = await prisma.novel.findUnique({
    where: { id: params.id },
  });

  if (!novel) return { title: 'رواية غير موجودة' };

  return {
    title: `${novel.title} | عهد ألفا`,
    description: novel.description || `اقرأ وتصفح تفاصيل رواية ${novel.title}`,
  };
}

export default async function NovelDetailsPage({ params }: { params: { id: string } }) {
  const novel = await prisma.novel.findUnique({
    where: { id: params.id },
    include: {
      chapters: {
        orderBy: { chapterNum: 'asc' },
        take: 5 // preview 5 chapters
      },
      characters: {
        orderBy: { sortOrder: 'asc' },
        take: 4 // preview 4 characters
      },
      videos: {
        orderBy: { createdAt: 'desc' },
        take: 3 // preview 3 videos
      },
      _count: {
        select: { chapters: true, characters: true, videos: true }
      }
    }
  });

  if (!novel) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#050505] flex flex-col relative z-0" dir="rtl">
      <Navbar />
      
      {/* Hero Banner */}
      <div className="relative w-full min-h-[60vh] flex items-end pb-16 pt-32 px-4">
        <div className="absolute inset-0">
          {novel.coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={novel.coverImage} alt={novel.title} className="w-full h-full object-cover opacity-30" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#1a1a1a] to-[#050505]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-transparent opacity-80" />
        </div>
        
        <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col md:flex-row gap-8 items-end">
          {novel.coverImage && (
            <div className="w-48 h-72 md:w-64 md:h-96 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.8)] border border-white/10 shrink-0 hidden md:block animate-slide-up">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={novel.coverImage} alt={novel.title} className="w-full h-full object-cover" />
            </div>
          )}
          
          <div className="flex-1 animate-fade-in" style={{ animationDelay: '200ms' }}>
            <Link href="/novels" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 group">
              <ArrowRight className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-tajawal text-sm font-bold">العودة للمكتبة</span>
            </Link>
            
            <h1 className="text-4xl md:text-6xl font-bold font-cairo text-white mb-4 drop-shadow-xl">{novel.title}</h1>
            {novel.author && (
              <p className="text-xl text-[var(--theme-primary)] font-bold mb-6 font-tajawal drop-shadow-md">بواسطة: {novel.author}</p>
            )}
            <p className="text-gray-300 font-tajawal text-lg md:text-xl leading-relaxed max-w-3xl mb-8 drop-shadow-sm">
              {novel.description}
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link href={`/chapters?novelId=${novel.id}`} className="px-8 py-4 rounded-xl bg-[var(--theme-primary)] hover:bg-[var(--theme-primary-dark)] text-white font-bold transition-all shadow-[0_0_20px_var(--theme-primary)]/30 hover:shadow-[0_0_30px_var(--theme-primary)]/50 font-cairo flex items-center gap-2">
                <BookOpen className="w-5 h-5" /> بدء القراءة
              </Link>
              <Link href={`/chat?novelId=${novel.id}`} className="px-8 py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold transition-all font-cairo flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" /> التحدث مع الرواية
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 pb-24 px-4 relative">
        <div className="max-w-7xl mx-auto space-y-20">
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative z-10 -mt-10">
            {[
              { icon: BookOpen, label: 'الفصول', count: novel._count.chapters, link: `/chapters?novelId=${novel.id}`, color: 'text-blue-400', bg: 'bg-blue-400/10' },
              { icon: Users, label: 'الشخصيات', count: novel._count.characters, link: `/characters?novelId=${novel.id}`, color: 'text-orange-400', bg: 'bg-orange-400/10' },
              { icon: Video, label: 'السجلات', count: novel._count.videos, link: `/videos?novelId=${novel.id}`, color: 'text-purple-400', bg: 'bg-purple-400/10' },
              { icon: MessageCircle, label: 'المجتمع', count: '∞', link: `/community?novelId=${novel.id}`, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
            ].map((stat, idx) => (
              <Link key={idx} href={stat.link} className="bg-[#111] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:-translate-y-1 transition-all hover:border-white/10 hover:bg-[#151515] shadow-xl">
                <div className={`p-3 rounded-full ${stat.bg} mb-4`}>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                <h3 className="text-3xl font-bold text-white font-cairo mb-1">{stat.count}</h3>
                <p className="text-gray-400 font-tajawal">{stat.label}</p>
              </Link>
            ))}
          </div>

          {/* Chapters Preview */}
          {novel.chapters.length > 0 && (
            <section className="animate-slide-up" style={{ animationDelay: '100ms' }}>
              <div className="flex justify-between items-end mb-8">
                <h2 className="text-3xl font-bold font-cairo text-white flex items-center gap-3">
                  <BookOpen className="text-[var(--theme-primary)]" />
                  أحدث الفصول
                </h2>
                <Link href={`/chapters?novelId=${novel.id}`} className="text-sm font-bold text-gray-400 hover:text-[var(--theme-primary)] transition-colors flex items-center gap-1">
                  عرض الكل <ArrowRight className="w-4 h-4 rotate-180" />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {novel.chapters.map(chapter => (
                  <Link key={chapter.id} href={`/chapters/${chapter.id}`} className="bg-[#111] border border-white/5 rounded-2xl p-6 hover:-translate-y-1 transition-all hover:border-[var(--theme-primary)]/30 group">
                    <span className="text-sm text-[var(--theme-primary)] font-bold mb-2 block">الفصل {chapter.chapterNum}</span>
                    <h3 className="text-xl font-bold text-white font-cairo mb-4 group-hover:text-[var(--theme-primary)] transition-colors">{chapter.title}</h3>
                    <p className="text-gray-400 text-sm font-tajawal line-clamp-2">{chapter.content.substring(0, 100)}...</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Characters Preview */}
          {novel.characters.length > 0 && (
            <section className="animate-slide-up" style={{ animationDelay: '200ms' }}>
              <div className="flex justify-between items-end mb-8">
                <h2 className="text-3xl font-bold font-cairo text-white flex items-center gap-3">
                  <Users className="text-[var(--theme-secondary)]" />
                  الشخصيات الرئيسية
                </h2>
                <Link href={`/characters?novelId=${novel.id}`} className="text-sm font-bold text-gray-400 hover:text-[var(--theme-secondary)] transition-colors flex items-center gap-1">
                  عرض الكل <ArrowRight className="w-4 h-4 rotate-180" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {novel.characters.map(character => (
                  <Link key={character.id} href={`/characters/${character.id}`} className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden hover:-translate-y-1 transition-all hover:border-[var(--theme-secondary)]/30 group">
                    <div className="h-48 relative overflow-hidden bg-black/50">
                      {character.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={character.imageUrl} alt={character.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Users className="w-12 h-12 text-gray-700" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#111] to-transparent" />
                    </div>
                    <div className="p-5 relative -mt-10">
                      <h3 className="text-xl font-bold text-white font-cairo mb-1">{character.name}</h3>
                      {character.faction && <p className="text-sm text-[var(--theme-secondary)] font-bold">{character.faction}</p>}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

        </div>
      </div>
      
      <Footer />
    </main>
  );
}
