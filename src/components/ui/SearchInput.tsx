'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';

interface SearchInputProps {
  placeholder?: string;
}

export default function SearchInput({ placeholder = 'ابحث هنا...' }: SearchInputProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // Avoid pushing on initial mount if query hasn't changed
      if (query !== initialQuery) {
        const current = new URLSearchParams(Array.from(searchParams.entries()));
        
        if (query) {
          current.set('q', query);
        } else {
          current.delete('q');
        }
        
        const search = current.toString();
        const queryStr = search ? `?${search}` : '';
        
        router.push(`${window.location.pathname}${queryStr}`);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [query, router, searchParams, initialQuery]);

  return (
    <div className="relative group w-full max-w-md mx-auto mb-10">
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--theme-primary)] to-purple-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
      <div className="relative flex items-center bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden transition-all focus-within:border-[var(--theme-primary)]/50 focus-within:shadow-[0_0_15px_color-mix(in_srgb,var(--theme-primary)_30%,transparent)]">
        <div className="pl-4 pr-4 text-gray-500 group-focus-within:text-[var(--theme-primary)] transition-colors">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent py-4 pr-2 pl-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-0 font-tajawal text-sm"
        />
      </div>
    </div>
  );
}
