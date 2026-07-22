'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Save, BookOpen, Flame } from 'lucide-react';
import GlowButton from '@/components/ui/GlowButton';

export default function EditChapterPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    chapterNum: '',
    title: '',
    content: '',
    audioUrl: '',
  });

  useEffect(() => {
    fetchChapter();
  }, [id]);

  const fetchChapter = async () => {
    try {
      const res = await fetch(`/api/chapters/${id}`);
      if (!res.ok) throw new Error('فشل في جلب الفصل');
      const data = await res.json();
      setForm({
        chapterNum: data.chapterNum.toString(),
        title: data.title,
        content: data.content,
        audioUrl: data.audioUrl || '',
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/chapters/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'فشل في تحديث الفصل');
      }

      router.push('/admin');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-abyss flex items-center justify-center">
        <Flame className="w-12 h-12 text-magma animate-glow-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-abyss">
      <header className="bg-abyss-light border-b border-stone-dark">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-magma" />
              <h1 className="font-cairo font-bold text-xl text-silver-ash-light">تعديل الفصل</h1>
            </div>
            <Link
              href="/admin"
              className="flex items-center gap-2 text-sm text-stone-light hover:text-magma transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
              العودة
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-cairo font-bold text-silver-ash-light mb-2">
                رقم الفصل *
              </label>
              <input
                type="number"
                required
                value={form.chapterNum}
                onChange={(e) => setForm({ ...form, chapterNum: e.target.value })}
                className="w-full bg-abyss-lighter border border-stone rounded-lg px-4 py-3 text-silver-ash focus:border-magma focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-cairo font-bold text-silver-ash-light mb-2">
                عنوان الفصل *
              </label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full bg-abyss-lighter border border-stone rounded-lg px-4 py-3 text-silver-ash focus:border-magma focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-cairo font-bold text-silver-ash-light mb-2">
              محتوى الفصل *
            </label>
            <textarea
              required
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows={15}
              className="w-full bg-abyss-lighter border border-stone rounded-lg px-4 py-3 text-silver-ash focus:border-magma focus:outline-none transition-colors resize-y font-tajawal leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-sm font-cairo font-bold text-silver-ash-light mb-2">
              رابط المقطع الصوتي (اختياري)
            </label>
            <input
              type="url"
              value={form.audioUrl}
              onChange={(e) => setForm({ ...form, audioUrl: e.target.value })}
              className="w-full bg-abyss-lighter border border-stone rounded-lg px-4 py-3 text-silver-ash focus:border-magma focus:outline-none transition-colors"
              placeholder="https://example.com/audio.mp3"
            />
            <p className="text-xs text-stone-light mt-1">موسيقى ملحمية بحتة خالية من الغناء</p>
          </div>

          <div className="flex justify-end">
            <GlowButton type="submit" variant="magma" size="md" disabled={loading}>
              <Save className="w-4 h-4" />
              {loading ? 'جارٍ الحفظ...' : 'تحديث الفصل'}
            </GlowButton>
          </div>
        </form>
      </div>
    </div>
  );
}
