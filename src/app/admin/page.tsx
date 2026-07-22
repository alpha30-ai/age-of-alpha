import { Users, BookOpen, Film, UserCircle, Flame, Plus, Settings, Palette } from 'lucide-react';
import Link from 'next/link';
import prisma from '@/lib/prisma';

export default async function AdminDashboard() {
  const [userCount, chapterCount, videoCount, characterCount, recentChapters, recentUsers] = await Promise.all([
    prisma.user.count(),
    prisma.chapter.count(),
    prisma.videoMedia.count(),
    prisma.character.count(),
    prisma.chapter.findMany({ take: 4, orderBy: { createdAt: 'desc' } }),
    prisma.user.findMany({ take: 4, orderBy: { createdAt: 'desc' } }),
  ]);

  const stats = [
    { label: 'المستخدمين', count: userCount, icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'الفصول', count: chapterCount, icon: BookOpen, color: 'text-[#E64A19]', bg: 'bg-[#E64A19]/10' },
    { label: 'الشخصيات', count: characterCount, icon: UserCircle, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { label: 'الفيديوهات', count: videoCount, icon: Film, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  ];

  return (
    <div className="space-y-8" dir="rtl">
      <div className="bg-gradient-to-r from-magma/20 to-transparent p-8 rounded-3xl border border-magma/30 relative overflow-hidden">
        <div className="absolute -left-10 -top-10 opacity-10">
          <Flame className="w-64 h-64 text-magma" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="text-center md:text-right">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3">
              <Flame className="w-8 h-8 sm:w-10 sm:h-10 text-magma animate-pulse" />
              لوحة القيادة الملكية
            </h1>
            <p className="text-gray-300 text-sm sm:text-base md:text-lg">مرحباً بك في مركز التحكم بملحمة الدول المائة. كل شيء رهن إشارتك.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto mt-4 md:mt-0">
            <Link href="/admin/chapters/new" className="w-full sm:w-auto justify-center bg-magma hover:bg-magma-light text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-magma/30 transition-all">
              <Plus className="w-5 h-5" />
              مخطوطة جديدة
            </Link>
            <Link href="/admin/theme" className="w-full sm:w-auto justify-center bg-white/10 hover:bg-white/20 border border-white/20 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all">
              <Palette className="w-5 h-5" />
              المظهر
            </Link>
            <Link href="/settings" className="w-full sm:w-auto justify-center bg-white/10 hover:bg-white/20 border border-white/20 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all">
              <Settings className="w-5 h-5" />
              إعدادات الحساب
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur-xl shadow-xl hover:bg-white/10 transition-colors group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium mb-1">{stat.label}</p>
                <p className="text-4xl font-bold text-white">{stat.count}</p>
              </div>
              <div className={`p-4 rounded-xl ${stat.bg} transition-transform group-hover:scale-110`}>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </div>
            {/* Glossy shine effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          </div>
        ))}
      </div>

      {/* Recent Activity Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Chapters */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-magma" />
              أحدث المخطوطات
            </h3>
            <Link href="/admin/chapters" className="text-sm text-magma hover:text-magma-light font-bold">
              عرض الكل
            </Link>
          </div>
          <div className="space-y-4">
            {recentChapters.length > 0 ? recentChapters.map((chapter) => (
              <div key={chapter.id} className="flex items-center justify-between p-4 rounded-xl bg-black/40 border border-white/5 hover:border-magma/30 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-magma/20 text-magma flex items-center justify-center font-bold border border-magma/30">
                    {chapter.chapterNum}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-200">{chapter.title}</h4>
                    <p className="text-xs text-gray-500">{new Date(chapter.createdAt).toLocaleDateString('ar-EG')}</p>
                  </div>
                </div>
              </div>
            )) : (
              <p className="text-center text-gray-500 py-4">لا توجد مخطوطات بعد.</p>
            )}
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-400" />
              أحدث المنضمين للعهد
            </h3>
            <span className="text-sm text-gray-400">آخر 4 مستخدمين</span>
          </div>
          <div className="space-y-4">
            {recentUsers.length > 0 ? recentUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 rounded-xl bg-black/40 border border-white/5 hover:border-blue-400/30 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold overflow-hidden border border-blue-500/30">
                    {user.image ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={user.image} alt={user.name || ''} className="w-full h-full object-cover" />
                    ) : (
                      <UserCircle className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-200">{user.name || 'مستخدم مجهول'}</h4>
                    <p className="text-xs text-gray-500" dir="ltr">{user.email}</p>
                  </div>
                </div>
              </div>
            )) : (
              <p className="text-center text-gray-500 py-4">لا يوجد مستخدمين بعد.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
