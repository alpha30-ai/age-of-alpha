'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { Send, Bot, User, Loader2, Sparkles, ChevronDown, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MaintenanceGuard from '@/components/layout/MaintenanceGuard';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';

type Novel = {
  id: string;
  title: string;
  coverImage?: string;
};

type Message = {
  id: string;
  role: 'user' | 'model';
  content: string;
};

function ChatContent() {
  const searchParams = useSearchParams();
  const initialNovelId = searchParams.get('novelId');
  const [novels, setNovels] = useState<Novel[]>([]);
  const [selectedNovel, setSelectedNovel] = useState<Novel | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 'welcome', role: 'model', content: 'أهلاً بك أيها المستكشف. أنا حارس سجلات هذه العوالم. اختر الرواية التي تود التحدث عنها وسأجيب على كافة أسئلتك بلسان شخصياتها وتاريخها السري.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/admin/novels')
      .then(res => res.json())
      .then(data => {
        setNovels(data);
        if (data.length > 0) {
          if (initialNovelId) {
            const found = data.find((n: Novel) => n.id === initialNovelId);
            if (found) setSelectedNovel(found);
            else setSelectedNovel(data[0]);
          } else {
            setSelectedNovel(data[0]);
          }
        }
      })
      .catch(() => toast.error('فشل في جلب الروايات'));
  }, [initialNovelId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !selectedNovel || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    const newMessages = [...messages, { id: Date.now().toString(), role: 'user' as const, content: userMsg }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          novelId: selectedNovel.id,
          message: userMsg,
          history: messages.slice(1) // exclude welcome message
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'حدث خطأ غير معروف');

      setMessages([...newMessages, { id: Date.now().toString(), role: 'model', content: data.reply }]);
    } catch (error: any) {
      toast.error(error.message);
      setMessages([...newMessages, { id: Date.now().toString(), role: 'model', content: 'عذراً، تشوشت الرؤية في البلورة السحرية. لم أستطع إجابتك الآن.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] flex flex-col relative z-0">
      <Navbar />
      
      {/* Dynamic Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]">
        <div className="absolute top-1/4 left-1/4 w-[50vw] h-[50vw] bg-[var(--color-magma)]/10 blur-[120px] rounded-full mix-blend-screen animate-float"></div>
        <div className="absolute bottom-0 right-0 w-[60vw] h-[60vw] bg-[var(--color-milky-blue)]/10 blur-[150px] rounded-full mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay"></div>
      </div>

      <div className="flex-1 flex flex-col items-center pt-32 pb-24 px-4 w-full">
        <div className="w-full max-w-4xl space-y-6">
          
          {/* Header & Custom Novel Selector */}
          <div className="bg-[#111]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 relative z-20">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="p-4 bg-[var(--color-magma)]/10 rounded-full border border-[var(--color-magma)]/20 shadow-[0_0_20px_var(--color-magma)]/20">
                <Sparkles className="w-8 h-8 text-[var(--color-magma)] animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl font-bold font-cairo text-white mb-1 tracking-wide">الرائي العليم</h1>
                <p className="text-sm text-gray-400 font-tajawal">حارس أسرار الممالك وسجلات الفانتازيا</p>
              </div>
            </div>
            
            <div className="w-full md:w-72 relative" ref={dropdownRef}>
              <label className="block text-xs text-gray-500 mb-2 font-bold uppercase tracking-wider">الرواية المحددة للبحث</label>
              
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full bg-[#1a1a1a] border border-white/10 hover:border-white/20 rounded-xl px-4 py-3 flex items-center justify-between text-white transition-all shadow-inner"
              >
                {selectedNovel ? (
                  <div className="flex items-center gap-3">
                    {selectedNovel.coverImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={selectedNovel.coverImage} alt="" className="w-6 h-6 rounded border border-white/10 object-cover" />
                    ) : (
                      <div className="w-6 h-6 rounded bg-white/5 border border-white/10"></div>
                    )}
                    <span className="font-bold font-cairo truncate">{selectedNovel.title}</span>
                  </div>
                ) : (
                  <span className="text-gray-500">جاري التحميل...</span>
                )}
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 max-h-64 overflow-y-auto custom-scrollbar"
                  >
                    {novels.map(novel => (
                      <button
                        key={novel.id}
                        onClick={() => { setSelectedNovel(novel); setIsDropdownOpen(false); }}
                        className={`w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors ${selectedNovel?.id === novel.id ? 'bg-[var(--color-magma)]/10' : ''}`}
                      >
                        <div className="flex items-center gap-3">
                          {novel.coverImage ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={novel.coverImage} alt="" className="w-8 h-8 rounded-md border border-white/10 object-cover" />
                          ) : (
                            <div className="w-8 h-8 rounded-md bg-white/5 border border-white/10"></div>
                          )}
                          <span className={`font-bold font-cairo text-right ${selectedNovel?.id === novel.id ? 'text-[var(--color-magma)]' : 'text-gray-300'}`}>
                            {novel.title}
                          </span>
                        </div>
                        {selectedNovel?.id === novel.id && <Check className="w-5 h-5 text-[var(--color-magma)]" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Chat Area */}
          <div className="bg-[#111]/60 backdrop-blur-md border border-white/10 rounded-3xl shadow-2xl flex flex-col h-[600px] overflow-hidden relative z-10">
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 custom-scrollbar scroll-smooth">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 md:gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-lg ${msg.role === 'user' ? 'bg-[var(--color-magma)] text-white' : 'bg-black border border-white/10 text-[var(--color-magma)]'}`}>
                    {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                  </div>
                  <div className={`max-w-[85%] md:max-w-[75%] rounded-2xl p-4 md:p-5 shadow-sm text-sm md:text-base ${msg.role === 'user' ? 'bg-[var(--color-magma)]/10 border border-[var(--color-magma)]/20 text-white rounded-tr-none' : 'bg-[#1a1a1a]/80 border border-white/5 text-gray-300 rounded-tl-none leading-loose font-tajawal'}`}>
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-black border border-white/10 text-[var(--color-magma)] flex items-center justify-center shrink-0 shadow-lg">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div className="rounded-2xl rounded-tl-none p-4 bg-[#1a1a1a]/80 border border-white/5 text-gray-400 flex items-center gap-3">
                    <Loader2 className="w-5 h-5 animate-spin text-[var(--color-magma)]" />
                    <span className="animate-pulse">الرائي يستحضر السجلات...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl">
              <form onSubmit={handleSend} className="relative flex items-center gap-4 max-w-4xl mx-auto">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="تحدث مع الرائي العليم، اسأله عن أحداث، شخصيات، أو أسرار..."
                  className="w-full bg-[#1a1a1a] border border-white/10 focus:bg-[#222] rounded-full px-6 py-4 text-white focus:outline-none focus:border-[var(--color-magma)]/50 transition-all shadow-inner pr-16 font-tajawal text-lg"
                  disabled={isLoading || !selectedNovel}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim() || !selectedNovel}
                  className="absolute right-2 p-3 bg-[var(--color-magma)] hover:bg-[var(--theme-primary-dark)] text-white rounded-full transition-all disabled:opacity-50 hover:scale-105 active:scale-95 shadow-[0_0_15px_var(--color-magma)]/40"
                >
                  <Send className="w-6 h-6 rtl:-scale-x-100" />
                </button>
              </form>
            </div>

          </div>

        </div>
      </div>
      <Footer />
    </main>
  );
}

export default function ChatPage() {
  return (
    <MaintenanceGuard>
      <Suspense fallback={<div className="min-h-screen bg-[#050505] flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-[var(--color-magma)]" /></div>}>
        <ChatContent />
      </Suspense>
    </MaintenanceGuard>
  );
}
