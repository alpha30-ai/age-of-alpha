import { Save, X } from "lucide-react";
import Link from "next/link";
import { createVideo } from "../actions";
import FileUploadInput from "@/components/ui/FileUploadInput";

export default function NewVideoPage() {
  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">إضافة فيديو جديد</h1>
        <p className="text-gray-400">إضافة مقطع فيديو جديد للأرشيف المرئي الخاص بالرواية.</p>
      </div>

      <form action={createVideo} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl space-y-6">
        <div className="space-y-2">
          <label htmlFor="title" className="block text-sm font-bold text-gray-300">عنوان الفيديو</label>
          <input 
            type="text" 
            id="title" 
            name="title" 
            required
            placeholder="مثال: المعركة الحاسمة - الإعلان التشويقي"
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--theme-primary)]/50 transition-all font-bold" 
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="description" className="block text-sm font-bold text-gray-300">الوصف (اختياري)</label>
          <textarea 
            id="description" 
            name="description" 
            rows={4}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-gray-200 focus:outline-none focus:border-[var(--theme-primary)]/50 transition-all resize-y" 
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FileUploadInput name="videoUrl" label="ملف الفيديو (ارفع من جهازك أو رابط خارجي)" accept="video/*" />
          <FileUploadInput name="thumbnail" label="صورة الغلاف (Thumbnail) - اختياري" accept="image/*" />
        </div>

        <label className="flex items-center gap-4 cursor-pointer mt-4 p-4 rounded-xl border border-white/5 bg-black/20 hover:bg-black/40 transition-colors w-fit">
          <div className="relative flex items-center">
            <input type="hidden" name="isHosted" value="false" />
            <input 
              type="checkbox" 
              id="isHosted" 
              name="isHosted" 
              value="true" 
              className="w-5 h-5 accent-[var(--theme-primary)] rounded bg-gray-900 border-gray-700 cursor-pointer" 
            />
          </div>
          <span className="text-sm font-bold text-gray-300">هذا الفيديو مرفوع على استضافة خاصة (وليس من يوتيوب)</span>
        </label>

        <div className="flex items-center gap-4 pt-6 border-t border-white/10">
          <button 
            type="submit" 
            className="flex items-center justify-center gap-2 bg-magma hover:bg-magma-light text-white px-8 py-3 rounded-xl font-bold transition-all shadow-magma/30"
          >
            <Save className="w-5 h-5" />
            حفظ الفيديو
          </button>
          
          <Link 
            href="/admin/videos"
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
