'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import VideoCard from '@/components/videos/VideoCard';
import SearchInput from '@/components/ui/SearchInput';
import ViewToggle from '@/components/ui/ViewToggle';
import { Film } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface VideosClientProps {
  initialVideos: any[];
  initialQuery: string;
  initialNovelId?: string;
  novels?: any[];
}

export default function VideosClient({ initialVideos, initialQuery, initialNovelId, novels }: VideosClientProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();

  const handleSearch = (value: string, selectedNovelId?: string) => {
    setQuery(value);
    const params = new URLSearchParams();
    if (value) params.set('q', value);

    const activeNovelId = selectedNovelId !== undefined ? selectedNovelId : initialNovelId;
    if (activeNovelId && activeNovelId !== 'all') {
      params.set('novelId', activeNovelId);
    }

    router.push(`/videos?${params.toString()}`);
  };

  return (
    <>
      <div className="flex flex-col md:flex-row items-center gap-4 mb-12">
        <div className="flex-1 w-full flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <SearchInput placeholder="ابحث عن فيديو..." value={query} onChange={(val) => handleSearch(val)} />
          </div>
          {novels && novels.length > 0 && (
            <select
              value={initialNovelId || 'all'}
              onChange={(e) => handleSearch(query, e.target.value)}
              className="bg-black/60 border border-white/10 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--theme-primary)]/50 transition-colors w-full sm:w-48 appearance-none"
              style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%239CA3AF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'left 1rem center', backgroundSize: '0.65em auto' }}
            >
              <option value="all">جميع الروايات</option>
              {novels.map(novel => (
                <option key={novel.id} value={novel.id}>{novel.title}</option>
              ))}
            </select>
          )}
        </div>
        <div className="shrink-0 hidden md:block">
          <ViewToggle storageKey="videos-view-mode" defaultView="grid" onViewChange={setViewMode} />
        </div>
      </div>

      <div className="md:hidden flex justify-end mb-6 -mt-8">
        <ViewToggle storageKey="videos-view-mode" defaultView="grid" onViewChange={setViewMode} />
      </div>

      {initialVideos.length > 0 ? (
        <motion.div 
          layout
          className={viewMode === 'grid' 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6" 
            : "flex flex-col gap-6 max-w-4xl mx-auto"
          }
        >
          <AnimatePresence mode="popLayout">
            {initialVideos.map((video) => (
              <motion.div
                key={video.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={viewMode === 'list' ? 'w-full' : ''}
              >
                <VideoCard
                  id={video.id}
                  title={video.title}
                  description={video.description}
                  videoUrl={video.videoUrl}
                  thumbnail={video.thumbnail}
                  isList={viewMode === 'list'}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="text-center py-24 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl">
          <Film className="w-16 h-16 text-gray-500 mx-auto mb-6" />
          <p className="text-white text-xl font-bold font-cairo">
            {initialQuery ? "لم يتم العثور على أي فيديو يطابق بحثك" : "لا توجد سجلات مرئية بعد"}
          </p>
        </div>
      )}
    </>
  );
}
