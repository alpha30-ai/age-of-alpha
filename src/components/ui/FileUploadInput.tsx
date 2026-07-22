'use client';

import { useState } from 'react';
import { UploadCloud, Link as LinkIcon, Loader2, X } from 'lucide-react';

export default function FileUploadInput({ 
  name, 
  label, 
  defaultValue = '', 
  accept = "image/*" 
}: { 
  name: string;
  label: string;
  defaultValue?: string;
  accept?: string;
}) {
  const [url, setUrl] = useState(defaultValue);
  const [isUploading, setIsUploading] = useState(false);
  const [mode, setMode] = useState<'file' | 'url'>('file');
  const [error, setError] = useState('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError('');

    // Cloudinary setup
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      setError('لم يتم إعداد Cloudinary. يرجى إضافة NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME و NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET');
      setIsUploading(false);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    try {
      // Upload directly to Cloudinary from browser (bypassing Vercel limits)
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      
      if (res.ok && data.secure_url) {
        setUrl(data.secure_url);
      } else {
        setError(data.error?.message || 'فشل الرفع إلى التخزين السحابي');
      }
    } catch (err) {
      setError('انقطع الاتصال بخادم التخزين السحابي');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-bold text-gray-300">{label}</label>
      <input type="hidden" name={name} value={url} />
      
      <div className="flex gap-2 mb-2 bg-black/20 p-1 rounded-lg w-fit border border-white/5">
        <button 
          type="button" 
          onClick={() => setMode('file')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-bold transition-all ${mode === 'file' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
        >
          <UploadCloud className="w-4 h-4" />
          رفع من الجهاز
        </button>
        <button 
          type="button"
          onClick={() => setMode('url')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-bold transition-all ${mode === 'url' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
        >
          <LinkIcon className="w-4 h-4" />
          رابط خارجي
        </button>
      </div>

      {mode === 'url' ? (
        <input 
          type="text" 
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://... أو /uploads/..."
          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-gray-300 focus:outline-none focus:border-[var(--theme-primary)]/50 transition-all font-mono text-left"
          dir="ltr"
        />
      ) : (
        <div className="relative">
          <input 
            type="file" 
            accept={accept}
            onChange={handleFileUpload}
            disabled={isUploading}
            className="hidden"
            id={`file-upload-${name}`}
          />
          <label 
            htmlFor={`file-upload-${name}`}
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-xl cursor-pointer bg-black/20 hover:bg-black/40 transition-all hover:border-[var(--theme-primary)]/50 group"
          >
            {isUploading ? (
              <div className="flex flex-col items-center justify-center gap-2 text-[var(--theme-primary)] px-4 text-center">
                <Loader2 className="w-8 h-8 animate-spin" />
                <span className="text-sm font-bold">جاري الرفع...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 text-gray-400 group-hover:text-[var(--theme-primary)] transition-colors px-4 text-center">
                <UploadCloud className="w-8 h-8" />
                <span className="text-sm font-bold">اضغط لاختيار ملف أو اسحب الملف هنا</span>
              </div>
            )}
          </label>
        </div>
      )}

      {error && <p className="text-red-400 text-sm font-bold mt-1">{error}</p>}
      
      {url && (
        <div className="flex items-center gap-2 mt-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
          <LinkIcon className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm font-mono truncate flex-1" dir="ltr">{url}</span>
          <button type="button" onClick={() => setUrl('')} className="p-1 hover:bg-emerald-500/20 rounded-md transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
