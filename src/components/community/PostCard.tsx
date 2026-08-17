'use client';

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import { MoreHorizontal, Trash2, ShieldAlert, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface PostCardProps {
  post: any;
  currentUser: any;
  onDeleted: () => void;
}

export default function PostCard({ post, currentUser, onDeleted }: PostCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-[#111]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-xl relative group hover:border-[var(--theme-primary)]/30 transition-all duration-300 overflow-hidden"
      dir="rtl"
    >
      {/* Background Glow on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--theme-primary)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-[var(--theme-primary)]/50 transition-colors bg-black shadow-lg">
            {post.user.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={post.user.image} alt={post.user.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xl font-bold text-[var(--theme-primary)]">
                {post.user.name?.[0] || 'A'}
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-white font-cairo group-hover:text-[var(--theme-secondary)] transition-colors">{post.user.name || 'مستخدم مجهول'}</h4>
              {post.user.role === 'ADMIN' && (
                <span className="bg-red-500/20 text-red-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-500/20">
                  إدارة
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 font-tajawal flex items-center gap-2">
              <span className="text-[var(--theme-primary)]/80">{post.user.rank}</span>
              <span>•</span>
              <span dir="ltr">{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: ar })}</span>
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

      {post.isReported && isAdmin && (
        <div className="mt-4 flex items-center gap-2 bg-red-500/10 text-red-400 px-3 py-2 rounded-lg border border-red-500/20 text-sm font-bold relative z-10">
          <ShieldAlert className="w-4 h-4" /> تم الإبلاغ عن هذا المنشور
        </div>
      )}
    </motion.div>
  );
}
