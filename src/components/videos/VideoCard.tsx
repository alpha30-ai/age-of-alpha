'use client';

import Link from 'next/link';
import { Play } from 'lucide-react';
import { motion } from 'framer-motion';

interface VideoCardProps {
  id: string;
  title: string;
  description?: string | null;
  videoUrl: string;
  thumbnail?: string | null;
}

export default function VideoCard({ id, title, description, thumbnail }: VideoCardProps) {
  return (
    <Link href={`/videos/${id}`} className="block group">
      <div className="relative w-full bg-[#0a0a0a] rounded-2xl overflow-hidden border border-white/10 group-hover:border-[var(--theme-primary)]/50 shadow-lg group-hover:shadow-[0_10px_30px_-10px_color-mix(in_srgb,var(--theme-primary)_30%,transparent)] transition-all duration-500 hover:-translate-y-2 flex flex-col">
        
        {/* Top Video Thumbnail Section (16:9 ratio) */}
        <div className="relative w-full aspect-video bg-[#111] overflow-hidden border-b border-white/5">
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
            style={{ 
              backgroundImage: thumbnail ? `url(${thumbnail})` : 'none',
            }}
          >
            {/* Fallback pattern if no image */}
            {!thumbnail && (
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />
            )}
          </div>
          
          {/* Play Icon Center Overlay */}
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            <div className="w-14 h-14 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:bg-[var(--theme-primary)] group-hover:border-white transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.5)] group-hover:shadow-[0_0_30px_color-mix(in_srgb,var(--theme-primary)_60%,transparent)] group-hover:scale-110">
              <Play className="w-6 h-6 text-white ml-1" />
            </div>
          </div>
        </div>

        {/* Bottom Content Section */}
        <div className="p-5 flex-1 flex flex-col bg-gradient-to-b from-[#0a0a0a] to-[#050505] relative z-20">
          <h3 className="font-cairo font-bold text-lg md:text-xl text-gray-100 group-hover:text-[var(--theme-primary)] transition-colors duration-300 mb-2 leading-tight drop-shadow-sm">
            {title}
          </h3>
          
          {description && (
            <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 mt-auto group-hover:text-gray-200 transition-colors duration-300">
              {description}
            </p>
          )}
        </div>
        
      </div>
    </Link>
  );
}
