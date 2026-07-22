'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, Trash2, ShieldCheck, AlertTriangle, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function CommentsAdminPage() {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
    }
  };

  const handleDismissReport = async (commentId: string) => {
    try {
      await fetch('/api/admin/comments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentId, action: 'dismiss_report' })
      });
      fetchComments();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا التعليق؟ لا يمكن التراجع عن هذا الإجراء.')) return;
    try {
      await fetch(`/api/admin/comments?commentId=${commentId}`, { method: 'DELETE' });
      fetchComments();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto font-tajawal">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center">
          <MessageSquare className="w-6 h-6 text-pink-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white font-amiri tracking-wide">إدارة التعليقات والرقابة</h1>
          <p className="text-gray-400 mt-1">راجع التعليقات، تعامل مع البلاغات، وحافظ على مجتمع الملحمة</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-pink-500/30 border-t-pink-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-black/50 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 text-gray-400 font-bold w-1/3">التعليق</th>
                  <th className="px-6 py-4 text-gray-400 font-bold">الكاتب</th>
                  <th className="px-6 py-4 text-gray-400 font-bold">الفصل</th>
                  <th className="px-6 py-4 text-gray-400 font-bold">حالة البلاغ</th>
                  <th className="px-6 py-4 text-gray-400 font-bold text-left">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {comments.map((comment, index) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    key={comment.id} 
                    className={`hover:bg-white/5 transition-colors ${comment.isReported ? 'bg-red-500/5' : ''}`}
                  >
                    <td className="px-6 py-4">
                      <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
                        {comment.content}
                      </p>
                      <span className="text-xs text-gray-500 mt-2 block">
                        {new Date(comment.createdAt).toLocaleString('ar-SA')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-white text-sm">{comment.user.name}</div>
                      <div className="text-gray-500 text-xs">{comment.user.email}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-300 text-sm">
                      الفصل {comment.chapter.chapterNum}
                    </td>
                    <td className="px-6 py-4">
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
                    <td className="px-6 py-4 text-left">
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
                          href={`/chapters/${comment.chapter.id}`}
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
