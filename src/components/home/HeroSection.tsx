'use client';

import { useState, useEffect } from 'react';
import { Flame, BookOpen, ChevronDown, Shield } from 'lucide-react';
import GlowButton from '@/components/ui/GlowButton';
import { motion, Variants } from 'framer-motion';

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
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 40, damping: 15 } },
  };

  const isBannerActive = theme?.bannerIsActive ?? true;
  const title = isBannerActive && theme?.bannerTitle ? theme.bannerTitle : "عهد ألفا";
  const subtitle = isBannerActive && theme?.bannerSubtitle ? theme.bannerSubtitle : "ملحمة الدول المائة";
  const backgroundUrl = isBannerActive && theme?.bannerImageUrl ? theme.bannerImageUrl : null;

  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden bg-abyss transition-colors duration-500"
      style={backgroundUrl ? { backgroundImage: `url(${backgroundUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        {/* Dark Gradient Overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-abyss/70 via-abyss/50 to-abyss transition-colors duration-500" />
        
        {/* Core Magma Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-[var(--theme-primary)]/15 blur-[100px] rounded-full mix-blend-screen animate-pulse pointer-events-none" />
        
        {/* Ember particles effect */}
        {isMounted && (
          <div className="absolute inset-0 overflow-hidden opacity-40 pointer-events-none">
            {[...Array(25)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-[var(--theme-primary)] animate-ember"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${2 + Math.random() * 4}s`,
                  boxShadow: '0 0 10px 2px color-mix(in srgb, var(--theme-primary) 60%, transparent)'
                }}
              />
            ))}
          </div>
        )}

        {/* Bottom fade into Abyss */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-abyss to-transparent transition-colors duration-500" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-4 w-full max-w-6xl mx-auto pt-20 pb-32 md:pb-24">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative w-full max-w-4xl mx-auto p-4 sm:p-8"
        >
          {/* Subtle Top Shine */}
          <div className="absolute top-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-silver-ash/20 to-transparent" />

          {/* Flame Icon */}
          <motion.div variants={itemVariants} className="mb-8 flex justify-center">
            <div className="relative group cursor-default">
              <Flame className="w-20 h-20 md:w-24 md:h-24 text-[var(--theme-primary)]" />
              <motion.div 
                animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-[var(--theme-primary)]/40 rounded-full blur-3xl pointer-events-none"
              />
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1 
            variants={itemVariants} 
            className="font-amiri font-bold text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-silver-ash mb-4 tracking-wider drop-shadow-lg"
          >
            {title}
          </motion.h1>

          {/* Subtitle */}
          <motion.h2 
            variants={itemVariants} 
            className="font-cairo font-bold text-2xl md:text-3xl lg:text-4xl text-silver-ash-light mb-8 drop-shadow-md"
          >
            {subtitle}
          </motion.h2>

          {/* Logline */}
          <motion.p 
            variants={itemVariants} 
            className="text-lg sm:text-xl md:text-2xl text-silver-ash-light max-w-4xl mx-auto mb-16 leading-relaxed font-tajawal drop-shadow-md whitespace-pre-wrap"
          >
            {theme?.bannerDescription || "من بين أنقاض الألم، وُلدت إمبراطورية لا تعرف الرحمة... عهدٌ تُكتب قوانينه بالدم، وتُدفع ضرائبه بالولاء المطلق."}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-8">
            <GlowButton href="/chapters" variant="magma" size="lg" className="w-full sm:w-auto min-w-[200px]">
              <BookOpen className="w-5 h-5" />
              ابدأ القراءة
            </GlowButton>
            <GlowButton href="/videos" variant="ghost" size="lg" className="w-full sm:w-auto min-w-[200px] border-silver-ash/20 text-silver-ash hover:bg-silver-ash/10">
              <Shield className="w-5 h-5" />
              السجلات المرئية
            </GlowButton>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 15, 0] }}
          transition={{ delay: 2.5, duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-1/2 -translate-x-1/2 bottom-4 sm:bottom-8 z-20 flex justify-center w-full"
        >
          <ChevronDown className="w-10 h-10 text-silver-ash/30" />
        </motion.div>
      </div>
    </section>
  );
}
