'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-16 h-8 bg-white/5 rounded-full" />;
  }

  const isDark = theme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={`
        relative flex items-center justify-between w-16 h-8 rounded-full p-1 transition-colors duration-500 ease-in-out
        ${isDark ? 'bg-stone border border-silver-ash/10 shadow-inner' : 'bg-gray-200 border border-gray-300 shadow-inner'}
      `}
      aria-label="Toggle Theme"
    >
      <div 
        className={`
          absolute top-1 left-1 w-6 h-6 rounded-full transition-transform duration-500 ease-in-out flex items-center justify-center
          ${isDark ? 'translate-x-8 bg-[#222] shadow-[0_0_10px_rgba(255,255,255,0.1)]' : 'translate-x-0 bg-white shadow-md'}
        `}
      >
        {isDark ? (
          <Moon className="w-3.5 h-3.5 text-blue-400" />
        ) : (
          <Sun className="w-3.5 h-3.5 text-orange-500" />
        )}
      </div>
      <Sun className={`w-4 h-4 ml-1.5 transition-opacity duration-300 ${isDark ? 'opacity-30 text-gray-400' : 'opacity-0'}`} />
      <Moon className={`w-4 h-4 mr-1.5 transition-opacity duration-300 ${isDark ? 'opacity-0' : 'opacity-30 text-gray-500'}`} />
    </button>
  );
}
