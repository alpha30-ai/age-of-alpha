'use client';

import Link from 'next/link';
import { BookOpen, Calendar, Music } from 'lucide-react';
import { formatDate, truncateText } from '@/lib/utils';

interface ChapterCardProps {
  id: string;
  chapterNum: number;
  title: string;
  content: string;
  createdAt: Date;
  audioUrl?: string | null;
  imageUrl?: string | null;
}

export default function ChapterCard({ id, chapterNum, title, content, createdAt, audioUrl, imageUrl }: ChapterCardProps) {
  return (
    <Link href={`/chapters/${id}`} className="block group">
      <div className="relative w-full bg-[#0a0a0a] rounded-2xl overflow-hidden border border-white/10 group-hover:border-[var(--theme-primary)]/50 shadow-lg group-hover:shadow-[0_10px_30px_-10px_color-mix(in_srgb,var(--theme-primary)_30%,transparent)] transition-all duration-500 hover:-translate-y-2 flex flex-col">
        
        {/* Top Image Section (16:9 ratio) */}
        <div className="relative w-full aspect-video bg-[#111] overflow-hidden border-b border-white/5">
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
            style={{ 
              backgroundImage: imageUrl ? `url(${imageUrl})` : 'none',
            }}
          >
            {/* Fallback pattern if no image */}
            {!imageUrl && (
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />
            )}
          </div>

          {/* Gradient Overlay for Top Badges */}
          <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/80 to-transparent z-10" />
          
          {/* Top Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-start justify-between z-20">
            <span className="bg-black/60 backdrop-blur-md border border-white/10 text-[var(--theme-primary)] px-3 py-1 rounded-lg text-sm font-bold shadow-md">
              الفصل {chapterNum}
            </span>
            {audioUrl && (
              <span className="bg-blue-500/20 backdrop-blur-md text-blue-300 border border-blue-500/30 px-2 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md">
                <Music className="w-3 h-3" /> مسموع
              </span>
            )}
          </div>
        </div>

        {/* Bottom Content Section */}
        <div className="p-5 flex-1 flex flex-col justify-between bg-gradient-to-b from-[#0a0a0a] to-[#050505] relative z-20">
          <div>
            <h3 className="font-cairo font-bold text-xl md:text-2xl text-gray-100 group-hover:text-[var(--theme-primary)] transition-colors duration-300 mb-2 leading-tight">
              {title}
            </h3>

            <p className="text-gray-400 text-sm md:text-base leading-relaxed line-clamp-2 mb-4 group-hover:text-gray-200 transition-colors duration-300">
              {truncateText(content, 120)}
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 mt-auto border-t border-white/10 group-hover:border-[var(--theme-primary)]/30 transition-colors duration-300">
            <div className="flex items-center gap-2 text-gray-500 text-xs font-bold">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(createdAt)}</span>
            </div>
            
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[var(--theme-primary)]/20 transition-colors duration-300">
              <BookOpen className="w-4 h-4 text-gray-500 group-hover:text-[var(--theme-primary)] transition-colors" />
            </div>
          </div>
        </div>
        
      </div>
    </Link>
  );
}
