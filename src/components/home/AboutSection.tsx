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
    <section className="py-24 bg-abyss border-t border-[var(--color-theme-border)] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Story Cinematic Panel */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="relative bg-stone-dark border border-[var(--color-theme-border)] rounded-xl p-8 md:p-12 mb-20 shadow-lg"
        >
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5 relative">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded bg-white/5 border border-white/10 mb-6">
                <span className="w-2 h-2 rounded-full bg-[var(--theme-primary)]" />
                <span className="text-gray-300 font-bold text-sm tracking-widest uppercase">عن الملحمة</span>
              </div>
              <h2 className="font-amiri font-bold text-5xl sm:text-6xl text-[var(--color-theme-heading)] mb-6 leading-tight">
                ما وراء <br/>
                <span className="text-[var(--theme-primary)]">
                  الدماء والرماد
                </span>
              </h2>
              <div className="w-32 h-1 bg-[var(--theme-primary)] rounded-full" />
            </div>

            <div className="lg:col-span-7 font-tajawal text-lg sm:text-xl text-gray-300 leading-loose space-y-6 text-justify">
               <p className="border-r-4 border-[var(--theme-primary)] pr-6">
                لم يُولد القائد الأعلى <span className="text-white font-bold mx-1">"ألفا"</span> وفي فمه ملعقة من ذهب، بل نُحتت أسطورته في زنازين الجحيم. طفلٌ سُلب من طفولته ليقع بين براثن منظمة "إيبكس" المظلمة؛ كيان سري لا يرحم، اتخذه حقلاً لتجارب قاسية لصناعة السلاح البشري المثالي.
               </p>
               <p className="text-gray-400 font-medium pr-6">
                لكنهم لم يدركوا أنهم، وبكل ندبة حفروها في جسده، كانوا يصقلون نصل فنائهم. عاد ألفا ليحصد أرواح جلاديه في انتقام بارد ومحسوب، ليؤسس على أنقاضهم إمبراطوريته التي لن تتوقف حتى يخضع العالم بأسره لقانونه.
               </p>
            </div>
            
          </div>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-24">
          {features.map((feature, index) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              key={index}
              className="bg-stone border border-[var(--color-theme-border)] rounded-xl p-8 hover:border-[var(--theme-primary)]/50 transition-colors shadow-md group"
            >
              <div className="w-14 h-14 rounded-lg bg-white/5 flex items-center justify-center mb-6 border border-white/10 group-hover:bg-[var(--theme-primary)]/10 group-hover:border-[var(--theme-primary)]/30 transition-colors">
                <feature.icon className="w-6 h-6 text-gray-400 group-hover:text-[var(--theme-primary)] transition-colors" />
              </div>
              <h4 className="font-bold text-2xl text-[var(--color-theme-heading)] mb-3">
                {feature.title}
              </h4>
              <p className="text-gray-400 text-base leading-relaxed">
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
            className="pt-24 border-t border-silver-ash/5"
          >
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
              <div>
                <h3 className="font-amiri font-bold text-5xl sm:text-6xl text-[var(--color-theme-heading)] mb-6 drop-shadow-lg">
                  أبطال <span className="text-[var(--theme-primary)]">الملحمة</span>
                </h3>
                <p className="text-gray-400 font-tajawal text-xl max-w-2xl leading-relaxed">
                  شخصيات نُحتت من الألم والحروب، كلٌ يحمل أسراراً وطموحات قد تغيّر مجرى التاريخ في الدول المائة.
                </p>
              </div>
              <Link 
                href="/characters"
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white/5 hover:bg-[var(--theme-primary)]/10 border border-silver-ash/10 hover:border-[var(--theme-primary)]/50 text-silver-ash transition-all duration-500 font-cairo font-bold text-lg whitespace-nowrap shadow-lg hover:shadow-[0_0_30px_color-mix(in_srgb,var(--theme-primary)_30%,transparent)]"
              >
                اكتشف جميع الشخصيات
                <ArrowLeft className="w-6 h-6 group-hover:-translate-x-2 transition-transform duration-500" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {characters.map((char: any, i: number) => (
                <Link href={`/characters/${char.id}`} key={char.id} className="block group">
                  <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden border border-silver-ash/10 bg-stone shadow-2xl">
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
                      style={{ backgroundImage: char.imageUrl ? `url(${char.imageUrl})` : 'none' }}
                    >
                      {!char.imageUrl && (
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />
                      )}
                    </div>
                    
                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-abyss via-abyss/60 to-transparent opacity-90 group-hover:opacity-75 transition-opacity duration-500" />
                    
                    {/* Content */}
                    <div className="absolute inset-0 p-8 flex flex-col justify-end translate-y-6 group-hover:translate-y-0 transition-transform duration-500">
                      {char.title && (
                        <span className="text-[var(--theme-primary)] text-sm font-black font-cairo mb-2 drop-shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100 uppercase tracking-widest">
                          {char.title}
                        </span>
                      )}
                      <h4 className="text-3xl font-black font-cairo text-[var(--color-theme-heading)] drop-shadow-[0_2px_15px_rgba(0,0,0,0.8)] mb-3 group-hover:text-[var(--theme-primary)] transition-colors duration-300">
                        {char.name}
                      </h4>
                      <p className="text-gray-300 font-tajawal text-base line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-200">
                        {char.description}
                      </p>
                    </div>

                    {/* Faction Badge */}
                    {char.faction && (
                      <div className="absolute top-6 right-6 bg-black/60 backdrop-blur-xl border border-silver-ash/10 px-4 py-2 rounded-xl text-xs font-bold text-gray-200 shadow-xl">
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
