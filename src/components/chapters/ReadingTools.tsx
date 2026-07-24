"use client";

import { useState, useEffect } from 'react';
import { ArrowUp, Type, ZoomIn, ZoomOut } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ReadingTools() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [fontSizeIndex, setFontSizeIndex] = useState(2); // default size index
  const [isToolsOpen, setIsToolsOpen] = useState(false);

  // Define font size scales (in rem)
  const fontSizes = [1.125, 1.25, 1.5, 1.75, 2.0]; // md, lg, xl, 2xl, 3xl
  const lineHeights = [2.0, 2.2, 2.4, 2.6, 2.8];

  useEffect(() => {
    const handleScroll = () => {
      // Calculate scroll progress
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
      setScrollProgress(progress);

      // Show scroll-to-top button
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const changeFontSize = (step: number) => {
    const newIndex = Math.max(0, Math.min(fontSizes.length - 1, fontSizeIndex + step));
    setFontSizeIndex(newIndex);
    
    // Apply size to the chapter content element
    const contentEl = document.getElementById('chapter-reader-content');
    if (contentEl) {
      contentEl.style.fontSize = `${fontSizes[newIndex]}rem`;
      contentEl.style.lineHeight = `${lineHeights[newIndex]}`;
    }
  };

  return (
    <>
      {/* Progress Bar (Fixed Top) */}
      <div className="fixed top-0 left-0 w-full h-1 bg-black/50 z-50">
        <div 
          className="h-full bg-gradient-to-r from-[var(--theme-primary)] to-orange-400 transition-all duration-150 ease-out shadow-[0_0_10px_var(--theme-primary)]"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Floating Toolbar (Fixed Bottom Right/Left depending on RTL) */}
      <div className="fixed bottom-6 left-6 z-40 flex flex-col items-center gap-3" dir="rtl">
        
        {/* Expandable Tools */}
        <div 
          className={cn(
            "flex flex-col gap-2 transition-all duration-300 origin-bottom",
            isToolsOpen ? "scale-100 opacity-100" : "scale-0 opacity-0 pointer-events-none"
          )}
        >
          <button
            onClick={() => changeFontSize(1)}
            disabled={fontSizeIndex === fontSizes.length - 1}
            className="w-12 h-12 rounded-full bg-black/80 backdrop-blur-md border border-white/10 text-white flex items-center justify-center hover:bg-[var(--theme-primary)]/20 hover:border-[var(--theme-primary)] transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed group"
            title="تكبير الخط"
          >
            <ZoomIn className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>
          
          <button
            onClick={() => changeFontSize(-1)}
            disabled={fontSizeIndex === 0}
            className="w-12 h-12 rounded-full bg-black/80 backdrop-blur-md border border-white/10 text-white flex items-center justify-center hover:bg-[var(--theme-primary)]/20 hover:border-[var(--theme-primary)] transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed group"
            title="تصغير الخط"
          >
            <ZoomOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>
        </div>

        {/* Main Toggle Button */}
        <button
          onClick={() => setIsToolsOpen(!isToolsOpen)}
          className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-xl border border-white/10 backdrop-blur-md",
            isToolsOpen 
              ? "bg-[var(--theme-primary)] text-white shadow-[0_0_15px_var(--theme-primary)] border-[var(--theme-primary)]" 
              : "bg-black/80 text-gray-400 hover:text-white hover:bg-black"
          )}
          title="أدوات القراءة"
        >
          <Type className="w-5 h-5" />
        </button>

        {/* Scroll to Top */}
        <button
          onClick={scrollToTop}
          className={cn(
            "w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-all shadow-lg mt-2",
            showScrollTop ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0 pointer-events-none"
          )}
          title="العودة للأعلى"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      </div>
    </>
  );
}
