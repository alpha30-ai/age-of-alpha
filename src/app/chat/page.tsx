import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import MaintenanceGuard from '@/components/layout/MaintenanceGuard';
import ChatClient from './ChatClient';

export default function ChatPage() {
  return (
    <MaintenanceGuard>
      <Suspense fallback={<div className="min-h-screen bg-[#050505] flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-[var(--theme-primary)]" /></div>}>
        <ChatClient />
      </Suspense>
    </MaintenanceGuard>
  );
}
