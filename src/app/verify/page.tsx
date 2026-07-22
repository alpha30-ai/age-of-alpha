'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function VerifyOTPPage() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return; // Prevent multiple chars
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join('');
    if (fullCode.length !== 6 || !email) {
      setError('يرجى إدخال البريد الإلكتروني والكود بالكامل.');
      return;
    }
    
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: fullCode }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'حدث خطأ أثناء التوثيق');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/login?verified=true');
      }, 3000);
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#050505] text-white" dir="rtl">
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-24 xl:px-32 relative z-10">
        
        <div className="absolute top-8 right-8">
          <Link href="/login" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
            <ArrowRight className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" />
            <span className="font-tajawal text-sm">العودة لتسجيل الدخول</span>
          </Link>
        </div>

        <div className="w-full max-w-md mx-auto mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-900 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.4)] border border-green-500/30">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
            </div>

            <h2 className="text-4xl font-black font-tajawal text-center mb-2 text-transparent bg-clip-text bg-gradient-to-l from-white to-gray-400">
              توثيق الدماء
            </h2>
            <p className="text-gray-400 text-center mb-8 font-tajawal leading-relaxed">
              لقد أرسلنا لفافة تحمل تعويذة من 6 أرقام إلى بريدك الإلكتروني. أدخلها هنا لتثبت جدارتك.
            </p>

            {success ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-500/10 border border-green-500/30 text-green-400 p-6 rounded-2xl mb-6 font-tajawal text-center shadow-[0_0_30px_rgba(34,197,94,0.2)]"
              >
                <div className="text-2xl mb-2">🔥</div>
                <div className="font-bold text-lg mb-1">تم توثيق حسابك بنجاح!</div>
                <div className="text-sm opacity-90">مرحباً بك في إمارة الصدأ. جاري تحويلك...</div>
              </motion.div>
            ) : (
              <>
                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl mb-6 font-tajawal text-sm text-center">
                    {error}
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-8 font-tajawal">
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-500" />
                    </div>
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl pr-12 pl-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder:text-gray-600 text-right backdrop-blur-md"
                      placeholder="البريد الإلكتروني الذي قمت بالتسجيل به"
                      required
                    />
                  </div>

                  <div className="flex justify-center gap-3 md:gap-4" dir="ltr">
                    {code.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => { inputRefs.current[idx] = el; }}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(idx, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(idx, e)}
                        className="w-12 h-14 md:w-14 md:h-16 bg-white/5 border border-white/10 rounded-xl text-center text-2xl font-bold text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all shadow-inner"
                      />
                    ))}
                  </div>

                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-500 hover:to-emerald-600 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02] shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] disabled:opacity-50 flex justify-center items-center gap-2"
                  >
                    {isLoading ? (
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <span>تأكيد الميثاق</span>
                    )}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      </div>

      <div className="hidden lg:flex w-1/2 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center transform hover:scale-105 transition-transform duration-10000"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=2024&auto=format&fit=crop')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-l from-[#050505] via-[#050505]/40 to-transparent" />
        <div className="absolute inset-0 bg-green-900/10 mix-blend-overlay" />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
        
        <div className="relative z-10 flex flex-col justify-end p-16 text-white h-full w-full bg-gradient-to-t from-[#050505] via-transparent to-transparent">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-7xl font-black tracking-widest font-tajawal text-transparent bg-clip-text bg-gradient-to-br from-green-400 via-emerald-500 to-emerald-900 mb-6 drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]"
          >
            ميثاق الدم
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-2xl text-gray-200 max-w-lg font-light leading-relaxed font-tajawal drop-shadow-md"
          >
            لا يُسمح للغرباء بعبور البوابات. تأكيد هويتك هو الخطوة الأولى لتنضم إلى صفوف النخبة.
          </motion.p>
        </div>
      </div>
    </div>
  );
}
