'use client';

import { LayoutGrid, List } from 'lucide-react';
import { useEffect, useState } from 'react';

type ViewMode = 'grid' | 'list';

interface ViewToggleProps {
  storageKey: string;
  defaultView?: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export default function ViewToggle({ storageKey, defaultView = 'grid', onViewChange }: ViewToggleProps) {
  const [view, setView] = useState<ViewMode>(defaultView);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem(storageKey) as ViewMode;
    if (saved === 'grid' || saved === 'list') {
      setView(saved);
      onViewChange(saved);
    }
  }, [storageKey, onViewChange]);

  const handleToggle = (newView: ViewMode) => {
    setView(newView);
    localStorage.setItem(storageKey, newView);
    onViewChange(newView);
  };

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) return (
    <div className="flex bg-[#0a0a0a] border border-white/10 rounded-xl p-1 w-[88px] h-10 animate-pulse"></div>
  );

  return (
    <div className="flex bg-[#0a0a0a] border border-white/10 rounded-xl p-1 shadow-inner relative z-10">
      <button
        onClick={() => handleToggle('grid')}
        className={`p-2 rounded-lg transition-all duration-300 ${
          view === 'grid' 
            ? 'bg-[var(--theme-primary)] text-white shadow-[0_0_10px_color-mix(in_srgb,var(--theme-primary)_50%,transparent)]' 
            : 'text-gray-500 hover:text-white hover:bg-white/5'
        }`}
        title="عرض شبكي"
      >
        <LayoutGrid className="w-4 h-4" />
      </button>
      <button
        onClick={() => handleToggle('list')}
        className={`p-2 rounded-lg transition-all duration-300 ${
          view === 'list' 
            ? 'bg-[var(--theme-primary)] text-white shadow-[0_0_10px_color-mix(in_srgb,var(--theme-primary)_50%,transparent)]' 
            : 'text-gray-500 hover:text-white hover:bg-white/5'
        }`}
        title="عرض عمودي"
      >
        <List className="w-4 h-4" />
      </button>
    </div>
  );
}
