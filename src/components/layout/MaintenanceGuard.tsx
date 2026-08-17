'use client';

import { AlertTriangle, Lock } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';

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
          
          {/* Animated Background Layers */}
          <div className="absolute inset-0 z-0">
            {/* Pulsing Orbs */}
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[var(--theme-primary-dark)]/20 rounded-full blur-[120px]"
            />
            <motion.div 
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.1, 0.2, 0.1],
              }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-[var(--theme-secondary-dark)]/20 rounded-full blur-[150px]"
            />
            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTU5LjUgMGguNXY2MGgtLjV6TTAgNTkuNWg2MHYuNUgweiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAyKSIgZmlsbC1ydWxlPSJldmVub2RkIi8+PC9zdmc+')] opacity-50"></div>
          </div>

          {/* Main Content Container */}
          <motion.div 
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="bg-black/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-10 max-w-2xl w-full text-center shadow-[0_0_50px_rgba(0,0,0,0.5)] relative z-10"
          >
            {/* Icon Animation */}
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 200, damping: 20 }}
              className="relative w-28 h-28 mx-auto mb-8"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-[var(--theme-primary-dark)] to-[var(--theme-secondary-dark)] rounded-full animate-spin-slow opacity-20 blur-xl"></div>
              <div className="relative w-full h-full bg-black/50 border border-white/10 rounded-full flex items-center justify-center backdrop-blur-md shadow-inner">
                <Lock className="w-12 h-12 text-[var(--theme-primary-dark)]" />
              </div>
            </motion.div>

            {/* Typography */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold font-cairo text-white mb-6 tracking-wide drop-shadow-lg">
                بوابات العوالم <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--theme-primary-dark)] to-[var(--theme-secondary-dark)]">مغلقة مؤقتاً</span>
              </h1>
              
              <p className="text-silver-ash font-tajawal text-lg md:text-xl leading-relaxed mb-10 max-w-xl mx-auto">
                {maintenanceMessage || 'الموقع يخضع لعمليات صيانة سحرية وتحديث للأنظمة. القوى تتبلور، وسنعود قريباً جداً، نشكركم على صبركم.'}
              </p>
            </motion.div>
            
            {/* Progress / Status Indicator */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mb-10 relative"
            >
              <motion.div 
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 bottom-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-[var(--theme-primary-dark)] to-transparent"
              />
            </motion.div>
            
            {/* Admin Login Link */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="pt-6 border-t border-white/5"
            >
              <Link href="/login" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors group">
                <Lock className="w-4 h-4 group-hover:text-[var(--theme-primary-dark)] transition-colors" />
                <span>بوابة الإدارة السرية</span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      );
    }
  }

  return <>{children}</>;
}
