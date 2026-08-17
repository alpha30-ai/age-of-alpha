'use client';

import { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, Mail, Lock, Flame } from 'lucide-react';

function LoginContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const verified = searchParams.get('verified');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      if (res.error === 'UnverifiedEmail') {
        setError('يرجى تأكيد بريدك الإلكتروني أولاً.');
      } else {
        setError('البريد الإلكتروني أو كلمة المرور غير صحيحة.');
      }
      setIsLoading(false);
    } else {
      router.push('/admin'); // Redirect to admin by default for now
    }
  };

  return (
    <div className="flex min-h-screen bg-abyss text-silver-ash" dir="rtl">
      {/* القسم الأيمن: النموذج */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-24 xl:px-32 relative z-10">
        
        {/* زر العودة للرئيسية */}
        <div className="absolute top-4 right-4 md:top-8 md:right-8 z-50">
          <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group bg-black/40 p-2 md:p-0 rounded-full md:rounded-none md:bg-transparent backdrop-blur-md md:backdrop-blur-none border border-white/10 md:border-transparent">
            <ArrowRight className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" />
            <span className="font-tajawal text-sm hidden md:inline">العودة للرئيسية</span>
          </Link>
        </div>

        <div className="w-full max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-magma to-magma-dark rounded-2xl flex items-center justify-center glow-magma border border-magma/30">
                <Flame className="w-8 h-8 text-white" />
              </div>
            </div>

            <h2 className="text-4xl font-black font-tajawal text-center mb-2 text-transparent bg-clip-text bg-gradient-to-l from-white to-gray-400">
              تسجيل الدخول
            </h2>
            <p className="text-gray-400 text-center mb-10 font-tajawal">
              مرحباً بعودتك إلى إمارة الصدأ.. عرشك في انتظارك.
            </p>

            {verified && (
              <div className="bg-green-500/10 border border-green-500/30 text-green-400 p-4 rounded-xl mb-6 font-tajawal text-sm text-center">
                تم توثيق حسابك بنجاح! يمكنك الآن تسجيل الدخول.
              </div>
            )}

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl mb-6 font-tajawal text-sm text-center">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6 font-tajawal">
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-500" />
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pr-12 pl-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-magma focus:border-transparent transition-all placeholder:text-gray-600 text-right backdrop-blur-md"
                  placeholder="البريد الإلكتروني"
                  required
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500" />
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pr-12 pl-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-magma focus:border-transparent transition-all placeholder:text-gray-600 text-right backdrop-blur-md"
                  placeholder="كلمة المرور"
                  required
                />
              </div>

              <div className="flex justify-start">
                <Link href="/forgot-password" className="text-sm text-magma hover:text-magma-light transition-colors">
                  نسيت كلمة المرور؟
                </Link>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-magma to-magma-dark hover:from-magma-light hover:to-magma text-white font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02] glow-magma disabled:opacity-50 flex justify-center items-center gap-2"
              >
                {isLoading ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <span>دخول الملحمة</span>
                )}
              </button>
            </form>

            <div className="mt-8">
              <p className="text-center text-gray-400 font-tajawal">
                ليس لديك حساب؟ <Link href="/register" className="text-magma hover:text-magma-light font-bold transition-colors">أنشئ حسابك الآن</Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* القسم الأيسر: الصورة الملحمية */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center transform hover:scale-105 transition-transform duration-10000"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=1974&auto=format&fit=crop')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-l from-abyss via-transparent to-transparent" />
        <div className="absolute inset-0 bg-magma/20 mix-blend-overlay" />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
        
        <div className="relative z-10 flex flex-col justify-end p-16 text-white h-full w-full bg-gradient-to-t from-abyss via-transparent to-transparent">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-7xl font-black tracking-widest font-tajawal text-transparent bg-clip-text bg-gradient-to-br from-magma-light via-magma to-magma-dark mb-6 drop-shadow-[0_0_15px_color-mix(in_srgb,var(--theme-primary)_30%,transparent)]"
          >
            عهد ألفا
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-2xl text-gray-200 max-w-lg font-light leading-relaxed font-tajawal drop-shadow-md"
          >
            تاريخ يُكتب بالدماء، وممالك تسقط بضربة سيف. انضم الآن وابدأ أسطورتك الخاصة.
          </motion.p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050505] flex items-center justify-center text-magma">جاري التحميل...</div>}>
      <LoginContent />
    </Suspense>
  );
}
