'use client';

import { useState, useEffect } from 'react';
import { Share2, Video, Globe, Wand2, Save, Loader2, Copy, Palette, BookOpen, Users, Film, ChevronDown, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

type Novel = { id: string; title: string };
type Chapter = { id: string; title: string; chapterNum: number };
type VisualAttachment = { id: string; label: string; type: 'CHARACTER' | 'VIDEO' | 'NONE' };

export default function SocialPublishAdminPage() {
  const [novels, setNovels] = useState<Novel[]>([]);
  const [selectedNovelId, setSelectedNovelId] = useState<string>('');

  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [selectedChapterId, setSelectedChapterId] = useState<string>('');

  const [visuals, setVisuals] = useState<VisualAttachment[]>([]);
  const [selectedVisualId, setSelectedVisualId] = useState<string>('NONE'); // NONE means just the chapter

  const [platform, setPlatform] = useState<'YOUTUBE' | 'FACEBOOK'>('YOUTUBE');
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [youtubeTags, setYoutubeTags] = useState('');
  const [thumbnailPrompt, setThumbnailPrompt] = useState('');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingSettings, setIsLoadingSettings] = useState(false);

  const [isNovelDropdownOpen, setIsNovelDropdownOpen] = useState(false);
  const [isChapterDropdownOpen, setIsChapterDropdownOpen] = useState(false);
  const [isVisualDropdownOpen, setIsVisualDropdownOpen] = useState(false);

  // Fetch novels
  useEffect(() => {
    fetch('/api/admin/novels') // Fetch admin novels
      .then(res => res.json())
      .then(data => {
        setNovels(data);
        if (data.length > 0) setSelectedNovelId(data[0].id);
      })
      .catch(e => console.error(e));
  }, []);

  // Fetch chapters, characters, videos for selected novel
  useEffect(() => {
    if (!selectedNovelId) return;

    Promise.all([
      fetch(`/api/chapters?novelId=${selectedNovelId}`).then(r => r.json()),
      fetch(`/api/characters?novelId=${selectedNovelId}`).then(r => r.json()),
      fetch(`/api/videos?novelId=${selectedNovelId}`).then(r => r.json()),
    ]).then(([chaps, chars, vids]) => {
      // Sort chapters
      if (Array.isArray(chaps)) {
        chaps.sort((a: any, b: any) => b.chapterNum - a.chapterNum);
        setChapters(chaps);
        if (chaps.length > 0) setSelectedChapterId(chaps[0].id);
        else setSelectedChapterId('');
      }

      const visualOptions: VisualAttachment[] = [
        { id: 'NONE', label: 'بدون ملحق بصري (غلاف الفصل الافتراضي)', type: 'NONE' }
      ];
      
      if (Array.isArray(chars)) {
        chars.forEach((c: any) => visualOptions.push({ id: c.id, label: `شخصية: ${c.name}`, type: 'CHARACTER' }));
      }
      if (Array.isArray(vids)) {
        vids.forEach((v: any) => visualOptions.push({ id: v.id, label: `فيديو: ${v.title}`, type: 'VIDEO' }));
      }

      setVisuals(visualOptions);
      setSelectedVisualId('NONE');
    }).catch(e => console.error(e));

  }, [selectedNovelId]);

  // Fetch existing settings
  useEffect(() => {
    if (!selectedChapterId) {
      setTitle(''); setDescription(''); setHashtags(''); setThumbnailPrompt(''); setYoutubeTags('');
      return;
    }
    
    setIsLoadingSettings(true);
    let targetId = selectedChapterId;
    let targetType = 'CHAPTER';

    // To check if there's a specific setting saved with this visual attachment
    // Actually, we'll just fetch based on chapterId.
    fetch(`/api/admin/social?targetType=CHAPTER&targetId=${selectedChapterId}&platform=${platform}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setTitle(data.data.title || '');
          setDescription(data.data.description || '');
          setHashtags(data.data.hashtags || '');
          setYoutubeTags(data.data.youtubeTags || '');
          setThumbnailPrompt(data.data.thumbnailPrompt || '');
          
          if (data.data.characterId) setSelectedVisualId(data.data.characterId);
          else if (data.data.videoId) setSelectedVisualId(data.data.videoId);
          else setSelectedVisualId('NONE');

        } else {
          setTitle(''); setDescription(''); setHashtags(''); setYoutubeTags(''); setThumbnailPrompt('');
        }
      })
      .catch(() => toast.error('فشل في جلب الإعدادات السابقة'))
      .finally(() => setIsLoadingSettings(false));
  }, [selectedChapterId, platform]);

  const handleGenerate = async () => {
    if (!selectedChapterId) return;
    
    setIsGenerating(true);
    const toastId = toast.loading('الذكاء الاصطناعي يحلل الرواية ويعمل الآن... ⏳');
    try {
      const visual = visuals.find(v => v.id === selectedVisualId);
      
      const res = await fetch('/api/admin/social/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          targetType: 'CHAPTER', 
          targetId: selectedChapterId, 
          platform,
          // Pass context to AI to weave character/video into description
          visualContext: visual?.type !== 'NONE' ? visual : undefined
        })
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error);
      
      setTitle(data.data.title);
      setDescription(data.data.description);
      setHashtags(data.data.hashtags);
      setYoutubeTags(data.data.youtubeTags || '');
      setThumbnailPrompt(data.data.thumbnailPrompt);
      
      toast.success('تم التوليد السحري بنجاح! ✨', { id: toastId, duration: 5000 });
    } catch (error: any) {
      toast.error(error.message || 'حدث خطأ', { id: toastId, duration: 6000 });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!selectedChapterId || !title || !description || !hashtags || !thumbnailPrompt) {
      toast.error('يرجى التأكد من ملء الحقول المطلوبة.');
      return;
    }
    
    setIsSaving(true);
    const toastId = toast.loading('جاري حفظ المحتوى... 💾');
    try {
      const visual = visuals.find(v => v.id === selectedVisualId);

      const res = await fetch('/api/admin/social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetType: 'CHAPTER',
          targetId: selectedChapterId, // Acts as primary chapterId
          characterId: visual?.type === 'CHARACTER' ? visual.id : null,
          videoId: visual?.type === 'VIDEO' ? visual.id : null,
          platform,
          title,
          description,
          hashtags,
          youtubeTags,
          thumbnailPrompt
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      toast.success('تم الحفظ ومستعد للنشر! 🚀', { id: toastId });
    } catch (error: any) {
      toast.error(error.message || 'حدث خطأ', { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('تم نسخ النص!');
  };

  return (
    <div className="w-full space-y-8 md:space-y-10 animate-fade-in pb-24 px-2 md:px-0">
      
      {/* Dynamic Header */}
      <div className="relative overflow-hidden bg-[#111] rounded-2xl p-8 border border-white/5 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-magma/10 rounded-2xl border border-magma/20 shadow-inner">
              <Share2 className="w-10 h-10 text-magma" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-amiri font-bold text-white mb-2">أدوات النشر والتسويق</h1>
              <p className="text-gray-400 font-tajawal text-base md:text-lg max-w-lg">
                اصنع محتوى جذاب لترويج الفصول باستخدام الذكاء الاصطناعي مع إمكانية إرفاق شخصيات وفيديوهات.
              </p>
            </div>
          </div>
          
          <button
            onClick={handleGenerate}
            disabled={isGenerating || isLoadingSettings || !selectedChapterId}
            className="flex items-center gap-3 bg-gradient-to-l from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-8 py-4 rounded-xl font-bold transition-all disabled:opacity-50 shadow-lg hover:shadow-purple-500/30 transform hover:-translate-y-1"
          >
            {isGenerating ? <Loader2 className="w-6 h-6 animate-spin" /> : <Wand2 className="w-6 h-6" />}
            <span className="text-lg">توليد شامل بالـ AI</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Sidebar - Configuration */}
        <div className="xl:col-span-1 space-y-6">
          
          {/* Workflow Steps */}
          <div className="bg-[#111] rounded-2xl p-6 border border-white/5 shadow-lg space-y-6">
            
            {/* Step 1: Novel */}
            <div>
              <h3 className="text-lg font-bold text-white mb-3">1. اختر الرواية</h3>
              {novels.length === 0 ? (
                <div className="w-full bg-[#0a0a0a] border border-white/5 rounded-xl px-4 py-3 text-gray-500 text-center">لا توجد روايات</div>
              ) : (
                <div className="relative">
                  <button type="button" onClick={() => setIsNovelDropdownOpen(!isNovelDropdownOpen)} className="w-full flex items-center justify-between bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-magma transition-colors text-base cursor-pointer">
                    <span className="truncate pr-2">{novels.find(n => n.id === selectedNovelId)?.title || 'اختر...'}</span>
                    <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${isNovelDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isNovelDropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setIsNovelDropdownOpen(false)} />
                      <div className="absolute z-20 top-full mt-2 left-0 w-full bg-[#111] border border-white/10 rounded-xl shadow-xl overflow-hidden max-h-48 overflow-y-auto">
                        {novels.map(n => (
                          <button key={n.id} onClick={() => { setSelectedNovelId(n.id); setIsNovelDropdownOpen(false); }} className={`w-full text-right px-4 py-3 hover:bg-magma/10 hover:text-magma border-b border-white/5 last:border-0 ${selectedNovelId === n.id ? 'bg-magma/5 text-magma' : 'text-gray-300'}`}>
                            {n.title}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Step 2: Chapter */}
            <div>
              <h3 className="text-lg font-bold text-white mb-3">2. اختر الفصل (الأساس)</h3>
              {chapters.length === 0 ? (
                <div className="w-full bg-[#0a0a0a] border border-white/5 rounded-xl px-4 py-3 text-gray-500 text-center">لا توجد فصول لهذه الرواية</div>
              ) : (
                <div className="relative">
                  <button type="button" onClick={() => setIsChapterDropdownOpen(!isChapterDropdownOpen)} className="w-full flex items-center justify-between bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-magma transition-colors text-base cursor-pointer">
                    <span className="truncate pr-2">{chapters.find(c => c.id === selectedChapterId)?.title ? `الفصل ${chapters.find(c => c.id === selectedChapterId)?.chapterNum}: ${chapters.find(c => c.id === selectedChapterId)?.title}` : 'اختر...'}</span>
                    <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${isChapterDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isChapterDropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setIsChapterDropdownOpen(false)} />
                      <div className="absolute z-20 top-full mt-2 left-0 w-full bg-[#111] border border-white/10 rounded-xl shadow-xl overflow-hidden max-h-48 overflow-y-auto">
                        {chapters.map(c => (
                          <button key={c.id} onClick={() => { setSelectedChapterId(c.id); setIsChapterDropdownOpen(false); }} className={`w-full text-right px-4 py-3 hover:bg-magma/10 hover:text-magma border-b border-white/5 last:border-0 ${selectedChapterId === c.id ? 'bg-magma/5 text-magma' : 'text-gray-300'}`}>
                            الفصل {c.chapterNum}: {c.title}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Step 3: Visual Attachment */}
            <div>
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2"><Palette className="w-4 h-4 text-gray-400" /> 3. الملحق البصري (اختياري)</h3>
              <p className="text-sm text-gray-500 mb-2">دمج شخصية رئيسية أو فيديو كصورة مصغرة للبوست.</p>
              <div className="relative">
                <button type="button" onClick={() => setIsVisualDropdownOpen(!isVisualDropdownOpen)} className="w-full flex items-center justify-between bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-magma transition-colors text-base cursor-pointer">
                  <span className="truncate pr-2">{visuals.find(v => v.id === selectedVisualId)?.label || 'اختر...'}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${isVisualDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {isVisualDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsVisualDropdownOpen(false)} />
                    <div className="absolute z-20 top-full mt-2 left-0 w-full bg-[#111] border border-white/10 rounded-xl shadow-xl overflow-hidden max-h-48 overflow-y-auto">
                      {visuals.map(v => (
                        <button key={v.id} onClick={() => { setSelectedVisualId(v.id); setIsVisualDropdownOpen(false); }} className={`w-full flex items-center gap-2 text-right px-4 py-3 hover:bg-magma/10 hover:text-magma border-b border-white/5 last:border-0 ${selectedVisualId === v.id ? 'bg-magma/5 text-magma' : 'text-gray-300'}`}>
                          {v.type === 'CHARACTER' && <Users className="w-4 h-4 opacity-50" />}
                          {v.type === 'VIDEO' && <Film className="w-4 h-4 opacity-50" />}
                          {v.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Platform Selection */}
            <div>
              <h3 className="text-lg font-bold text-white mb-3">4. منصة النشر</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setPlatform('YOUTUBE')}
                  className={`flex flex-col items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${platform === 'YOUTUBE' ? 'bg-red-600/20 text-red-500 border-red-500/50' : 'bg-[#0a0a0a] text-gray-400 border-white/5 hover:border-white/10'} border`}
                >
                  <Video className="w-5 h-5" />
                  <span>يوتيوب</span>
                </button>
                <button
                  onClick={() => setPlatform('FACEBOOK')}
                  className={`flex flex-col items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${platform === 'FACEBOOK' ? 'bg-blue-600/20 text-blue-500 border-blue-500/50' : 'bg-[#0a0a0a] text-gray-400 border-white/5 hover:border-white/10'} border`}
                >
                  <Globe className="w-5 h-5" />
                  <span>فيسبوك</span>
                </button>
              </div>
            </div>

          </div>
          
          <button
            onClick={handleSave}
            disabled={isSaving || isLoadingSettings}
            className="w-full flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-xl font-bold transition-all disabled:opacity-50 shadow-lg hover:shadow-emerald-500/30 transform hover:-translate-y-1"
          >
            {isSaving ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
            <span className="text-lg">حفظ التكوين</span>
          </button>
        </div>

        {/* Right Content - Editors */}
        <div className="xl:col-span-2 space-y-6">
          
          <div className="bg-[#111] rounded-2xl p-6 md:p-8 border border-white/5 shadow-lg relative group transition-all duration-300 hover:border-magma/30">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
              <label className="flex items-center gap-2 text-lg font-bold text-gray-300">
                <div className="w-2 h-2 rounded-full bg-magma"></div>
                العنوان الرئيسي
              </label>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-bold px-2 py-1 rounded-lg ${title.length > 100 ? 'bg-red-900/30 text-red-400' : 'bg-white/5 text-gray-400'}`}>
                  {title.length} / 100
                </span>
                <button onClick={() => copyToClipboard(title)} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-all"><Copy className="w-4 h-4"/></button>
              </div>
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="العنوان الجذاب يكتب هنا..."
              className={`w-full bg-[#0a0a0a] border ${title.length > 100 ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-magma'} rounded-xl px-6 py-4 text-white focus:outline-none transition-colors text-lg md:text-xl font-bold shadow-inner`}
            />
          </div>

          <div className="bg-[#111] rounded-2xl p-6 md:p-8 border border-white/5 shadow-lg relative group transition-all duration-300 hover:border-blue-500/30">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
              <label className="flex items-center gap-2 text-lg font-bold text-gray-300">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                الوصف التسويقي (Description)
              </label>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-bold px-2 py-1 rounded-lg ${description.length > 5000 ? 'bg-red-900/30 text-red-400' : 'bg-white/5 text-gray-400'}`}>
                  {description.length} / 5000
                </span>
                <button onClick={() => copyToClipboard(description)} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-all"><Copy className="w-4 h-4"/></button>
              </div>
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              className={`w-full bg-[#0a0a0a] border ${description.length > 5000 ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-blue-500'} rounded-xl px-6 py-4 text-white focus:outline-none transition-colors text-base md:text-lg leading-relaxed shadow-inner`}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#111] rounded-2xl p-6 border border-white/5 shadow-lg relative group transition-all duration-300 hover:border-emerald-500/30">
              <div className="flex items-center justify-between mb-4">
                <label className="flex items-center gap-2 text-base font-bold text-gray-300">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  الهاشتاجات العادية
                </label>
                <button onClick={() => copyToClipboard(hashtags)} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-all"><Copy className="w-4 h-4"/></button>
              </div>
              <textarea
                value={hashtags}
                onChange={(e) => setHashtags(e.target.value)}
                rows={4}
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-5 py-4 text-emerald-400 focus:outline-none focus:border-emerald-500 transition-colors text-base shadow-inner leading-relaxed"
              />
            </div>
            
            {platform === 'YOUTUBE' && (
              <div className="bg-[#111] rounded-2xl p-6 border border-red-500/20 shadow-lg relative group transition-all duration-300 hover:border-red-500/40">
                <button onClick={() => copyToClipboard(youtubeTags)} className="absolute top-6 left-6 p-2 bg-red-500/20 hover:bg-red-500/40 rounded-xl text-red-400 transition-all"><Copy className="w-4 h-4"/></button>
                <label className="flex items-center gap-2 text-base font-bold text-red-400 mb-4">
                  <Video className="w-4 h-4 text-red-500" />
                  كلمات يوتيوب (Tags)
                </label>
                <textarea
                  value={youtubeTags}
                  onChange={(e) => setYoutubeTags(e.target.value)}
                  dir="rtl"
                  rows={4}
                  className="w-full bg-[#050505] border border-red-500/30 rounded-xl px-5 py-4 text-red-300 focus:outline-none focus:border-red-500 transition-colors text-base shadow-inner leading-relaxed"
                  placeholder="خيال, اكشن, عهد الفا, قصة..."
                />
              </div>
            )}

            <div className={`bg-[#111] rounded-2xl p-6 border border-purple-500/20 shadow-lg relative group transition-all duration-300 hover:border-purple-500/40 ${platform !== 'YOUTUBE' ? 'md:col-span-2' : ''}`}>
              <button onClick={() => copyToClipboard(thumbnailPrompt)} className="absolute top-6 left-6 p-2 bg-purple-500/20 hover:bg-purple-500/40 rounded-xl text-purple-400 transition-all z-10"><Copy className="w-4 h-4"/></button>
              <label className="flex items-center gap-2 text-base font-bold text-purple-300 mb-4 relative z-10">
                <Palette className="w-5 h-5 text-purple-500" />
                البرومبت البصري (Thumbnail)
              </label>
              <textarea
                value={thumbnailPrompt}
                onChange={(e) => setThumbnailPrompt(e.target.value)}
                dir="ltr"
                rows={4}
                className="relative z-10 w-full bg-[#050505] border border-purple-500/30 rounded-xl px-5 py-4 text-purple-300 focus:outline-none focus:border-purple-500 transition-colors font-mono text-sm shadow-inner leading-relaxed"
              />
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
