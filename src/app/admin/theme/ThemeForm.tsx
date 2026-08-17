'use client';

import { useState } from 'react';
import { updateTheme } from './actions';
import { Paintbrush, Image as ImageIcon, CheckCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import FileUploadInput from '@/components/ui/FileUploadInput';

export default function ThemeForm({ defaultTheme }: { defaultTheme: any }) {
  const [isPending, setIsPending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    setShowSuccess(false);
    try {
      await updateTheme(formData);
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
      
      {/* Colors Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
      >
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
          <div className="p-2 bg-purple-500/10 rounded-lg">
            <Paintbrush className="w-6 h-6 text-purple-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">لوحة الألوان الملكية</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { id: 'primaryColor', label: 'اللون الأساسي (Primary)', default: defaultTheme.primaryColor },
            { id: 'secondaryColor', label: 'اللون الثانوي (Secondary)', default: defaultTheme.secondaryColor },
            { id: 'backgroundColor', label: 'لون الخلفية (Background)', default: defaultTheme.backgroundColor },
            { id: 'textColor', label: 'لون النصوص (Text)', default: defaultTheme.textColor },
          ].map((colorItem) => (
            <div key={colorItem.id} className="space-y-3">
              <label htmlFor={colorItem.id} className="block text-sm font-bold text-gray-300">
                {colorItem.label}
              </label>
              <div className="flex items-center gap-4 bg-black/40 border border-white/10 rounded-xl p-2 transition-all focus-within:border-purple-500/50 focus-within:shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                <input 
                  type="color" 
                  id={colorItem.id} 
                  name={colorItem.id} 
                  defaultValue={colorItem.default} 
                  className="w-12 h-12 rounded-lg cursor-pointer bg-transparent border-0 p-0" 
                />
                <input 
                  type="text" 
                  defaultValue={colorItem.default} 
                  className="bg-transparent border-none outline-none text-white font-mono flex-1 text-left ltr" 
                  readOnly 
                  dir="ltr"
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Banner Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
      >
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
          <div className="p-2 bg-orange-500/10 rounded-lg">
            <ImageIcon className="w-6 h-6 text-orange-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">الواجهة الرئيسية (Hero Banner)</h2>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-2">
            <label htmlFor="bannerTitle" className="block text-sm font-bold text-gray-300">العنوان الرئيسي</label>
            <input 
              type="text" 
              id="bannerTitle" 
              name="bannerTitle" 
              defaultValue={defaultTheme.bannerTitle} 
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500/50 focus:shadow-[0_0_15px_rgba(249,115,22,0.2)] transition-all font-bold" 
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="bannerSubtitle" className="block text-sm font-bold text-gray-300">العنوان الفرعي</label>
            <input 
              type="text" 
              id="bannerSubtitle" 
              name="bannerSubtitle" 
              defaultValue={defaultTheme.bannerSubtitle} 
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500/50 focus:shadow-[0_0_15px_rgba(249,115,22,0.2)] transition-all" 
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="bannerDescription" className="block text-sm font-bold text-gray-300">الوصف الطويل (يظهر تحت العنوان)</label>
            <textarea 
              id="bannerDescription" 
              name="bannerDescription" 
              defaultValue={defaultTheme.bannerDescription} 
              rows={4}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500/50 focus:shadow-[0_0_15px_rgba(249,115,22,0.2)] transition-all resize-none" 
            />
          </div>
          
          <div className="space-y-2">
            <FileUploadInput name="bannerImageUrl" label="صورة الخلفية (ارفع من الجهاز أو رابط خارجي)" defaultValue={defaultTheme.bannerImageUrl || ''} accept="image/*" />
          </div>

          <label className="flex items-center gap-4 cursor-pointer mt-4 p-4 rounded-xl border border-white/5 bg-black/20 hover:bg-black/40 transition-colors">
            <div className="relative flex items-center">
              <input type="hidden" name="bannerIsActive" value="false" />
              <input 
                type="checkbox" 
                id="bannerIsActive" 
                name="bannerIsActive" 
                value="true" 
                defaultChecked={defaultTheme.bannerIsActive} 
                className="w-5 h-5 accent-orange-500 rounded bg-gray-900 border-gray-700 cursor-pointer" 
              />
            </div>
            <span className="text-sm font-bold text-gray-300">تفعيل هذه التعديلات وعرضها في الصفحة الرئيسية بدلاً من المظهر الافتراضي للرواية</span>
          </label>
        </div>
      </motion.div>

      {/* Submit Button */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-4"
      >
        <button 
          type="submit" 
          disabled={isPending}
          className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-red-800 hover:from-orange-500 hover:to-red-700 text-white px-10 py-4 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(234,88,12,0.3)] hover:shadow-[0_0_30px_rgba(234,88,12,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              جاري حفظ التعديلات...
            </>
          ) : (
            'حفظ إعدادات المظهر'
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
            <span className="font-bold">تم الحفظ بنجاح!</span>
          </motion.div>
        )}
      </motion.div>

    </form>
  );
}
