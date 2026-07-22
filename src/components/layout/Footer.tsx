'use client';

import { Flame, MessageCircle, Globe, Tv, Code2, Heart } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/10 overflow-hidden bg-[#050505]">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-1 bg-gradient-to-r from-transparent via-magma to-transparent opacity-50" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-xl h-[100px] bg-magma/10 blur-[80px]" />
      
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Brand & Description (Spans 4 columns) */}
          <div className="col-span-1 md:col-span-5 space-y-6">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-magma/10 border border-magma/30">
                <Flame className="w-7 h-7 text-magma-light group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-magma/30 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <span className="font-amiri font-bold text-3xl tracking-wide text-white">
                عهد ألفا
              </span>
            </Link>
            <p className="text-base text-gray-400 leading-relaxed font-tajawal max-w-md">
              ملحمة الفانتازيا المظلمة التي ستأخذك في رحلة إلى إمارة الصدأ. حيث تتصارع القوى العظمى في عالم لا يرحم الضعفاء. استعد لاكتشاف أسرار الدول المائة.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-4 pt-2">
              <motion.a whileHover={{ scale: 1.1, y: -2 }} href="#" className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-[var(--theme-primary)] hover:bg-[var(--theme-primary)]/10 hover:border-[var(--theme-primary)]/30 transition-all duration-300">
                <MessageCircle className="w-5 h-5" />
              </motion.a>
              <motion.a whileHover={{ scale: 1.1, y: -2 }} href="#" className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-[var(--theme-primary)] hover:bg-[var(--theme-primary)]/10 hover:border-[var(--theme-primary)]/30 transition-all duration-300">
                <Tv className="w-5 h-5" />
              </motion.a>
              <motion.a whileHover={{ scale: 1.1, y: -2 }} href="#" className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-[var(--theme-primary)] hover:bg-[var(--theme-primary)]/10 hover:border-[var(--theme-primary)]/30 transition-all duration-300">
                <Globe className="w-5 h-5" />
              </motion.a>
            </div>
          </div>

          {/* Quick Links (Spans 3 columns) */}
          <div className="col-span-1 md:col-span-3 space-y-6">
            <h3 className="font-cairo font-bold text-xl text-white relative inline-block">
              روابط سريعة
              <span className="absolute -bottom-2 right-0 w-1/2 h-0.5 bg-gradient-to-l from-[var(--theme-primary)] to-transparent rounded-full" />
            </h3>
            <div className="flex flex-col space-y-4 mt-8">
              <Link href="/" className="text-gray-400 hover:text-[var(--theme-primary)] hover:translate-x-[-8px] transition-all duration-300 font-tajawal text-lg w-fit flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-600 opacity-0 group-hover:opacity-100" />
                الرئيسية
              </Link>
              <Link href="/chapters" className="text-gray-400 hover:text-[var(--theme-primary)] hover:translate-x-[-8px] transition-all duration-300 font-tajawal text-lg w-fit flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-600 opacity-0 group-hover:opacity-100" />
                دليل الفصول
              </Link>
              <Link href="/characters" className="text-gray-400 hover:text-[var(--theme-primary)] hover:translate-x-[-8px] transition-all duration-300 font-tajawal text-lg w-fit flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-600 opacity-0 group-hover:opacity-100" />
                أبطال الملحمة
              </Link>
              <Link href="/videos" className="text-gray-400 hover:text-[var(--theme-primary)] hover:translate-x-[-8px] transition-all duration-300 font-tajawal text-lg w-fit flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-600 opacity-0 group-hover:opacity-100" />
                السجلات المرئية
              </Link>
            </div>
          </div>

          {/* Contact / Help (Spans 4 columns) */}
          <div className="col-span-1 md:col-span-4 space-y-6">
            <h3 className="font-cairo font-bold text-xl text-white relative inline-block">
              انضم إلى مجتمعنا
              <span className="absolute -bottom-2 right-0 w-1/2 h-0.5 bg-gradient-to-l from-[var(--theme-primary)] to-transparent rounded-full" />
            </h3>
            <p className="text-gray-400 font-tajawal text-base leading-relaxed mt-8">
              اشترك في نشرتنا السحرية لتصلك أحدث فصول الرواية قبل الجميع. لن نرسل لك أي تعويذات مزعجة!
            </p>
            <form className="relative group mt-6">
              <input 
                type="email" 
                placeholder="بريدك الإلكتروني..." 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-5 text-white placeholder:text-gray-600 focus:outline-none focus:border-[var(--theme-primary)]/50 focus:ring-1 focus:ring-[var(--theme-primary)]/50 transition-all font-tajawal backdrop-blur-sm"
              />
              <button 
                type="button" 
                className="absolute left-1.5 top-1.5 bottom-1.5 px-6 bg-gradient-to-r from-[var(--theme-primary)] to-orange-600 hover:opacity-90 text-white font-cairo font-bold text-sm rounded-lg transition-all shadow-lg"
              >
                اشتراك
              </button>
            </form>
          </div>

        </div>

        {/* Developer Badge & Copyright */}
        <div className="mt-20 pt-8 border-t border-white/10 flex flex-col items-center justify-center gap-8 relative">
          
          {/* Stunning Developer Badge */}
          <div className="relative group cursor-pointer">
            <div className="absolute -inset-1 bg-gradient-to-r from-[var(--theme-primary)] via-purple-500 to-blue-500 rounded-full blur opacity-25 group-hover:opacity-60 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
            <div className="relative flex items-center gap-3 bg-black/80 backdrop-blur-xl border border-white/10 px-8 py-3 rounded-full overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
              
              <Code2 className="w-5 h-5 text-[var(--theme-primary)]" />
              <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
                <span className="font-tajawal text-gray-400 text-sm">تم التطوير بكل</span>
                <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse inline-block mx-1" />
                <span className="font-tajawal text-gray-400 text-sm">بواسطة المطور</span>
              </div>
              
              <div className="h-4 w-px bg-white/20 hidden sm:block mx-2" />
              
              <span className="font-cairo font-black text-transparent bg-clip-text bg-gradient-to-l from-white to-gray-400 tracking-wider text-base">
                محمد حشيش
              </span>
              <span className="font-tajawal font-bold text-[var(--theme-primary)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 -ml-2 text-xs">
                M. Hashish
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between w-full items-center gap-4">
            <p className="text-sm text-gray-500 font-tajawal">
              © {currentYear} عهد ألفا: ملحمة الدول المائة. جميع الحقوق محفوظة.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-500 font-tajawal">
              <a href="#" className="hover:text-white transition-colors">شروط الاستخدام</a>
              <a href="#" className="hover:text-white transition-colors">سياسة الخصوصية</a>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}
