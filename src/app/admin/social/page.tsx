'use client';

import { useState, useEffect } from 'react';
import { Share2, Video, Globe, Wand2, Save, Loader2, Copy, Palette, BookOpen, Users, Film, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

type Entity = {
  id: string;
  name?: string; // Character
  title?: string; // Chapter / Video
  chapterNum?: number; // Chapter
};

export default function SocialPublishAdminPage() {
  const [targetType, setTargetType] = useState<'CHAPTER' | 'CHARACTER' | 'VIDEO'>('CHAPTER');
  const [platform, setPlatform] = useState<'YOUTUBE' | 'FACEBOOK'>('YOUTUBE');
  
  const [items, setItems] = useState<Entity[]>([]);
  const [selectedTargetId, setSelectedTargetId] = useState<string>('');
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [thumbnailPrompt, setThumbnailPrompt] = useState('');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingSettings, setIsLoadingSettings] = useState(false);

  // Fetch items based on targetType
  useEffect(() => {
    let url = '';
    if (targetType === 'CHAPTER') url = '/api/chapters';
    else if (targetType === 'CHARACTER') url = '/api/characters';
    else if (targetType === 'VIDEO') url = '/api/videos';

    fetch(url)
      .then(res => res.json())
      .then(data => {
        const arrayData = Array.isArray(data) ? data : data.chapters || data.characters || data.videos || [];
        
        if (targetType === 'CHAPTER') {
          arrayData.sort((a: any, b: any) => b.chapterNum - a.chapterNum);
        }
        setItems(arrayData);
        if (arrayData.length > 0) {
          setSelectedTargetId(arrayData[0].id);
        } else {
          setSelectedTargetId('');
        }
      });
  }, [targetType]);

  // Fetch existing settings when selection changes
  useEffect(() => {
    if (!selectedTargetId) {
      setTitle('');
      setDescription('');
      setHashtags('');
      setThumbnailPrompt('');
      return;
    }
    
    setIsLoadingSettings(true);
    fetch(`/api/admin/social?targetType=${targetType}&targetId=${selectedTargetId}&platform=${platform}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setTitle(data.data.title || '');
          setDescription(data.data.description || '');
          setHashtags(data.data.hashtags || '');
          setThumbnailPrompt(data.data.thumbnailPrompt || '');
        } else {
          setTitle('');
          setDescription('');
          setHashtags('');
          setThumbnailPrompt('');
        }
      })
      .catch(() => toast.error('فشل في جلب الإعدادات السابقة'))
      .finally(() => setIsLoadingSettings(false));
  }, [selectedTargetId, targetType, platform]);

  const handleGenerate = async () => {
    if (!selectedTargetId) return;
    
    setIsGenerating(true);
    const toastId = toast.loading('الذكاء الاصطناعي يعمل الآن... ⏳');
    try {
      const res = await fetch('/api/admin/social/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetType, targetId: selectedTargetId, platform })
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error);
      
      setTitle(data.data.title);
      setDescription(data.data.description);
      setHashtags(data.data.hashtags);
      setThumbnailPrompt(data.data.thumbnailPrompt);
      
      toast.success('تم التوليد السحري بنجاح! ✨', { id: toastId, duration: 5000 });
    } catch (error: any) {
      toast.error(error.message, { id: toastId, duration: 6000 });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!selectedTargetId || !title || !description || !hashtags || !thumbnailPrompt) {
      toast.error('يرجى التأكد من ملء الحقول المطلوبة.');
      return;
    }
    
    setIsSaving(true);
    const toastId = toast.loading('جاري حفظ المحتوى... 💾');
    try {
      const res = await fetch('/api/admin/social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetType,
          targetId: selectedTargetId,
          platform,
          title,
          description,
          hashtags,
          thumbnailPrompt
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      toast.success('تم الحفظ ومستعد للنشر! 🚀', { id: toastId });
    } catch (error: any) {
      toast.error(error.message, { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('تم نسخ النص!');
  };

  const getItemLabel = (item: Entity) => {
    if (targetType === 'CHAPTER') return `الفصل ${item.chapterNum}: ${item.title}`;
    if (targetType === 'CHARACTER') return `الشخصية: ${item.name}`;
    if (targetType === 'VIDEO') return `الفيديو: ${item.title}`;
    return item.title || item.name || '';
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 md:space-y-10 animate-fade-in pb-24 px-2 md:px-0">
      
      {/* Dynamic Header */}
      <div className="relative overflow-hidden bg-white dark:bg-[#0a0a0a] rounded-3xl p-8 border border-gray-200 dark:border-white/10 shadow-xl">
        <div className="absolute top-0 left-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 translate-x-1/2"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-gradient-to-br from-rose-100 to-rose-50 dark:from-rose-900/50 dark:to-magma/20 rounded-2xl border border-rose-200 dark:border-rose-500/20 shadow-sm dark:shadow-inner">
              <Share2 className="w-10 h-10 text-rose-500 dark:text-rose-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-amiri font-bold text-gray-900 dark:text-white mb-2">أدوات النشر والتسويق</h1>
              <p className="text-gray-600 dark:text-gray-400 font-tajawal text-base md:text-lg max-w-lg">
                اصنع محتوى جذاب لمنصات التواصل الاجتماعي باستخدام الذكاء الاصطناعي لزيادة تفاعل المتابعين.
              </p>
            </div>
          </div>
          
          <button
            onClick={handleGenerate}
            disabled={isGenerating || isLoadingSettings || !selectedTargetId}
            className="flex items-center gap-3 bg-gradient-to-l from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-8 py-4 rounded-2xl font-bold transition-all disabled:opacity-50 shadow-lg hover:shadow-purple-500/30 transform hover:-translate-y-1"
          >
            {isGenerating ? <Loader2 className="w-6 h-6 animate-spin" /> : <Wand2 className="w-6 h-6" />}
            <span className="text-lg">توليد شامل بالـ AI</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Sidebar - Configuration */}
        <div className="xl:col-span-1 space-y-6">
          
          {/* Target Types */}
          <div className="bg-white dark:bg-[#111] rounded-3xl p-6 border border-gray-200 dark:border-white/10 shadow-lg">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">1. نوع المحتوى</h3>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setTargetType('CHAPTER')}
                className={`flex items-center gap-3 px-5 py-4 rounded-2xl font-bold transition-all ${targetType === 'CHAPTER' ? 'bg-magma text-white shadow-md' : 'bg-gray-50 dark:bg-[#0a0a0a] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/10'}`}
              >
                <BookOpen className="w-5 h-5" /> الفصول المكتوبة
              </button>
              <button
                onClick={() => setTargetType('CHARACTER')}
                className={`flex items-center gap-3 px-5 py-4 rounded-2xl font-bold transition-all ${targetType === 'CHARACTER' ? 'bg-purple-600 text-white shadow-md' : 'bg-gray-50 dark:bg-[#0a0a0a] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/10'}`}
              >
                <Users className="w-5 h-5" /> الشخصيات الرئيسية
              </button>
              <button
                onClick={() => setTargetType('VIDEO')}
                className={`flex items-center gap-3 px-5 py-4 rounded-2xl font-bold transition-all ${targetType === 'VIDEO' ? 'bg-emerald-600 text-white shadow-md' : 'bg-gray-50 dark:bg-[#0a0a0a] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/10'}`}
              >
                <Film className="w-5 h-5" /> الفيديوهات المرئية
              </button>
            </div>
          </div>

          {/* Target Selection */}
          <div className="bg-white dark:bg-[#111] rounded-3xl p-6 border border-gray-200 dark:border-white/10 shadow-lg">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">2. اختر العنصر</h3>
            {items.length === 0 ? (
              <div className="w-full bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/5 rounded-2xl px-5 py-4 text-gray-500 text-center">لا يوجد عناصر متاحة</div>
            ) : (
              <select 
                value={selectedTargetId}
                onChange={(e) => setSelectedTargetId(e.target.value)}
                className="w-full bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 rounded-2xl px-5 py-4 text-gray-900 dark:text-white focus:outline-none focus:border-magma transition-colors text-base shadow-sm cursor-pointer"
              >
                {items.map(item => (
                  <option key={item.id} value={item.id}>{getItemLabel(item)}</option>
                ))}
              </select>
            )}
          </div>

          {/* Platform Selection */}
          <div className="bg-white dark:bg-[#111] rounded-3xl p-6 border border-gray-200 dark:border-white/10 shadow-lg">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">3. منصة النشر</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setPlatform('YOUTUBE')}
                className={`flex flex-col items-center justify-center gap-2 py-4 rounded-2xl font-bold transition-all ${
                  platform === 'YOUTUBE' 
                    ? 'bg-red-600 text-white shadow-md' 
                    : 'bg-gray-50 dark:bg-[#0a0a0a] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/10'
                }`}
              >
                <Video className="w-6 h-6" />
                <span>يوتيوب</span>
              </button>
              <button
                onClick={() => setPlatform('FACEBOOK')}
                className={`flex flex-col items-center justify-center gap-2 py-4 rounded-2xl font-bold transition-all ${
                  platform === 'FACEBOOK' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-gray-50 dark:bg-[#0a0a0a] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/10'
                }`}
              >
                <Globe className="w-6 h-6" />
                <span>فيسبوك</span>
              </button>
            </div>
          </div>
          
          <button
            onClick={handleSave}
            disabled={isSaving || isLoadingSettings}
            className="w-full flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-2xl font-bold transition-all disabled:opacity-50 shadow-lg hover:shadow-emerald-500/30 transform hover:-translate-y-1"
          >
            {isSaving ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
            <span className="text-lg">حفظ المحتوى</span>
          </button>
        </div>

        {/* Right Content - Editors */}
        <div className="xl:col-span-2 space-y-6">
          
          <div className="bg-white dark:bg-[#111] rounded-3xl p-6 md:p-8 border border-gray-200 dark:border-white/10 shadow-lg relative group">
            <button onClick={() => copyToClipboard(title)} className="absolute top-6 left-6 p-2 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-xl text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all"><Copy className="w-5 h-5"/></button>
            <label className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-gray-300 mb-4">
              <div className="w-2 h-2 rounded-full bg-magma"></div>
              العنوان الرئيسي
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="العنوان الجذاب يكتب هنا..."
              className="w-full bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 rounded-2xl px-6 py-5 text-gray-900 dark:text-white focus:outline-none focus:border-magma transition-colors text-lg md:text-xl font-bold shadow-inner"
            />
          </div>

          <div className="bg-white dark:bg-[#111] rounded-3xl p-6 md:p-8 border border-gray-200 dark:border-white/10 shadow-lg relative group">
            <button onClick={() => copyToClipboard(description)} className="absolute top-6 left-6 p-2 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-xl text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all"><Copy className="w-5 h-5"/></button>
            <label className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-gray-300 mb-4">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              الوصف التسويقي (Description)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              className="w-full bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 rounded-2xl px-6 py-5 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors text-base md:text-lg leading-relaxed shadow-inner"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-[#111] rounded-3xl p-6 border border-gray-200 dark:border-white/10 shadow-lg relative group">
              <button onClick={() => copyToClipboard(hashtags)} className="absolute top-6 left-6 p-2 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-xl text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all"><Copy className="w-4 h-4"/></button>
              <label className="flex items-center gap-2 text-base font-bold text-gray-900 dark:text-gray-300 mb-4">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                الهاشتاجات (SEO)
              </label>
              <textarea
                value={hashtags}
                onChange={(e) => setHashtags(e.target.value)}
                rows={4}
                className="w-full bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 rounded-2xl px-5 py-4 text-emerald-600 dark:text-emerald-400 focus:outline-none focus:border-emerald-500 transition-colors text-base shadow-inner leading-relaxed"
              />
            </div>

            <div className="bg-purple-50 dark:bg-[#111] rounded-3xl p-6 border border-purple-200 dark:border-purple-500/20 shadow-lg relative group">
              <button onClick={() => copyToClipboard(thumbnailPrompt)} className="absolute top-6 left-6 p-2 bg-purple-100 dark:bg-purple-500/20 hover:bg-purple-200 dark:hover:bg-purple-500/40 rounded-xl text-purple-600 dark:text-purple-400 transition-all z-10"><Copy className="w-4 h-4"/></button>
              <label className="flex items-center gap-2 text-base font-bold text-purple-900 dark:text-purple-300 mb-4 relative z-10">
                <Palette className="w-5 h-5 text-purple-500" />
                البرومبت البصري (Thumbnail)
              </label>
              <textarea
                value={thumbnailPrompt}
                onChange={(e) => setThumbnailPrompt(e.target.value)}
                dir="ltr"
                rows={4}
                className="relative z-10 w-full bg-white dark:bg-[#050505] border border-purple-200 dark:border-purple-500/30 rounded-2xl px-5 py-4 text-purple-700 dark:text-purple-300 focus:outline-none focus:border-purple-500 transition-colors font-mono text-sm shadow-inner leading-relaxed"
              />
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
