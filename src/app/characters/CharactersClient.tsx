"use client";

import { useState } from 'react';
import Link from 'next/link';
import { motion, Variants, AnimatePresence } from "framer-motion";
import { Character } from "@prisma/client";
import { Shield, Zap, Brain, Users } from "lucide-react";

export default function CharactersClient({ characters }: { characters: Character[] }) {
  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const tabs = [
    { id: 'ALL', label: 'الكل' },
    { id: 'CITIZEN', label: 'أبناء الدولة' },
    { id: 'ALLY', label: 'تحالفات الدولة' },
    { id: 'ENEMY', label: 'أعداء الدولة' },
    { id: 'OTHER', label: 'أخرى' },
  ];

  const filteredCharacters = characters.filter(char => {
    const matchesTab = activeTab === 'ALL' || char.alliance === activeTab;
    const matchesSearch = char.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (char.title && char.title.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
  };

  if (characters.length === 0) {
    return (
      <div className="text-center text-gray-400 py-20 text-2xl font-tajawal">
        لم يتم إضافة أي شخصيات بعد.
      </div>
    );
  }

  return (
    <div className="space-y-12">
      
      {/* Search & Filters */}
      <div className="flex flex-col items-center gap-8 bg-[#0a0a0a]/60 p-8 rounded-3xl border border-white/5 backdrop-blur-md shadow-2xl relative overflow-hidden">
        {/* Glow effect for the filter box */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[var(--theme-primary)]/50 to-transparent" />
        
        {/* Search Input */}
        <div className="relative w-full max-w-2xl">
          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="ابحث عن شخصية بالاسم أو اللقب..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#111] border border-white/10 rounded-2xl py-4 pr-12 pl-4 text-white focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)]/50 focus:border-[var(--theme-primary)] transition-all font-tajawal text-lg shadow-inner placeholder-gray-500"
          />
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-3 w-full">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-2.5 rounded-full font-cairo font-bold text-sm md:text-base transition-all duration-300 ${
              activeTab === tab.id
                ? 'bg-[var(--theme-primary)] text-white shadow-[0_0_20px_color-mix(in_srgb,var(--theme-primary)_40%,transparent)] scale-105'
                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
        </div>
      </div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        layout
      >
        <AnimatePresence mode="popLayout">
          {filteredCharacters.length === 0 ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="col-span-full text-center py-20 text-gray-400 font-tajawal text-xl border border-dashed border-white/10 rounded-3xl"
            >
              لا توجد شخصيات في هذا التصنيف حالياً.
            </motion.div>
          ) : (
            filteredCharacters.map((char) => (
              <Link href={`/characters/${char.id}`} key={char.id} className="block">
                <motion.div
                  layout
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="relative w-full h-full bg-[#0a0a0a] rounded-2xl overflow-hidden border border-white/10 hover:border-[var(--theme-primary)]/50 shadow-lg hover:shadow-[0_10px_30px_-10px_color-mix(in_srgb,var(--theme-primary)_30%,transparent)] transition-all duration-500 flex flex-col group cursor-pointer"
          >
            {/* Card Header (Image & Gradient 4:3) */}
            <div className="relative w-full aspect-[4/3] bg-[#111] overflow-hidden border-b border-white/5">
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ 
                  backgroundImage: char.imageUrl ? `url(${char.imageUrl})` : 'none',
                }}
              >
                {/* Fallback pattern if no image */}
                {!char.imageUrl && (
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-black/30 opacity-90 transition-opacity duration-300" />
              
              {char.faction && (
                <div className="absolute top-4 right-4 z-20">
                  <span className="bg-black/60 backdrop-blur-md border border-white/10 text-[var(--theme-primary)] px-3 py-1 rounded-lg text-sm font-bold shadow-md">
                    {char.faction}
                  </span>
                </div>
              )}

              <div className="absolute bottom-4 right-4 left-4 z-20">
                <h2 className="text-2xl md:text-3xl font-cairo font-bold text-white drop-shadow-lg group-hover:text-[var(--theme-primary)] transition-colors duration-300">{char.name}</h2>
                {char.title && (
                  <p className="text-gray-300 font-tajawal text-sm mt-1 font-bold">{char.title}</p>
                )}
              </div>
            </div>

            {/* Card Body */}
            <div className="p-6 flex-1 flex flex-col bg-gradient-to-b from-[#0a0a0a] to-[#050505]">
              <p className="text-gray-400 font-tajawal text-sm leading-relaxed mb-6 line-clamp-3 group-hover:text-gray-200 transition-colors duration-300">
                {char.description}
              </p>

              {/* Stats Bars */}
              <div className="space-y-4 mt-auto pt-4 border-t border-white/10 group-hover:border-[var(--theme-primary)]/30 transition-colors duration-300">
                <StatBar icon={<Shield className="w-4 h-4 text-blue-400" />} label="القوة" value={char.strength} colorClass="bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                <StatBar icon={<Zap className="w-4 h-4 text-[var(--theme-primary)]" />} label="السحر" value={char.magic} colorClass="bg-[var(--theme-primary)] shadow-[0_0_8px_color-mix(in_srgb,var(--theme-primary)_60%,transparent)]" />
                <StatBar icon={<Brain className="w-4 h-4 text-purple-400" />} label="الذكاء" value={char.intelligence} colorClass="bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)]" />
              </div>
            </div>
          </motion.div>
        </Link>
            ))
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

function StatBar({ icon, label, value, colorClass }: { icon: React.ReactNode; label: string; value: number; colorClass: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-6 flex justify-center">{icon}</div>
      <div className="w-12 text-xs font-bold text-gray-400">{label}</div>
      <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
        <motion.div 
          className={`h-full ${colorClass}`}
          initial={{ width: 0 }}
          whileInView={{ width: `${Math.min(100, Math.max(0, value))}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
      <div className="w-8 text-right text-xs font-bold text-white">{value}</div>
    </div>
  );
}
