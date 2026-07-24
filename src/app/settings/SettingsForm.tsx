'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Save, User, Mail, Lock } from 'lucide-react';
import FileUploadInput from '@/components/ui/FileUploadInput';
import { updateUserProfile } from './actions';
import { useState } from 'react';

export default function SettingsForm({ dbUser }: { dbUser: any }) {
  const { update } = useSession();
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    try {
      await updateUserProfile(formData);
      // Force next-auth session update on the client
      await update();
      // Refresh router to get new server-side data
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form action={handleSubmit} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl space-y-8 relative overflow-hidden">
      {/* Aesthetic Background Accents */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-magma/10 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-milky-blue/10 rounded-full blur-3xl -z-10 -translate-x-1/2 translate-y-1/2"></div>

      <div className="flex flex-col md:flex-row gap-10 items-start">
        {/* Profile Picture Upload */}
        <div className="w-full md:w-1/3 space-y-4">
          <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2">الصورة الشخصية</h3>
          <div className="p-4 bg-black/40 rounded-2xl border border-white/5 shadow-inner">
            <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-magma/30 shadow-[0_0_20px_color-mix(in_srgb,var(--theme-primary)_20%,transparent)] bg-black/50 flex items-center justify-center">
              {dbUser.image ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={dbUser.image} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-12 h-12 text-magma" />
              )}
            </div>
            <FileUploadInput name="image" label="" defaultValue={dbUser.image || ''} accept="image/*" />
          </div>
        </div>

        {/* User Details */}
        <div className="w-full md:w-2/3 space-y-6">
          <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2 flex items-center justify-between">
            <span>البيانات الأساسية</span>
            {dbUser.createdAt && (
              <span className="text-xs font-normal text-gray-400 bg-black/40 px-3 py-1 rounded-full border border-white/5">
                عضو منذ: {new Date(dbUser.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            )}
          </h3>
          
          <div className="space-y-2 relative">
            <label htmlFor="name" className="block text-sm font-bold text-gray-300">الاسم</label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-400">
                <User className="w-5 h-5" />
              </div>
              <input 
                type="text" 
                id="name" 
                name="name" 
                defaultValue={dbUser.name || ''} 
                required
                className="w-full bg-black/40 border border-white/10 rounded-xl pr-12 pl-4 py-3 text-white focus:outline-none focus:border-magma/50 focus:shadow-magma/20 transition-all font-bold" 
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-bold text-gray-300">البريد الإلكتروني</label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-400">
                <Mail className="w-5 h-5" />
              </div>
              <input 
                type="email" 
                id="email" 
                name="email" 
                defaultValue={dbUser.email || ''} 
                required
                className="w-full bg-black/40 border border-white/10 rounded-xl pr-12 pl-4 py-3 text-white focus:outline-none focus:border-magma/50 focus:shadow-magma/20 transition-all text-left" 
                dir="ltr"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-bold text-gray-300">كلمة المرور الجديدة (اختياري)</label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-400">
                <Lock className="w-5 h-5" />
              </div>
              <input 
                type="password" 
                id="password" 
                name="password" 
                placeholder="اترك هذا الحقل فارغاً إذا لم ترغب بتغييرها"
                className="w-full bg-black/40 border border-white/10 rounded-xl pr-12 pl-4 py-3 text-white focus:outline-none focus:border-magma/50 focus:shadow-magma/20 transition-all text-left placeholder:text-gray-600" 
                dir="ltr"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end pt-6 border-t border-white/10">
        <button 
          type="submit" 
          disabled={isPending}
          className="flex items-center justify-center gap-2 bg-magma hover:bg-magma-light text-white px-10 py-3 rounded-xl font-bold transition-all shadow-magma/30 hover:shadow-magma/50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-5 h-5" />
          {isPending ? 'جاري الحفظ...' : 'حفظ التغييرات'}
        </button>
      </div>
    </form>
  );
}
