'use client';

import { useState } from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function DeleteAccountSection() {
  const [step, setStep] = useState<'IDLE' | 'OTP_SENT' | 'LOADING'>('IDLE');
  const [otpCode, setOtpCode] = useState('');
  const [error, setError] = useState('');

  const handleRequestDelete = async () => {
    setStep('LOADING');
    setError('');
    try {
      const res = await fetch('/api/auth/delete-request', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setStep('OTP_SENT');
    } catch (err: any) {
      setError(err.message);
      setStep('IDLE');
    }
  };

  const handleConfirmDelete = async () => {
    if (otpCode.length !== 6) {
      setError('يجب أن يتكون الكود من 6 أرقام');
      return;
    }
    setStep('LOADING');
    setError('');
    try {
      const res = await fetch('/api/auth/delete-confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: otpCode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      
      // Account deleted, logout user
      await signOut({ callbackUrl: '/' });
    } catch (err: any) {
      setError(err.message);
      setStep('OTP_SENT');
    }
  };

  return (
    <div className="bg-red-500/10 border border-red-500/30 rounded-3xl p-8 shadow-2xl relative overflow-hidden mt-8">
      <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500/50 to-transparent"></div>
      
      <div className="flex items-center gap-3 mb-6">
        <AlertTriangle className="w-8 h-8 text-red-500" />
        <div>
          <h2 className="text-2xl font-bold text-red-400">منطقة الخطر</h2>
          <p className="text-gray-400 text-sm mt-1">حذف الحساب نهائياً. هذه العملية لا يمكن التراجع عنها، وسيتم مسح كافة بياناتك وتاريخك في الملحمة.</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-500 text-red-200 p-4 rounded-xl mb-6 font-bold text-sm">
          {error}
        </div>
      )}

      {step === 'IDLE' && (
        <button 
          onClick={handleRequestDelete}
          className="bg-red-600/20 hover:bg-red-600/40 border border-red-500/50 text-red-400 px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2"
        >
          <Trash2 className="w-5 h-5" />
          طلب حذف الحساب
        </button>
      )}

      {step === 'OTP_SENT' && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
          <p className="text-gray-300 font-bold">لقد أرسلنا كود توثيق مكون من 6 أرقام إلى بريدك الإلكتروني.</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <input 
              type="text" 
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="bg-black/40 border border-red-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-all font-bold text-center tracking-[0.5em]" 
              placeholder="000000"
              maxLength={6}
              dir="ltr"
            />
            <button 
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)]"
            >
              تأكيد الحذف النهائي
            </button>
          </div>
        </div>
      )}

      {step === 'LOADING' && (
        <div className="flex items-center gap-3 text-red-400 font-bold">
          <span className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></span>
          جاري المعالجة...
        </div>
      )}
    </div>
  );
}
