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
    <div className="flex min-h-screen bg-[#050505] text-white" dir="rtl">
      {/* القسم الأيمن: النموذج */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-24 xl:px-32 relative z-10">
        
        {/* زر العودة للرئيسية */}
        <div className="absolute top-8 right-8">
          <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
            <ArrowRight className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" />
            <span className="font-tajawal text-sm">العودة للرئيسية</span>
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

            <div className="mt-8 relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <span className="relative bg-[#050505] px-4 text-sm text-gray-500 font-tajawal">أو</span>
            </div>

            <button 
              onClick={() => signIn('google')}
              className="w-full mt-8 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-tajawal py-4 rounded-xl transition-all flex items-center justify-center gap-3"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/><path d="M1 1h22v22H1z" fill="none"/></svg>
              الدخول عبر جوجل
            </button>

            <p className="mt-8 text-center text-gray-400 font-tajawal">
              ليس لديك حساب؟ <Link href="/register" className="text-magma hover:text-magma-light font-bold transition-colors">أنشئ حسابك الآن</Link>
            </p>
          </motion.div>
        </div>
      </div>

      {/* القسم الأيسر: الصورة الملحمية */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center transform hover:scale-105 transition-transform duration-10000"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=1974&auto=format&fit=crop')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-l from-[#050505] via-transparent to-transparent" />
        <div className="absolute inset-0 bg-magma/20 mix-blend-overlay" />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
        
        <div className="relative z-10 flex flex-col justify-end p-16 text-white h-full w-full bg-gradient-to-t from-[#050505] via-transparent to-transparent">
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
