'use client';

import { useState } from 'react';
import { Image as ImageIcon, Send, Loader2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

interface CreatePostFormProps {
  novelId: string;
  user: any;
  onPostCreated: (post: any) => void;
}

export default function CreatePostForm({ novelId, user, onPostCreated }: CreatePostFormProps) {
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showImageInput, setShowImageInput] = useState(false);

  if (!user) {
    return (
      <div className="bg-[#111]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center shadow-2xl">
        <h3 className="text-xl font-bold text-white mb-4 font-cairo">انضم للمجتمع الآن</h3>
        <p className="text-gray-400 mb-6 font-tajawal">يجب عليك تسجيل الدخول للمشاركة وإضافة منشورات.</p>
        <Link href="/login" className="inline-block bg-[var(--color-magma)] text-white px-8 py-3 rounded-xl font-bold shadow-[0_0_15px_var(--color-magma)]/30 hover:shadow-[0_0_25px_var(--color-magma)]/50 transition-all font-tajawal">
          تسجيل الدخول
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/community/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, imageUrl, novelId })
      });

      if (!res.ok) throw new Error('Failed to create post');
      
      const newPost = await res.json();
      onPostCreated(newPost);
      setContent('');
      setImageUrl('');
      setShowImageInput(false);
      toast.success('تم النشر بنجاح!');
    } catch (error) {
      toast.error('حدث خطأ أثناء النشر');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
      <div className="flex gap-4">
        <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-white/10 bg-black">
          {user.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xl font-bold text-[var(--color-magma)]">
              {user.name?.[0] || 'A'}
            </div>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="flex-1 space-y-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="شارك نظرياتك، أفكارك، أو رأيك في الرواية..."
            className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-[var(--color-magma)]/50 transition-all resize-none min-h-[100px] font-tajawal text-lg"
            dir="rtl"
          />

          {showImageInput && (
            <div className="relative animate-fade-in">
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="ضع رابط الصورة هنا (اختياري)..."
                className="w-full bg-black/40 border border-[var(--color-milky-blue)]/30 rounded-xl px-4 py-2 pr-10 text-white focus:outline-none focus:border-[var(--color-milky-blue)] transition-all font-tajawal text-sm"
                dir="rtl"
              />
              <button 
                type="button"
                onClick={() => { setShowImageInput(false); setImageUrl(''); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {imageUrl && (
            <div className="relative rounded-xl overflow-hidden border border-white/10 max-h-[300px] animate-slide-up">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-white/5">
            <button
              type="button"
              onClick={() => setShowImageInput(!showImageInput)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors font-bold text-sm ${showImageInput ? 'bg-[var(--color-milky-blue)]/20 text-[var(--color-milky-blue)]' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
            >
              <ImageIcon className="w-5 h-5" />
              إضافة صورة
            </button>

            <button
              type="submit"
              disabled={isSubmitting || !content.trim()}
              className="flex items-center gap-2 bg-[var(--color-magma)] text-white px-8 py-2.5 rounded-xl font-bold shadow-[0_0_15px_var(--color-magma)]/30 hover:shadow-[0_0_25px_var(--color-magma)]/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-cairo"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              نشر
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
