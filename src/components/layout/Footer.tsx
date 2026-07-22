'use client';

import { Flame, MessageCircle, Globe, Tv, Code2 } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/5 overflow-hidden bg-[#050505] text-gray-400">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-px bg-gradient-to-r from-transparent via-[var(--theme-primary)] to-transparent opacity-30" />
      
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Brand & Description (Spans 4 columns) */}
          <div className="col-span-1 md:col-span-5 space-y-6">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-[var(--theme-primary)]/5 border border-[var(--theme-primary)]/20 group-hover:border-[var(--theme-primary)]/50 transition-colors">
                <Flame className="w-5 h-5 text-[var(--theme-primary)]" />
              </div>
              <span className="font-amiri font-bold text-2xl tracking-wide text-white">
                عهد ألفا
              </span>
            </Link>
            <p className="text-sm leading-relaxed font-tajawal max-w-md">
              ملحمة الفانتازيا المظلمة التي ستأخذك في رحلة إلى إمارة الصدأ. حيث تتصارع القوى العظمى في عالم لا يرحم الضعفاء. استعد لاكتشاف أسرار الدول المائة.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-4 pt-2">
              <motion.a whileHover={{ y: -2 }} href="#" className="p-2 rounded-md bg-white/5 border border-white/5 hover:text-[var(--theme-primary)] hover:border-[var(--theme-primary)]/30 transition-all duration-300">
                <MessageCircle className="w-4 h-4" />
              </motion.a>
              <motion.a whileHover={{ y: -2 }} href="#" className="p-2 rounded-md bg-white/5 border border-white/5 hover:text-[var(--theme-primary)] hover:border-[var(--theme-primary)]/30 transition-all duration-300">
                <Tv className="w-4 h-4" />
              </motion.a>
              <motion.a whileHover={{ y: -2 }} href="#" className="p-2 rounded-md bg-white/5 border border-white/5 hover:text-[var(--theme-primary)] hover:border-[var(--theme-primary)]/30 transition-all duration-300">
                <Globe className="w-4 h-4" />
              </motion.a>
            </div>
          </div>

          {/* Quick Links (Spans 3 columns) */}
          <div className="col-span-1 md:col-span-3 space-y-6">
            <h3 className="font-cairo font-bold text-lg text-white">
              روابط سريعة
            </h3>
            <div className="flex flex-col space-y-3 mt-4">
              <Link href="/" className="hover:text-[var(--theme-primary)] transition-colors font-tajawal text-sm w-fit">
                الرئيسية
              </Link>
              <Link href="/chapters" className="hover:text-[var(--theme-primary)] transition-colors font-tajawal text-sm w-fit">
                دليل الفصول
              </Link>
              <Link href="/characters" className="hover:text-[var(--theme-primary)] transition-colors font-tajawal text-sm w-fit">
                أبطال الملحمة
              </Link>
              <Link href="/videos" className="hover:text-[var(--theme-primary)] transition-colors font-tajawal text-sm w-fit">
                السجلات المرئية
              </Link>
            </div>
          </div>

          {/* Contact / Help (Spans 4 columns) */}
          <div className="col-span-1 md:col-span-4 space-y-6">
            <h3 className="font-cairo font-bold text-lg text-white">
              انضم إلى مجتمعنا
            </h3>
            <p className="font-tajawal text-sm leading-relaxed mt-4">
              اشترك في نشرتنا السحرية لتصلك أحدث فصول الرواية قبل الجميع. لن نرسل لك أي تعويذات مزعجة!
            </p>
            <form className="relative mt-4">
              <input 
                type="email" 
                placeholder="بريدك الإلكتروني..." 
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg py-3 px-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-[var(--theme-primary)]/50 focus:ring-1 focus:ring-[var(--theme-primary)]/50 transition-all font-tajawal text-sm"
              />
              <button 
                type="button" 
                className="absolute left-1 top-1 bottom-1 px-6 bg-[var(--theme-primary)] hover:opacity-90 text-black font-tajawal font-bold text-sm rounded-md transition-opacity"
              >
                اشتراك
              </button>
            </form>
          </div>

        </div>

        {/* Developer Badge & Copyright */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          
          <p className="text-xs font-tajawal">
            © {currentYear} عهد ألفا: ملحمة الدول المائة. جميع الحقوق محفوظة.
          </p>

          {/* Sleek Developer Tag */}
          <div className="flex items-center gap-2 text-xs font-tajawal uppercase tracking-widest text-gray-500 hover:text-white transition-colors duration-500 group">
            <Code2 className="w-4 h-4 text-[var(--theme-primary)] opacity-50 group-hover:opacity-100 transition-opacity" />
            <span className="opacity-70 group-hover:opacity-100 transition-opacity">Developed By</span>
            <span className="font-bold text-white tracking-widest">Mohamed Hashish</span>
          </div>

        </div>
      </div>
    </footer>
  );
}
