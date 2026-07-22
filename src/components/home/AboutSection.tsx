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
    <section className="py-24 bg-[#050505] relative overflow-hidden border-t border-white/5">
      {/* Background Ornaments */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[var(--theme-primary)]/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-blue-900/5 rounded-full blur-[150px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Part 1: Story & Features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-32">
          
          {/* Story Text */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="space-y-8 text-right lg:sticky lg:top-32"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
                <span className="w-2 h-2 rounded-full bg-[var(--theme-primary)] animate-pulse" />
                <span className="text-gray-300 font-bold text-sm">عن الملحمة</span>
              </div>
              <h2 className="font-amiri font-bold text-5xl sm:text-6xl text-white mb-6 leading-tight drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                ما وراء الدماء والرماد
              </h2>
              <div className="w-24 h-1 bg-gradient-to-l from-[var(--theme-primary)] to-transparent rounded-full" />
            </div>

            <div className="font-tajawal text-xl text-gray-400 leading-[2.2] space-y-6 text-justify">
              <p>
                لم يُولد القائد الأعلى <span className="text-white font-bold tracking-wide">"ألفا"</span> وفي فمه ملعقة من ذهب، بل نُحتت أسطورته في زنازين الجحيم. طفلٌ سُلب من طفولته ليقع بين براثن منظمة "إيبكس" المظلمة؛ كيان سري لا يرحم، اتخذه حقلاً لتجارب قاسية في محاولة مريضة لصناعة السلاح البشري المثالي.
              </p>
              <p>
                لكنهم لم يدركوا أنهم، وبكل ندبة حفروها في جسده، كانوا يصقلون نصل فنائهم. عندما اشتد عوده، عاد ألفا ليحصد أرواح جلاديه في انتقام بارد ومحسوب. لم يتوقف طموحه عند هذا الحد؛ فقد سحق "إمارة الصدأ" الفاسدة وطهرها بالحديد والنار لتصبح النواة الأولى لـ <span className="text-[var(--theme-primary)] font-bold">"دولة ألفا"</span> العظمى.
              </p>
              <p>
                الآن، يقف القائد الشاب على قمة "قلعة الصهارة"، تحيط به ركائز دولته المرعبة. الماضي أصبح رماداً، لتبدأ ملحمة دموية من الدهاء السياسي، والحروب التكتيكية، وبناء إمبراطورية لن تقف حتى يخضع العالم بأسره لقانون ألفا.
              </p>
            </div>
          </motion.div>

          {/* Features Grid */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4"
          >
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 hover:bg-white/5 hover:border-[var(--theme-primary)]/40 transition-all duration-500 group shadow-lg hover:shadow-[0_10px_30px_-10px_color-mix(in_srgb,var(--theme-primary)_20%,transparent)]"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#111] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500 border border-white/5 group-hover:border-[var(--theme-primary)]/30">
                  <feature.icon className="w-7 h-7 text-gray-500 group-hover:text-[var(--theme-primary)] transition-colors duration-500" />
                </div>
                <h4 className="font-cairo font-bold text-2xl text-white mb-4 group-hover:text-[var(--theme-primary)] transition-colors duration-300">
                  {feature.title}
                </h4>
                <p className="text-gray-400 text-base leading-relaxed font-tajawal">
                  {feature.description}
                </p>
              </div>
            ))}
          </motion.div>

        </div>

        {/* Part 2: Characters Showcase */}
        {characters && characters.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="pt-16 border-t border-white/5"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-12">
              <div>
                <h3 className="font-amiri font-bold text-4xl sm:text-5xl text-white mb-4">
                  أبطال الملحمة
                </h3>
                <p className="text-gray-400 font-tajawal text-lg max-w-2xl">
                  شخصيات نُحتت من الألم والحروب، كلٌ يحمل أسراراً وطموحات قد تغيّر مجرى التاريخ في الدول المائة.
                </p>
              </div>
              <Link 
                href="/characters"
                className="group flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 hover:bg-[var(--theme-primary)]/10 border border-white/10 hover:border-[var(--theme-primary)]/50 text-white transition-all duration-300 font-cairo font-bold whitespace-nowrap"
              >
                اكتشف جميع الشخصيات
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {characters.map((char: any, i: number) => (
                <Link href={`/characters/${char.id}`} key={char.id} className="block group">
                  <div className="relative aspect-[3/4] rounded-3xl overflow-hidden border border-white/10 bg-[#111] shadow-2xl">
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                      style={{ backgroundImage: char.imageUrl ? `url(${char.imageUrl})` : 'none' }}
                    >
                      {!char.imageUrl && (
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />
                      )}
                    </div>
                    
                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent opacity-90 group-hover:opacity-80 transition-opacity duration-300" />
                    
                    {/* Content */}
                    <div className="absolute inset-0 p-6 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      {char.title && (
                        <span className="text-[var(--theme-primary)] text-sm font-bold font-cairo mb-1 drop-shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                          {char.title}
                        </span>
                      )}
                      <h4 className="text-2xl font-bold font-cairo text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] mb-2">
                        {char.name}
                      </h4>
                      <p className="text-gray-300 font-tajawal text-sm line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                        {char.description}
                      </p>
                    </div>

                    {/* Faction Badge */}
                    {char.faction && (
                      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg text-xs font-bold text-gray-300">
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
