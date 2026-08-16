'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ChapterCard from '@/components/chapters/ChapterCard';
import SearchInput from '@/components/ui/SearchInput';
import ViewToggle from '@/components/ui/ViewToggle';
import { BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Chapter {
  id: string;
  chapterNum: number;
  title: string;
  content: string;
  createdAt: string;
  audioUrl?: string;
  imageUrl?: string;
}

interface ChaptersClientProps {
  initialChapters: Chapter[];
  initialQuery: string;
  novelId?: string;
}

export default function ChaptersClient({ initialChapters, initialQuery, novelId }: ChaptersClientProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();

  const handleSearch = (value: string) => {
    setQuery(value);
    const params = new URLSearchParams();
    if (value) params.set('q', value);
    if (novelId) params.set('novelId', novelId);
    router.push(`/chapters?${params.toString()}`);
  };
  
  return (
    <>
      <div className="flex flex-col md:flex-row items-center gap-4 mb-12">
        <div className="flex-1 w-full">
          <SearchInput placeholder="ابحث عن مخطوطة باسمها أو رقمها..." value={query} onChange={(val) => handleSearch(val)} />
        </div>
        <div className="shrink-0 hidden md:block">
          <ViewToggle storageKey="chapters-view-mode" defaultView="grid" onViewChange={setViewMode} />
        </div>
      </div>

      <div className="md:hidden flex justify-end mb-6 -mt-8">
        <ViewToggle storageKey="chapters-view-mode" defaultView="grid" onViewChange={setViewMode} />
      </div>

      {initialChapters.length > 0 ? (
        <motion.div 
          layout
          className={viewMode === 'grid' 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6" 
            : "flex flex-col gap-4 max-w-4xl mx-auto"
          }
        >
          <AnimatePresence mode="popLayout">
            {initialChapters.map((chapter) => (
              <motion.div
                key={chapter.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={viewMode === 'list' ? 'w-full' : ''}
              >
                <ChapterCard
                  id={chapter.id}
                  chapterNum={chapter.chapterNum}
                  title={chapter.title}
                  content={chapter.content}
                  createdAt={chapter.createdAt}
                  audioUrl={chapter.audioUrl}
                  imageUrl={chapter.imageUrl}
                  isList={viewMode === 'list'}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="text-center py-24 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl">
          <BookOpen className="w-16 h-16 text-gray-500 mx-auto mb-6" />
          <p className="text-white text-xl font-bold font-cairo">
            {initialQuery ? "لم يتم العثور على أي مخطوطات تطابق بحثك" : "لم تُنشر أي مخطوطات بعد"}
          </p>
          {!initialQuery && <p className="text-gray-400 mt-3">تأكد من اتصال قاعدة البيانات وتشغيل البيانات التجريبية</p>}
        </div>
      )}
    </>
  );
}
