'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { BookOpen, Crown, Shield, Clock, Flame, ArrowLeft, Swords } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';

interface DashboardClientProps {
  user: {
    name: string;
    email: string;
    image?: string | null;
    role: string;
    createdAt: Date;
    savedChapterId: string | null;
  };
  recentChapters: {
    id: string;
    title: string;
    chapterNum: number;
  }[];
}

export default function DashboardClient({ user, recentChapters }: DashboardClientProps) {
  const isAdmin = user.role === 'ADMIN';

  return (
    <div className="min-h-screen bg-[#050505] text-white font-tajawal relative overflow-hidden" dir="rtl">
      {/* Global Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        
        {/* Welcome Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[var(--theme-primary)] shadow-[0_0_20px_color-mix(in_srgb,var(--theme-primary)_30%,transparent)] bg-[#111] flex items-center justify-center">
              {user.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
              ) : isAdmin ? (
                <Crown className="w-8 h-8 text-[var(--theme-primary)]" />
              ) : (
                <Shield className="w-8 h-8 text-[var(--theme-primary)]" />
              )}
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-l from-white to-gray-400">
                مرحباً يا بطل، {user.name}
              </h1>
              <p className="text-gray-400 text-lg mt-2 flex items-center gap-2">
                <Swords className="w-5 h-5 text-gray-500" />
                <span>إمارة الصدأ ترحب بعودتك.</span>
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Stats & Profile (takes 1 column) */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-8"
          >
            {/* ID Card */}
            <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 shadow-xl relative overflow-hidden group hover:border-[var(--theme-primary)]/50 transition-all duration-500">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--theme-primary)] opacity-5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:opacity-10 transition-all duration-500" />
              
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-white border-b border-white/5 pb-4">
                <Shield className="w-6 h-6 text-[var(--theme-primary)]" />
                هوية المقاتل
              </h3>
              
              <div className="space-y-5">
                <div>
                  <p className="text-sm text-gray-500 mb-1">الاسم</p>
                  <p className="font-bold text-lg text-gray-200">{user.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">البريد الإلكتروني</p>
                  <p className="font-bold text-gray-400" dir="ltr">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">الرتبة</p>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold bg-[var(--theme-primary)]/10 text-[var(--theme-primary)] border border-[var(--theme-primary)]/20 shadow-[0_0_10px_color-mix(in_srgb,var(--theme-primary)_10%,transparent)]">
                    {isAdmin ? <Crown className="w-4 h-4" /> : <Swords className="w-4 h-4" />}
                    {isAdmin ? 'الإمبراطور الأعظم' : 'فارس عادي'}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">تاريخ الانضمام</p>
                  <p className="font-bold text-gray-400 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    {new Date(user.createdAt).toLocaleDateString('ar-EG')}
                  </p>
                </div>
              </div>

              {isAdmin ? (
                <div className="mt-8 pt-6 border-t border-white/10 space-y-3">
                  <Link 
                    href="/settings"
                    className="w-full flex items-center justify-center gap-2 bg-[#111] hover:bg-white/5 text-gray-300 hover:text-white border border-white/10 py-3 rounded-xl transition-all font-bold"
                  >
                    تعديل إعدادات الحساب
                  </Link>
                  <Link 
                    href="/admin"
                    className="w-full flex items-center justify-center gap-2 bg-[var(--theme-primary)]/10 hover:bg-[var(--theme-primary)]/20 text-[var(--theme-primary)] border border-[var(--theme-primary)]/30 py-3 rounded-xl transition-all font-bold shadow-[0_0_15px_color-mix(in_srgb,var(--theme-primary)_15%,transparent)]"
                  >
                    <Crown className="w-5 h-5" />
                    الدخول لغرفة القيادة
                  </Link>
                </div>
              ) : (
                <div className="mt-8 pt-6 border-t border-white/10">
                  <Link 
                    href="/settings"
                    className="w-full flex items-center justify-center gap-2 bg-[#111] hover:bg-white/5 text-gray-300 hover:text-white border border-white/10 py-3 rounded-xl transition-all font-bold"
                  >
                    تعديل إعدادات الحساب
                  </Link>
                </div>
              )}
            </div>
          </motion.div>

          {/* Right Column: Content & Reading Progress (takes 2 columns) */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* Reading Progress Card */}
            <div className="bg-gradient-to-br from-[#111] to-[#050505] border border-[var(--theme-primary)]/30 rounded-3xl p-8 shadow-[0_0_30px_color-mix(in_srgb,var(--theme-primary)_10%,transparent)] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-l from-[var(--theme-primary)] to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <div>
                  <h3 className="text-2xl font-bold mb-3 flex items-center gap-3 text-white">
                    <BookOpen className="w-7 h-7 text-[var(--theme-primary)]" />
                    مخطوطتك الحالية
                  </h3>
                  <p className="text-gray-400">
                    {user.savedChapterId ? 'القدر ينتظر أن تكمل ما بدأته.' : 'لم تبدأ رحلتك بعد.. افتح الفصل الأول لتكتب أسطورتك.'}
                  </p>
                </div>
                
                <Link 
                  href={user.savedChapterId ? `/chapters/${user.savedChapterId}` : `/chapters/1`}
                  className="shrink-0 inline-flex items-center justify-center gap-2 bg-[var(--theme-primary)] hover:opacity-90 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-[0_0_20px_color-mix(in_srgb,var(--theme-primary)_40%,transparent)] hover:scale-105"
                >
                  {user.savedChapterId ? 'متابعة القراءة' : 'ابدأ من الفصل الأول'}
                  <ArrowLeft className="w-5 h-5" />
                </Link>
              </div>
            </div>

            {/* Recommended/Recent Chapters */}
            <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 shadow-xl">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-white border-b border-white/5 pb-4">
                <Flame className="w-6 h-6 text-[var(--theme-primary)]" />
                فصول ملحمية
              </h3>
              
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {recentChapters.length > 0 ? (
                  recentChapters.map((chapter) => (
                    <Link 
                      key={chapter.id}
                      href={`/chapters/${chapter.id}`}
                      className="group block bg-[#111] border border-white/5 hover:border-[var(--theme-primary)]/50 rounded-2xl p-5 transition-all duration-300"
                    >
                      <span className="text-[var(--theme-primary)] font-bold text-sm mb-2 block">الفصل {chapter.chapterNum}</span>
                      <h4 className="text-lg font-bold text-gray-300 group-hover:text-white transition-colors line-clamp-2">
                        {chapter.title}
                      </h4>
                    </Link>
                  ))
                ) : (
                  <div className="col-span-full py-12 text-center text-gray-500 border border-dashed border-white/10 rounded-2xl bg-black/50">
                    لم يتم نشر أي فصول بعد في المملكة.
                  </div>
                )}
              </div>
            </div>

          </motion.div>

        </div>
      </main>
    </div>
  );
}
