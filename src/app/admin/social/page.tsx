'use client';

import { useState, useEffect } from 'react';
import { Share2, Video, Globe, Wand2, Save, Loader2, Copy, Palette, BookOpen, Users, Film } from 'lucide-react';
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
        // Fix for previous bug: API directly returns array now or we handle both
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
          setTitle(data.data.title);
          setDescription(data.data.description);
          setHashtags(data.data.hashtags);
          setThumbnailPrompt(data.data.thumbnailPrompt);
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
    const toastId = toast.loading('جاري توليد المحتوى بالذكاء الاصطناعي... ⏳');
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
      
      toast.success('تم التوليد بنجاح الإبداع! ✨ لا تنس الحفظ.', { id: toastId, duration: 5000 });
    } catch (error: any) {
      toast.error(error.message, { id: toastId, duration: 6000 });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!selectedTargetId || !title || !description || !hashtags || !thumbnailPrompt) {
      toast.error('يرجى التأكد من ملء جميع الحقول أو توليدها أولاً.');
      return;
    }
    
    setIsSaving(true);
    const toastId = toast.loading('جاري حفظ البيانات... 💾');
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
      
      toast.success('تم حفظ إعدادات النشر بنجاح! 🎉', { id: toastId });
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
    <div className="max-w-6xl mx-auto space-y-8 md:space-y-12 animate-fade-in pb-24 px-2 md:px-0">
      
      {/* Header Section */}
      <div className="relative overflow-hidden stone-card rounded-3xl p-6 md:p-10 border border-white/10 shadow-2xl">
        <div className="absolute top-0 left-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-magma/10 rounded-full blur-3xl translate-y-1/2 translate-x-1/2"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-gradient-to-br from-rose-900/50 to-magma/20 rounded-2xl border border-rose-500/20 shadow-inner">
              <Share2 className="w-10 h-10 text-rose-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-amiri font-bold text-white mb-2">أدوات النشر والتسويق</h1>
              <p className="text-gray-400 font-tajawal text-base md:text-lg max-w-lg">
                توليد وإدارة المحتوى التسويقي لمنصات التواصل الاجتماعي للفصول، الشخصيات، والفيديوهات بلمسة ذكاء اصطناعي.
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center justify-center p-4 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm">
            <Wand2 className="w-8 h-8 text-magma animate-pulse" />
          </div>
        </div>
      </div>

      {/* Target Type Tabs */}
      <div className="flex flex-col md:flex-row gap-3 p-2 bg-[#111] border border-white/5 rounded-3xl w-full max-w-2xl mx-auto shadow-2xl">
        <button
          onClick={() => setTargetType('CHAPTER')}
          className={`flex-1 flex justify-center items-center gap-3 py-4 rounded-2xl font-bold transition-all duration-300 ${targetType === 'CHAPTER' ? 'bg-magma text-white shadow-[0_0_20px_rgba(230,74,25,0.3)] scale-[1.02]' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
        >
          <BookOpen className="w-5 h-5" /> الفصول
        </button>
        <button
          onClick={() => setTargetType('CHARACTER')}
          className={`flex-1 flex justify-center items-center gap-3 py-4 rounded-2xl font-bold transition-all duration-300 ${targetType === 'CHARACTER' ? 'bg-purple-600 text-white shadow-[0_0_20px_rgba(147,51,234,0.3)] scale-[1.02]' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
        >
          <Users className="w-5 h-5" /> الشخصيات
        </button>
        <button
          onClick={() => setTargetType('VIDEO')}
          className={`flex-1 flex justify-center items-center gap-3 py-4 rounded-2xl font-bold transition-all duration-300 ${targetType === 'VIDEO' ? 'bg-emerald-600 text-white shadow-[0_0_20px_rgba(5,150,105,0.3)] scale-[1.02]' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
        >
          <Film className="w-5 h-5" /> الفيديوهات
        </button>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        
        {/* Select Target */}
        <div className="stone-card rounded-3xl p-6 md:p-8 border border-white/5 hover:border-white/10 transition-colors">
          <label className="block text-base md:text-lg font-bold text-gray-300 mb-4">اختر المحتوى المستهدف:</label>
          {items.length === 0 ? (
            <div className="w-full bg-[#0a0a0a] border border-white/10 rounded-2xl px-5 py-4 text-gray-500 text-center">لا يوجد محتوى حالياً...</div>
          ) : (
            <select 
              value={selectedTargetId}
              onChange={(e) => setSelectedTargetId(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-magma transition-colors text-lg shadow-inner appearance-none cursor-pointer"
            >
              {items.map(item => (
                <option key={item.id} value={item.id}>{getItemLabel(item)}</option>
              ))}
            </select>
          )}
        </div>

        {/* Select Platform */}
        <div className="stone-card rounded-3xl p-6 md:p-8 border border-white/5 hover:border-white/10 transition-colors">
          <label className="block text-base md:text-lg font-bold text-gray-300 mb-4">منصة النشر:</label>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setPlatform('YOUTUBE')}
              className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl font-bold transition-all duration-300 ${
                platform === 'YOUTUBE' 
                  ? 'bg-red-600 text-white shadow-[0_0_25px_rgba(220,38,38,0.5)] scale-[1.02]' 
                  : 'bg-[#0a0a0a] border border-white/10 text-gray-400 hover:text-white'
              }`}
            >
              <Video className="w-6 h-6" />
              يوتيوب
            </button>
            <button
              onClick={() => setPlatform('FACEBOOK')}
              className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl font-bold transition-all duration-300 ${
                platform === 'FACEBOOK' 
                  ? 'bg-blue-600 text-white shadow-[0_0_25px_rgba(37,99,235,0.5)] scale-[1.02]' 
                  : 'bg-[#0a0a0a] border border-white/10 text-gray-400 hover:text-white'
              }`}
            >
              <Globe className="w-6 h-6" />
              فيسبوك
            </button>
          </div>
        </div>
      </div>

      {/* Generate & Save Actions */}
      <div className="flex flex-col sm:flex-row justify-end gap-4">
        <button
          onClick={handleGenerate}
          disabled={isGenerating || isLoadingSettings || !selectedTargetId}
          className="flex-1 sm:flex-none flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-8 py-4 rounded-2xl font-bold transition-all disabled:opacity-50 shadow-lg hover:shadow-purple-500/30"
        >
          {isGenerating ? <Loader2 className="w-6 h-6 animate-spin" /> : <Wand2 className="w-6 h-6" />}
          <span className="text-lg">توليد بالذكاء الاصطناعي ✨</span>
        </button>
        <button
          onClick={handleSave}
          disabled={isSaving || isLoadingSettings}
          className="flex-1 sm:flex-none flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white px-10 py-4 rounded-2xl font-bold transition-all disabled:opacity-50 shadow-lg hover:shadow-emerald-500/30"
        >
          {isSaving ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
          <span className="text-lg">حفظ الإعدادات</span>
        </button>
      </div>

      {/* Editors */}
      <div className="space-y-6 md:space-y-8">
        
        {/* Title */}
        <div className="stone-card rounded-3xl p-6 md:p-8 relative group border border-white/5">
          <button onClick={() => copyToClipboard(title)} className="absolute top-6 left-6 p-3 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100"><Copy className="w-5 h-5"/></button>
          <label className="block text-lg font-bold text-gray-300 mb-4">عنوان الفيديو / المنشور:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="مثال: هل استيقظ ألفا أخيراً؟ - أحداث صادمة في إمارة الصدأ | عهد ألفا"
            className="w-full bg-[#0a0a0a] border border-white/10 rounded-2xl px-6 py-5 text-white focus:outline-none focus:border-magma transition-colors text-lg md:text-xl font-bold shadow-inner"
          />
        </div>

        {/* Description */}
        <div className="stone-card rounded-3xl p-6 md:p-8 relative group border border-white/5">
          <button onClick={() => copyToClipboard(description)} className="absolute top-6 left-6 p-3 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100"><Copy className="w-5 h-5"/></button>
          <label className="block text-lg font-bold text-gray-300 mb-4">وصف احترافي (Description):</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            className="w-full bg-[#0a0a0a] border border-white/10 rounded-2xl px-6 py-5 text-white focus:outline-none focus:border-magma transition-colors text-base md:text-lg leading-relaxed shadow-inner"
          />
        </div>

        {/* Hashtags */}
        <div className="stone-card rounded-3xl p-6 md:p-8 relative group border border-white/5">
          <button onClick={() => copyToClipboard(hashtags)} className="absolute top-6 left-6 p-3 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100"><Copy className="w-5 h-5"/></button>
          <label className="block text-lg font-bold text-gray-300 mb-4">الهاشتاجات (Hashtags):</label>
          <input
            type="text"
            value={hashtags}
            onChange={(e) => setHashtags(e.target.value)}
            className="w-full bg-[#0a0a0a] border border-white/10 rounded-2xl px-6 py-5 text-blue-400 focus:outline-none focus:border-magma transition-colors text-lg shadow-inner"
          />
        </div>

        {/* Thumbnail Prompt */}
        <div className="stone-card rounded-3xl p-6 md:p-8 border-l-4 border-l-purple-500 relative group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 to-transparent pointer-events-none"></div>
          <button onClick={() => copyToClipboard(thumbnailPrompt)} className="absolute top-6 left-6 p-3 bg-white/5 hover:bg-white/10 rounded-xl text-purple-300 hover:text-white transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 z-10"><Copy className="w-5 h-5"/></button>
          
          <div className="relative z-10 flex flex-col gap-2 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Palette className="w-6 h-6 text-purple-400" />
              </div>
              <label className="block text-xl font-bold text-purple-300">البرومبت البصري للصورة المصغرة (Thumbnail Prompt):</label>
            </div>
            <p className="text-sm md:text-base text-gray-400 pr-12">انسخ هذا النص وضعه في Midjourney أو DALL-E لتوليد صورة مصغرة سينمائية.</p>
          </div>
          
          <textarea
            value={thumbnailPrompt}
            onChange={(e) => setThumbnailPrompt(e.target.value)}
            dir="ltr"
            rows={5}
            className="relative z-10 w-full bg-[#050505] border border-purple-500/30 rounded-2xl px-6 py-5 text-purple-300 focus:outline-none focus:border-purple-500 transition-colors font-mono text-base md:text-lg leading-relaxed shadow-inner"
          />
        </div>
      </div>
    </div>
  );
}
