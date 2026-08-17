'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, Book } from 'lucide-react';

interface Novel {
  id: string;
  title: string;
}

interface NovelFilterDropdownProps {
  novels: Novel[];
  value: string;
  onChange: (novelId: string) => void;
  allLabel?: string;
  className?: string;
}

export default function NovelFilterDropdown({ 
  novels, 
  value, 
  onChange, 
  allLabel = 'جميع الروايات',
  className = ''
}: NovelFilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedTitle = value === 'all' 
    ? allLabel 
    : novels.find(n => n.id === value)?.title || allLabel;

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-3 bg-black/40 backdrop-blur-md border border-[var(--theme-primary)]/20 hover:border-[var(--theme-primary)]/50 rounded-xl px-5 py-3.5 transition-all group shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
      >
        <div className="flex items-center gap-2">
          <Book className="w-4 h-4 text-[var(--theme-primary)]" />
          <span className="font-cairo font-bold text-sm sm:text-base text-gray-200 group-hover:text-white transition-colors">{selectedTitle}</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 group-hover:text-[var(--theme-primary)] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-3 bg-[#111]/95 backdrop-blur-xl border border-[var(--theme-primary)]/20 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden z-50 p-2 min-w-[200px]"
          >
            <div className="max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
              <button
                onClick={() => { onChange('all'); setIsOpen(false); }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                  value === 'all' 
                    ? 'bg-[var(--theme-primary)]/20 text-[var(--theme-primary)] font-bold' 
                    : 'hover:bg-white/5 text-gray-300'
                }`}
              >
                <span className="font-cairo text-sm truncate">{allLabel}</span>
                {value === 'all' && <Check className="w-4 h-4" />}
              </button>
              
              {novels.map(novel => (
                <button
                  key={novel.id}
                  onClick={() => { onChange(novel.id); setIsOpen(false); }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all mt-1 ${
                    value === novel.id 
                      ? 'bg-[var(--theme-primary)]/20 text-[var(--theme-primary)] font-bold' 
                      : 'hover:bg-white/5 text-gray-300'
                  }`}
                >
                  <span className="font-cairo text-sm truncate">{novel.title}</span>
                  {value === novel.id && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
