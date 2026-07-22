'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Mail, Lock, User, Flame, Eye, EyeOff, Check, X } from 'lucide-react';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Password validation states
  const [hasLength, setHasLength] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [hasSpecial, setHasSpecial] = useState(false);
  const [strengthScore, setStrengthScore] = useState(0);

  useEffect(() => {
    setHasLength(password.length >= 8);
    setHasNumber(/\d/.test(password));
    setHasSpecial(/[@$!%*#?&]/.test(password));

    let score = 0;
    if (password.length > 0) score += 1;
    if (password.length >= 8) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[@$!%*#?&]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    setStrengthScore(score);
  }, [password]);

  const getStrengthColor = () => {
    if (strengthScore === 0) return 'bg-gray-700';
    if (strengthScore <= 2) return 'bg-red-500';
    if (strengthScore <= 4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthText = () => {
    if (strengthScore === 0) return '';
    if (strengthScore <= 2) return 'ضعيفة';
    if (strengthScore <= 4) return 'متوسطة';
    return 'قوية جداً';
  };

  const getStrengthTextColor = () => {
    if (strengthScore <= 2) return 'text-red-400';
    if (strengthScore <= 4) return 'text-yellow-400';
    return 'text-green-400';
  };

  const isPasswordValid = hasLength && hasNumber && hasSpecial;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid) {
      setError('يرجى التأكد من استيفاء جميع شروط كلمة المرور');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'حدث خطأ أثناء التسجيل');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/verify');
      }, 2000);
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#050505] text-white" dir="rtl">
      {/* القسم الأيمن: النموذج */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-24 xl:px-32 relative z-10 py-12">
        
        {/* زر العودة للرئيسية */}
        <div className="absolute top-8 right-8">
          <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
            <ArrowRight className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" />
            <span className="font-tajawal text-sm">العودة للرئيسية</span>
          </Link>
        </div>

        <div className="w-full max-w-md mx-auto mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-magma to-magma-dark rounded-2xl flex items-center justify-center glow-magma border border-magma/30">
                <Flame className="w-8 h-8 text-white" />
              </div>
            </div>

            <h2 className="text-4xl font-black font-tajawal text-center mb-2 text-transparent bg-clip-text bg-gradient-to-l from-white to-gray-400">
              إنشاء حساب
            </h2>
            <p className="text-gray-400 text-center mb-8 font-tajawal">
              ادخل عالم الملحمة واصنع تاريخك الخاص
            </p>

            {success ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-500/10 border border-green-500/30 text-green-400 p-6 rounded-2xl mb-6 font-tajawal text-center shadow-[0_0_30px_rgba(34,197,94,0.2)]"
              >
                <div className="text-2xl mb-2">✨</div>
                <div className="font-bold text-lg mb-1">تم التسجيل بنجاح!</div>
                <div className="text-sm opacity-90">جاري تحويلك لصفحة التفعيل... تفقد بريدك الإلكتروني للحصول على الكود.</div>
              </motion.div>
            ) : (
              <>
                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl mb-6 font-tajawal text-sm text-center">
                    {error}
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-5 font-tajawal">
                  <div className="relative group">
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-500 group-focus-within:text-magma transition-colors" />
                    </div>
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl pr-12 pl-4 py-4 text-white focus:outline-none focus:ring-1 focus:ring-magma focus:border-magma transition-all placeholder:text-gray-600 text-right backdrop-blur-md"
                      placeholder="اسم البطل"
                      required
                    />
                  </div>

                  <div className="relative group">
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-500 group-focus-within:text-magma transition-colors" />
                    </div>
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl pr-12 pl-4 py-4 text-white focus:outline-none focus:ring-1 focus:ring-magma focus:border-magma transition-all placeholder:text-gray-600 text-right backdrop-blur-md"
                      placeholder="البريد الإلكتروني"
                      required
                    />
                  </div>

                  <div className="relative group space-y-3">
                    <div className="relative">
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-500 group-focus-within:text-magma transition-colors" />
                      </div>
                      <input 
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl pr-12 pl-12 py-4 text-white focus:outline-none focus:ring-1 focus:ring-magma focus:border-magma transition-all placeholder:text-gray-600 text-right backdrop-blur-md font-sans"
                        placeholder="كلمة المرور"
                        required
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-500 hover:text-white transition-colors"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>

                    {/* Password Strength Indicator */}
                    {password.length > 0 && (
                      <div className="bg-black/40 border border-white/5 rounded-xl p-4 mt-2 animate-in fade-in slide-in-from-top-2">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs text-gray-400 font-bold">قوة كلمة المرور:</span>
                          <span className={`text-xs font-bold ${getStrengthTextColor()}`}>{getStrengthText()}</span>
                        </div>
                        <div className="flex gap-1 mb-4 h-1.5 w-full">
                          <div className={`flex-1 rounded-full transition-colors duration-300 ${strengthScore >= 1 ? getStrengthColor() : 'bg-white/10'}`}></div>
                          <div className={`flex-1 rounded-full transition-colors duration-300 ${strengthScore >= 3 ? getStrengthColor() : 'bg-white/10'}`}></div>
                          <div className={`flex-1 rounded-full transition-colors duration-300 ${strengthScore >= 4 ? getStrengthColor() : 'bg-white/10'}`}></div>
                          <div className={`flex-1 rounded-full transition-colors duration-300 ${strengthScore >= 5 ? getStrengthColor() : 'bg-white/10'}`}></div>
                        </div>

                        <ul className="text-xs space-y-2">
                          <li className={`flex items-center gap-2 transition-colors ${hasLength ? 'text-green-400' : 'text-gray-500'}`}>
                            {hasLength ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                            8 أحرف على الأقل
                          </li>
                          <li className={`flex items-center gap-2 transition-colors ${hasNumber ? 'text-green-400' : 'text-gray-500'}`}>
                            {hasNumber ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                            يحتوي على رقم واحد على الأقل
                          </li>
                          <li className={`flex items-center gap-2 transition-colors ${hasSpecial ? 'text-green-400' : 'text-gray-500'}`}>
                            {hasSpecial ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                            يحتوي على رمز خاص (مثل @, #, $)
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>

                  <button 
                    type="submit" 
                    disabled={isLoading || (password.length > 0 && !isPasswordValid)}
                    className="w-full bg-gradient-to-r from-magma to-magma-dark hover:from-magma-light hover:to-magma text-white font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02] active:scale-95 glow-magma disabled:opacity-50 disabled:hover:scale-100 flex justify-center items-center gap-2 mt-2 border border-magma/50"
                  >
                    {isLoading ? (
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <span>انضمام للملحمة</span>
                    )}
                  </button>
                </form>

                <p className="mt-8 text-center text-gray-400 font-tajawal">
                  لديك حساب بالفعل؟ <Link href="/login" className="text-magma hover:text-magma-light font-bold transition-colors">تسجيل الدخول</Link>
                </p>
              </>
            )}
          </motion.div>
        </div>
      </div>

      {/* القسم الأيسر: الصورة الملحمية */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center transform hover:scale-105 transition-transform duration-10000"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=2098&auto=format&fit=crop')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-l from-[#050505] via-transparent to-transparent" />
        <div className="absolute inset-0 bg-magma/10 mix-blend-overlay" />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]" />
        
        <div className="relative z-10 flex flex-col justify-end p-16 text-white h-full w-full bg-gradient-to-t from-[#050505] via-transparent to-transparent">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-7xl font-black tracking-widest font-tajawal text-transparent bg-clip-text bg-gradient-to-br from-magma-light via-magma to-magma-dark mb-6 drop-shadow-[0_0_15px_color-mix(in_srgb,var(--theme-primary)_30%,transparent)]"
          >
            نار التكوين
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-2xl text-gray-200 max-w-lg font-light leading-relaxed font-tajawal drop-shadow-md"
          >
            من الرماد ننهض، وفي الظلام نصنع النور. أولئك الذين يحملون الشعلة هم من يقودون العالم.
          </motion.p>
        </div>
      </div>
    </div>
  );
}
