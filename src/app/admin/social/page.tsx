'use client';

import { useState, useEffect } from 'react';
import { Share2, Video, Globe, Wand2, Save, Loader2, CheckCircle, AlertTriangle, Copy, Palette, BookOpen, Users, Film } from 'lucide-react';

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
  
  const [message, setMessage] = useState<{type: 'success'|'error', text: string}|null>(null);

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
      .catch(() => setMessage({ type: 'error', text: 'فشل في جلب الإعدادات السابقة' }))
      .finally(() => setIsLoadingSettings(false));
  }, [selectedTargetId, targetType, platform]);

  const handleGenerate = async () => {
    if (!selectedTargetId) return;
    
    setIsGenerating(true);
    setMessage(null);
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
      
      setMessage({ type: 'success', text: 'تم التوليد بنجاح! لا تنس الحفظ.' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!selectedTargetId || !title || !description || !hashtags || !thumbnailPrompt) {
      setMessage({ type: 'error', text: 'يرجى التأكد من ملء جميع الحقول أو توليدها.' });
      return;
    }
    
    setIsSaving(true);
    setMessage(null);
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
      
      setMessage({ type: 'success', text: 'تم حفظ إعدادات النشر بنجاح!' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setIsSaving(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getItemLabel = (item: Entity) => {
    if (targetType === 'CHAPTER') return `الفصل ${item.chapterNum}: ${item.title}`;
    if (targetType === 'CHARACTER') return `الشخصية: ${item.name}`;
    if (targetType === 'VIDEO') return `الفيديو: ${item.title}`;
    return item.title || item.name || '';
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-20">
      <div className="flex flex-col gap-2 border-b border-white/10 pb-6">
        <h1 className="text-3xl font-amiri font-bold text-white flex items-center gap-3">
          <Share2 className="w-8 h-8 text-magma" />
          أدوات النشر والتسويق الشاملة
        </h1>
        <p className="text-gray-400 font-tajawal text-lg">
          توليد وإدارة المحتوى التسويقي لمنصات التواصل الاجتماعي للفصول، الشخصيات، والفيديوهات!
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

      {/* Target Type Tabs */}
      <div className="flex gap-2 p-1 bg-white/5 rounded-2xl w-full max-w-lg mx-auto">
        <button
          onClick={() => setTargetType('CHAPTER')}
          className={`flex-1 flex justify-center items-center gap-2 py-3 rounded-xl font-bold transition-all ${targetType === 'CHAPTER' ? 'bg-magma text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
        >
          <BookOpen className="w-4 h-4" /> الفصول
        </button>
        <button
          onClick={() => setTargetType('CHARACTER')}
          className={`flex-1 flex justify-center items-center gap-2 py-3 rounded-xl font-bold transition-all ${targetType === 'CHARACTER' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
        >
          <Users className="w-4 h-4" /> الشخصيات
        </button>
        <button
          onClick={() => setTargetType('VIDEO')}
          className={`flex-1 flex justify-center items-center gap-2 py-3 rounded-xl font-bold transition-all ${targetType === 'VIDEO' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
        >
          <Film className="w-4 h-4" /> الفيديوهات
        </button>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="stone-card rounded-2xl p-6">
          <label className="block text-sm font-bold text-gray-400 mb-2">اختر المحتوى:</label>
          {items.length === 0 ? (
            <div className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-gray-500">لا يوجد محتوى حالياً...</div>
          ) : (
            <select 
              value={selectedTargetId}
              onChange={(e) => setSelectedTargetId(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-magma transition-colors"
            >
              {items.map(item => (
                <option key={item.id} value={item.id}>{getItemLabel(item)}</option>
              ))}
            </select>
          )}
        </div>

        <div className="stone-card rounded-2xl p-6">
          <label className="block text-sm font-bold text-gray-400 mb-2">منصة النشر:</label>
          <div className="flex gap-4">
            <button
              onClick={() => setPlatform('YOUTUBE')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${
                platform === 'YOUTUBE' 
                  ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]' 
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Video className="w-5 h-5" />
              يوتيوب
            </button>
            <button
              onClick={() => setPlatform('FACEBOOK')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${
                platform === 'FACEBOOK' 
                  ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]' 
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Globe className="w-5 h-5" />
              فيسبوك
            </button>
          </div>
        </div>
      </div>

      {/* Generate & Save Actions */}
      <div className="flex justify-end gap-4">
        <button
          onClick={handleGenerate}
          disabled={isGenerating || isLoadingSettings || !selectedTargetId}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-50 shadow-lg"
        >
          {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
          توليد بالذكاء الاصطناعي ✨
        </button>
        <button
          onClick={handleSave}
          disabled={isSaving || isLoadingSettings}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-xl font-bold transition-all disabled:opacity-50 shadow-lg"
        >
          {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          حفظ التعديلات
        </button>
      </div>

      {/* Editors */}
      <div className="space-y-6">
        {/* Title */}
        <div className="stone-card rounded-2xl p-6 relative group">
          <button onClick={() => copyToClipboard(title)} className="absolute top-4 left-4 p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100"><Copy className="w-4 h-4"/></button>
          <label className="block text-sm font-bold text-gray-400 mb-2">عنوان الفيديو / المنشور:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="مثال: هل استيقظ ألفا أخيراً؟ - أحداث صادمة في إمارة الصدأ | عهد ألفا"
            className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-magma transition-colors text-lg font-bold"
          />
        </div>

        {/* Description */}
        <div className="stone-card rounded-2xl p-6 relative group">
          <button onClick={() => copyToClipboard(description)} className="absolute top-4 left-4 p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100"><Copy className="w-4 h-4"/></button>
          <label className="block text-sm font-bold text-gray-400 mb-2">وصف احترافي (Description):</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-magma transition-colors leading-relaxed"
          />
        </div>

        {/* Hashtags */}
        <div className="stone-card rounded-2xl p-6 relative group">
          <button onClick={() => copyToClipboard(hashtags)} className="absolute top-4 left-4 p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100"><Copy className="w-4 h-4"/></button>
          <label className="block text-sm font-bold text-gray-400 mb-2">الهاشتاجات (Hashtags):</label>
          <input
            type="text"
            value={hashtags}
            onChange={(e) => setHashtags(e.target.value)}
            className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-blue-400 focus:outline-none focus:border-magma transition-colors"
          />
        </div>

        {/* Thumbnail Prompt */}
        <div className="stone-card rounded-2xl p-6 border-l-4 border-l-purple-500 relative group">
          <button onClick={() => copyToClipboard(thumbnailPrompt)} className="absolute top-4 left-4 p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100"><Copy className="w-4 h-4"/></button>
          <div className="flex items-center gap-2 mb-2">
            <Palette className="w-5 h-5 text-purple-400" />
            <label className="block text-sm font-bold text-purple-400">البرومبت البصري للصورة المصغرة (Thumbnail Prompt for AI):</label>
          </div>
          <p className="text-xs text-gray-500 mb-3">انسخ هذا النص وضعه في Midjourney أو DALL-E لتوليد صورة مصغرة احترافية.</p>
          <textarea
            value={thumbnailPrompt}
            onChange={(e) => setThumbnailPrompt(e.target.value)}
            dir="ltr"
            rows={4}
            className="w-full bg-black/50 border border-purple-500/30 rounded-xl px-4 py-3 text-purple-300 focus:outline-none focus:border-purple-500 transition-colors font-mono text-sm leading-relaxed"
          />
        </div>
      </div>
    </div>
  );
}
