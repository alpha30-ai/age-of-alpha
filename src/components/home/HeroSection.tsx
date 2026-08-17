'use client';

import { useState, useEffect } from 'react';
import { Flame, BookOpen, ChevronDown, Shield, Sparkles } from 'lucide-react';
import GlowButton from '@/components/ui/GlowButton';
import { motion, Variants } from 'framer-motion';
import Link from 'next/link';

export default function HeroSection({ theme }: { theme?: any }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 50, damping: 20 } },
  };

  const isBannerActive = theme?.bannerIsActive ?? true;
  const title = isBannerActive && theme?.bannerTitle ? theme.bannerTitle : "عهد ألفا";
  const subtitle = isBannerActive && theme?.bannerSubtitle ? theme.bannerSubtitle : "ملحمة الدول المائة";
  const backgroundUrl = isBannerActive && theme?.bannerImageUrl ? theme.bannerImageUrl : 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=2000&auto=format&fit=crop';

  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden bg-[#050505] perspective-1000">
      {/* Immersive Background System */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute inset-0"
          style={{ backgroundImage: `url(${backgroundUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.85) contrast(1.1)' }}
        />
        
        {/* Fog & Gradient Overlays - Reduced Opacity for Better Image Visibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/60 via-[#050505]/20 to-[#050505]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/70 via-transparent to-[#050505]/70" />
        
        {/* Dynamic Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] max-w-[1200px] max-h-[1200px] bg-[var(--theme-primary)]/15 blur-[150px] rounded-full mix-blend-screen animate-pulse pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[60vw] h-[60vw] bg-black blur-[120px] rounded-full mix-blend-multiply pointer-events-none" />

        {/* Floating Icons */}
        {isMounted && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
            <motion.div
              animate={{ y: [-20, 20, -20], rotate: [0, 10, -10, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-[20%] left-[15%] opacity-30 text-[var(--theme-primary)] blur-[1px]"
            >
              <Shield className="w-24 h-24" />
            </motion.div>
            
            <motion.div
              animate={{ y: [20, -20, 20], rotate: [0, -15, 15, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute bottom-[30%] right-[10%] opacity-20 text-[var(--theme-primary)] blur-[2px]"
            >
              <BookOpen className="w-32 h-32" />
            </motion.div>
            
            <motion.div
              animate={{ y: [-15, 15, -15], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
              className="absolute top-[40%] right-[20%] opacity-40 text-[var(--theme-primary)]"
            >
              <Flame className="w-16 h-16" />
            </motion.div>
            
            <motion.div
              animate={{ y: [15, -15, 15], rotate: [0, -20, 20, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
              className="absolute bottom-[20%] left-[25%] opacity-20 text-white blur-[1px]"
            >
              <Sparkles className="w-20 h-20" />
            </motion.div>

            {/* Floating Particles (Embers / Magic Dust) */}
            {[...Array(40)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  y: '100vh', 
                  x: `${Math.random() * 100}vw`,
                  opacity: 0,
                  scale: Math.random() * 0.5 + 0.5
                }}
                animate={{ 
                  y: '-10vh',
                  x: `${Math.random() * 100}vw`,
                  opacity: [0, 1, 0],
                }}
                transition={{ 
                  duration: 5 + Math.random() * 10,
                  repeat: Infinity,
                  ease: 'linear',
                  delay: Math.random() * 5
                }}
                className="absolute w-1.5 h-1.5 rounded-full bg-[var(--theme-primary)]"
                style={{
                  boxShadow: '0 0 15px 2px var(--theme-primary)'
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 z-10 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(var(--theme-primary) 1px, transparent 1px), linear-gradient(90deg, var(--theme-primary) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* Main Content Area */}
      <div className="relative z-20 text-center px-4 w-full max-w-7xl mx-auto pt-24 pb-32">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative w-full max-w-5xl mx-auto"
        >
          {/* Top Decorative Badge */}
          <motion.div variants={itemVariants} className="mb-8 flex justify-center">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 shadow-[0_0_20px_var(--theme-primary)]/10">
              <Sparkles className="w-4 h-4 text-[var(--theme-primary)]" />
              <span className="text-gray-300 font-bold text-sm tracking-[0.2em] uppercase font-tajawal">مغامرة استثنائية بانتظارك</span>
              <Sparkles className="w-4 h-4 text-[var(--theme-primary)]" />
            </div>
          </motion.div>

          {/* Epic Title */}
          <motion.h1 
            variants={itemVariants} 
            className="font-cairo font-black text-6xl sm:text-7xl md:text-8xl lg:text-[10rem] text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-200 to-gray-500 mb-2 filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] leading-none"
          >
            {title}
          </motion.h1>

          {/* Subtitle */}
          <motion.h2 
            variants={itemVariants} 
            className="font-amiri font-bold text-3xl md:text-5xl lg:text-6xl text-[var(--theme-primary)] mb-8 drop-shadow-[0_0_15px_var(--theme-primary)]"
          >
            {subtitle}
          </motion.h2>

          {/* Logline */}
          <motion.p 
            variants={itemVariants} 
            className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-16 leading-loose font-tajawal font-medium drop-shadow-xl backdrop-blur-sm bg-black/20 p-6 rounded-3xl border border-white/5"
          >
            {theme?.bannerDescription || "من بين أنقاض الألم، وُلدت إمبراطورية لا تعرف الرحمة... عهدٌ تُكتب قوانينه بالدم، وتُدفع ضرائبه بالولاء المطلق."}
          </motion.p>

          {/* Action Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
            <Link href="/chapters" className="group relative px-8 py-4 w-full sm:w-auto overflow-hidden rounded-2xl bg-[var(--theme-primary)] hover:bg-[var(--theme-primary)] transition-colors">
              <div className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out skew-x-12" />
              <div className="relative flex items-center justify-center gap-3 font-cairo font-black text-white text-lg">
                <BookOpen className="w-6 h-6" />
                <span>ابدأ القراءة الآن</span>
              </div>
            </Link>
            
            <Link href="/videos" className="group flex items-center justify-center gap-3 px-8 py-4 w-full sm:w-auto rounded-2xl bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 hover:border-white/20 text-white transition-all font-cairo font-bold text-lg">
              <Shield className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
              <span>السجلات المرئية</span>
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator Down */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 20, 0] }}
          transition={{ delay: 2, duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-1/2 -translate-x-1/2 bottom-8 z-20 flex flex-col items-center gap-2 cursor-pointer"
          onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}
        >
          <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">اكتشف المزيد</span>
          <ChevronDown className="w-6 h-6 text-gray-400" />
        </motion.div>
      </div>
      
      {/* Bottom Fade to match site bg */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050505] to-transparent z-10 pointer-events-none" />
    </section>
  );
}
