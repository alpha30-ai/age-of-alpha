'use client';

import { Flame, MessageCircle, Globe, Tv, Code2, Heart, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#020202] text-gray-400 overflow-hidden font-tajawal">
      {/* Premium Gradient Top Border */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--theme-primary)] to-transparent opacity-50 shadow-[0_0_20px_var(--theme-primary)]" />
      
      {/* Ambient Glows */}
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-[var(--theme-primary)]/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 lg:gap-8 mb-16 border-b border-white/5 pb-16">
          
          {/* Brand & Description */}
          <div className="col-span-1 md:col-span-5 space-y-6">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-[#111] to-[#050505] border border-[var(--theme-primary)]/30 group-hover:border-[var(--theme-primary)] shadow-[0_0_20px_color-mix(in_srgb,var(--theme-primary)_10%,transparent)] group-hover:shadow-[0_0_30px_color-mix(in_srgb,var(--theme-primary)_30%,transparent)] transition-all duration-500">
                <Flame className="w-6 h-6 text-[var(--theme-primary)] group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div>
                <span className="block font-amiri font-bold text-3xl tracking-wide text-white group-hover:text-[var(--theme-primary)] transition-colors duration-500">
                  عهد ألفا
                </span>
                <span className="block text-[10px] text-gray-500 tracking-[0.3em] uppercase">ملحمة الدول المائة</span>
              </div>
            </Link>
            <p className="text-sm leading-loose text-gray-400 max-w-sm">
              حيث تتصارع القوى العظمى في عالم لا يرحم الضعفاء. ملحمة الفانتازيا المظلمة التي ستأسر خيالك إلى الأبد.
            </p>
            
            {/* Social Links Premium */}
            <div className="flex items-center gap-3 pt-4">
              {[MessageCircle, Tv, Globe].map((Icon, idx) => (
                <a key={idx} href="#" className="relative p-3 rounded-xl bg-[#0a0a0a] border border-white/10 hover:border-[var(--theme-primary)]/50 group transition-all duration-500 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-[var(--theme-primary)]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <Icon className="w-5 h-5 text-gray-500 group-hover:text-white relative z-10 transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1 md:col-span-3 space-y-8 mt-2">
            <h3 className="font-bold text-lg text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[var(--theme-primary)]" />
              روابط سريعة
            </h3>
            <ul className="space-y-4">
              {['الرئيسية', 'دليل الفصول', 'أبطال الملحمة', 'السجلات المرئية'].map((item, idx) => (
                <li key={idx}>
                  <Link href="#" className="group flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors w-fit">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-[var(--theme-primary)] transition-colors" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Premium */}
          <div className="col-span-1 md:col-span-4 space-y-6 mt-2">
            <h3 className="font-bold text-lg text-white">
              انضم إلى النخبة
            </h3>
            <p className="text-sm leading-relaxed text-gray-400">
              احصل على مخطوطات حصرية وتسريبات من داخل إمارة الصدأ مباشرة إلى بريدك السحري.
            </p>
            <form className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--theme-primary)] to-purple-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative flex p-1 bg-[#0a0a0a] rounded-xl border border-white/10">
                <input 
                  type="email" 
                  placeholder="بريدك الإلكتروني..." 
                  className="w-full bg-transparent border-none px-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-0 text-sm"
                />
                <button 
                  type="button" 
                  className="shrink-0 px-6 py-3 bg-[var(--theme-primary)] hover:bg-[var(--theme-primary)] text-white font-bold text-sm rounded-lg shadow-[0_0_15px_color-mix(in_srgb,var(--theme-primary)_40%,transparent)] transition-all transform hover:scale-105"
                >
                  اشتراك
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Developer Badge & Copyright */}
        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-8 md:gap-4">
          
          <p className="text-xs text-gray-600 font-medium">
            © {currentYear} عهد ألفا. جميع الحقوق محفوظة لورثة العرش.
          </p>

          {/* Ultra-Premium Developer Badge */}
          <a href="https://github.com/MH_HASHISH" target="_blank" rel="noopener noreferrer" className="relative group inline-flex cursor-pointer">
            {/* Animated Glow Behind */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[var(--theme-primary)] via-purple-500 to-[#A9C4EB] rounded-full blur-md opacity-30 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
            
            {/* Button Surface */}
            <div className="relative flex items-center gap-3 px-6 py-3 bg-black/90 backdrop-blur-2xl border border-white/10 group-hover:border-[var(--theme-primary)]/50 rounded-full leading-none overflow-hidden transition-all duration-300">
              
              {/* Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out"></div>
              
              {/* Icon Container */}
              <div className="relative flex items-center justify-center w-6 h-6 rounded-full bg-white/5 border border-white/10 group-hover:bg-[var(--theme-primary)]/20 group-hover:border-[var(--theme-primary)]/50 transition-all duration-300">
                <Code2 className="w-3.5 h-3.5 text-gray-400 group-hover:text-white transition-colors relative z-10" />
              </div>
              
              {/* Text */}
              <div className="flex items-center gap-1.5 relative z-10 font-tajawal text-xs uppercase tracking-widest mt-0.5">
                <span className="text-gray-500 group-hover:text-gray-300 transition-colors">Crafted by</span>
                <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 group-hover:from-white group-hover:to-white transition-all tracking-[0.2em] ml-1">
                  Mohamed Hashish
                </span>
              </div>
              
              {/* Heart Pulse */}
              <Heart className="w-3.5 h-3.5 text-red-500 opacity-0 group-hover:opacity-100 group-hover:animate-bounce transition-opacity ml-1 relative z-10" />
            </div>
          </a>

        </div>
      </div>
    </footer>
  );
}
