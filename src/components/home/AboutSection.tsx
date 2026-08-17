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
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.15] mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505]" />
        
        {/* Animated Background Gradients */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[var(--theme-primary)]/10 rounded-full blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-[var(--theme-primary)]/5 rounded-full blur-[150px] mix-blend-screen animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }} />
        
        {/* Cinematic Borders */}
        <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-[var(--theme-primary)]/30 to-transparent" />
        <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-[var(--theme-primary)]/30 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-32">
        
        {/* Story Intro - Cinematic Layout */}
        <div className="relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-20 mix-blend-overlay pointer-events-none rounded-3xl" />
          
          <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto mb-20 space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-black/50 backdrop-blur-xl border border-[var(--theme-primary)]/30 shadow-[0_0_20px_var(--theme-primary)]/20"
            >
              <Skull className="w-5 h-5 text-[var(--theme-primary)]" />
              <span className="text-white font-bold tracking-widest text-sm uppercase">عن الملحمة</span>
              <Skull className="w-5 h-5 text-[var(--theme-primary)]" />
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="font-cairo font-black text-5xl md:text-7xl text-white leading-[1.2] drop-shadow-2xl"
            >
              ما وراء <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-[var(--theme-primary)] filter drop-shadow-[0_0_30px_var(--theme-primary)]">الدماء والرماد</span>
            </motion.h2>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative p-8 rounded-2xl bg-gradient-to-b from-white/5 to-transparent border-t border-[var(--theme-primary)]/20 backdrop-blur-sm"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-[var(--theme-primary)] to-transparent" />
              <p className="font-tajawal text-xl md:text-2xl text-gray-300 leading-relaxed mb-6 font-medium">
                لم يُولد <span className="text-white font-bold text-[var(--theme-primary)] drop-shadow-[0_0_10px_var(--theme-primary)]">"ألفا"</span> وفي فمه ملعقة من ذهب، بل نُحتت أسطورته في زنازين الجحيم. طفلٌ سُلب من طفولته ليقع بين براثن منظمة "إيبكس" المظلمة؛ كيان سري اتخذه حقلاً لتجارب قاسية لصناعة السلاح البشري المثالي.
              </p>
              <p className="font-tajawal text-lg md:text-xl text-gray-400 leading-relaxed">
                عاد ألفا ليحصد أرواح جلاديه في انتقام بارد ومحسوب، ليؤسس على أنقاضهم إمبراطوريته التي لن تتوقف حتى يخضع العالم بأسره لقانونه.
              </p>
            </motion.div>
          </div>

          {/* Epic Features Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10"
          >
            {features.map((feature, idx) => (
              <div 
                key={idx} 
                className="group relative bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-8 hover:border-[var(--theme-primary)]/50 transition-all duration-500 overflow-hidden hover:-translate-y-2"
              >
                {/* Hover Gradients */}
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--theme-primary)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-[var(--theme-primary)]/20 rounded-full blur-3xl group-hover:bg-[var(--theme-primary)]/40 transition-colors duration-700" />
                
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-xl bg-black/50 border border-white/10 flex items-center justify-center mb-6 group-hover:border-[var(--theme-primary)]/40 group-hover:shadow-[0_0_20px_var(--theme-primary)]/20 transition-all duration-300">
                    <feature.icon className="w-7 h-7 text-gray-500 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h4 className="text-xl font-cairo font-bold text-white mb-3 group-hover:text-[var(--theme-primary)] transition-colors duration-300">{feature.title}</h4>
                  <p className="text-gray-400 text-sm leading-relaxed font-tajawal group-hover:text-gray-300 transition-colors duration-300">{feature.description}</p>
                </div>
                
                {/* Bottom Line Accent */}
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[var(--theme-primary)] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-center" />
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
