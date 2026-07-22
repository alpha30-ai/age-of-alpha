'use client';

import { Flame, MessageCircle, Globe, Play, Code2, Heart, Sparkles } from 'lucide-react';
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
              <a href="#" className="relative p-3 rounded-xl bg-[#0a0a0a] border border-white/10 hover:border-[var(--theme-primary)]/50 group transition-all duration-500 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-[var(--theme-primary)]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <MessageCircle className="w-5 h-5 text-gray-500 group-hover:text-white relative z-10 transition-colors" />
              </a>
              <a href="https://www.youtube.com/@AlphaStudio-H" target="_blank" rel="noopener noreferrer" className="relative p-3 rounded-xl bg-[#0a0a0a] border border-white/10 hover:border-[var(--theme-primary)]/50 group transition-all duration-500 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#FF0000]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <Play className="w-5 h-5 text-gray-500 group-hover:text-white relative z-10 transition-colors" fill="currentColor" />
              </a>
              <a href="#" className="relative p-3 rounded-xl bg-[#0a0a0a] border border-white/10 hover:border-[var(--theme-primary)]/50 group transition-all duration-500 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-[var(--theme-primary)]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <Globe className="w-5 h-5 text-gray-500 group-hover:text-white relative z-10 transition-colors" />
              </a>
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

        {/* Copyright */}
        <div className="flex items-center justify-center mt-12 pt-8 border-t border-white/5">
          <p className="text-xs text-gray-600 font-medium font-tajawal tracking-wider">
            © {currentYear} عهد ألفا. جميع الحقوق محفوظة لورثة العرش.
          </p>
        </div>
      </div>

      {/* 
        ========================================
          Ultra Premium Developer Full-Width Bar
        ======================================== 
      */}
      <a 
        href="https://github.com/alpha30-ai" 
        target="_blank" 
        rel="noopener noreferrer"
        className="block relative w-full overflow-hidden border-t border-white/5 bg-[#000000] group cursor-pointer"
      >
        {/* Animated Hover Background Shine */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--theme-primary)]/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out"></div>
        
        {/* Laser Top Border on Hover */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-full h-[2px] bg-gradient-to-r from-transparent via-[var(--theme-primary)] to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out shadow-[0_0_20px_var(--theme-primary)]"></div>

        {/* Ambient Glow from bottom */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[300px] h-[50px] bg-[var(--theme-primary)]/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

        <div className="max-w-7xl mx-auto px-6 py-6 md:py-8 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 relative z-10">
          
          {/* Icon and Prefix */}
          <div className="flex items-center gap-3">
             <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 group-hover:bg-[var(--theme-primary)]/20 group-hover:border-[var(--theme-primary)]/50 transition-all duration-500 group-hover:scale-110 shadow-[0_0_15px_rgba(0,0,0,0.5)] group-hover:shadow-[0_0_20px_color-mix(in_srgb,var(--theme-primary)_30%,transparent)]">
               <Code2 className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
             </div>
             
             <span className="text-gray-500 font-tajawal text-xs sm:text-sm uppercase tracking-[0.3em] group-hover:text-gray-300 transition-colors">
               Crafted & Engineered By
             </span>
          </div>

          {/* Developer Name */}
          <div className="flex items-center gap-3">
            <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 group-hover:from-white group-hover:to-white transition-all tracking-[0.3em] text-xl sm:text-2xl drop-shadow-lg">
              MOHAMED HASHISH
            </span>
            <Sparkles className="w-6 h-6 text-yellow-500 opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-300 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
          </div>

        </div>
      </a>
    </footer>
  );
}
