'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import VideoCard from '@/components/videos/VideoCard';
import SearchInput from '@/components/ui/SearchInput';
import ViewToggle from '@/components/ui/ViewToggle';
import { Film } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import NovelFilterDropdown from '@/components/ui/NovelFilterDropdown';

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
        <div className="flex-1 w-full flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchInput placeholder="ابحث عن فيديو..." value={query} onChange={(val) => handleSearch(val)} />
          </div>
          {novels && novels.length > 0 && (
            <div className="w-full sm:w-64 shrink-0">
              <NovelFilterDropdown
                novels={novels}
                value={initialNovelId || 'all'}
                onChange={(val) => handleSearch(query, val)}
                allLabel="جميع الروايات"
              />
            </div>
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
