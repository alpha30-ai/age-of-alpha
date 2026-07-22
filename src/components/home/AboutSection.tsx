'use client';

import { motion } from 'framer-motion';
import { BookOpen, Shield, Sword, Eye, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AboutSection({ characters = [] }: { characters?: any[] }) {
  const features = [
    {
      title: 'بناء دول وحروب استراتيجية',
      description: 'ليست مجرد قصة نجاة، بل ملحمة تفصيلية عن كيفية إدارة الموارد، السياسة، الاستخبارات، وقيادة الجيوش.',
      icon: Shield,
    },
    {
      title: 'فانتازيا مظلمة (Dark Fantasy)',
      description: 'عالم قاسٍ لا يعترف بالضعفاء، قلاع من الحجر الأسود، أنهار من الصهارة، ورماد يتساقط كالثلج.',
      icon: Eye,
    },
    {
      title: 'شخصيات ناضجة ومعقدة',
      description: 'لا دراما طفولية أو رومانسية متسرعة. العلاقات تُبنى على الاحترام، الصدمات المشتركة، والوفاء في وجه الموت.',
      icon: Sword,
    },
    {
      title: 'إيقاع سينمائي',
      description: 'أحداث تُسرد بطريقة "Show, Don\'t Tell"، لتعيش كل لحظة من التوتر والمعارك وكأنك تراها على الشاشة.',
      icon: BookOpen,
    },
  ];

  return (
    <section className="py-32 bg-[#050505] relative overflow-hidden border-t border-white/5">
      {/* Background Ornaments */}
      <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-[var(--theme-primary)]/5 rounded-full blur-[180px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[1000px] h-[1000px] bg-blue-900/5 rounded-full blur-[180px] translate-y-1/2 -translate-x-1/3 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Story Cinematic Panel */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="relative bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-16 mb-24 overflow-hidden group shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
        >
          {/* Ambient inner glow */}
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-[var(--theme-primary)]/10 to-transparent pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            <div className="lg:col-span-5">
              <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 mb-8 shadow-inner">
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--theme-primary)] animate-pulse shadow-[0_0_10px_var(--theme-primary)]" />
                <span className="text-gray-300 font-bold text-sm tracking-widest uppercase">عن الملحمة</span>
              </div>
              <h2 className="font-amiri font-bold text-5xl sm:text-6xl lg:text-7xl text-white mb-6 leading-[1.1] drop-shadow-2xl">
                ما وراء <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-l from-white to-gray-500">الدماء والرماد</span>
              </h2>
              <div className="w-32 h-1.5 bg-gradient-to-l from-[var(--theme-primary)] to-transparent rounded-full opacity-70" />
            </div>

            <div className="lg:col-span-7 font-tajawal text-xl sm:text-2xl text-gray-300 leading-[2.2] space-y-6 text-justify">
               <p>
                لم يُولد القائد الأعلى <span className="text-white font-black drop-shadow-lg tracking-wide">"ألفا"</span> وفي فمه ملعقة من ذهب، بل نُحتت أسطورته في زنازين الجحيم. طفلٌ سُلب من طفولته ليقع بين براثن منظمة "إيبكس" المظلمة؛ كيان سري لا يرحم، اتخذه حقلاً لتجارب قاسية لصناعة السلاح البشري المثالي.
               </p>
               <p className="text-lg sm:text-xl text-gray-500 font-medium">
                لكنهم لم يدركوا أنهم، وبكل ندبة حفروها في جسده، كانوا يصقلون نصل فنائهم. عاد ألفا ليحصد أرواح جلاديه في انتقام بارد ومحسوب، ليؤسس على أنقاضهم إمبراطوريته التي لن تتوقف حتى يخضع العالم بأسره لقانونه.
               </p>
            </div>
            
          </div>
        </motion.div>

        {/* Bento Grid Features */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-32">
          {features.map((feature, index) => (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              key={index}
              className={`relative bg-[#0a0a0a] border border-white/5 rounded-[2rem] p-8 hover:bg-[#111] hover:border-[var(--theme-primary)]/40 transition-all duration-500 group shadow-xl hover:shadow-[0_15px_50px_-15px_color-mix(in_srgb,var(--theme-primary)_40%,transparent)] overflow-hidden ${
                index === 0 ? 'md:col-span-7' : index === 1 ? 'md:col-span-5' : index === 2 ? 'md:col-span-5' : 'md:col-span-7'
              }`}
            >
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500 border border-white/5 group-hover:border-[var(--theme-primary)]/30 group-hover:bg-[var(--theme-primary)]/10 shadow-inner">
                <feature.icon className="w-8 h-8 text-gray-500 group-hover:text-[var(--theme-primary)] transition-colors duration-500 drop-shadow-md" />
              </div>
              <h4 className="font-cairo font-black text-2xl sm:text-3xl text-white mb-4 group-hover:text-[var(--theme-primary)] transition-colors duration-300 tracking-wide">
                {feature.title}
              </h4>
              <p className="text-gray-400 text-lg leading-relaxed font-tajawal group-hover:text-gray-300 transition-colors">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Part 2: Characters Showcase */}
        {characters && characters.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="pt-24 border-t border-white/5"
          >
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
              <div>
                <h3 className="font-amiri font-bold text-5xl sm:text-6xl text-white mb-6 drop-shadow-lg">
                  أبطال <span className="text-[var(--theme-primary)]">الملحمة</span>
                </h3>
                <p className="text-gray-400 font-tajawal text-xl max-w-2xl leading-relaxed">
                  شخصيات نُحتت من الألم والحروب، كلٌ يحمل أسراراً وطموحات قد تغيّر مجرى التاريخ في الدول المائة.
                </p>
              </div>
              <Link 
                href="/characters"
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white/5 hover:bg-[var(--theme-primary)]/10 border border-white/10 hover:border-[var(--theme-primary)]/50 text-white transition-all duration-500 font-cairo font-bold text-lg whitespace-nowrap shadow-lg hover:shadow-[0_0_30px_color-mix(in_srgb,var(--theme-primary)_30%,transparent)]"
              >
                اكتشف جميع الشخصيات
                <ArrowLeft className="w-6 h-6 group-hover:-translate-x-2 transition-transform duration-500" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {characters.map((char: any, i: number) => (
                <Link href={`/characters/${char.id}`} key={char.id} className="block group">
                  <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden border border-white/10 bg-[#111] shadow-2xl">
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
                      style={{ backgroundImage: char.imageUrl ? `url(${char.imageUrl})` : 'none' }}
                    >
                      {!char.imageUrl && (
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />
                      )}
                    </div>
                    
                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-[#020202]/60 to-transparent opacity-90 group-hover:opacity-75 transition-opacity duration-500" />
                    
                    {/* Content */}
                    <div className="absolute inset-0 p-8 flex flex-col justify-end translate-y-6 group-hover:translate-y-0 transition-transform duration-500">
                      {char.title && (
                        <span className="text-[var(--theme-primary)] text-sm font-black font-cairo mb-2 drop-shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100 uppercase tracking-widest">
                          {char.title}
                        </span>
                      )}
                      <h4 className="text-3xl font-black font-cairo text-white drop-shadow-[0_2px_15px_rgba(0,0,0,0.8)] mb-3 group-hover:text-[var(--theme-primary)] transition-colors duration-300">
                        {char.name}
                      </h4>
                      <p className="text-gray-300 font-tajawal text-base line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-200">
                        {char.description}
                      </p>
                    </div>

                    {/* Faction Badge */}
                    {char.faction && (
                      <div className="absolute top-6 right-6 bg-black/60 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-xl text-xs font-bold text-gray-200 shadow-xl">
                        {char.faction}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}

      </div>
    </section>
  );
}
