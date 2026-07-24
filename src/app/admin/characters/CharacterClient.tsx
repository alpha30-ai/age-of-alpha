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
}

export default function CharacterClient({ initialCharacters }: { initialCharacters: Character[] }) {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الشخصية؟')) return;
    setLoading(true);
    await deleteCharacter(id);
    setLoading(false);
  };

  const filteredCharacters = initialCharacters.filter(char => 
    char.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (char.title && char.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (char.faction && char.faction.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
      <div className="bg-black/40 border border-white/10 p-4 rounded-3xl backdrop-blur-2xl shadow-[0_8px_30px_rgba(0,0,0,0.5)] sticky top-[88px] z-30 mb-8">
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
          <div className="w-full flex-1">
            <SearchInput placeholder="ابحث باسم الشخصية، اللقب، أو الفصيل..." value={searchQuery} onChange={setSearchQuery} />
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
             {/* Any actions can go here if needed in the future */}
          </div>
        </div>
      </div>

      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
        {filteredCharacters.map(char => (
          <motion.div 
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            key={char.id} 
            className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl group hover:bg-white/10 transition-colors relative"
          >
            <div className="absolute top-2 right-2 z-10 bg-black/80 backdrop-blur-md border border-white/10 text-white px-2 py-1 rounded-md text-xs font-bold">
              ترتيب: {char.sortOrder}
            </div>
            {char.imageUrl ? (
              <div className="h-48 w-full bg-gray-800 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={char.imageUrl} alt={char.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent"></div>
              </div>
            ) : (
              <div className="h-48 w-full bg-gradient-to-br from-purple-900/50 to-blue-900/50 flex items-center justify-center">
                <Shield className="w-16 h-16 text-white/20" />
              </div>
            )}
            
            <div className="p-6 relative">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-xl font-bold text-white">{char.name}</h3>
                  {char.title && <p className="text-sm text-purple-400">{char.title}</p>}
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/admin/characters/${char.id}`}
                    className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition-all"
                    title="تعديل"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </Link>
                  <button 
                    disabled={loading}
                    onClick={() => handleDelete(char.id)}
                    className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                    title="حذف"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {char.faction && (
                <span className="inline-block px-3 py-1 bg-white/10 rounded-full text-xs text-gray-300 mb-4 border border-white/5">
                  {char.faction}
                </span>
              )}
              
              <p className="text-gray-400 text-sm mb-6 line-clamp-2">{char.description}</p>
              
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center p-2 rounded-xl bg-black/30 border border-white/5">
                  <Swords className="w-4 h-4 text-red-400 mx-auto mb-1" />
                  <span className="text-xs text-white font-bold">{char.strength}</span>
                </div>
                <div className="text-center p-2 rounded-xl bg-black/30 border border-white/5">
                  <Zap className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                  <span className="text-xs text-white font-bold">{char.magic}</span>
                </div>
                <div className="text-center p-2 rounded-xl bg-black/30 border border-white/5">
                  <Brain className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                  <span className="text-xs text-white font-bold">{char.intelligence}</span>
                </div>
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
