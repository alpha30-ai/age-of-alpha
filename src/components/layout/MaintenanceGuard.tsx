'use client';

import { Lock, Book, Shield, Flame, Sword, Sparkles, Moon, Star } from 'lucide-react';
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
      
      const floatingIcons = [
        { Icon: Book, top: '10%', left: '15%', delay: 0 },
        { Icon: Shield, top: '20%', right: '10%', delay: 1.5 },
        { Icon: Sword, top: '70%', left: '20%', delay: 3 },
        { Icon: Moon, top: '80%', right: '15%', delay: 4.5 },
        { Icon: Star, top: '40%', left: '5%', delay: 2 },
        { Icon: Sparkles, top: '50%', right: '5%', delay: 3.5 },
        { Icon: Flame, top: '15%', left: '50%', delay: 5 },
      ];

      return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden" dir="rtl">
          
          {/* Animated Background Layers */}
          <div className="absolute inset-0 z-0">
            {/* Pulsing Core */}
            <motion.div 
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-[var(--color-magma)]/20 to-[var(--color-milky-blue)]/20 rounded-full blur-[150px]"
            />

            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTU5LjUgMGguNXY2MGgtLjV6TTAgNTkuNWg2MHYuNUgweiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAyKSIgZmlsbC1ydWxlPSJldmVub2RkIi8+PC9zdmc+')] opacity-20"></div>
          </div>

          {/* Floating Icons */}
          {floatingIcons.map((item, index) => (
            <motion.div
              key={index}
              animate={{
                y: [0, -30, 0],
                rotate: [0, 15, -15, 0],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: item.delay,
              }}
              className="absolute text-gray-500 z-0"
              style={{ top: item.top, left: item.left, right: item.right }}
            >
              <item.Icon className="w-12 h-12" />
            </motion.div>
          ))}

          {/* Secret Entrance (Logo) */}
          <motion.div
            animate={{
              y: [0, -40, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute top-[30%] left-[80%] md:left-[70%] z-20 cursor-pointer hover:opacity-100 transition-opacity"
          >
            <Link href="/login" aria-label="Secret Login">
              {/* Using a star icon as a disguised logo entrance, or a glowing orb */}
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-transparent via-[var(--color-magma)]/30 to-transparent border border-[var(--color-magma)]/10 backdrop-blur-md flex items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-[var(--color-magma)]/20 animate-pulse group-hover:bg-[var(--color-magma)]/50 transition-colors" />
                <Sparkles className="w-8 h-8 text-[var(--color-magma)] opacity-50 group-hover:opacity-100 transition-opacity relative z-10" />
              </div>
            </Link>
          </motion.div>

          {/* Main Content Container */}
          <motion.div 
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="bg-[#0a0a0a]/80 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-12 max-w-2xl w-full text-center shadow-2xl relative z-10 overflow-hidden"
          >
            {/* Inner Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-gradient-to-b from-[var(--color-magma)]/10 to-transparent pointer-events-none" />

            {/* Icon Animation */}
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 150, damping: 20 }}
              className="relative w-32 h-32 mx-auto mb-10"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-magma)] to-[var(--color-milky-blue)] rounded-full animate-spin-slow opacity-20 blur-2xl"></div>
              <div className="relative w-full h-full bg-[#111] border border-white/10 rounded-full flex items-center justify-center shadow-inner">
                <Lock className="w-14 h-14 text-[var(--color-magma)]" strokeWidth={1.5} />
              </div>
            </motion.div>

            {/* Typography */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold font-cairo text-white mb-6 tracking-wide leading-tight">
                أبواب العوالم <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-magma)] to-[var(--color-milky-blue)]">
                  قيد التكوين
                </span>
              </h1>
              
              <p className="text-gray-400 font-tajawal text-lg md:text-xl leading-relaxed mb-10 max-w-xl mx-auto">
                {maintenanceMessage || 'نقوم بنسج تعويذات جديدة وتحديث بنية العالم السحرية. القوى تتبلور الآن، وسنفتح الأبواب قريباً جداً.'}
              </p>
            </motion.div>
            
            {/* Progress / Status Indicator */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="w-full h-1 bg-white/5 rounded-full overflow-hidden relative"
            >
              <motion.div 
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 bottom-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-[var(--color-magma)] to-transparent"
              />
            </motion.div>
          </motion.div>
        </div>
      );
    }
  }

  return <>{children}</>;
}
