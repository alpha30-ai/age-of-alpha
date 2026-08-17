'use client';

import { motion } from 'framer-motion';
import { Shield, Sword, Eye, Crosshair, ArrowLeft, Skull } from 'lucide-react';
import Link from 'next/link';

export default function AboutSection({ characters = [] }: { characters?: any[] }) {
  const features = [
    {
      title: 'بناء دول وحروب استراتيجية',
      description: 'إدارة موارد، سياسة، تحالفات، وقيادة جيوش في عالم لا يرحم الضعفاء.',
      icon: Shield,
    },
    {
      title: 'عالم فانتازيا مظلمة',
      description: 'أنهار من الصهارة، قلاع من الحجر الأسود، ورماد يتساقط كالثلج.',
      icon: Eye,
    },
    {
      title: 'شخصيات ناضجة',
      description: 'علاقات تُبنى على الاحترام والصدمات المشتركة في وجه الموت المحتم.',
      icon: Sword,
    },
    {
      title: 'إيقاع سينمائي',
      description: 'أحداث تُسرد لتعيش كل لحظة من التوتر والمعارك وكأنك تراها.',
      icon: Crosshair,
    },
  ];

  return (
    <section className="relative bg-[#050505] overflow-hidden py-32" dir="rtl">
      
      {/* Immersive Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--theme-primary)]/20 to-transparent" />
        <div className="absolute top-0 right-1/4 w-[40vw] h-[40vw] bg-[var(--theme-primary)]/5 blur-[150px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-1/4 left-1/4 w-[50vw] h-[50vw] bg-black blur-[120px] rounded-full mix-blend-multiply" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.15] mix-blend-overlay" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-32">
        
        {/* Story Intro */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[var(--theme-primary)]/10 border border-[var(--theme-primary)]/20 shadow-[0_0_15px_var(--theme-primary)]/10">
              <Skull className="w-4 h-4 text-[var(--theme-primary)]" />
              <span className="text-[var(--theme-primary)] font-bold text-sm tracking-widest">عن الملحمة</span>
            </div>
            
            <h2 className="font-cairo font-black text-5xl sm:text-6xl text-white leading-[1.2]">
              ما وراء <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-[var(--theme-primary)] to-[var(--theme-primary)]/70 filter drop-shadow-[0_0_20px_var(--theme-primary)]">الدماء والرماد</span>
            </h2>

            <div className="space-y-6 font-tajawal text-lg text-gray-400 leading-loose border-r-2 border-[var(--theme-primary)]/50 pr-6">
               <p>
                لم يُولد <span className="text-white font-bold">"ألفا"</span> وفي فمه ملعقة من ذهب، بل نُحتت أسطورته في زنازين الجحيم. طفلٌ سُلب من طفولته ليقع بين براثن منظمة "إيبكس" المظلمة؛ كيان سري اتخذه حقلاً لتجارب قاسية لصناعة السلاح البشري المثالي.
               </p>
               <p>
                عاد ألفا ليحصد أرواح جلاديه في انتقام بارد ومحسوب، ليؤسس على أنقاضهم إمبراطوريته التي لن تتوقف حتى يخضع العالم بأسره لقانونه.
               </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 gap-4 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-[var(--theme-primary)]/10 to-transparent blur-3xl rounded-full" />
            {features.map((feature, idx) => (
              <div 
                key={idx} 
                className={`bg-[#111]/80 backdrop-blur-md border border-white/5 p-6 rounded-2xl hover:bg-[#1a1a1a] hover:border-[var(--theme-primary)]/30 hover:shadow-[0_0_20px_var(--theme-primary)]/10 transition-all duration-300 group ${idx % 2 !== 0 ? 'translate-y-8' : ''}`}
              >
                <feature.icon className="w-8 h-8 text-gray-500 mb-4 group-hover:text-[var(--theme-primary)] transition-colors" />
                <h4 className="text-white font-cairo font-bold text-lg mb-2">{feature.title}</h4>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Characters Showcase */}
        {characters && characters.length > 0 && (
          <div className="pt-16 border-t border-white/10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="space-y-4 max-w-2xl"
              >
                <h3 className="font-cairo font-black text-4xl sm:text-5xl text-white">
                  أبطال <span className="text-[var(--theme-primary)]">الملحمة</span>
                </h3>
                <p className="text-gray-400 font-tajawal text-lg leading-relaxed">
                  شخصيات نُحتت من الألم والحروب، كلٌ يحمل أسراراً وطموحات قد تغيّر مجرى التاريخ في الدول المائة.
                </p>
              </motion.div>
              
              <Link 
                href="/characters"
                className="group inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-white/5 hover:bg-[var(--theme-primary)] border border-white/10 hover:border-[var(--theme-primary)] text-white transition-all duration-300 font-cairo font-bold text-sm shadow-lg hover:shadow-[0_0_20px_var(--theme-primary)]/50 shrink-0"
              >
                جميع الشخصيات
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {characters.map((char: any, i: number) => (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  key={char.id}
                >
                  <Link href={`/characters/${char.id}`} className="block group">
                    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#111] border border-white/5 shadow-2xl">
                      <div 
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
                        style={{ backgroundImage: char.imageUrl ? `url(${char.imageUrl})` : 'none' }}
                      >
                        {!char.imageUrl && (
                          <div className="absolute inset-0 flex items-center justify-center opacity-10">
                            <Sword className="w-20 h-20" />
                          </div>
                        )}
                      </div>
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90 group-hover:opacity-80 transition-opacity duration-500" />
                      
                      <div className="absolute inset-0 p-6 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        {char.title && (
                          <span className="text-[var(--theme-primary)] text-xs font-black font-cairo mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 uppercase tracking-widest">
                            {char.title}
                          </span>
                        )}
                        <h4 className="text-2xl font-black font-cairo text-white mb-2 group-hover:text-[var(--theme-primary)] transition-colors duration-300">
                          {char.name}
                        </h4>
                        <p className="text-gray-400 font-tajawal text-sm line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                          {char.description}
                        </p>
                      </div>

                      {char.faction && (
                        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg text-[10px] font-bold text-gray-300">
                          {char.faction}
                        </div>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
