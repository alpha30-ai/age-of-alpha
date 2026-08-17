'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createCharacter, deleteCharacter } from './actions';
import { Trash2, Plus, Swords, Brain, Zap, Shield, Users } from 'lucide-react';
import FileUploadInput from '@/components/ui/FileUploadInput';
import SearchInput from '@/components/ui/SearchInput';
import { motion, AnimatePresence } from 'framer-motion';

interface Character {
  id: string;
  name: string;
  title: string | null;
  description: string;
  faction: string | null;
  alliance: string;
  strength: number;
  magic: number;
  intelligence: number;
  sortOrder: number;
  imageUrl: string | null;
  novelId: string | null;
}

export default function CharacterClient({ initialCharacters, novels }: { initialCharacters: Character[], novels: any[] }) {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الشخصية؟')) return;
    setLoading(true);
    await deleteCharacter(id);
    setLoading(false);
  };

  const [selectedNovelId, setSelectedNovelId] = useState<string>('all');

  const filteredCharacters = initialCharacters.filter(char => {
    const matchesSearch = char.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (char.title && char.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (char.faction && char.faction.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesNovel = selectedNovelId === 'all' || char.novelId === selectedNovelId;
    return matchesSearch && matchesNovel;
  });

  return (
    <div className="space-y-8">
      {/* Create Form */}
      <form action={async (formData) => {
        setLoading(true);
        await createCharacter(formData);
        const form = document.getElementById('char-form') as HTMLFormElement;
        form.reset();
        // Since FileUploadInput is uncontrolled for reset right now, it might keep URL. 
        // A full page reload (server action revalidate) usually handles it.
        setLoading(false);
      }} id="char-form" className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-xl">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Plus className="w-5 h-5 text-[var(--theme-primary)]" />
          إضافة شخصية جديدة
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">الاسم</label>
            <input name="name" required className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)]/50 transition-all" placeholder="اسم الشخصية" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">اللقب</label>
            <input name="title" className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)]/50 transition-all" placeholder="مثال: القائد الأعلى" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-gray-300">الوصف</label>
            <textarea name="description" required rows={3} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)]/50 transition-all" placeholder="وصف الشخصية..."></textarea>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">الفصيل</label>
            <input name="faction" className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)]/50 transition-all" placeholder="مثال: إمارة الصدأ" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">الرواية (اختياري)</label>
            <select name="novelId" className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)]/50 transition-all">
              <option value="" className="bg-[#111]">-- بدون رواية --</option>
              {novels.map(novel => (
                <option key={novel.id} value={novel.id} className="bg-[#111]">{novel.title}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">الانتماء (حليف/عدو)</label>
            <select name="alliance" defaultValue="CITIZEN" className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)]/50 transition-all">
              <option value="CITIZEN" className="bg-[#111]">أبناء الدولة / أبطال رئيسيين</option>
              <option value="ALLY" className="bg-[#111]">تحالفات الدولة</option>
              <option value="ENEMY" className="bg-[#111]">أعداء الدولة</option>
              <option value="OTHER" className="bg-[#111]">أخرى (محايد أو غير معروف)</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">ترتيب العرض (0 هو الأول)</label>
            <input name="sortOrder" type="number" defaultValue={0} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)]/50 transition-all" />
          </div>
          <div className="space-y-2">
            <FileUploadInput name="imageUrl" label="رابط الصورة أو الرفع (اختياري)" accept="image/*" />
          </div>
          
          <div className="grid grid-cols-3 gap-4 md:col-span-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 flex items-center gap-1"><Swords className="w-4 h-4 text-red-400"/> القوة</label>
              <input name="strength" type="number" defaultValue={50} min={1} max={100} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 flex items-center gap-1"><Zap className="w-4 h-4 text-blue-400"/> السحر</label>
              <input name="magic" type="number" defaultValue={50} min={1} max={100} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 flex items-center gap-1"><Brain className="w-4 h-4 text-emerald-400"/> الذكاء</label>
              <input name="intelligence" type="number" defaultValue={50} min={1} max={100} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all" />
            </div>
          </div>
        </div>
        
        <button disabled={loading} type="submit" className="w-full bg-magma hover:bg-magma-light text-white font-bold py-3 px-6 rounded-xl transition-all shadow-magma/30 disabled:opacity-50">
          {loading ? 'جاري الإضافة...' : 'إضافة الشخصية'}
        </button>
      </form>

      {/* Header and Stats */}
      <div className="bg-gradient-to-br from-white/5 to-black/40 p-6 md:p-8 rounded-3xl border border-white/10 relative overflow-hidden shadow-2xl mb-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 blur-[120px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col gap-8">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
              <Shield className="w-8 h-8 text-purple-400" />
              إدارة أبطال الملحمة
            </h1>
            <p className="text-gray-400 text-sm md:text-base">
              أضف شخصيات جديدة، حدد تحالفاتهم وقدراتهم، وابحث في السجل الكامل لأبطال الرواية.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4 hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center shrink-0">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-gray-400 text-xs font-bold mb-1">إجمالي الشخصيات</p>
                <p className="text-2xl font-bold text-white font-sans">{initialCharacters.length}</p>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4 hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center shrink-0">
                <Shield className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-gray-400 text-xs font-bold mb-1">أبناء الدولة / أبطال</p>
                <p className="text-2xl font-bold text-white font-sans">{initialCharacters.filter(c => c.alliance === 'CITIZEN').length}</p>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4 hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center shrink-0">
                <Swords className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <p className="text-gray-400 text-xs font-bold mb-1">الأعداء</p>
                <p className="text-2xl font-bold text-white font-sans">{initialCharacters.filter(c => c.alliance === 'ENEMY').length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Standalone Search & Actions Toolbar */}
      <div className="bg-black/40 border border-white/10 p-3 md:p-4 rounded-3xl backdrop-blur-2xl shadow-[0_8px_30px_rgba(0,0,0,0.5)] sticky top-[72px] md:top-[88px] z-30 mb-8">
        <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-4 w-full">
          <div className="w-full flex-1 min-w-0 flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <SearchInput placeholder="ابحث باسم الشخصية، اللقب، أو الفصيل..." value={searchQuery} onChange={setSearchQuery} />
            </div>
            {novels && novels.length > 0 && (
              <select
                value={selectedNovelId}
                onChange={(e) => setSelectedNovelId(e.target.value)}
                className="bg-black/60 border border-white/10 text-white text-sm rounded-xl px-4 py-3 h-[48px] focus:outline-none focus:border-[var(--theme-primary)]/50 transition-colors w-full sm:w-48 appearance-none"
                style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%239CA3AF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'left 1rem center', backgroundSize: '0.65em auto' }}
              >
                <option value="all">جميع الروايات</option>
                {novels.map(novel => (
                  <option key={novel.id} value={novel.id}>{novel.title}</option>
                ))}
              </select>
            )}
          </div>
          
          <div className="flex items-center gap-2 md:gap-3 shrink-0">
             {/* Any actions can go here if needed in the future */}
          </div>
        </div>
      </div>

      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <AnimatePresence>
        {filteredCharacters.map(char => (
          <motion.div 
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            key={char.id} 
            className="bg-white/5 border border-white/10 rounded-2xl p-5 md:p-6 hover:border-purple-500/50 transition-colors group relative overflow-hidden flex flex-col"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-3xl -mr-10 -mt-10 pointer-events-none" />
            
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="flex gap-3 items-center">
                <div 
                  className="w-12 h-12 md:w-16 md:h-16 rounded-xl bg-[#111] bg-cover bg-center border border-white/10 shrink-0"
                  style={{ backgroundImage: char.imageUrl ? `url(${char.imageUrl})` : 'none' }}
                >
                  {!char.imageUrl && (
                    <div className="w-full h-full flex items-center justify-center opacity-30">
                      <Users className="w-6 h-6 md:w-8 md:h-8 text-white" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-lg md:text-xl text-white group-hover:text-purple-400 transition-colors">{char.name}</h3>
                  {char.title && <p className="text-gray-400 text-xs md:text-sm">{char.title}</p>}
                </div>
              </div>
              
              <div className="flex items-center gap-2 shrink-0">
                <Link 
                  href={`/admin/characters/${char.id}`}
                  className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors border border-blue-500/20"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </Link>
                <button 
                  disabled={loading}
                  onClick={() => handleDelete(char.id)}
                  className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors border border-red-500/20 disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4 relative z-10">
              <span className={`text-[10px] md:text-xs px-2 md:px-3 py-1 rounded-full border ${
                char.alliance === 'CITIZEN' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                char.alliance === 'ENEMY' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                char.alliance === 'ALLY' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                'bg-gray-500/10 text-gray-400 border-gray-500/20'
              }`}>
                {char.alliance === 'CITIZEN' ? 'أبناء الدولة' :
                 char.alliance === 'ENEMY' ? 'عدو' :
                 char.alliance === 'ALLY' ? 'حليف' : 'أخرى'}
              </span>
              {char.faction && (
                <span className="text-[10px] md:text-xs px-2 md:px-3 py-1 rounded-full bg-white/5 text-gray-300 border border-white/10">
                  {char.faction}
                </span>
              )}
            </div>

            <p className="text-gray-500 text-xs md:text-sm line-clamp-2 relative z-10 flex-1">
              {char.description}
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-white/10 relative z-10">
              <div className="text-center p-2 rounded-xl bg-black/30 border border-white/5">
                <Swords className="w-3 h-3 md:w-4 md:h-4 text-red-400 mx-auto mb-1" />
                <p className="text-white font-bold font-sans text-xs md:text-sm">{char.strength}</p>
              </div>
              <div className="text-center p-2 rounded-xl bg-black/30 border border-white/5">
                <Zap className="w-3 h-3 md:w-4 md:h-4 text-blue-400 mx-auto mb-1" />
                <p className="text-white font-bold font-sans text-xs md:text-sm">{char.magic}</p>
              </div>
              <div className="text-center p-2 rounded-xl bg-black/30 border border-white/5">
                <Brain className="w-3 h-3 md:w-4 md:h-4 text-emerald-400 mx-auto mb-1" />
                <p className="text-white font-bold font-sans text-xs md:text-sm">{char.intelligence}</p>
              </div>
            </div>
          </motion.div>
        ))}
        </AnimatePresence>
      </motion.div>
      {filteredCharacters.length === 0 && (
        <div className="p-12 text-center border border-dashed border-white/20 rounded-2xl text-gray-400">
          لم يتم العثور على شخصيات.
        </div>
      )}
    </div>
  );
}
