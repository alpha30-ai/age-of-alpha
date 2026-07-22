import prisma from "@/lib/prisma";
import Link from "next/link";
import { Plus, Edit2, Trash2, BookOpen } from "lucide-react";
import { deleteChapter } from "./actions";

export default async function AdminChaptersPage() {
  const chapters = await prisma.chapter.findMany({
    orderBy: { chapterNum: 'asc' }
  });

  return (
    <div className="max-w-6xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-[#E64A19]" />
            سجل المخطوطات (الفصول)
          </h1>
          <p className="text-gray-400">إدارة فصول الرواية، إضافة فصول جديدة، وتعديل المخطوطات القديمة.</p>
        </div>
        
        <Link 
          href="/admin/chapters/new"
          className="flex items-center gap-2 bg-magma hover:bg-magma-light text-white px-6 py-3 rounded-xl font-bold transition-all shadow-magma/30"
        >
          <Plus className="w-5 h-5" />
          مخطوطة جديدة
        </Link>
      </div>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-black/40 border-b border-white/10 text-gray-400">
              <tr>
                <th className="px-6 py-4 font-bold">رقم الفصل</th>
                <th className="px-6 py-4 font-bold">العنوان</th>
                <th className="px-6 py-4 font-bold">تاريخ النشر</th>
                <th className="px-6 py-4 font-bold text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-gray-200">
              {chapters.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    لا توجد أي فصول حتى الآن.. السجل فارغ.
                  </td>
                </tr>
              ) : (
                chapters.map((chapter) => (
                  <tr key={chapter.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 font-bold">
                        {chapter.chapterNum}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-lg">{chapter.title}</td>
                    <td className="px-6 py-4 text-gray-400">
                      {new Date(chapter.createdAt).toLocaleDateString('ar-EG')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-3">
                        <Link 
                          href={`/admin/chapters/${chapter.id}`}
                          className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors border border-blue-500/20"
                          title="تعديل"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        
                        <form action={deleteChapter}>
                          <input type="hidden" name="id" value={chapter.id} />
                          <button 
                            type="submit"
                            className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors border border-red-500/20"
                            title="حذف"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
