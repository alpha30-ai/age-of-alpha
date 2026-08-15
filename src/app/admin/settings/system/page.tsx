'use client';

import { useState, useEffect } from 'react';
import { Settings2, Key, Server, Loader2, CheckCircle, AlertTriangle, Cloud, BrainCircuit } from 'lucide-react';

export default function SystemSettingsPage() {
  const [settings, setSettings] = useState({
    openAiApiKey: '',
    geminiApiKey: '',
    cloudinaryCloudName: '',
    cloudinaryApiKey: '',
    cloudinaryApiSecret: '',
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{type: 'success'|'error', text: string}|null>(null);

  useEffect(() => {
    fetch('/api/admin/settings/system')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setSettings({
            openAiApiKey: data.data.openAiApiKey || '',
            geminiApiKey: data.data.geminiApiKey || '',
            cloudinaryCloudName: data.data.cloudinaryCloudName || '',
            cloudinaryApiKey: data.data.cloudinaryApiKey || '',
            cloudinaryApiSecret: data.data.cloudinaryApiSecret || '',
          });
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);
    try {
      const res = await fetch('/api/admin/settings/system', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error);
      
      setMessage({ type: 'success', text: 'تم حفظ مفاتيح النظام بنجاح!' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-10 h-10 text-magma animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
      <div className="flex flex-col gap-2 border-b border-white/10 pb-6">
        <h1 className="text-3xl font-amiri font-bold text-white flex items-center gap-3">
          <Settings2 className="w-8 h-8 text-magma" />
          إعدادات النظام (API Keys)
        </h1>
        <p className="text-gray-400 font-tajawal text-lg">
          تحكم في مفاتيح الذكاء الاصطناعي وخوادم رفع الصور من مكان واحد. هذه البيانات مشفرة وآمنة تماماً.
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

      {/* Gemini Settings */}
      <div className="stone-card rounded-2xl overflow-hidden border border-white/5">
        <div className="bg-gradient-to-r from-blue-900/40 to-transparent p-6 border-b border-white/5 flex items-center gap-3">
          <div className="p-3 bg-blue-500/20 rounded-xl">
            <BrainCircuit className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white font-amiri">الذكاء الاصطناعي المجاني (Google Gemini)</h3>
            <p className="text-sm text-gray-400">لإنشاء الملخصات التسويقية والبرومبت البصري مجاناً وبدقة فائقة.</p>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl mb-4">
            <p className="text-blue-300 text-sm">
              للحصول على مفتاح مجاني، سجل دخولك بحساب Google واذهب إلى: <br/>
              <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-blue-400 font-bold underline hover:text-blue-200 inline-block mt-2">
                Google AI Studio (اضغط هنا)
              </a>
              <br/>
              ثم اضغط على "Create API key".
            </p>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-400 mb-2">Gemini API Key:</label>
            <div className="relative">
              <Key className="absolute right-4 top-3.5 w-5 h-5 text-gray-500" />
              <input
                type="password"
                name="geminiApiKey"
                value={settings.geminiApiKey || ''}
                onChange={handleChange}
                placeholder="الصق مفتاح Gemini هنا..."
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl pr-12 pl-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                dir="ltr"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Cloudinary Settings */}
      <div className="stone-card rounded-2xl overflow-hidden border border-white/5">
        <div className="bg-gradient-to-r from-blue-900/40 to-transparent p-6 border-b border-white/5 flex items-center gap-3">
          <div className="p-3 bg-blue-500/20 rounded-xl">
            <Cloud className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white font-amiri">خادم الصور (Cloudinary)</h3>
            <p className="text-sm text-gray-400">لإدارة ورفع صور الفصول والشخصيات بشكل دائم.</p>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-400 mb-2">Cloud Name:</label>
            <div className="relative">
              <Server className="absolute right-4 top-3.5 w-5 h-5 text-gray-500" />
              <input
                type="text"
                name="cloudinaryCloudName"
                value={settings.cloudinaryCloudName}
                onChange={handleChange}
                placeholder="مثال: dzc8xubk3"
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl pr-12 pl-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                dir="ltr"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-400 mb-2">API Key:</label>
            <div className="relative">
              <Key className="absolute right-4 top-3.5 w-5 h-5 text-gray-500" />
              <input
                type="text"
                name="cloudinaryApiKey"
                value={settings.cloudinaryApiKey}
                onChange={handleChange}
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl pr-12 pl-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                dir="ltr"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-400 mb-2">API Secret:</label>
            <div className="relative">
              <Key className="absolute right-4 top-3.5 w-5 h-5 text-gray-500" />
              <input
                type="password"
                name="cloudinaryApiSecret"
                value={settings.cloudinaryApiSecret}
                onChange={handleChange}
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl pr-12 pl-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                dir="ltr"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-magma hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-bold transition-all disabled:opacity-50 shadow-lg"
        >
          {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Settings2 className="w-5 h-5" />}
          حفظ التعديلات العامة
        </button>
      </div>
    </div>
  );
}
