'use client';

import { useState } from 'react';
import Link from "next/link";
import { Plus, Edit2, Trash2, BookOpen, LayoutGrid, List as ListIcon } from "lucide-react";
import { deleteChapter } from "./actions";
import SearchInput from '@/components/ui/SearchInput';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChaptersAdminClient({ initialChapters }: { initialChapters: any[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid'); // Default to grid

  const filteredChapters = initialChapters.filter(ch => 
    ch.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    ch.chapterNum.toString() === searchQuery
  );

  // Calculate stats
  const totalChapters = initialChapters.length;
  const latestChapter = totalChapters > 0 ? Math.max(...initialChapters.map(c => c.chapterNum)) : 0;

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header & Stats Section */}
      <div className="bg-gradient-to-br from-white/5 to-black/40 p-6 md:p-8 rounded-3xl border border-white/10 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--theme-primary)]/10 blur-[120px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col gap-6 md:gap-8">
          {/* Top Row: Title */}
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-[var(--theme-primary)]" />
              سجل المخطوطات
            </h1>
            <p className="text-gray-400 text-sm md:text-base">
              إدارة فصول الرواية والمخطوطات القديمة. أضف فصولاً جديدة وتحكم بمحتواها.
            </p>
          </div>
          
          {/* Middle Row: Search & Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
            <div className="w-full flex-1">
              <SearchInput placeholder="ابحث برقم أو اسم المخطوطة..." value={searchQuery} onChange={setSearchQuery} />
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
              <div className="flex bg-black/40 rounded-xl p-1 shadow-inner h-[52px] w-full sm:w-auto justify-center">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-4 sm:px-3 rounded-lg transition-all duration-300 flex-1 sm:flex-none flex items-center justify-center ${
                    viewMode === 'grid' 
                      ? 'bg-[var(--theme-primary)] text-white shadow-lg shadow-[var(--theme-primary)]/20' 
                      : 'text-gray-500 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <LayoutGrid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 sm:px-3 rounded-lg transition-all duration-300 flex-1 sm:flex-none flex items-center justify-center ${
                    viewMode === 'list' 
                      ? 'bg-[var(--theme-primary)] text-white shadow-lg shadow-[var(--theme-primary)]/20' 
                      : 'text-gray-500 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <ListIcon className="w-5 h-5" />
                </button>
              </div>
              
              <Link 
                href="/admin/chapters/new"
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-[var(--theme-primary)] to-orange-600 hover:from-orange-600 hover:to-[var(--theme-primary)] text-white h-[52px] px-6 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(230,74,25,0.3)] hover:shadow-[0_0_30px_rgba(230,74,25,0.5)] border border-white/10 shrink-0 w-full sm:w-auto"
              >
                <Plus className="w-5 h-5" />
                <span>مخطوطة جديدة</span>
              </Link>
            </div>
          </div>

          {/* Bottom Row: Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4 hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[var(--theme-primary)]/20 flex items-center justify-center shrink-0">
                <BookOpen className="w-6 h-6 text-[var(--theme-primary)]" />
              </div>
              <div>
                <p className="text-gray-400 text-xs font-bold mb-1">إجمالي المخطوطات</p>
                <p className="text-2xl font-bold text-white font-sans">{totalChapters}</p>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4 hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center shrink-0">
                <LayoutGrid className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <p className="text-gray-400 text-xs font-bold mb-1">آخر مخطوطة</p>
                <p className="text-2xl font-bold text-white font-sans">#{latestChapter}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {filteredChapters.length === 0 ? (
        <div className="text-center py-20 bg-white/5 border border-white/10 rounded-3xl">
          <BookOpen className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">لم يتم العثور على أي مخطوطات.</p>
        </div>
      ) : (
        viewMode === 'grid' ? (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredChapters.map((chapter) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={chapter.id} 
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-magma/50 transition-colors group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-magma/10 blur-3xl -mr-10 -mt-10 pointer-events-none" />
                  
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 font-bold text-xl">
                      {chapter.chapterNum}
                    </span>
                    
                    <div className="flex items-center gap-2">
                      <Link 
                        href={`/admin/chapters/${chapter.id}`}
                        className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors border border-blue-500/20"
                        title="تعديل"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      
                      <form action={deleteChapter}>
                        <input type="hidden" name="id" value={chapter.id} />
                        <button 
                          type="submit"
                          className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors border border-red-500/20"
                          title="حذف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </form>
                    </div>
                  </div>
                  
                  <h3 className="font-bold text-xl text-white mb-2 relative z-10 group-hover:text-magma transition-colors">{chapter.title}</h3>
                  <p className="text-gray-500 text-sm mb-4 relative z-10">
                    {new Date(chapter.createdAt).toLocaleDateString('ar-EG')}
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead className="bg-black/40 border-b border-white/10 text-gray-400">
                  <tr>
                    <th className="px-6 py-4 font-bold">رقم الفصل</th>
                    <th className="px-6 py-4 font-bold">العنوان</th>
                    <th className="px-6 py-4 font-bold">تاريخ النشر</th>
                    <th className="px-6 py-4 font-bold text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-gray-200">
                  {filteredChapters.map((chapter) => (
                    <tr key={chapter.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 font-bold">
                          {chapter.chapterNum}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-lg">{chapter.title}</td>
                      <td className="px-6 py-4 text-gray-400">
                        {new Date(chapter.createdAt).toLocaleDateString('ar-EG')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-3">
                          <Link 
                            href={`/admin/chapters/${chapter.id}`}
                            className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors border border-blue-500/20"
                            title="تعديل"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>
                          
                          <form action={deleteChapter}>
                            <input type="hidden" name="id" value={chapter.id} />
                            <button 
                              type="submit"
                              className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors border border-red-500/20"
                              title="حذف"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}
    </div>
  );
}
