'use client';

import { useState } from 'react';
import { DownloadCloud, UploadCloud, AlertTriangle, Loader2, Server, Database, SaveAll } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function BackupAdminPage() {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const router = useRouter();

  const handleExport = async () => {
    setIsExporting(true);
    const toastId = toast.loading('جاري تجهيز النسخة الاحتياطية... 📦');
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
      
      toast.success('تم تصدير النسخة الاحتياطية بنجاح! 🎉', { id: toastId });
    } catch (error: any) {
      toast.error(error.message || 'حدث خطأ أثناء التصدير', { id: toastId });
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const toastId = toast.loading('جاري قراءة واستعادة النسخة الاحتياطية... ⚙️');
      try {
        setIsImporting(true);
        
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
        
        toast.success('تمت استعادة البيانات بنجاح! 🚀', { id: toastId });
        router.refresh();
      } catch (error: any) {
        toast.error(error.message || 'حدث خطأ أثناء الاستيراد', { id: toastId });
      } finally {
        setIsImporting(false);
        if (e.target) e.target.value = '';
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 md:space-y-10 animate-fade-in pb-24 px-2 md:px-0">
      
      {/* Header Section */}
      <div className="relative overflow-hidden stone-card rounded-3xl p-6 md:p-10 border border-white/10 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-gradient-to-br from-blue-900/50 to-blue-600/20 rounded-2xl border border-blue-500/20 shadow-inner">
              <Database className="w-10 h-10 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-amiri font-bold text-white mb-2">النسخ الاحتياطي (Backup)</h1>
              <p className="text-gray-400 font-tajawal text-base md:text-lg max-w-lg">
                مركز التحكم في البيانات. احفظ جميع فصولك، شخصياتك، وفيديوهاتك بنقرة واحدة، واستعدها في أي وقت بأمان تام.
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center justify-center p-4 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm">
            <Server className="w-8 h-8 text-gray-500 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Action Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        
        {/* Export Card */}
        <div className="group relative stone-card rounded-3xl p-6 md:p-10 flex flex-col items-center justify-center text-center gap-6 border border-white/10 hover:border-blue-500/30 transition-all duration-500 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="relative z-10 w-24 h-24 rounded-full bg-gradient-to-br from-blue-900/40 to-blue-500/10 flex items-center justify-center border border-blue-500/20 group-hover:scale-110 transition-transform duration-500 shadow-[0_0_30px_rgba(59,130,246,0.1)]">
            <DownloadCloud className="w-12 h-12 text-blue-400" />
          </div>
          
          <div className="relative z-10 space-y-3">
            <h3 className="text-2xl font-bold text-white font-amiri">تصدير قاعدة البيانات</h3>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed px-4">
              قم بإنشاء وتنزيل ملف مشفر (JSON) يحتوي على نسخة كاملة من جميع محتويات الموقع الحالية.
            </p>
          </div>
          
          <button 
            onClick={handleExport}
            disabled={isExporting || isImporting}
            className="relative z-10 mt-2 w-full md:w-auto flex justify-center items-center gap-3 bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-600 hover:to-blue-400 text-white px-10 py-4 rounded-2xl font-bold transition-all disabled:opacity-50 shadow-lg hover:shadow-blue-500/25"
          >
            {isExporting ? <Loader2 className="w-6 h-6 animate-spin" /> : <SaveAll className="w-6 h-6" />}
            <span className="text-lg">تصدير الآن (Export)</span>
          </button>
        </div>

        {/* Import Card */}
        <div className="group relative stone-card rounded-3xl p-6 md:p-10 flex flex-col items-center justify-center text-center gap-6 border border-white/10 hover:border-emerald-500/30 transition-all duration-500 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="relative z-10 w-24 h-24 rounded-full bg-gradient-to-br from-emerald-900/40 to-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform duration-500 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
            <UploadCloud className="w-12 h-12 text-emerald-400" />
          </div>
          
          <div className="relative z-10 space-y-3">
            <h3 className="text-2xl font-bold text-white font-amiri">استعادة النظام</h3>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed px-4">
              قم برفع ملف النسخة الاحتياطية لاستعادة الموقع لحالته السابقة. سيتم دمج وتحديث البيانات تلقائياً.
            </p>
          </div>
          
          <div className="relative z-10 mt-2 w-full md:w-auto">
            <input 
              type="file" 
              accept=".json" 
              onChange={handleImport}
              disabled={isExporting || isImporting}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-20"
            />
            <div className="flex justify-center items-center gap-3 bg-gradient-to-r from-emerald-700 to-emerald-500 text-white px-10 py-4 rounded-2xl font-bold transition-all shadow-lg hover:shadow-emerald-500/25">
              {isImporting ? <Loader2 className="w-6 h-6 animate-spin" /> : <UploadCloud className="w-6 h-6" />}
              <span className="text-lg">استيراد ملف (Import)</span>
            </div>
          </div>
          
          <div className="relative z-10 flex items-center gap-2 bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-lg mt-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <p className="text-xs text-red-300 font-bold">هذه العملية قد تستبدل البيانات الموجودة!</p>
          </div>
        </div>

      </div>
    </div>
  );
}
