'use client';

import { useState } from 'react';
import { updateSettings } from './actions';
import { ShieldAlert, CheckCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SettingsForm({ defaultSettings }: { defaultSettings: any }) {
  const [isPending, setIsPending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    setShowSuccess(false);
    try {
      await updateSettings(formData);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error(error);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-8" dir="rtl">
      
      {/* Maintenance Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-xl border border-[var(--color-theme-border)] rounded-3xl p-8 shadow-2xl relative overflow-hidden"
      >
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--color-theme-border)]">
          <div className="p-2 bg-red-500/10 rounded-lg">
            <ShieldAlert className="w-6 h-6 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-[var(--color-theme-heading)]">وضع الصيانة</h2>
        </div>
        
        <div className="space-y-6">
          <label className="flex items-center gap-4 cursor-pointer p-6 rounded-2xl border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 transition-colors">
            <div className="relative flex items-center">
              <input type="hidden" name="isMaintenanceMode" value="false" />
              <input 
                type="checkbox" 
                id="isMaintenanceMode" 
                name="isMaintenanceMode" 
                value="true" 
                defaultChecked={defaultSettings.isMaintenanceMode} 
                className="w-6 h-6 accent-red-500 rounded bg-gray-900 border-gray-700 cursor-pointer" 
              />
            </div>
            <div>
              <span className="block text-lg font-bold text-red-400">تفعيل وضع الصيانة</span>
              <span className="block text-sm text-gray-400 mt-1">سيتم منع وصول الزوار العاديين للموقع وعرض رسالة الصيانة. يحق للإدارة الدخول فقط.</span>
            </div>
          </label>

          <div className="space-y-2">
            <label htmlFor="maintenanceMessage" className="block text-sm font-bold text-gray-300">رسالة الصيانة التي ستظهر للزوار</label>
            <textarea 
              id="maintenanceMessage" 
              name="maintenanceMessage" 
              defaultValue={defaultSettings.maintenanceMessage} 
              rows={4}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--color-magma)]/50 focus:shadow-[0_0_15px_var(--color-magma)]/20 transition-all resize-none font-tajawal text-lg" 
            />
          </div>
        </div>
      </motion.div>

      {/* API Keys Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/5 backdrop-blur-xl border border-[var(--color-theme-border)] rounded-3xl p-8 shadow-2xl relative overflow-hidden"
      >
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--color-theme-border)]">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <ShieldAlert className="w-6 h-6 text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-[var(--color-theme-heading)]">مفاتيح الربط البرمجية (API Keys)</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="geminiApiKey" className="block text-sm font-bold text-gray-300">Gemini API Key (للشات بوت)</label>
            <input 
              type="password" 
              id="geminiApiKey" 
              name="geminiApiKey" 
              defaultValue={defaultSettings.geminiApiKey} 
              placeholder="AIzaSy..." 
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--color-magma)]/50 transition-all font-mono" 
              dir="ltr"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="openAiApiKey" className="block text-sm font-bold text-gray-300">OpenAI API Key (اختياري)</label>
            <input 
              type="password" 
              id="openAiApiKey" 
              name="openAiApiKey" 
              defaultValue={defaultSettings.openAiApiKey} 
              placeholder="sk-..." 
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--color-magma)]/50 transition-all font-mono" 
              dir="ltr"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="cloudinaryCloudName" className="block text-sm font-bold text-gray-300">Cloudinary Cloud Name</label>
            <input 
              type="text" 
              id="cloudinaryCloudName" 
              name="cloudinaryCloudName" 
              defaultValue={defaultSettings.cloudinaryCloudName} 
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--color-magma)]/50 transition-all font-mono" 
              dir="ltr"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="cloudinaryApiKey" className="block text-sm font-bold text-gray-300">Cloudinary API Key</label>
            <input 
              type="password" 
              id="cloudinaryApiKey" 
              name="cloudinaryApiKey" 
              defaultValue={defaultSettings.cloudinaryApiKey} 
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--color-magma)]/50 transition-all font-mono" 
              dir="ltr"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label htmlFor="cloudinaryApiSecret" className="block text-sm font-bold text-gray-300">Cloudinary API Secret</label>
            <input 
              type="password" 
              id="cloudinaryApiSecret" 
              name="cloudinaryApiSecret" 
              defaultValue={defaultSettings.cloudinaryApiSecret} 
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--color-magma)]/50 transition-all font-mono" 
              dir="ltr"
            />
          </div>
        </div>
      </motion.div>

      {/* Submit Button */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-4"
      >
        <button 
          type="submit" 
          disabled={isPending}
          className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white px-10 py-4 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              جاري الحفظ...
            </>
          ) : (
            'حفظ إعدادات النظام'
          )}
        </button>

        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex items-center gap-2 text-emerald-400 bg-emerald-400/10 px-4 py-3 rounded-xl border border-emerald-400/20"
          >
            <CheckCircle className="w-5 h-5" />
            <span className="font-bold">تم حفظ إعدادات النظام بنجاح!</span>
          </motion.div>
        )}
      </motion.div>

    </form>
  );
}
