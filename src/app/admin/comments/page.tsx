'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, Trash2, ShieldCheck, AlertTriangle, ExternalLink, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import toast from 'react-hot-toast';
import SearchInput from '@/components/ui/SearchInput';

export default function CommentsAdminPage() {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const res = await fetch('/api/admin/comments');
      const data = await res.json();
      setComments(data);
    } catch (error) {
      console.error(error);
      toast.error('فشل في جلب التعليقات');
    } finally {
      setLoading(false);
    }
  };

  const handleDismissReport = async (commentId: string) => {
    try {
      const res = await fetch('/api/admin/comments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentId, action: 'dismiss_report' })
      });
      if (res.ok) {
        toast.success('تم تجاهل البلاغ واعتبار التعليق سليم');
        fetchComments();
      } else {
        toast.error('فشل في تجاهل البلاغ');
      }
    } catch (error) {
      console.error(error);
      toast.error('تعذر الاتصال بالخادم');
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا التعليق؟ لا يمكن التراجع عن هذا الإجراء.')) return;
    try {
      const res = await fetch(`/api/admin/comments?commentId=${commentId}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('تم حذف التعليق نهائياً');
        fetchComments();
      } else {
        toast.error('فشل في حذف التعليق');
      }
    } catch (error) {
      console.error(error);
      toast.error('تعذر الاتصال بالخادم');
    }
  };

  const filteredComments = comments.filter(c => 
    c.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto font-tajawal">
      {/* Header & Stats Section */}
      <div className="bg-gradient-to-br from-white/5 to-black/40 p-6 md:p-8 rounded-3xl border border-white/10 relative overflow-hidden shadow-2xl mb-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 blur-[120px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col gap-8">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
              <MessageSquare className="w-8 h-8 text-cyan-400" />
              سجل التعليقات
            </h1>
            <p className="text-gray-400 text-sm md:text-base">
              مراجعة تعليقات القراء وحذف التعليقات المسيئة لضمان بيئة قراءة نظيفة.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4 hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center shrink-0">
                <MessageSquare className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <p className="text-gray-400 text-xs font-bold mb-1">إجمالي التعليقات</p>
                <p className="text-2xl font-bold text-white font-sans">{comments.length}</p>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4 hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
                <CheckCircle className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-gray-400 text-xs font-bold mb-1">تمت مراجعتها</p>
                <p className="text-2xl font-bold text-white font-sans">{comments.filter(c => c.isApproved).length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Standalone Search & Actions Toolbar */}
      <div className="bg-black/40 border border-white/10 p-3 md:p-4 rounded-3xl backdrop-blur-2xl shadow-[0_8px_30px_rgba(0,0,0,0.5)] sticky top-[72px] md:top-[88px] z-30 mb-8">
        <div className="flex flex-row items-center gap-2 md:gap-4 w-full">
          <div className="w-full flex-1 min-w-0">
            <SearchInput placeholder="ابحث في التعليقات أو اسم الكاتب..." value={searchQuery} onChange={setSearchQuery} />
          </div>
          
          <div className="flex items-center gap-2 md:gap-3 shrink-0">
             {/* Any actions can go here if needed in the future */}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-pink-500/30 border-t-pink-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-right min-w-[800px]">
              <thead className="bg-black/50 border-b border-white/10 whitespace-nowrap">
                <tr>
                  <th className="px-4 md:px-6 py-4 text-gray-400 font-bold w-[35%]">التعليق</th>
                  <th className="px-4 md:px-6 py-4 text-gray-400 font-bold">الكاتب</th>
                  <th className="px-4 md:px-6 py-4 text-gray-400 font-bold">الفصل</th>
                  <th className="px-4 md:px-6 py-4 text-gray-400 font-bold">حالة البلاغ</th>
                  <th className="px-4 md:px-6 py-4 text-gray-400 font-bold text-left">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredComments.map((comment, index) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    key={comment.id} 
                    className={`hover:bg-white/5 transition-colors ${comment.isReported ? 'bg-red-500/5' : ''}`}
                  >
                    <td className="px-4 md:px-6 py-4">
                      <p className="text-gray-300 text-sm leading-relaxed max-w-sm md:max-w-md line-clamp-3">
                        {comment.content}
                      </p>
                      <span className="text-[10px] md:text-xs text-gray-500 mt-2 block whitespace-nowrap">
                        {new Date(comment.createdAt).toLocaleString('ar-SA')}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                      <div className="font-bold text-white text-sm md:text-base">{comment.user.name}</div>
                      <div className="text-gray-500 text-xs md:text-sm">{comment.user.email}</div>
                    </td>
                    <td className="px-4 md:px-6 py-4 text-gray-300 text-sm whitespace-nowrap">
                      الفصل {comment.chapter.chapterNum}
                    </td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                      {comment.isReported ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20">
                          <AlertTriangle className="w-3 h-3" />
                          مُبلّغ عنه
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <ShieldCheck className="w-3 h-3" />
                          سليم
                        </span>
                      )}
                    </td>
                    <td className="px-4 md:px-6 py-4 text-left whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        {comment.isReported && (
                          <button
                            onClick={() => handleDismissReport(comment.id)}
                            className="p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition-colors"
                            title="تجاهل البلاغ (سليم)"
                          >
                            <ShieldCheck className="w-4 h-4" />
                          </button>
                        )}
                        <Link
                          href={`/chapters/${comment.chapter.id}#${comment.id}`}
                          target="_blank"
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                          title="عرض في الصفحة"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(comment.id)}
                          className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
                          title="حذف التعليق"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
                {comments.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      لا يوجد تعليقات بعد.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
