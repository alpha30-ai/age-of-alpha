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
        className="bg-white/5 backdrop-blur-xl border border-[var(--color-theme-border)] rounded-3xl p-8 shadow-2xl relative overflow-hidden"
      >
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--color-theme-border)]">
          <div className="p-2 bg-purple-500/10 rounded-lg">
            <Paintbrush className="w-6 h-6 text-purple-400" />
          </div>
          <h2 className="text-2xl font-bold text-[var(--color-theme-heading)]">لوحة الألوان الملكية</h2>
        </div>

        {/* Theme Presets */}
        <div className="mb-8 p-4 bg-black/20 rounded-2xl border border-white/5">
          <h3 className="text-sm font-bold text-gray-300 mb-4">الثيمات الجاهزة (اختر لتطبيق سريع)</h3>
          <div className="flex flex-wrap gap-4">
            <button
              type="button"
              onClick={() => {
                (document.getElementById('primaryColor') as HTMLInputElement).value = '#E64A19';
                (document.getElementById('primaryColor_text') as HTMLInputElement).value = '#E64A19';
                (document.getElementById('secondaryColor') as HTMLInputElement).value = '#A9C4EB';
                (document.getElementById('secondaryColor_text') as HTMLInputElement).value = '#A9C4EB';
                (document.getElementById('headingColor') as HTMLInputElement).value = '#FFFFFF';
                (document.getElementById('headingColor_text') as HTMLInputElement).value = '#FFFFFF';
                (document.getElementById('borderColor') as HTMLInputElement).value = 'rgba(255,255,255,0.1)';
                (document.getElementById('borderColor_text') as HTMLInputElement).value = 'rgba(255,255,255,0.1)';
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400 hover:bg-orange-500/20 transition-all font-bold"
            >
              <div className="w-4 h-4 rounded-full bg-[#E64A19]" /> ناري (الافتراضي)
            </button>
            <button
              type="button"
              onClick={() => {
                (document.getElementById('primaryColor') as HTMLInputElement).value = '#10B981';
                (document.getElementById('primaryColor_text') as HTMLInputElement).value = '#10B981';
                (document.getElementById('secondaryColor') as HTMLInputElement).value = '#D1FAE5';
                (document.getElementById('secondaryColor_text') as HTMLInputElement).value = '#D1FAE5';
                (document.getElementById('headingColor') as HTMLInputElement).value = '#34D399';
                (document.getElementById('headingColor_text') as HTMLInputElement).value = '#34D399';
                (document.getElementById('borderColor') as HTMLInputElement).value = 'rgba(16,185,129,0.2)';
                (document.getElementById('borderColor_text') as HTMLInputElement).value = 'rgba(16,185,129,0.2)';
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition-all font-bold"
            >
              <div className="w-4 h-4 rounded-full bg-[#10B981]" /> زمردي
            </button>
            <button
              type="button"
              onClick={() => {
                (document.getElementById('primaryColor') as HTMLInputElement).value = '#8B5CF6';
                (document.getElementById('primaryColor_text') as HTMLInputElement).value = '#8B5CF6';
                (document.getElementById('secondaryColor') as HTMLInputElement).value = '#EDE9FE';
                (document.getElementById('secondaryColor_text') as HTMLInputElement).value = '#EDE9FE';
                (document.getElementById('headingColor') as HTMLInputElement).value = '#C4B5FD';
                (document.getElementById('headingColor_text') as HTMLInputElement).value = '#C4B5FD';
                (document.getElementById('borderColor') as HTMLInputElement).value = 'rgba(139,92,246,0.2)';
                (document.getElementById('borderColor_text') as HTMLInputElement).value = 'rgba(139,92,246,0.2)';
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 hover:bg-purple-500/20 transition-all font-bold"
            >
              <div className="w-4 h-4 rounded-full bg-[#8B5CF6]" /> ظلامي ملكي
            </button>
            <button
              type="button"
              onClick={() => {
                (document.getElementById('primaryColor') as HTMLInputElement).value = '#3B82F6';
                (document.getElementById('primaryColor_text') as HTMLInputElement).value = '#3B82F6';
                (document.getElementById('secondaryColor') as HTMLInputElement).value = '#DBEAFE';
                (document.getElementById('secondaryColor_text') as HTMLInputElement).value = '#DBEAFE';
                (document.getElementById('headingColor') as HTMLInputElement).value = '#93C5FD';
                (document.getElementById('headingColor_text') as HTMLInputElement).value = '#93C5FD';
                (document.getElementById('borderColor') as HTMLInputElement).value = 'rgba(59,130,246,0.2)';
                (document.getElementById('borderColor_text') as HTMLInputElement).value = 'rgba(59,130,246,0.2)';
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500/20 transition-all font-bold"
            >
              <div className="w-4 h-4 rounded-full bg-[#3B82F6]" /> جليدي
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { id: 'primaryColor', label: 'اللون الأساسي (Primary)', default: defaultTheme.primaryColor },
            { id: 'secondaryColor', label: 'اللون الثانوي (Secondary)', default: defaultTheme.secondaryColor },
            { id: 'backgroundColor', label: 'لون الخلفية (Background)', default: defaultTheme.backgroundColor },
            { id: 'textColor', label: 'لون النصوص (Text)', default: defaultTheme.textColor },
            { id: 'headingColor', label: 'لون العناوين (Headings)', default: defaultTheme.headingColor || '#FFFFFF' },
            { id: 'borderColor', label: 'لون الحواف والحدود (Borders)', default: defaultTheme.borderColor || 'rgba(255,255,255,0.1)' },
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
                  onChange={(e) => { (document.getElementById(`${colorItem.id}_text`) as HTMLInputElement).value = e.target.value; }}
                  className="w-12 h-12 rounded-lg cursor-pointer bg-transparent border-0 p-0" 
                />
                <input 
                  type="text"
                  id={`${colorItem.id}_text`}
                  defaultValue={colorItem.default} 
                  onChange={(e) => { (document.getElementById(colorItem.id) as HTMLInputElement).value = e.target.value; }}
                  className="bg-transparent border-none outline-none text-white font-mono flex-1 text-left ltr" 
                  dir="ltr"
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Opacity Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-white/5 backdrop-blur-xl border border-[var(--color-theme-border)] rounded-3xl p-8 shadow-2xl relative overflow-hidden"
      >
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--color-theme-border)]">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <ImageIcon className="w-6 h-6 text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-[var(--color-theme-heading)]">التحكم بالشفافية (Transparency)</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <label className="flex justify-between text-sm font-bold text-gray-300">
              <span>شفافية البطاقات (Cards Opacity)</span>
              <span id="cardOpacityValue">{defaultTheme.cardOpacity ?? 0.8}</span>
            </label>
            <input 
              type="range" 
              id="cardOpacity" 
              name="cardOpacity" 
              min="0" max="1" step="0.05" 
              defaultValue={defaultTheme.cardOpacity ?? 0.8}
              onChange={(e) => document.getElementById('cardOpacityValue')!.innerText = e.target.value}
              className="w-full accent-[var(--theme-primary)]" 
            />
            <p className="text-xs text-gray-500">يتحكم في مدى شفافية خلفية الصناديق والبطاقات في الموقع</p>
          </div>
          
          <div className="space-y-4">
            <label className="flex justify-between text-sm font-bold text-gray-300">
              <span>شفافية الأزرار (Buttons Opacity)</span>
              <span id="buttonOpacityValue">{defaultTheme.buttonOpacity ?? 1.0}</span>
            </label>
            <input 
              type="range" 
              id="buttonOpacity" 
              name="buttonOpacity" 
              min="0.1" max="1" step="0.05" 
              defaultValue={defaultTheme.buttonOpacity ?? 1.0}
              onChange={(e) => document.getElementById('buttonOpacityValue')!.innerText = e.target.value}
              className="w-full accent-[var(--theme-primary)]" 
            />
            <p className="text-xs text-gray-500">يتحكم في مدى شفافية خلفية الأزرار الرئيسية</p>
          </div>
        </div>
      </motion.div>

      {/* Banner Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/5 backdrop-blur-xl border border-[var(--color-theme-border)] rounded-3xl p-8 shadow-2xl relative overflow-hidden"
      >
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--color-theme-border)]">
          <div className="p-2 bg-orange-500/10 rounded-lg">
            <ImageIcon className="w-6 h-6 text-orange-400" />
          </div>
          <h2 className="text-2xl font-bold text-[var(--color-theme-heading)]">الواجهة الرئيسية (Hero Banner)</h2>
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
