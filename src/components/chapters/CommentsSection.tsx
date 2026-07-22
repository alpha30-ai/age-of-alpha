'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { MessageSquare, Send, AlertTriangle, User } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CommentsSection({ chapterId }: { chapterId: string }) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [chapterId]);

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/comments?chapterId=${chapterId}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newComment, chapterId })
      });

      if (res.ok) {
        setNewComment('');
        fetchComments();
        toast.success('تمت إضافة تعليقك بنجاح!');
      } else {
        const data = await res.json();
        toast.error(data.error || 'حدث خطأ أثناء إضافة التعليق');
      }
    } catch (error) {
      console.error(error);
      toast.error('تعذر الاتصال بالخادم.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReport = async (commentId: string) => {
    try {
      const res = await fetch('/api/comments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentId, action: 'report' })
      });
      if (res.ok) {
        toast.success('تم رفع البلاغ بنجاح للرقابة.');
      } else {
        toast.error('حدث خطأ أثناء رفع البلاغ.');
      }
    } catch (error) {
      console.error(error);
      toast.error('تعذر رفع البلاغ.');
    }
  };

  return (
    <div className="mt-20 pt-10 font-tajawal">
      <div className="flex items-center gap-3 mb-8">
        <MessageSquare className="w-8 h-8 text-[var(--theme-primary)]" />
        <h3 className="font-amiri font-bold text-4xl text-white">التعليقات</h3>
      </div>

      {/* Add Comment Form */}
      {session ? (
        <form onSubmit={handleSubmit} className="mb-12 relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--theme-primary)] to-transparent rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative bg-[#0a0a0a] border border-white/10 rounded-2xl p-4 flex flex-col items-start shadow-xl">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="اكتب تعليقك هنا حول هذا الفصل..."
              className="w-full bg-transparent border-none text-white placeholder-gray-500 focus:ring-0 resize-none min-h-[100px] mb-4 text-right"
              required
              dir="rtl"
            />
            <button
              type="submit"
              disabled={isSubmitting || !newComment.trim()}
              className="flex items-center gap-2 px-6 py-2.5 bg-[var(--theme-primary)] hover:bg-[var(--theme-primary)]/80 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-[0_0_15px_color-mix(in_srgb,var(--theme-primary)_40%,transparent)] self-end"
            >
              {isSubmitting ? 'جاري الإرسال...' : (
                <>
                  <span>إرسال</span>
                  <Send className="w-4 h-4 rtl:rotate-180" />
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-12 p-6 bg-white/5 border border-white/10 rounded-2xl text-center">
          <p className="text-gray-400 mb-4">يجب عليك تسجيل الدخول لترك تعليق.</p>
          <a href="/api/auth/signin" className="inline-block px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-colors">
            تسجيل الدخول
          </a>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div id={comment.id} key={comment.id} className="group relative bg-[#111] border border-white/5 rounded-2xl p-6 hover:border-[var(--theme-primary)]/20 transition-colors shadow-lg">
              <div className="flex justify-between items-start mb-4">
                
                {/* User Info (Right side in RTL) */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 bg-black/50 flex items-center justify-center text-[var(--theme-primary)] font-bold shrink-0">
                    {comment.user.image ? (
                      <img src={comment.user.image} alt={comment.user.name} className="w-full h-full object-cover" />
                    ) : (
                      comment.user.name?.charAt(0) || <User className="w-5 h-5" />
                    )}
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-white text-lg">{comment.user.name}</h4>
                      {comment.user.rank && comment.user.rank !== 'مواطن' && (
                        <span className="px-2 py-0.5 text-[10px] bg-purple-500/10 text-purple-400 border border-purple-500/30 rounded-md font-bold">
                          {comment.user.rank}
                        </span>
                      )}
                      {comment.user.role === 'ADMIN' && (
                        <span className="px-2 py-0.5 text-[10px] bg-[var(--theme-primary)]/10 text-[var(--theme-primary)] border border-[var(--theme-primary)]/30 rounded-md font-bold">
                          المسؤول
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString('ar-SA')}
                    </span>
                  </div>
                </div>

                {/* Report Button (Left side in RTL) */}
                <button
                  onClick={() => {
                    toast((t) => (
                      <div className="flex flex-col gap-3 font-tajawal">
                        <span className="font-bold text-sm">هل تريد الإبلاغ عن هذا التعليق لانتهاكه القواعد؟</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              toast.dismiss(t.id);
                              handleReport(comment.id);
                            }}
                            className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-600"
                          >
                            تأكيد الإبلاغ
                          </button>
                          <button
                            onClick={() => toast.dismiss(t.id)}
                            className="bg-white/10 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-white/20"
                          >
                            إلغاء
                          </button>
                        </div>
                      </div>
                    ), { duration: 5000 });
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg flex items-center gap-1 text-xs font-bold shrink-0"
                  title="إبلاغ عن محتوى مسيء"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span className="hidden sm:inline">إبلاغ</span>
                </button>
                
              </div>
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap text-right">
                {comment.content}
              </p>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-gray-500 bg-[#111] rounded-2xl border border-white/5">
            لا توجد تعليقات بعد. كن أول من يترك بصمته!
          </div>
        )}
      </div>
    </div>
  );
}
