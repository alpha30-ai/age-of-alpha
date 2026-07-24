'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';

interface SearchInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (val: string) => void;
}

function SearchInputContent({ placeholder, value, onChange }: SearchInputProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  // If controlled (value/onChange provided), use them. Otherwise use local state.
  const isControlled = value !== undefined && onChange !== undefined;
  const [internalQuery, setInternalQuery] = useState(initialQuery);
  const query = isControlled ? value : internalQuery;

  useEffect(() => {
    if (isControlled) return;

    const timeoutId = setTimeout(() => {
      if (internalQuery !== initialQuery) {
        const current = new URLSearchParams(Array.from(searchParams.entries()));
        if (internalQuery) current.set('q', internalQuery);
        else current.delete('q');
        
        const search = current.toString();
        const queryStr = search ? `?${search}` : '';
        router.push(`${window.location.pathname}${queryStr}`);
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [internalQuery, router, searchParams, initialQuery, isControlled]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isControlled) {
      onChange(e.target.value);
    } else {
      setInternalQuery(e.target.value);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-10 flex flex-col items-center gap-8 bg-[#0a0a0a]/60 p-8 rounded-3xl border border-white/5 backdrop-blur-md shadow-2xl relative overflow-hidden">
      {/* Glow effect for the filter box */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[var(--theme-primary)]/50 to-transparent" />
      
      <div className="relative w-full">
        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full bg-[#111] border border-white/10 rounded-2xl py-4 pr-12 pl-4 text-white focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)]/50 focus:border-[var(--theme-primary)] transition-all font-tajawal text-lg shadow-inner placeholder-gray-500"
        />
      </div>
    </div>
  );
}

export default function SearchInput({ placeholder = 'ابحث هنا...', value, onChange }: SearchInputProps) {
  return (
    <Suspense fallback={<div className="w-full max-w-2xl mx-auto h-24 bg-white/5 border border-white/10 rounded-3xl mb-10 animate-pulse"></div>}>
      <SearchInputContent placeholder={placeholder} value={value} onChange={onChange} />
    </Suspense>
  );
}
