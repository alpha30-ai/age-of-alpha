'use client';

import { useState, useEffect } from 'react';
import { Settings2, Key, Server, Loader2, Cloud, BrainCircuit, Eye, EyeOff, Save, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SystemSettingsPage() {
  const [settings, setSettings] = useState({
    geminiApiKey: '',
    cloudinaryCloudName: '',
    cloudinaryApiKey: '',
    cloudinaryApiSecret: '',
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<'AI' | 'STORAGE'>('AI');

  useEffect(() => {
    fetch('/api/admin/settings/system')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setSettings({
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

  const toggleKeyVisibility = (key: string) => {
    setShowKeys(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    const toastId = toast.loading('جاري حفظ الإعدادات... 💾');
    try {
      const res = await fetch('/api/admin/settings/system', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error);
      
      toast.success('تم حفظ المفاتيح بنجاح! 🎉', { id: toastId });
    } catch (error: any) {
      toast.error(error.message, { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="relative">
          <Loader2 className="w-12 h-12 text-magma animate-spin" />
          <div className="absolute inset-0 bg-magma blur-xl opacity-50 animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-20 px-2 sm:px-0">
      
      {/* Header Section */}
      <div className="relative overflow-hidden bg-white dark:bg-[#111] rounded-3xl p-8 border border-gray-200 dark:border-white/10 shadow-xl dark:shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-magma/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-magma/10 dark:bg-white/5 rounded-2xl border border-magma/20 dark:border-white/10 shadow-inner">
              <Settings2 className="w-10 h-10 text-magma" />
            </div>
            <div>
              <h1 className="text-3xl font-amiri font-bold text-gray-900 dark:text-white mb-2">إعدادات النظام والمفاتيح</h1>
              <p className="text-gray-600 dark:text-gray-400 font-tajawal text-base md:text-lg max-w-lg">
                إدارة مفاتيح واجهات برمجة التطبيقات (API Keys) للذكاء الاصطناعي وخوادم التخزين بشكل مشفر وآمن.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600 dark:text-red-400">
            <ShieldAlert className="w-5 h-5" />
            <span className="text-sm font-bold">منطقة أمنية حساسة</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 p-2 bg-gray-100 dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/5 rounded-2xl w-full sm:w-fit shadow-inner">
        <button
          onClick={() => setActiveTab('AI')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
            activeTab === 'AI' 
              ? 'bg-white dark:bg-white/10 text-blue-600 dark:text-blue-400 shadow-md dark:border dark:border-white/10' 
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <BrainCircuit className="w-5 h-5" /> الذكاء الاصطناعي
        </button>
        <button
          onClick={() => setActiveTab('STORAGE')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
            activeTab === 'STORAGE' 
              ? 'bg-white dark:bg-white/10 text-emerald-600 dark:text-emerald-400 shadow-md dark:border dark:border-white/10' 
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Cloud className="w-5 h-5" /> خوادم التخزين
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Forms */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'AI' && (
            <div className="bg-white dark:bg-[#111] rounded-3xl overflow-hidden border border-gray-200 dark:border-white/10 shadow-lg transition-all animate-slide-up">
              <div className="p-6 border-b border-gray-100 dark:border-white/5 flex items-center gap-4 bg-gray-50 dark:bg-white/5">
                <div className="p-3 bg-blue-100 dark:bg-blue-500/20 rounded-xl">
                  <BrainCircuit className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white font-amiri">Google Gemini API</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">لإنشاء المحتوى التسويقي بذكاء</p>
                </div>
              </div>
              
              <div className="p-6 md:p-8 space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">مفتاح API (Gemini API Key)</label>
                  <div className="relative group">
                    <Key className="absolute right-4 top-3.5 w-5 h-5 text-gray-400 dark:text-gray-500 transition-colors group-focus-within:text-blue-500" />
                    <input
                      type={showKeys['gemini'] ? "text" : "password"}
                      name="geminiApiKey"
                      value={settings.geminiApiKey}
                      onChange={handleChange}
                      placeholder="AIzaSy..."
                      className="w-full bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 rounded-2xl pr-12 pl-12 py-3.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-inner"
                      dir="ltr"
                    />
                    <button 
                      type="button" 
                      onClick={() => toggleKeyVisibility('gemini')}
                      className="absolute left-4 top-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
                    >
                      {showKeys['gemini'] ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                    يمكنك الحصول على المفتاح مجاناً من <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">Google AI Studio</a>.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'STORAGE' && (
            <div className="bg-white dark:bg-[#111] rounded-3xl overflow-hidden border border-gray-200 dark:border-white/10 shadow-lg transition-all animate-slide-up">
              <div className="p-6 border-b border-gray-100 dark:border-white/5 flex items-center gap-4 bg-gray-50 dark:bg-white/5">
                <div className="p-3 bg-emerald-100 dark:bg-emerald-500/20 rounded-xl">
                  <Cloud className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white font-amiri">Cloudinary Settings</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">خادم استضافة وتخزين الصور السحابي</p>
                </div>
              </div>
              
              <div className="p-6 md:p-8 space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Cloud Name</label>
                  <div className="relative group">
                    <Server className="absolute right-4 top-3.5 w-5 h-5 text-gray-400 dark:text-gray-500 transition-colors group-focus-within:text-emerald-500" />
                    <input
                      type="text"
                      name="cloudinaryCloudName"
                      value={settings.cloudinaryCloudName}
                      onChange={handleChange}
                      placeholder="ex: dzc8xubk3"
                      className="w-full bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 rounded-2xl pr-12 pl-4 py-3.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all shadow-inner font-mono"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">API Key</label>
                  <div className="relative group">
                    <Key className="absolute right-4 top-3.5 w-5 h-5 text-gray-400 dark:text-gray-500 transition-colors group-focus-within:text-emerald-500" />
                    <input
                      type={showKeys['cloudKey'] ? "text" : "password"}
                      name="cloudinaryApiKey"
                      value={settings.cloudinaryApiKey}
                      onChange={handleChange}
                      placeholder="API Key..."
                      className="w-full bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 rounded-2xl pr-12 pl-12 py-3.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all shadow-inner font-mono"
                      dir="ltr"
                    />
                    <button 
                      type="button" 
                      onClick={() => toggleKeyVisibility('cloudKey')}
                      className="absolute left-4 top-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
                    >
                      {showKeys['cloudKey'] ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">API Secret</label>
                  <div className="relative group">
                    <Key className="absolute right-4 top-3.5 w-5 h-5 text-gray-400 dark:text-gray-500 transition-colors group-focus-within:text-emerald-500" />
                    <input
                      type={showKeys['cloudSecret'] ? "text" : "password"}
                      name="cloudinaryApiSecret"
                      value={settings.cloudinaryApiSecret}
                      onChange={handleChange}
                      placeholder="API Secret..."
                      className="w-full bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 rounded-2xl pr-12 pl-12 py-3.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all shadow-inner font-mono"
                      dir="ltr"
                    />
                    <button 
                      type="button" 
                      onClick={() => toggleKeyVisibility('cloudSecret')}
                      className="absolute left-4 top-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
                    >
                      {showKeys['cloudSecret'] ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar / Info */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-magma/10 to-transparent dark:from-magma/5 dark:to-[#0a0a0a] border border-magma/20 rounded-3xl p-6 shadow-lg">
            <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-4">تعليمات الحفظ</h4>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-magma mt-1">•</span>
                هذه المفاتيح مشفرة بالكامل ولا يتم مشاركتها أبداً مع المتصفح.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-magma mt-1">•</span>
                استخدم زر العين لإظهار المفاتيح المخفية أو إخفائها.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-magma mt-1">•</span>
                تأكد من صحة المفاتيح قبل الحفظ لتجنب تعطل الرفع أو التوليد.
              </li>
            </ul>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="mt-8 w-full flex items-center justify-center gap-2 bg-magma hover:bg-orange-600 text-white px-6 py-4 rounded-2xl font-bold transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(230,74,25,0.3)] hover:shadow-[0_0_30px_rgba(230,74,25,0.5)] transform hover:-translate-y-1"
            >
              {isSaving ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
              حفظ التغييرات
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
