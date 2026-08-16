'use client';

import { useState, useEffect } from 'react';
import { Plus, BookOpen, Loader2, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import FileUploadInput from '@/components/ui/FileUploadInput';

type Novel = {
  id: string;
  title: string;
  description: string;
  coverImage?: string;
  author?: string;
  _count?: {
    chapters: number;
    characters: number;
  };
};

export default function AdminNovelsPage() {
  const [novels, setNovels] = useState<Novel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('');
  const [coverImage, setCoverImage] = useState('');

  const fetchNovels = () => {
    setIsLoading(true);
    fetch('/api/admin/novels')
      .then(res => res.json())
      .then(data => setNovels(data))
      .catch(() => toast.error('فشل في جلب الروايات'))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchNovels();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setAuthor('');
    setCoverImage('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (novel: Novel) => {
    setEditingId(novel.id);
    setTitle(novel.title);
    setDescription(novel.description);
    setAuthor(novel.author || '');
    setCoverImage(novel.coverImage || '');
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الرواية بشكل نهائي؟ سيتم حذف جميع الفصول والشخصيات المرتبطة بها!')) return;
    
    const toastId = toast.loading('جاري الحذف...');
    try {
      const res = await fetch(`/api/admin/novels/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('فشل في عملية الحذف');
      
      toast.success('تم حذف الرواية بنجاح', { id: toastId });
      fetchNovels();
    } catch (err: any) {
      toast.error(err.message, { id: toastId });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return toast.error('يرجى تعبئة الحقول المطلوبة');

    setIsSubmitting(true);
    try {
      const url = editingId ? `/api/admin/novels/${editingId}` : '/api/admin/novels';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, author, coverImage })
      });
      if (!res.ok) throw new Error('فشل في حفظ الرواية');
      
      toast.success(editingId ? 'تم تحديث الرواية بنجاح!' : 'تم إنشاء الرواية بنجاح!');
      setIsModalOpen(false);
      fetchNovels();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full space-y-8 animate-fade-in pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white dark:bg-[#111] p-6 rounded-3xl border border-gray-200 dark:border-white/10 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-magma/10 rounded-2xl text-magma">
            <BookOpen className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">إدارة الروايات</h1>
            <p className="text-gray-500">تحكم في مكتبة الروايات المتاحة في النظام</p>
          </div>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 bg-magma hover:bg-magma-light text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg hover:shadow-magma/30"
        >
          <Plus className="w-5 h-5" /> إنشاء رواية جديدة
        </button>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-magma" /></div>
      ) : novels.length === 0 ? (
        <div className="text-center py-20 text-gray-500 bg-white dark:bg-[#111] rounded-3xl border border-gray-200 dark:border-white/10">لا توجد روايات مسجلة.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {novels.map(novel => (
            <div key={novel.id} className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-lg hover:shadow-xl hover:border-magma/30 transition-all group relative">
              <div className="absolute top-4 left-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button onClick={() => handleOpenEdit(novel)} className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-lg transition-colors"><Edit className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(novel.id)} className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
              
              {novel.coverImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={novel.coverImage} alt={novel.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-[#1a1a1a] dark:to-[#0a0a0a] flex items-center justify-center">
                  <BookOpen className="w-16 h-16 text-gray-400 dark:text-gray-600 opacity-50" />
                </div>
              )}
              <div className="p-6 relative bg-white dark:bg-[#111]">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{novel.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">{novel.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-400 font-bold border-t border-gray-100 dark:border-white/10 pt-4">
                  <span>الفصول: {novel._count?.chapters || 0}</span>
                  <span>الشخصيات: {novel._count?.characters || 0}</span>
                  <span>الكاتب: {novel.author}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto py-10">
          <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-3xl p-8 w-full max-w-2xl shadow-2xl animate-slide-up relative my-auto">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {editingId ? 'تعديل بيانات الرواية' : 'إنشاء رواية جديدة'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">عنوان الرواية *</label>
                <input required type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-magma transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">الوصف والملخص *</label>
                <textarea required rows={6} value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-magma transition-colors leading-relaxed" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">رابط صورة الغلاف أو الرفع (اختياري)</label>
                  <FileUploadInput
                    value={coverImage}
                    onChange={setCoverImage}
                    placeholder="ارفع صورة الغلاف..."
                    accept="image/*"
                  />
                </div>
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">اسم الكاتب (اختياري)</label>
                  <input type="text" value={author} onChange={e => setAuthor(e.target.value)} className="w-full bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-magma transition-colors" />
                </div>
              </div>
              <div className="flex gap-4 pt-4 mt-6 border-t border-gray-200 dark:border-white/10">
                <button type="submit" disabled={isSubmitting} className="flex-1 bg-magma hover:bg-magma-light text-white font-bold py-3 rounded-xl transition-colors flex justify-center items-center">
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'حفظ البيانات'}
                </button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-white/10 dark:hover:bg-white/20 text-gray-800 dark:text-white font-bold py-3 rounded-xl transition-colors">
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
