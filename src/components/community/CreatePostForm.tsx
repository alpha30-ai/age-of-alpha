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
        <Link href="/login" className="inline-block bg-[var(--theme-primary)] text-white px-8 py-3 rounded-xl font-bold shadow-[0_0_15px_var(--theme-primary)]/30 hover:shadow-[0_0_25px_var(--theme-primary)]/50 transition-all font-tajawal">
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
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl transition-all focus-within:border-[var(--theme-primary)]/30 focus-within:shadow-[0_0_30px_var(--theme-primary)]/10">
      <div className="flex gap-4">
        <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-[var(--theme-primary)]/30 bg-black shadow-[0_0_10px_var(--theme-primary)]/20">
          {user.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xl font-bold text-[var(--theme-primary)]">
              {user.name?.[0] || 'A'}
            </div>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="flex-1 space-y-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="شارك نظرياتك، أفكارك، أو رأيك في الرواية..."
            className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-[var(--theme-primary)]/50 transition-all resize-none min-h-[100px] font-tajawal text-lg"
            dir="rtl"
          />

          {showImageInput && (
            <div className="relative animate-fade-in p-4 bg-black/40 border border-[var(--theme-secondary)]/30 rounded-xl mt-2 flex flex-col gap-3">
              <label className="text-sm text-gray-300 font-tajawal font-bold mb-1">صورة المرفق</label>
              
              {imageUrl ? (
                <div className="relative w-full h-32 rounded-lg overflow-hidden border border-white/10 group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imageUrl} alt="preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      type="button"
                      onClick={() => setImageUrl('')}
                      className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 w-full">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      
                      const toastId = toast.loading('جاري رفع الصورة...');
                      const formData = new FormData();
                      formData.append('file', file);
                      
                      try {
                        const res = await fetch('/api/upload', {
                          method: 'POST',
                          body: formData
                        });
                        const data = await res.json();
                        if (data.success && data.url) {
                          setImageUrl(data.url);
                          toast.success('تم رفع الصورة', { id: toastId });
                        } else {
                          toast.error('فشل في رفع الصورة', { id: toastId });
                        }
                      } catch (err) {
                        toast.error('حدث خطأ أثناء الرفع', { id: toastId });
                      }
                    }}
                    className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-[var(--theme-primary)]/20 file:text-[var(--theme-primary)] hover:file:bg-[var(--theme-primary)]/30 font-tajawal cursor-pointer border border-white/5 bg-black/20 rounded-xl"
                  />
                </div>
              )}
              
              <div className="text-xs text-gray-500 font-tajawal">
                أو أدخل رابط الصورة مباشرة:
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white text-left focus:outline-none focus:border-[var(--theme-secondary)] transition-all font-tajawal text-sm"
                  dir="ltr"
                />
              </div>

              <button 
                type="button"
                onClick={() => { setShowImageInput(false); setImageUrl(''); }}
                className="absolute top-4 left-4 text-gray-400 hover:text-red-400"
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
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors font-bold text-sm ${showImageInput ? 'bg-[var(--theme-secondary)]/20 text-[var(--theme-secondary)]' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
            >
              <ImageIcon className="w-5 h-5" />
              إضافة صورة
            </button>

            <button
              type="submit"
              disabled={isSubmitting || !content.trim()}
              className="flex items-center gap-2 bg-[var(--theme-primary)] text-white px-8 py-2.5 rounded-xl font-bold shadow-[0_0_15px_var(--theme-primary)]/30 hover:shadow-[0_0_25px_var(--theme-primary)]/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-cairo hover:scale-105 active:scale-95"
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
