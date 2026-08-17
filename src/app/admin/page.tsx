import { Users, BookOpen, Film, UserCircle, Flame, Plus, Settings, Palette, Share2 } from 'lucide-react';
import Link from 'next/link';
import prisma from '@/lib/prisma';

export default async function AdminDashboard() {
  const [userCount, chapterCount, videoCount, characterCount, socialCount, recentChapters, recentUsers, recentSocial] = await Promise.all([
    prisma.user.count(),
    prisma.chapter.count(),
    prisma.videoMedia.count(),
    prisma.character.count(),
    prisma.socialPublishSetting.count(),
    prisma.chapter.findMany({ take: 4, orderBy: { createdAt: 'desc' } }),
    prisma.user.findMany({ take: 4, orderBy: { createdAt: 'desc' } }),
    prisma.socialPublishSetting.findMany({
      take: 4, 
      orderBy: { createdAt: 'desc' },
      include: { chapter: true, character: true, video: true }
    }),
  ]);

  const stats = [
    { label: 'المستخدمين', count: userCount, icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'الفصول', count: chapterCount, icon: BookOpen, color: 'text-[#E64A19]', bg: 'bg-[#E64A19]/10' },
    { label: 'الفيديوهات', count: videoCount, icon: Film, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { label: 'المحتوى التسويقي', count: socialCount, icon: Share2, color: 'text-rose-400', bg: 'bg-rose-400/10' },
  ];

  return (
    <div className="space-y-8" dir="rtl">
      <div className="bg-white/5 p-8 rounded-xl border border-[var(--theme-primary)]/30 relative overflow-hidden shadow-lg">
        <div className="absolute -left-10 -top-10 opacity-5">
          <Flame className="w-64 h-64 text-[var(--theme-primary)]" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="text-center md:text-right">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--color-theme-heading)] mb-3 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3">
              <Flame className="w-8 h-8 sm:w-10 sm:h-10 text-[var(--theme-primary)]" />
              لوحة القيادة الملكية
            </h1>
            <p className="text-gray-400 text-sm sm:text-base md:text-lg">مرحباً بك في مركز التحكم بملحمة الدول المائة. كل شيء رهن إشارتك.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto mt-4 md:mt-0">
            <Link href="/admin/chapters/new" className="w-full sm:w-auto justify-center bg-[var(--theme-primary)] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-[var(--theme-primary-dark)] transition-colors shadow-md">
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
          <div key={i} className="relative overflow-hidden rounded-xl bg-white/5 border border-white/5 p-6 shadow-md hover:border-[var(--theme-primary)]/30 transition-all duration-300 group">
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-gray-400 text-sm font-medium mb-1">{stat.label}</p>
                <p className="text-4xl font-bold text-white group-hover:text-[var(--theme-primary)] transition-colors">{stat.count}</p>
              </div>
              <div className={`p-4 rounded-xl ${stat.bg} transition-colors duration-300 shadow-inner group-hover:bg-[var(--theme-primary)]/20`}>
                <stat.icon className={`w-8 h-8 ${stat.color} group-hover:text-[var(--theme-primary)] transition-colors drop-shadow-sm`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Chapters */}
        <div className="bg-white/5 border border-[var(--theme-primary)]/20 shadow-[0_0_15px_var(--theme-primary)]/10 rounded-2xl p-6 backdrop-blur-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--theme-primary)]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-[var(--theme-primary)]/20 transition-all duration-500"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--theme-primary)]/20">
              <h3 className="text-xl font-bold text-[var(--theme-primary)] flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                أحدث المخطوطات
              </h3>
              <Link href="/admin/chapters" className="text-sm text-[var(--theme-primary)] hover:brightness-125 font-bold">
                عرض الكل
              </Link>
            </div>
            <div className="space-y-4">
              {recentChapters.length > 0 ? recentChapters.map((chapter) => (
                <div key={chapter.id} className="flex items-center justify-between p-4 rounded-xl bg-black/40 border border-[var(--theme-primary)]/10 hover:border-[var(--theme-primary)]/40 hover:shadow-[0_0_10px_var(--theme-primary)]/10 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[var(--theme-primary)]/20 text-[var(--theme-primary)] flex items-center justify-center font-bold border border-[var(--theme-primary)]/30">
                      {chapter.chapterNum}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-200 truncate w-32">{chapter.title}</h4>
                      <p className="text-xs text-gray-500">{new Date(chapter.createdAt).toLocaleDateString('ar-EG')}</p>
                    </div>
                  </div>
                </div>
              )) : (
                <p className="text-center text-gray-500 py-4">لا توجد مخطوطات بعد.</p>
              )}
            </div>
          </div>
        </div>

        {/* Recent Social Content */}
        <div className="bg-white/5 border border-[var(--theme-primary)]/20 shadow-[0_0_15px_var(--theme-primary)]/10 rounded-2xl p-6 backdrop-blur-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--theme-primary)]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-[var(--theme-primary)]/20 transition-all duration-500"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--theme-primary)]/20">
              <h3 className="text-xl font-bold text-[var(--theme-primary)] flex items-center gap-2">
                <Share2 className="w-5 h-5" />
                المحتوى التسويقي
              </h3>
              <Link href="/admin/social" className="text-sm text-[var(--theme-primary)] hover:brightness-125 font-bold">
                عرض الكل
              </Link>
            </div>
            <div className="space-y-4">
              {recentSocial.length > 0 ? recentSocial.map((social) => (
                <div key={social.id} className="flex flex-col gap-2 p-4 rounded-xl bg-black/40 border border-[var(--theme-primary)]/10 hover:border-[var(--theme-primary)]/40 hover:shadow-[0_0_10px_var(--theme-primary)]/10 transition-all">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${social.platform === 'YOUTUBE' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                      {social.platform === 'YOUTUBE' ? 'يوتيوب' : 'فيسبوك'}
                    </span>
                    <span className="text-[10px] text-gray-500">{new Date(social.createdAt).toLocaleDateString('ar-EG')}</span>
                  </div>
                  <h4 className="font-bold text-gray-200 text-sm truncate">{social.title}</h4>
                  <p className="text-xs text-gray-400 truncate">
                    {social.targetType === 'CHAPTER' ? `الفصل: ${social.chapter?.title}` : social.targetType === 'CHARACTER' ? `شخصية: ${social.character?.name}` : `فيديو: ${social.video?.title}`}
                  </p>
                </div>
              )) : (
                <p className="text-center text-gray-500 py-4">لا يوجد محتوى تسويقي.</p>
              )}
            </div>
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white/5 border border-[var(--theme-primary)]/20 shadow-[0_0_15px_var(--theme-primary)]/10 rounded-2xl p-6 backdrop-blur-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--theme-primary)]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-[var(--theme-primary)]/20 transition-all duration-500"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--theme-primary)]/20">
              <h3 className="text-xl font-bold text-[var(--theme-primary)] flex items-center gap-2">
                <Users className="w-5 h-5" />
                المنضمين الجدد
              </h3>
              <Link href="/admin/users" className="text-sm text-[var(--theme-primary)] hover:brightness-125 font-bold">
                عرض الكل
              </Link>
            </div>
            <div className="space-y-4">
              {recentUsers.length > 0 ? recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 rounded-xl bg-black/40 border border-[var(--theme-primary)]/10 hover:border-[var(--theme-primary)]/40 hover:shadow-[0_0_10px_var(--theme-primary)]/10 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[var(--theme-primary)]/20 text-[var(--theme-primary)] flex items-center justify-center font-bold overflow-hidden border border-[var(--theme-primary)]/30">
                      {user.image ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={user.image} alt={user.name || ''} className="w-full h-full object-cover" />
                      ) : (
                        <UserCircle className="w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-200 truncate w-32">{user.name || 'مجهول'}</h4>
                      <p className="text-xs text-gray-500 truncate w-32" dir="ltr">{user.email}</p>
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
    </div>
  );
}
