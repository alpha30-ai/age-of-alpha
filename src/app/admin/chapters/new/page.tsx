import { Save, X } from "lucide-react";
import Link from "next/link";
import { createChapter } from "../actions";
import FileUploadInput from "@/components/ui/FileUploadInput";

export default function NewChapterPage() {
  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">تدوين مخطوطة جديدة</h1>
        <p className="text-gray-400">اكتب أحداثاً ملحمية جديدة لتخلد في أرشيف عهد ألفا.</p>
      </div>

      <form action={createChapter} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-2 md:col-span-1">
            <label htmlFor="chapterNum" className="block text-sm font-bold text-gray-300">رقم الفصل</label>
            <input 
              type="number" 
              id="chapterNum" 
              name="chapterNum" 
              required
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--theme-primary)]/50 focus:shadow-[0_0_15px_rgba(var(--theme-primary-rgb),0.2)] transition-all font-bold text-center" 
            />
          </div>
          
          <div className="space-y-2 md:col-span-3">
            <label htmlFor="title" className="block text-sm font-bold text-gray-300">عنوان الفصل</label>
            <input 
              type="text" 
              id="title" 
              name="title" 
              required
              placeholder="مثال: صحوة الصهارة"
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--theme-primary)]/50 focus:shadow-[0_0_15px_rgba(var(--theme-primary-rgb),0.2)] transition-all font-bold" 
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="content" className="block text-sm font-bold text-gray-300">المحتوى الكامل (يدعم فواصل الأسطر)</label>
          <textarea 
            id="content" 
            name="content" 
            required
            rows={15}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-gray-200 focus:outline-none focus:border-[var(--theme-primary)]/50 focus:shadow-[0_0_15px_rgba(var(--theme-primary-rgb),0.2)] transition-all resize-y leading-loose" 
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FileUploadInput name="imageUrl" label="صورة البانر (الغلاف) - اختياري" accept="image/*" />
          <FileUploadInput name="audioUrl" label="رابط القراءة الصوتية - اختياري" accept="audio/*" />
        </div>

        <div className="flex items-center gap-4 pt-6 border-t border-white/10">
          <button 
            type="submit" 
            className="flex items-center justify-center gap-2 bg-magma hover:bg-magma-light text-white px-8 py-3 rounded-xl font-bold transition-all shadow-magma/30"
          >
            <Save className="w-5 h-5" />
            حفظ المخطوطة
          </button>
          
          <Link 
            href="/admin/chapters"
            className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 hover:border-white/20 px-8 py-3 rounded-xl font-bold transition-all"
          >
            <X className="w-5 h-5" />
            إلغاء
          </Link>
        </div>
      </form>
    </div>
  );
}
