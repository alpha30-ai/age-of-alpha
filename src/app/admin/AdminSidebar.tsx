'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, BookOpen, Users, Film, Palette, ArrowRight, ChevronRight, ChevronLeft, Menu, X, Settings, Flame, UserCircle, MessageSquare } from 'lucide-react';

export default function AdminSidebar({ user }: { user?: any }) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const links = [
    { href: '/admin', label: 'لوحة القيادة', icon: LayoutDashboard, color: 'text-blue-400' },
    { href: '/admin/chapters', label: 'الفصول', icon: BookOpen, color: 'text-orange-400' },
    { href: '/admin/characters', label: 'الشخصيات', icon: Users, color: 'text-purple-400' },
    { href: '/admin/videos', label: 'الفيديوهات', icon: Film, color: 'text-emerald-400' },
    { href: '/admin/theme', label: 'المظهر', icon: Palette, color: 'text-yellow-400' },
    { href: '/admin/users', label: 'المستخدمين', icon: UserCircle, color: 'text-indigo-400' },
    { href: '/admin/comments', label: 'التعليقات', icon: MessageSquare, color: 'text-pink-400' },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="md:hidden p-4 bg-black/50 border-b border-white/10 flex items-center justify-between z-50 relative">
        <h2 className="text-xl font-bold text-white tracking-wide text-magma truncate">
          لوحة التحكم
        </h2>
        <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="p-2 text-white bg-white/10 rounded-lg">
          {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside 
        className={`fixed md:relative top-0 right-0 h-screen bg-white/5 backdrop-blur-xl border-l border-white/10 flex flex-col z-40 shadow-[4px_0_24px_rgba(0,0,0,0.5)] transition-all duration-300 ease-in-out
          ${isMobileOpen ? 'translate-x-0 w-72' : 'translate-x-full md:translate-x-0'}
          ${isCollapsed ? 'md:w-20' : 'md:w-72'}
        `}
      >
        <div className={`p-6 flex items-center justify-between border-b border-white/5 ${isCollapsed ? 'justify-center' : ''}`}>
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <Flame className="w-8 h-8 text-magma animate-pulse" />
              <h2 className="text-2xl font-bold text-white tracking-wide text-magma truncate">
                عهد ألفا
              </h2>
            </div>
          )}
          <Link href="/" className={`text-gray-400 hover:text-white transition-colors ${isCollapsed ? 'hidden' : ''}`} title="العودة للموقع">
            <ArrowRight className="w-5 h-5" />
          </Link>
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
                <Icon className={`w-5 h-5 flex-shrink-0 transition-colors ${isActive ? 'text-magma' : link.color} group-hover:text-white`} />
                {!isCollapsed && <span className="font-bold truncate">{link.label}</span>}
              </Link>
            )
          })}
        </nav>

        {!isCollapsed && (
          <div className="m-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md relative group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-magma/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-magma/50 bg-black/50 shadow-[0_0_15px_rgba(230,74,25,0.2)] flex-shrink-0">
                {user?.image && user.image.trim() !== '' ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={user.image} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xl font-bold text-magma">
                    {user?.name?.[0]?.toUpperCase() || 'A'}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0 text-right">
                <p className="text-sm font-bold text-white truncate">{user?.name || 'المدير العام'}</p>
                <p className="text-xs text-gray-400 truncate mt-0.5">{user?.email}</p>
                <p className="text-[10px] text-magma font-bold mt-1 bg-magma/10 inline-block px-2 py-0.5 rounded-full border border-magma/20">صلاحيات كاملة</p>
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
