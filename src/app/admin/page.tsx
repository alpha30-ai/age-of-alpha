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
      {/* Epic Royal Command Center */}
      <div className="relative rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-[#0a0a0a] to-[#151515] border border-white/10 shadow-2xl group min-h-[300px] flex items-center">
        
        {/* Animated Background Layers */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-[70%] h-full bg-gradient-to-l from-[var(--theme-primary)]/20 to-transparent opacity-90" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[120%] bg-[var(--theme-secondary)]/10 blur-[120px] rounded-full mix-blend-screen animate-pulse" />
          <div className="absolute top-1/4 right-1/4 w-[50%] h-[60%] bg-[var(--theme-primary)]/10 blur-[100px] rounded-full mix-blend-screen" />
          <div className="absolute inset-0 bg-[linear-gradient(var(--theme-primary)_1px,transparent_1px),linear-gradient(90deg,var(--theme-primary)_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.03]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-90" />
        </div>
        
        <div className="relative z-10 w-full p-8 md:p-14 flex flex-col lg:flex-row items-center justify-between gap-12">
          
          {/* Text & Status */}
          <div className="text-center lg:text-right flex-1 w-full">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-md shadow-lg">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" />
              <span className="text-xs font-bold text-gray-300 font-tajawal tracking-wide">النظام الملكي متصل ويعمل بكفاءة</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 font-cairo tracking-tight drop-shadow-xl">
              مركز القيادة <span className="text-transparent bg-clip-text bg-gradient-to-br from-[var(--theme-primary)] to-rose-400">الملكي</span>
            </h1>
            
            <p className="text-gray-400 text-lg md:text-xl font-tajawal max-w-2xl leading-relaxed mx-auto lg:mx-0">
              مرحباً بك في غرفة العمليات المركزية. من هنا يمكنك إدارة الإمبراطورية، نشر الفصول، تخصيص المظهر، والتحكم في مصير العوالم بأكملها.
            </p>
          </div>
          
          {/* Quick Actions Panel */}
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto shrink-0 relative z-20">
            <Link 
              href="/admin/chapters/new" 
              className="flex items-center justify-center gap-3 bg-gradient-to-br from-[var(--theme-primary)] to-[#c53912] text-white px-8 py-5 rounded-2xl font-cairo font-bold text-lg hover:scale-[1.02] transition-all shadow-[0_0_30px_var(--theme-primary)]/30 hover:shadow-[0_0_50px_var(--theme-primary)]/50 group/btn border border-white/10"
            >
              <div className="bg-white/20 p-2 rounded-xl group-hover/btn:rotate-90 transition-transform duration-300">
                <Plus className="w-5 h-5" />
              </div>
              مخطوطة جديدة
            </Link>
            
            <Link 
              href="/admin/theme" 
              className="flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 px-8 py-5 rounded-2xl font-cairo font-bold text-lg hover:scale-[1.02] transition-all backdrop-blur-md shadow-lg"
            >
              <div className="bg-white/10 p-2 rounded-xl">
                <Palette className="w-5 h-5 text-gray-300" />
              </div>
              مظهر المنصة
            </Link>
          </div>
          
        </div>
      </div>

      {/* Stats Cards */}
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
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[var(--theme-primary)]" />
                أحدث المخطوطات
              </h3>
              <Link href="/admin/chapters" className="text-sm text-gray-400 hover:text-white font-bold transition-colors">
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
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Share2 className="w-5 h-5 text-[var(--theme-primary)]" />
                المحتوى التسويقي
              </h3>
              <Link href="/admin/social" className="text-sm text-gray-400 hover:text-white font-bold transition-colors">
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
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-[var(--theme-primary)]" />
                المنضمين الجدد
              </h3>
              <Link href="/admin/users" className="text-sm text-gray-400 hover:text-white font-bold transition-colors">
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
