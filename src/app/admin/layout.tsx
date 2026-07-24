import type { Metadata } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminSidebar from './AdminSidebar';

export const metadata: Metadata = {
  title: 'لوحة التحكم | عهد ألفا',
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  
  if (!session || (session.user as any)?.role !== 'ADMIN') {
    redirect('/');
  }
  return (
    <div className="min-h-screen bg-[#050505] flex flex-col md:flex-row font-sans relative z-0" dir="rtl">
      {/* Grid Pattern Background */}
      <div 
        className="fixed inset-0 z-[-2] opacity-[0.03] pointer-events-none"
        style={{ 
          backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
          backgroundSize: '40px 40px' 
        }}
      />
      
      <AdminSidebar user={session?.user} />

      {/* Main Content */}
      <main className="flex-1 relative overflow-y-auto">
        {/* Background Gradients */}
        <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-[-1]">
          <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-[#E64A19]/10 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-[#A9C4EB]/10 blur-[120px] rounded-full"></div>
        </div>
        
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
