'use client';

import { useState, useRef } from 'react';
import Link from "next/link";
import { Plus, Edit2, Trash2, Film, PlayCircle, Download, Upload, Loader2 } from "lucide-react";
import { deleteVideo } from "./actions";
import SearchInput from '@/components/ui/SearchInput';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function VideosAdminClient({ initialVideos, novels }: { initialVideos: any[], novels?: any[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNovelId, setSelectedNovelId] = useState<string>('all');
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const filteredVideos = initialVideos.filter(v => {
    const matchesSearch = v.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (v.description && v.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesNovel = selectedNovelId === 'all' || v.novelId === selectedNovelId;
    return matchesSearch && matchesNovel;
  });

  const handleExport = () => {
    setIsExporting(true);
    const toastId = toast.loading('جاري تصدير الفيديوهات... 📦');
    try {
      const dataStr = JSON.stringify(initialVideos, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `videos_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('تم تصدير الفيديوهات بنجاح! 🎉', { id: toastId });
    } catch (error) {
      toast.error('حدث خطأ أثناء تصدير الفيديوهات', { id: toastId });
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
      const toastId = toast.loading('جاري استيراد الفيديوهات... ⚙️');
      try {
        setIsImporting(true);
        const content = event.target?.result as string;
        const data = JSON.parse(content);
        
        const res = await fetch('/api/admin/videos/import', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        const result = await res.json();
        if (!res.ok) throw new Error(result.error || 'فشل في الاستيراد');

        toast.success(`تم استيراد ${result.count} فيديو بنجاح! 🚀`, { id: toastId });
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
      <div className="bg-gradient-to-br from-white/5 to-black/40 p-6 md:p-8 rounded-3xl border border-white/10 relative overflow-hidden shadow-2xl mb-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 blur-[120px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col gap-8">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
              <Film className="w-8 h-8 text-blue-400" />
              السجلات المرئية
            </h1>
            <p className="text-gray-400 text-sm md:text-base">
              إدارة الفيديوهات والمحتوى المرئي. أضف فيديوهات جديدة من يوتيوب أو ارفعها مباشرة.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4 hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center shrink-0">
                <Film className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-gray-400 text-xs font-bold mb-1">إجمالي الفيديوهات</p>
                <p className="text-2xl font-bold text-white font-sans">{initialVideos.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Standalone Search & Actions Toolbar */}
      <div className="bg-black/40 border border-white/10 p-3 md:p-4 rounded-3xl backdrop-blur-2xl shadow-[0_8px_30px_rgba(0,0,0,0.5)] sticky top-[72px] md:top-[88px] z-30 mb-8">
        <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4 w-full">
          <div className="w-full flex-1 min-w-0 flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <SearchInput placeholder="ابحث بعنوان أو وصف الفيديو..." value={searchQuery} onChange={setSearchQuery} />
            </div>
            {novels && novels.length > 0 && (
              <select
                value={selectedNovelId}
                onChange={(e) => setSelectedNovelId(e.target.value)}
                className="bg-black/60 border border-white/10 text-white text-sm rounded-xl px-4 py-3 h-[48px] md:h-[52px] focus:outline-none focus:border-[var(--theme-primary)]/50 transition-colors w-full sm:w-48 appearance-none"
                style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%239CA3AF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'left 1rem center', backgroundSize: '0.65em auto' }}
              >
                <option value="all">جميع الروايات</option>
                {novels.map(novel => (
                  <option key={novel.id} value={novel.id}>{novel.title}</option>
                ))}
              </select>
            )}
          </div>
          
          <div className="flex items-center gap-2 md:gap-3 shrink-0 flex-wrap justify-center">
            <button 
              onClick={handleExport}
              disabled={isExporting}
              className="flex items-center justify-center gap-2 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 h-[48px] md:h-[52px] px-3 md:px-4 rounded-xl font-bold transition-all border border-blue-500/20 shrink-0"
              title="تصدير الفيديوهات"
            >
              {isExporting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
            </button>

            <button 
              onClick={handleImportClick}
              disabled={isImporting}
              className="flex items-center justify-center gap-2 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 h-[48px] md:h-[52px] px-3 md:px-4 rounded-xl font-bold transition-all border border-emerald-500/20 shrink-0"
              title="استيراد فيديوهات"
            >
              {isImporting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
            </button>
            <input type="file" accept=".json" className="hidden" ref={fileInputRef} onChange={handleFileChange} />

            <Link 
              href="/admin/videos/new"
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-600 hover:to-blue-600 text-white h-[48px] md:h-[52px] px-4 md:px-6 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] border border-white/10 shrink-0"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden md:inline">فيديو جديد</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right min-w-[800px]">
            <thead className="bg-black/40 border-b border-white/10 text-gray-400 whitespace-nowrap">
              <tr>
                <th className="px-4 md:px-6 py-4 font-bold w-32">الصورة</th>
                <th className="px-4 md:px-6 py-4 font-bold">العنوان</th>
                <th className="px-4 md:px-6 py-4 font-bold">المنصة</th>
                <th className="px-4 md:px-6 py-4 font-bold">تاريخ النشر</th>
                <th className="px-4 md:px-6 py-4 font-bold text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-gray-200">
              {filteredVideos.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    لم يتم العثور على أي فيديوهات
                  </td>
                </tr>
              ) : (
                filteredVideos.map((video) => (
                  <tr key={video.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 md:px-6 py-4">
                      <div 
                        className="w-24 h-16 rounded-lg bg-[#111] bg-cover bg-center border border-white/10 flex items-center justify-center shrink-0"
                        style={{ backgroundImage: video.thumbnail ? `url(${video.thumbnail})` : 'none' }}
                      >
                        {!video.thumbnail && <Film className="w-6 h-6 text-gray-600" />}
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4">
                      <p className="font-bold text-base md:text-lg mb-1 line-clamp-1">{video.title}</p>
                      {video.description && (
                        <p className="text-gray-500 text-xs md:text-sm line-clamp-1">{video.description}</p>
                      )}
                    </td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 rounded-md text-xs font-bold border ${
                        !video.isHosted 
                          ? 'bg-red-500/10 text-red-400 border-red-500/20' 
                          : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      }`}>
                        {!video.isHosted ? 'YouTube' : 'مرفوع محلياً'}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-4 text-gray-400 text-xs md:text-sm whitespace-nowrap">
                      {video.createdAt ? new Date(video.createdAt).toLocaleDateString('ar-EG') : 'غير متوفر'}
                    </td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2 md:gap-3">
                        <Link 
                          href={`/admin/videos/${video.id}`}
                          className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors border border-blue-500/20"
                          title="تعديل"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        
                        <form action={deleteVideo}>
                          <input type="hidden" name="id" value={video.id} />
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
