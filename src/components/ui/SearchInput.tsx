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
    <div className="w-full relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--theme-primary)] to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
      <div className="relative flex items-center bg-stone-dark border border-silver-ash/10 rounded-2xl overflow-hidden transition-all focus-within:border-[var(--theme-primary)]/50 focus-within:shadow-[0_0_15px_color-mix(in_srgb,var(--theme-primary)_30%,transparent)]">
        <div className="pl-4 pr-4 text-gray-500 group-focus-within:text-[var(--theme-primary)] transition-colors">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full bg-transparent py-4 pr-2 pl-4 text-silver-ash placeholder:text-gray-600 focus:outline-none focus:ring-0 font-tajawal text-lg"
        />
      </div>
    </div>
  );
}

export default function SearchInput({ placeholder = 'ابحث هنا...', value, onChange }: SearchInputProps) {
  return (
    <Suspense fallback={<div className="w-full h-[58px] bg-white/5 border border-silver-ash/10 rounded-2xl animate-pulse"></div>}>
      <SearchInputContent placeholder={placeholder} value={value} onChange={onChange} />
    </Suspense>
  );
}
