'use client';

import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function MaintenanceGuard({ 
  children, 
  isMaintenanceMode,
  maintenanceMessage 
}: { 
  children: React.ReactNode;
  isMaintenanceMode: boolean;
  maintenanceMessage?: string;
}) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  
  if (isMaintenanceMode) {
    const isAdmin = (session?.user as any)?.role === 'ADMIN';
    const isLoginPage = pathname === '/login';
    const isRegisterPage = pathname === '/register';
    
    if (!isAdmin && !isLoginPage && !isRegisterPage && status !== 'loading') {
      return (
        <div className="min-h-screen bg-abyss flex flex-col items-center justify-center p-4 relative overflow-hidden" dir="rtl">
          {/* Background Glows */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--color-magma)]/10 blur-[150px] rounded-full pointer-events-none animate-pulse" />
          
          <div className="bg-[#111]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 max-w-lg w-full text-center shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-slide-up relative z-10">
            <div className="w-24 h-24 bg-[var(--color-magma)]/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-[var(--color-magma)]/30">
              <AlertTriangle className="w-12 h-12 text-[var(--color-magma)] animate-pulse" />
            </div>
            <h1 className="text-3xl font-bold font-cairo text-white mb-4 tracking-wide">بوابات العوالم مغلقة مؤقتاً</h1>
            <p className="text-gray-400 font-tajawal text-lg leading-relaxed mb-8">
              {maintenanceMessage || 'الموقع يخضع لعمليات صيانة وتحديث للأنظمة. سنعود قريباً جداً، نشكركم على صبركم.'}
            </p>
            
            <div className="pt-6 border-t border-white/5">
              <Link href="/login" className="text-sm text-gray-600 hover:text-gray-400 transition-colors">دخول الإدارة</Link>
            </div>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
}
