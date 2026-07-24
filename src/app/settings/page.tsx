import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { updateUserProfile } from './actions';
import FileUploadInput from '@/components/ui/FileUploadInput';
import { Save, User, Mail, Lock, ShieldCheck, ArrowRight } from 'lucide-react';
import { redirect } from 'next/navigation';
import DeleteAccountSection from '@/components/settings/DeleteAccountSection';
import Link from 'next/link';
import SettingsForm from './SettingsForm';

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    redirect('/login');
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: session.user.email }
  });

  if (!dbUser) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-[#050505] p-8" dir="rtl">
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Navigation / Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-magma" />
              إعدادات الحساب
            </h1>
            <p className="text-gray-400">التحكم الكامل في هويتك وبيانات الدخول الخاصة بك.</p>
          </div>
          <Link 
            href={dbUser.role === 'ADMIN' ? '/admin' : '/'} 
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-xl border border-white/10"
          >
            <ArrowRight className="w-5 h-5" />
            <span className="font-bold">{dbUser.role === 'ADMIN' ? 'لوحة القيادة' : 'الرئيسية'}</span>
          </Link>
        </div>

        {/* Profile Update Form */}
        <SettingsForm dbUser={dbUser} />

        {/* Delete Account Section */}
        <DeleteAccountSection />
      </div>
    </div>
  );
}
