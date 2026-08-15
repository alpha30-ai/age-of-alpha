'use client';

import { useState, useRef } from 'react';
import Link from "next/link";
import { Plus, Edit2, Trash2, BookOpen, LayoutGrid, List as ListIcon, Download, Upload, Loader2 } from "lucide-react";
import { deleteChapter } from "./actions";
import SearchInput from '@/components/ui/SearchInput';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function ChaptersAdminClient({ initialChapters }: { initialChapters: any[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid'); // Default to grid
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const filteredChapters = initialChapters.filter(ch => 
    ch.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    ch.chapterNum.toString() === searchQuery
  );

  // Calculate stats
  const totalChapters = initialChapters.length;
  const latestChapter = totalChapters > 0 ? Math.max(...initialChapters.map(c => c.chapterNum)) : 0;

  const handleExport = () => {
    setIsExporting(true);
    const toastId = toast.loading('جاري تصدير الفصول... 📦');
    try {
      const dataStr = JSON.stringify(initialChapters, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `chapters_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('تم تصدير الفصول بنجاح! 🎉', { id: toastId });
    } catch (error) {
      toast.error('حدث خطأ أثناء تصدير الفصول', { id: toastId });
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const toastId = toast.loading('جاري استيراد الفصول... ⚙️');
      try {
        setIsImporting(true);
        const content = event.target?.result as string;
        const data = JSON.parse(content);
        
        const res = await fetch('/api/admin/chapters/import', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        const result = await res.json();
        if (!res.ok) throw new Error(result.error || 'فشل في الاستيراد');

        toast.success(`تم استيراد ${result.count} فصل بنجاح! 🚀`, { id: toastId });
        router.refresh();
      } catch (error: any) {
        toast.error(error.message || 'حدث خطأ أثناء الاستيراد', { id: toastId });
      } finally {
        setIsImporting(false);
        if (e.target) e.target.value = ''; // Reset input
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header & Stats Section */}
      <div className="bg-gradient-to-br from-white/5 to-black/40 p-6 md:p-8 rounded-3xl border border-white/10 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--theme-primary)]/10 blur-[120px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col gap-8">
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

      {/* Standalone Search & Actions Toolbar */}
      <div className="bg-black/40 border border-white/10 p-3 md:p-4 rounded-3xl backdrop-blur-2xl shadow-[0_8px_30px_rgba(0,0,0,0.5)] sticky top-[72px] md:top-[88px] z-30">
        <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4 w-full">
          <div className="w-full flex-1 min-w-0">
            <SearchInput placeholder="ابحث برقم أو اسم المخطوطة..." value={searchQuery} onChange={setSearchQuery} />
          </div>
          
          <div className="flex items-center gap-2 md:gap-3 shrink-0 flex-wrap justify-center">
            <div className="flex bg-black/60 rounded-xl p-1 shadow-inner h-[48px] md:h-[52px]">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 md:px-4 rounded-lg transition-all duration-300 flex items-center justify-center ${
                  viewMode === 'grid' 
                    ? 'bg-[var(--theme-primary)] text-white shadow-lg shadow-[var(--theme-primary)]/20' 
                    : 'text-gray-500 hover:text-white hover:bg-white/5'
                }`}
              >
                <LayoutGrid className="w-4 h-4 md:w-5 md:h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 md:px-4 rounded-lg transition-all duration-300 flex items-center justify-center ${
                  viewMode === 'list' 
                    ? 'bg-[var(--theme-primary)] text-white shadow-lg shadow-[var(--theme-primary)]/20' 
                    : 'text-gray-500 hover:text-white hover:bg-white/5'
                }`}
              >
                <ListIcon className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>
            
            <button 
              onClick={handleExport}
              disabled={isExporting}
              className="flex items-center justify-center gap-2 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 h-[48px] md:h-[52px] px-3 md:px-4 rounded-xl font-bold transition-all border border-blue-500/20 shrink-0"
              title="تصدير الفصول"
            >
              {isExporting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
            </button>

            <button 
              onClick={handleImportClick}
              disabled={isImporting}
              className="flex items-center justify-center gap-2 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 h-[48px] md:h-[52px] px-3 md:px-4 rounded-xl font-bold transition-all border border-emerald-500/20 shrink-0"
              title="استيراد فصول"
            >
              {isImporting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
            </button>
            <input type="file" accept=".json" className="hidden" ref={fileInputRef} onChange={handleFileChange} />

            <Link 
              href="/admin/chapters/new"
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-[var(--theme-primary)] to-orange-600 hover:from-orange-600 hover:to-[var(--theme-primary)] text-white h-[48px] md:h-[52px] px-4 md:px-6 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(230,74,25,0.3)] hover:shadow-[0_0_30px_rgba(230,74,25,0.5)] border border-white/10 shrink-0"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden md:inline">مخطوطة جديدة</span>
            </Link>
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
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <AnimatePresence>
              {filteredChapters.map((chapter) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={chapter.id} 
                  className="bg-white/5 border border-white/10 rounded-2xl p-5 md:p-6 hover:border-magma/50 transition-colors group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-magma/10 blur-3xl -mr-10 -mt-10 pointer-events-none" />
                  
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <span className="inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 font-bold text-lg md:text-xl shrink-0">
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
                  
                  <h3 className="font-bold text-lg md:text-xl text-white mb-2 relative z-10 group-hover:text-magma transition-colors line-clamp-2">{chapter.title}</h3>
                  <p className="text-gray-500 text-xs md:text-sm mb-2 relative z-10">
                    {new Date(chapter.createdAt).toLocaleDateString('ar-EG')}
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-right min-w-[600px]">
                <thead className="bg-black/40 border-b border-white/10 text-gray-400 whitespace-nowrap">
                  <tr>
                    <th className="px-4 md:px-6 py-4 font-bold">رقم الفصل</th>
                    <th className="px-4 md:px-6 py-4 font-bold">العنوان</th>
                    <th className="px-4 md:px-6 py-4 font-bold">تاريخ النشر</th>
                    <th className="px-4 md:px-6 py-4 font-bold text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-gray-200">
                  {filteredChapters.map((chapter) => (
                    <tr key={chapter.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 font-bold text-sm md:text-base">
                          {chapter.chapterNum}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-4 font-bold text-base md:text-lg">{chapter.title}</td>
                      <td className="px-4 md:px-6 py-4 text-gray-400 text-sm whitespace-nowrap">
                        {new Date(chapter.createdAt).toLocaleDateString('ar-EG')}
                      </td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-center gap-2 md:gap-3">
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
