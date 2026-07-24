'use client';

import { useState } from 'react';
import Link from "next/link";
import { Plus, Edit2, Trash2, Film, PlayCircle } from "lucide-react";
import { deleteVideo } from "./actions";
import SearchInput from '@/components/ui/SearchInput';

export default function VideosAdminClient({ initialVideos }: { initialVideos: any[] }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredVideos = initialVideos.filter(v => 
    v.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (v.description && v.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
        <div className="flex flex-row items-center gap-2 md:gap-4 w-full">
          <div className="w-full flex-1 min-w-0">
            <SearchInput placeholder="ابحث بعنوان أو وصف الفيديو..." value={searchQuery} onChange={setSearchQuery} />
          </div>
          
          <Link 
            href="/admin/videos/new"
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-600 hover:to-blue-600 text-white h-[48px] md:h-[52px] px-4 md:px-6 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] border border-white/10 shrink-0"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden md:inline">فيديو جديد</span>
          </Link>
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
