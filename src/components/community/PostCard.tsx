'use client';

import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import { MoreHorizontal, Trash2, ShieldAlert, Loader2, Heart, MessageSquare, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface PostCardProps {
  post: any;
  currentUser: any;
  onDeleted: () => void;
}

export default function PostCard({ post, currentUser, onDeleted }: PostCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Likes state
  const initialLiked = post.likes?.some((like: any) => like.userId === currentUser?.id);
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
  const [isLiking, setIsLiking] = useState(false);

  // Comments state
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentsCount, setCommentsCount] = useState(post._count?.comments || 0);

  const isOwner = currentUser?.email && currentUser.email === post.user.email;
  const isAdmin = currentUser?.role === 'ADMIN';
  const canDelete = isOwner || isAdmin;

  const handleDelete = async () => {
    if (!confirm('هل أنت متأكد من حذف هذا المنشور؟')) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/community/posts?id=${post.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      toast.success('تم حذف المنشور');
      onDeleted();
    } catch (error) {
      toast.error('حدث خطأ أثناء الحذف');
      setIsDeleting(false);
    }
  };

  const toggleLike = async () => {
    if (!currentUser) {
      toast.error('يجب تسجيل الدخول للإعجاب بالمنشور');
      return;
    }
    
    if (isLiking) return;
    setIsLiking(true);

    // Optimistic update
    const newLiked = !isLiked;
    setIsLiked(newLiked);
    setLikesCount((prev: number) => newLiked ? prev + 1 : prev - 1);

    try {
      const res = await fetch(`/api/community/posts/${post.id}/like`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed to toggle like');
      const data = await res.json();
      setIsLiked(data.liked);
    } catch (error) {
      // Revert on error
      setIsLiked(isLiked);
      setLikesCount(likesCount);
      toast.error('حدث خطأ');
    } finally {
      setIsLiking(false);
    }
  };

  const fetchComments = async () => {
    setIsLoadingComments(true);
    try {
      const res = await fetch(`/api/community/posts/${post.id}/comments`);
      if (!res.ok) throw new Error('Failed to fetch comments');
      const data = await res.json();
      setComments(data);
    } catch (error) {
      toast.error('حدث خطأ أثناء جلب التعليقات');
    } finally {
      setIsLoadingComments(false);
    }
  };

  useEffect(() => {
    if (showComments && comments.length === 0 && commentsCount > 0) {
      fetchComments();
    }
  }, [showComments]);

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      toast.error('يجب تسجيل الدخول للتعليق');
      return;
    }
    if (!newComment.trim()) return;

    setIsSubmittingComment(true);
    try {
      const res = await fetch(`/api/community/posts/${post.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newComment })
      });
      if (!res.ok) throw new Error('Failed to post comment');
      const data = await res.json();
      setComments([...comments, data]);
      setCommentsCount((prev: number) => prev + 1);
      setNewComment('');
    } catch (error) {
      toast.error('حدث خطأ أثناء التعليق');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-[#111]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-xl relative group hover:border-[var(--color-magma)]/30 transition-all duration-300 overflow-hidden break-inside-avoid mb-6 w-full"
      dir="rtl"
    >
      {/* Background Glow on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-magma)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-[var(--color-magma)]/50 transition-colors bg-black shadow-lg">
            {post.user.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={post.user.image} alt={post.user.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xl font-bold text-[var(--color-magma)]">
                {post.user.name?.[0] || 'A'}
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-white font-cairo group-hover:text-[var(--color-milky-blue)] transition-colors">{post.user.name || 'مستخدم مجهول'}</h4>
              {post.user.role === 'ADMIN' && (
                <span className="bg-red-500/20 text-red-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-500/20">
                  إدارة
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 font-tajawal flex items-center gap-2">
              <span className="text-[var(--color-magma)]/80">{post.user.rank}</span>
              <span>•</span>
              <span dir="ltr">{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: ar })}</span>
              {post.novel && (
                <>
                  <span>•</span>
                  <Link href={`/novels/${post.novelId}`} className="text-[var(--color-milky-blue)]/80 hover:text-[var(--color-milky-blue)] transition-colors">
                    {post.novel.title}
                  </Link>
                </>
              )}
            </p>
          </div>
        </div>

        {canDelete && (
          <div className="relative z-20">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-500 hover:text-white rounded-full hover:bg-white/5 transition-colors"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>

            <AnimatePresence>
              {isMenuOpen && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute left-0 mt-2 w-48 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl py-1 z-20"
                >
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="w-full px-4 py-2 text-right text-sm text-red-400 hover:bg-white/5 flex items-center gap-2 disabled:opacity-50"
                  >
                    {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    حذف المنشور
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      <div className="text-gray-300 font-tajawal text-lg leading-relaxed whitespace-pre-wrap mb-4 relative z-10 group-hover:text-gray-200 transition-colors">
        {post.content}
      </div>

      {post.imageUrl && (
        <div className="mt-4 rounded-2xl overflow-hidden border border-white/10 max-h-[500px] relative z-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.imageUrl} alt="مرفق المنشور" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" loading="lazy" />
        </div>
      )}

      {/* Action Buttons (Likes and Comments) */}
      <div className="flex items-center gap-4 mt-6 pt-4 border-t border-white/5 relative z-10">
        <button
          onClick={toggleLike}
          className={`flex items-center gap-2 text-sm font-bold font-tajawal transition-colors ${
            isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-400'
          }`}
        >
          <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
          {likesCount} إعجاب
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className={`flex items-center gap-2 text-sm font-bold font-tajawal transition-colors ${
            showComments ? 'text-[var(--color-milky-blue)]' : 'text-gray-400 hover:text-[var(--color-milky-blue)]'
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          {commentsCount} تعليق
        </button>
      </div>

      {/* Comments Section */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 relative z-10"
          >
            <div className="space-y-4 mb-4">
              {isLoadingComments ? (
                <div className="flex justify-center p-4">
                  <Loader2 className="w-6 h-6 animate-spin text-[var(--color-milky-blue)]" />
                </div>
              ) : comments.map(comment => (
                <div key={comment.id} className="flex gap-3 bg-black/30 p-3 rounded-xl border border-white/5">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-black shrink-0">
                    {comment.user.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={comment.user.image} alt={comment.user.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-sm font-bold text-[var(--color-milky-blue)]">
                        {comment.user.name?.[0] || 'A'}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-bold text-white text-sm font-cairo">{comment.user.name}</span>
                      <span className="text-[10px] text-gray-500" dir="ltr">{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: ar })}</span>
                    </div>
                    <p className="text-gray-300 text-sm font-tajawal mt-1">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>

            {currentUser && (
              <form onSubmit={submitComment} className="flex gap-2 relative">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="أضف تعليقاً..."
                  className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2 pr-10 text-white focus:outline-none focus:border-[var(--color-milky-blue)]/50 transition-all font-tajawal text-sm"
                />
                <button
                  type="submit"
                  disabled={isSubmittingComment || !newComment.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--color-milky-blue)] hover:text-white disabled:opacity-50 transition-colors"
                >
                  {isSubmittingComment ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                </button>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {post.isReported && isAdmin && (
        <div className="mt-4 flex items-center gap-2 bg-red-500/10 text-red-400 px-3 py-2 rounded-lg border border-red-500/20 text-sm font-bold relative z-10">
          <ShieldAlert className="w-4 h-4" /> تم الإبلاغ عن هذا المنشور
        </div>
      )}
    </motion.div>
  );
}
