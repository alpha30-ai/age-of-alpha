import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ArrowRight, Shield, Zap, Brain, Users } from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const character = await prisma.character.findUnique({ where: { id } });
    if (!character) return { title: 'شخصية غير موجودة' };
    return {
      title: `${character.name} | أبطال الملحمة`,
      description: character.description.substring(0, 160),
    };
  } catch {
    return { title: 'شخصية غير موجودة' };
  }
}

export default async function CharacterDetailsPage({ params }: PageProps) {
  const { id } = await params;
  
  let character;

  try {
    character = await prisma.character.findUnique({ where: { id } });
  } catch {
    notFound();
  }

  if (!character) notFound();

  return (
    <main className="bg-[#050505] min-h-screen text-gray-300">
      <Navbar />
      
      {/* Ambient Top Glow */}
      <div className="absolute top-0 left-0 right-0 h-[60vh] pointer-events-none z-0">
        <div 
          className="absolute inset-0 opacity-20 blur-[100px] bg-cover bg-center"
          style={{ backgroundImage: character.imageUrl ? `url(${character.imageUrl})` : 'none' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/80 to-[#050505]" />
      </div>

      <article className="pt-32 pb-20 relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation */}
        <Link href="/characters" className="inline-flex items-center gap-2 text-[var(--theme-primary)] hover:text-white transition-colors mb-10 bg-[var(--theme-primary)]/10 px-4 py-2 rounded-xl border border-[var(--theme-primary)]/30 backdrop-blur-md">
          <ArrowRight className="w-5 h-5" />
          <span className="font-bold">العودة لسجل الأبطال</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Right Column: Image */}
          <div className="lg:col-span-5 relative">
            <div className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.8)] group bg-[#111]">
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700"
                style={{ backgroundImage: character.imageUrl ? `url(${character.imageUrl})` : 'none' }}
              >
                {!character.imageUrl && (
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-60" />
              
              {character.faction && (
                <div className="absolute top-6 right-6 z-20">
                  <span className="bg-black/80 backdrop-blur-md border border-white/10 text-[var(--theme-primary)] px-4 py-2 rounded-xl text-sm font-bold shadow-xl flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    {character.faction}
                  </span>
                </div>
              )}
            </div>
            
            {/* Stats Under Image */}
            <div className="mt-8 bg-white/5 border border-white/10 backdrop-blur-xl p-6 rounded-3xl">
              <h3 className="text-xl font-bold text-white mb-6 font-cairo">القدرات والإحصائيات</h3>
              <div className="space-y-6">
                <StatBar icon={<Shield className="w-5 h-5 text-blue-400" />} label="القوة الجسدية" value={character.strength} colorClass="bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.6)]" />
                <StatBar icon={<Zap className="w-5 h-5 text-[var(--theme-primary)]" />} label="الطاقة السحرية" value={character.magic} colorClass="bg-[var(--theme-primary)] shadow-[0_0_12px_color-mix(in_srgb,var(--theme-primary)_60%,transparent)]" />
                <StatBar icon={<Brain className="w-5 h-5 text-purple-400" />} label="الذكاء والدهاء" value={character.intelligence} colorClass="bg-purple-500 shadow-[0_0_12px_rgba(168,85,247,0.6)]" />
              </div>
            </div>
          </div>

          {/* Left Column: Details */}
          <div className="lg:col-span-7 pt-4">
            {character.title && (
              <h2 className="text-[var(--theme-primary)] font-bold text-xl md:text-2xl mb-2 tracking-wide font-cairo drop-shadow-[0_0_10px_color-mix(in_srgb,var(--theme-primary)_30%,transparent)]">
                {character.title}
              </h2>
            )}
            <h1 className="font-amiri font-bold text-5xl md:text-7xl text-white mb-8 leading-tight drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
              {character.name}
            </h1>
            
            <div className="w-24 h-1 bg-gradient-to-l from-[var(--theme-primary)] to-transparent mb-10 rounded-full" />

            <div className="prose prose-invert max-w-none text-right">
              <div className="font-tajawal text-xl leading-[2.4] text-gray-300">
                {character.description.split('\n').map((paragraph: string, index: number) => (
                  paragraph.trim() && (
                    <p key={index} className="mb-6 text-justify">
                      {paragraph}
                    </p>
                  )
                ))}
              </div>
            </div>
          </div>

        </div>
      </article>
      <Footer />
    </main>
  );
}

function StatBar({ icon, label, value, colorClass }: { icon: React.ReactNode; label: string; value: number; colorClass: string }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-bold text-gray-300">{label}</span>
        </div>
        <span className="font-bold text-white text-lg">{value}/100</span>
      </div>
      <div className="h-3 bg-gray-800 rounded-full overflow-hidden border border-white/5">
        <div 
          className={`h-full ${colorClass}`}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
    </div>
  );
}
