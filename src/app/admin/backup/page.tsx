'use client';

import { useState } from 'react';
import { DownloadCloud, UploadCloud, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function BackupAdminPage() {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const router = useRouter();

  const handleExport = async () => {
    setIsExporting(true);
    setMessage(null);
    try {
      const res = await fetch('/api/admin/backup');
      if (!res.ok) throw new Error('فشل في تصدير البيانات');
      
      const data = await res.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `age_of_alpha_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      setMessage({ type: 'success', text: 'تم تصدير النسخة الاحتياطية بنجاح!' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'حدث خطأ أثناء التصدير' });
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        setIsImporting(true);
        setMessage(null);
        
        const content = event.target?.result as string;
        const backupData = JSON.parse(content);
        
        if (!backupData.version || !backupData.data) {
          throw new Error('ملف النسخة الاحتياطية غير صالح');
        }

        const res = await fetch('/api/admin/backup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(backupData),
        });

        const result = await res.json();
        
        if (!res.ok) throw new Error(result.error || 'فشل في استعادة البيانات');
        
        setMessage({ type: 'success', text: 'تمت استعادة البيانات بنجاح!' });
        router.refresh();
      } catch (error: any) {
        setMessage({ type: 'error', text: error.message || 'حدث خطأ أثناء الاستيراد' });
      } finally {
        setIsImporting(false);
        if (e.target) e.target.value = '';
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
      <div className="flex flex-col gap-2 border-b border-white/10 pb-6">
        <h1 className="text-3xl font-amiri font-bold text-white flex items-center gap-3">
          <DownloadCloud className="w-8 h-8 text-magma" />
          النسخ الاحتياطي والاستعادة
        </h1>
        <p className="text-gray-400 font-tajawal text-lg">
          احفظ بيانات الموقع بالكامل أو قم باستعادتها في أي وقت.
        </p>
      </div>

      {message && (
        <div className={`p-4 rounded-xl border flex items-center gap-3 ${
          message.type === 'success' 
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
            : 'bg-red-500/10 border-red-500/30 text-red-400'
        }`}>
          {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          <p className="font-bold">{message.text}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export Card */}
        <div className="stone-card rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-4">
          <div className="w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/30">
            <DownloadCloud className="w-10 h-10 text-blue-400" />
          </div>
          <h3 className="text-2xl font-bold text-white font-amiri">تصدير الفصول والإعدادات</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            قم بتحميل نسخة كاملة من جميع الفصول، الشخصيات، إعدادات النشر، والمظهر في ملف JSON واحد للحفاظ عليها.
          </p>
          <button 
            onClick={handleExport}
            disabled={isExporting || isImporting}
            className="mt-4 flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-full font-bold transition-all disabled:opacity-50"
          >
            {isExporting ? <Loader2 className="w-5 h-5 animate-spin" /> : <DownloadCloud className="w-5 h-5" />}
            تصدير الآن (Export)
          </button>
        </div>

        {/* Import Card */}
        <div className="stone-card rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-4">
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/30">
            <UploadCloud className="w-10 h-10 text-emerald-400" />
          </div>
          <h3 className="text-2xl font-bold text-white font-amiri">استيراد واستعادة (Import)</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            استعد جميع الفصول والإعدادات من ملف نسخة احتياطية سابق. سيتم تحديث البيانات الحالية واستعادة المفقود.
          </p>
          <div className="mt-4 relative">
            <input 
              type="file" 
              accept=".json" 
              onChange={handleImport}
              disabled={isExporting || isImporting}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            />
            <div className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-full font-bold transition-all opacity-90 hover:opacity-100">
              {isImporting ? <Loader2 className="w-5 h-5 animate-spin" /> : <UploadCloud className="w-5 h-5" />}
              استيراد ملف (Import)
            </div>
          </div>
          <p className="text-xs text-red-400 font-bold mt-2">
            تحذير: هذه العملية قد تستبدل البيانات الموجودة حالياً!
          </p>
        </div>
      </div>
    </div>
  );
}
