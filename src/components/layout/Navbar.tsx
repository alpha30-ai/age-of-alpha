'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Flame, BookOpen, Film, Shield, LogOut, LogIn, User, Settings, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-black/60 backdrop-blur-2xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)] py-2'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group relative z-10">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-magma/10 border border-magma/30 group-hover:bg-magma/20 group-hover:border-magma/50 transition-all duration-500 overflow-hidden">
              <Flame className="w-6 h-6 text-magma-light relative z-10 group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-magma/30 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            <span className="font-amiri font-bold text-2xl tracking-wide text-white group-hover:text-magma-light transition-colors duration-500">
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

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="md:hidden absolute top-full left-0 right-0 overflow-hidden bg-black/95 backdrop-blur-3xl border-b border-white/10 shadow-2xl"
          >
            <div className="px-4 py-6 space-y-3">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-4 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300 font-cairo font-bold text-lg"
                  >
                    <Icon className="w-5 h-5 text-magma-light" />
                    {link.label}
                  </Link>
                );
              })}
              
              <div className="h-px bg-white/10 my-4" />
              
              {session ? (
                <div className="space-y-2">
                  {(session.user as any)?.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-4 rounded-xl text-yellow-500 hover:bg-yellow-500/10 transition-all duration-300 font-cairo font-bold"
                    >
                      <Shield className="w-5 h-5" />
                      لوحة تحكم الإدارة
                    </Link>
                  )}
                  <Link
                    href="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-4 rounded-xl text-milky-blue-light hover:bg-milky-blue/10 transition-all duration-300 font-cairo font-bold"
                  >
                    <User className="w-5 h-5" />
                    حسابي (متابعة القراءة)
                  </Link>
                  <Link
                    href="/settings"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-4 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300 font-cairo font-bold"
                  >
                    <Settings className="w-5 h-5" />
                    إعدادات الحساب
                  </Link>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      signOut();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-4 rounded-xl text-red-400 hover:bg-red-500/10 transition-all duration-300 font-cairo font-bold text-right"
                  >
                    <LogOut className="w-5 h-5" />
                    تسجيل الخروج
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-3 w-full px-4 py-4 rounded-xl bg-magma/80 text-white font-cairo font-bold text-lg shadow-[0_0_20px_rgba(230,74,25,0.4)]"
                >
                  <LogIn className="w-5 h-5" />
                  بوابة الدخول
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
