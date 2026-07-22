import { PrismaClient } from "@prisma/client";
import { notFound, redirect } from "next/navigation";
import { Save, X, Swords, Zap, Brain } from "lucide-react";
import Link from "next/link";
import { updateCharacter } from "../actions";
import FileUploadInput from "@/components/ui/FileUploadInput";

const prisma = new PrismaClient();

export default async function EditCharacterPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const character = await prisma.character.findUnique({
    where: { id: resolvedParams.id }
  });

  if (!character) {
    notFound();
  }

  // Wrapper for server action to handle redirect after success
  const handleUpdate = async (formData: FormData) => {
    'use server';
    await updateCharacter(formData);
    redirect('/admin/characters');
  };

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700" dir="rtl">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">تعديل الشخصية</h1>
        <p className="text-gray-400">تعديل بيانات البطل: {character.name}</p>
      </div>

      <form action={handleUpdate} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl space-y-6">
        <input type="hidden" name="id" value={character.id} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">الاسم</label>
            <input name="name" required defaultValue={character.name} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--theme-primary)]/50 transition-all font-bold" placeholder="اسم الشخصية" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">اللقب</label>
            <input name="title" defaultValue={character.title || ''} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--theme-primary)]/50 transition-all font-bold" placeholder="مثال: القائد الأعلى" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-gray-300">الوصف</label>
            <textarea name="description" required defaultValue={character.description} rows={5} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-gray-200 focus:outline-none focus:border-[var(--theme-primary)]/50 transition-all resize-y leading-relaxed" placeholder="وصف الشخصية..."></textarea>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">الفصيل</label>
            <input name="faction" defaultValue={character.faction || ''} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--theme-primary)]/50 transition-all font-bold" placeholder="مثال: إمارة الصدأ" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">ترتيب العرض (0 هو الأول)</label>
            <input name="sortOrder" type="number" defaultValue={character.sortOrder} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--theme-primary)]/50 transition-all font-bold" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <FileUploadInput name="imageUrl" label="تحديث الصورة (اتركه فارغاً للاحتفاظ بالصورة الحالية)" defaultValue={character.imageUrl || ''} accept="image/*" />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:col-span-2">
            <div className="space-y-2 bg-black/20 p-4 rounded-xl border border-white/5">
              <label className="text-sm font-medium text-gray-300 flex items-center gap-2 mb-2"><Swords className="w-4 h-4 text-red-400"/> القوة</label>
              <input name="strength" type="number" defaultValue={character.strength} min={1} max={100} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-red-500/50 transition-all text-center font-bold text-lg" />
            </div>
            <div className="space-y-2 bg-black/20 p-4 rounded-xl border border-white/5">
              <label className="text-sm font-medium text-gray-300 flex items-center gap-2 mb-2"><Zap className="w-4 h-4 text-blue-400"/> السحر</label>
              <input name="magic" type="number" defaultValue={character.magic} min={1} max={100} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-blue-500/50 transition-all text-center font-bold text-lg" />
            </div>
            <div className="space-y-2 bg-black/20 p-4 rounded-xl border border-white/5">
              <label className="text-sm font-medium text-gray-300 flex items-center gap-2 mb-2"><Brain className="w-4 h-4 text-emerald-400"/> الذكاء</label>
              <input name="intelligence" type="number" defaultValue={character.intelligence} min={1} max={100} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-emerald-500/50 transition-all text-center font-bold text-lg" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 pt-6 border-t border-white/10">
          <button 
            type="submit" 
            className="flex items-center justify-center gap-2 bg-[var(--theme-primary)] hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-[0_0_15px_color-mix(in_srgb,var(--theme-primary)_30%,transparent)]"
          >
            <Save className="w-5 h-5" />
            حفظ التعديلات
          </button>
          
          <Link 
            href="/admin/characters"
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
