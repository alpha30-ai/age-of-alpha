'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, BookOpen, Users, Film, Palette, ArrowRight, ChevronRight, ChevronLeft, Menu, X, Settings, Flame, UserCircle, MessageSquare, Share2, Library } from 'lucide-react';

export default function AdminSidebar({ user }: { user?: any }) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const links = [
    { href: '/admin', label: 'لوحة القيادة', icon: LayoutDashboard, color: 'text-blue-400' },
    { href: '/admin/novels', label: 'الروايات', icon: Library, color: 'text-cyan-400' },
    { href: '/admin/chapters', label: 'الفصول', icon: BookOpen, color: 'text-orange-400' },
    { href: '/admin/characters', label: 'الشخصيات', icon: Users, color: 'text-purple-400' },
    { href: '/admin/videos', label: 'الفيديوهات', icon: Film, color: 'text-emerald-400' },
    { href: '/admin/community', label: 'مجتمع القراء', icon: Users, color: 'text-yellow-400' },
    { href: '/admin/theme', label: 'المظهر', icon: Palette, color: 'text-orange-400' },
    { href: '/admin/users', label: 'المستخدمين', icon: UserCircle, color: 'text-indigo-400' },
    { href: '/admin/comments', label: 'التعليقات', icon: MessageSquare, color: 'text-pink-400' },
    { href: '/admin/social', label: 'النشر والتسويق', icon: Share2, color: 'text-rose-400' },
    { href: '/admin/backup', label: 'النسخ الاحتياطي', icon: Settings, color: 'text-gray-400' },
    { href: '/admin/settings', label: 'إعدادات النظام', icon: Flame, color: 'text-red-500' },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="md:hidden p-4 bg-black/50 border-b border-white/10 flex items-center justify-between z-30 relative">
        <h2 className="text-xl font-bold text-white tracking-wide text-[var(--theme-primary)] truncate">
          لوحة التحكم
        </h2>
        <div className="flex items-center gap-2">
          <Link href="/" className="p-2 text-white bg-white/10 hover:bg-white/20 rounded-lg flex items-center gap-2 transition-colors">
            <span className="text-xs font-bold">الرئيسية</span>
          </Link>
          <button onClick={() => setIsMobileOpen(true)} className="p-2 text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <aside 
        className={`fixed md:relative top-0 right-0 h-screen bg-white/5 backdrop-blur-xl border-l border-white/10 flex flex-col z-40 shadow-[4px_0_24px_rgba(0,0,0,0.5)] transition-all duration-300 ease-in-out
          ${isMobileOpen ? 'translate-x-0 w-72' : 'translate-x-full md:translate-x-0'}
          ${isCollapsed ? 'md:w-20' : 'md:w-72'}
        `}
      >
        <div className={`p-6 flex items-center justify-between border-b border-white/5 ${isCollapsed ? 'justify-center p-4' : ''}`}>
          <div className="flex items-center gap-2">
            <Flame className="w-8 h-8 text-[var(--theme-primary)] drop-shadow-[0_0_10px_var(--theme-primary)] shrink-0" />
            {!isCollapsed && (
              <h2 className="text-2xl font-bold text-white tracking-wide truncate">
                عهد ألفا
              </h2>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Link href="/" className={`flex items-center gap-1 text-gray-400 hover:text-white transition-colors bg-white/5 px-2 py-1 rounded-lg ${isCollapsed ? 'hidden' : 'hidden md:flex'}`} title="العودة للموقع">
              <span className="text-xs font-bold">الرئيسية</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <button onClick={() => setIsMobileOpen(false)} className="md:hidden p-2 text-gray-400 hover:text-white bg-white/5 rounded-lg transition-colors">
               <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <nav className="flex-1 space-y-2 p-4 overflow-y-auto">
          {links.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link 
                key={link.href}
                href={link.href} 
                title={link.label}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                  isActive 
                    ? 'bg-white/10 text-white shadow-inner border border-white/5' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 transition-colors ${isActive ? 'text-[var(--theme-primary)]' : link.color} group-hover:text-[var(--theme-primary)]`} />
                {!isCollapsed && <span className="font-bold truncate">{link.label}</span>}
              </Link>
            )
          })}
        </nav>

        {!isCollapsed && (
          <div className="m-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md relative group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--theme-primary)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[var(--theme-primary)]/50 bg-black/50 shadow-[0_0_15px_var(--theme-primary)]/20 flex-shrink-0">
                {user?.image && user.image.trim() !== '' ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={user.image} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xl font-bold text-[var(--theme-primary)]">
                    {user?.name?.[0]?.toUpperCase() || 'A'}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0 text-right">
                <p className="text-sm font-bold text-white truncate">{user?.name || 'المدير العام'}</p>
                <p className="text-xs text-gray-400 truncate mt-0.5">{user?.email}</p>
                <p className="text-[10px] text-[var(--theme-primary)] font-bold mt-1 bg-[var(--theme-primary)]/10 inline-block px-2 py-0.5 rounded-full border border-[var(--theme-primary)]/20">صلاحيات كاملة</p>
              </div>
            </div>
          </div>
        )}

        {/* Desktop Collapse Toggle */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex absolute -left-4 top-1/2 transform -translate-y-1/2 bg-[#111] border border-white/10 rounded-full p-1 text-gray-400 hover:text-white hover:bg-white/10 shadow-xl transition-all"
        >
          {isCollapsed ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </button>
      </aside>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
}
