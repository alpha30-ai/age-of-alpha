import prisma from "@/lib/prisma";
import Link from "next/link";
import { Plus, Edit2, Trash2, Film, PlayCircle } from "lucide-react";
import { deleteVideo } from "./actions";

export default async function AdminVideosPage() {
  const videos = await prisma.videoMedia.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="max-w-6xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Film className="w-8 h-8 text-emerald-400" />
            السجلات المرئية (الفيديوهات)
          </h1>
          <p className="text-gray-400">إدارة مقاطع الفيديو واليوتيوب الخاصة بعالم عهد ألفا.</p>
        </div>
        
        <Link 
          href="/admin/videos/new"
          className="flex items-center gap-2 bg-magma hover:bg-magma-light text-white px-6 py-3 rounded-xl font-bold transition-all shadow-magma/30"
        >
          <Plus className="w-5 h-5" />
          إضافة فيديو جديد
        </Link>
      </div>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-black/40 border-b border-white/10 text-gray-400">
              <tr>
                <th className="px-6 py-4 font-bold">معاينة</th>
                <th className="px-6 py-4 font-bold">العنوان</th>
                <th className="px-6 py-4 font-bold">المصدر</th>
                <th className="px-6 py-4 font-bold text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-gray-200">
              {videos.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    لم يتم إضافة أي فيديوهات بعد.
                  </td>
                </tr>
              ) : (
                videos.map((video) => (
                  <tr key={video.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="w-24 h-16 bg-black/50 rounded-lg overflow-hidden border border-white/10 relative flex items-center justify-center group cursor-pointer">
                        {video.thumbnail ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                        ) : (
                          <Film className="w-6 h-6 text-gray-500" />
                        )}
                        <PlayCircle className="absolute w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md" />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-lg mb-1">{video.title}</p>
                      <p className="text-sm text-gray-400 max-w-xs truncate">{video.description || "لا يوجد وصف"}</p>
                    </td>
                    <td className="px-6 py-4">
                      {video.isHosted ? (
                        <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20">فيديو مرفوع</span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-xs font-bold border border-red-500/20">رابط خارجي (YouTube)</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-3">
                        <Link 
                          href={`/admin/videos/${video.id}`}
                          className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors border border-blue-500/20"
                          title="تعديل"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        
                        <form action={deleteVideo}>
                          <input type="hidden" name="id" value={video.id} />
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
