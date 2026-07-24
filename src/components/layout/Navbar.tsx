'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Menu, X, BookOpen, Users, Video, Info, User, LogIn, LogOut, Settings, Shield, Film } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'الرئيسية', icon: Flame },
    { href: '/chapters', label: 'الفصول', icon: BookOpen },
    { href: '/characters', label: 'أبطال الملحمة', icon: Users },
    { href: '/videos', label: 'السجلات المرئية', icon: Film },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className={`fixed top-0 w-full left-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-black/60 backdrop-blur-2xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)] py-2'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group relative z-10 shrink-0">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-magma/10 border border-magma/30 group-hover:bg-magma/20 group-hover:border-magma/50 transition-all duration-500 overflow-hidden shrink-0">
              <Flame className="w-6 h-6 text-magma-light relative z-10 group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-magma/30 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            <span className="font-amiri font-bold text-2xl tracking-wide text-white group-hover:text-magma-light transition-colors duration-500 whitespace-nowrap">
              عهد ألفا
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1 bg-black/40 border border-white/5 backdrop-blur-md px-2 py-1.5 rounded-2xl shadow-inner">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300 font-cairo font-semibold text-sm"
                >
                  <Icon className="w-4 h-4 opacity-70" />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {session ? (
              <div className="flex items-center gap-2 bg-black/40 border border-white/5 p-1.5 rounded-2xl">
                {/* Admin Link */}
                {(session.user as any)?.role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-yellow-500 hover:text-yellow-400 hover:bg-yellow-500/10 transition-all duration-300 font-cairo text-sm font-bold"
                  >
                    <Shield className="w-4 h-4" />
                    الإدارة
                  </Link>
                )}
                
                {/* Dashboard Link */}
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 px-2 py-1.5 rounded-xl text-milky-blue-light hover:text-white hover:bg-milky-blue/10 transition-all duration-300 font-cairo text-sm font-bold border border-transparent hover:border-white/10"
                >
                  {(session.user as any)?.image ? (
                    <div className="w-7 h-7 rounded-full overflow-hidden border border-milky-blue/50">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={(session.user as any).image} alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <User className="w-4 h-4 ml-1" />
                  )}
                  {!(session.user as any)?.image && "حسابي"}
                </Link>

                <Link
                  href="/settings"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300 font-cairo text-sm font-bold"
                  title="إعدادات الحساب"
                >
                  <Settings className="w-4 h-4" />
                </Link>

                <div className="w-px h-6 bg-white/10 mx-1" />

                {/* Logout Button */}
                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 font-cairo text-sm"
                  title="تسجيل الخروج"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="group relative inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-magma/80 hover:bg-magma text-white font-cairo font-bold text-sm transition-all duration-300 shadow-[0_0_15px_rgba(230,74,25,0.3)] hover:shadow-[0_0_30px_rgba(230,74,25,0.6)] overflow-hidden border border-magma-light/30"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <LogIn className="w-4 h-4 relative z-10" />
                <span className="relative z-10">بوابة الدخول</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden relative z-10 p-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-all"
            aria-label="تبديل القائمة"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Full-Screen Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden fixed inset-0 z-40 bg-black/80 backdrop-blur-3xl flex flex-col pt-16 px-6 pb-6 overflow-y-auto"
          >
            {/* Close Button */}
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-6 left-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white z-50 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Background Effects inside menu */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-magma/10 blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 blur-[100px] pointer-events-none" />

            <div className="relative z-10 space-y-6 flex-1 flex flex-col">
              <div className="space-y-2">
                {navLinks.map((link, i) => {
                  const Icon = link.icon;
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.1 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-4 px-4 py-4 rounded-2xl text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-300 font-cairo font-bold text-xl group"
                      >
                        <div className="p-2 rounded-xl bg-white/5 group-hover:bg-magma/20 group-hover:text-magma-light transition-colors">
                          <Icon className="w-6 h-6" />
                        </div>
                        {link.label}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
              
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ delay: 0.4 }}
                className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-6" 
              />
              
              <motion.div 
                className="mt-auto space-y-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
              >
                {session ? (
                  <div className="bg-white/5 p-4 rounded-3xl border border-white/10 space-y-2">
                    <div className="flex items-center gap-3 mb-4 px-2">
                      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-magma/30">
                        {(session.user as any)?.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={(session.user as any).image} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-black/50 flex items-center justify-center">
                            <User className="w-5 h-5 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-white font-bold font-cairo">{session.user?.name || 'مستخدم'}</p>
                        <p className="text-xs text-gray-400">{session.user?.email}</p>
                      </div>
                    </div>

                    {(session.user as any)?.role === 'ADMIN' && (
                      <Link
                        href="/admin"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-yellow-500 hover:bg-yellow-500/10 transition-all duration-300 font-cairo font-bold bg-black/20"
                      >
                        <Shield className="w-5 h-5" />
                        لوحة تحكم الإدارة
                      </Link>
                    )}
                    <Link
                      href="/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-milky-blue-light hover:bg-milky-blue/10 transition-all duration-300 font-cairo font-bold bg-black/20"
                    >
                      <User className="w-5 h-5" />
                      حسابي (متابعة القراءة)
                    </Link>
                    <Link
                      href="/settings"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300 font-cairo font-bold bg-black/20"
                    >
                      <Settings className="w-5 h-5" />
                      إعدادات الحساب
                    </Link>
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        signOut();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all duration-300 font-cairo font-bold text-right bg-black/20"
                    >
                      <LogOut className="w-5 h-5" />
                      تسجيل الخروج
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-3 w-full px-4 py-4 rounded-2xl bg-gradient-to-r from-magma-dark to-magma text-white font-cairo font-bold text-xl shadow-[0_0_20px_rgba(230,74,25,0.4)]"
                  >
                    <LogIn className="w-6 h-6" />
                    بوابة الدخول
                  </Link>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
