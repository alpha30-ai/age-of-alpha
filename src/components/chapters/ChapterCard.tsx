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
  isList?: boolean;
}

export default function ChapterCard({ id, chapterNum, title, content, createdAt, audioUrl, imageUrl, isList = false }: ChapterCardProps) {
  return (
    <Link href={`/chapters/${id}`} className="block h-full group">
      <div className={`relative bg-stone-dark rounded-3xl overflow-hidden border border-silver-ash/10 shadow-2xl transition-all duration-500 hover:border-[var(--theme-primary)] hover:shadow-[0_0_30px_color-mix(in_srgb,var(--theme-primary)_30%,transparent)] ${isList ? 'flex flex-col sm:flex-row' : 'flex flex-col h-full'}`}>
        
        {/* Image Section */}
        <div className={`relative bg-stone overflow-hidden ${isList ? 'sm:w-64 sm:aspect-square flex-shrink-0' : 'w-full aspect-video border-b border-silver-ash/5'}`}>
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img 
              src={imageUrl.includes('res.cloudinary.com') ? imageUrl.replace('/upload/', '/upload/c_fill,w_600,q_auto,f_auto,fl_progressive/') : imageUrl} 
              alt={title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />
          )}

          {/* Gradient Overlay for Top Badges */}
          <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/80 to-transparent z-10" />
          
          {/* Top Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-start justify-between z-20">
            <span className="bg-black/60 backdrop-blur-md border border-silver-ash/10 text-[var(--theme-primary)] px-3 py-1 rounded-lg text-sm font-bold shadow-md">
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
        <div className="p-5 flex-1 flex flex-col justify-between bg-gradient-to-b from-[#0a0a0a] to-abyss relative z-20">
          <div>
            <h3 className="font-cairo font-bold text-xl md:text-2xl text-gray-100 group-hover:text-[var(--theme-primary)] transition-colors duration-300 mb-2 leading-tight line-clamp-2">
              {title}
            </h3>

            <p className="text-gray-400 text-sm md:text-base leading-relaxed line-clamp-2 mb-4 group-hover:text-gray-200 transition-colors duration-300">
              {truncateText(content, 120)}
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 mt-auto border-t border-silver-ash/10 group-hover:border-[var(--theme-primary)]/30 transition-colors duration-300">
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
