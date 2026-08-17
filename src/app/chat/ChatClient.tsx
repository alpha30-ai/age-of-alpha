'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Loader2, Sparkles, ChevronDown, Check, Book, Sword, ScrollText, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';

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

export default function ChatClient() {
  const searchParams = useSearchParams();
  const initialNovelId = searchParams.get('novelId');
  const [novels, setNovels] = useState<Novel[]>([]);
  const [selectedNovel, setSelectedNovel] = useState<Novel | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 'welcome', role: 'model', content: 'أهلاً بك أيها المستكشف. أنا حارس سجلات هذه العوالم. اختر الرواية التي تود التحدث عنها وسأجيب على كافة أسئلتك بلسان شخصياتها وتاريخها السري. 🔮⚔️' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [isMounted, setIsMounted] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
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
    if (!selectedNovel) return;
    
    const storageKey = `chat_session_${selectedNovel.id}`;
    let sid = localStorage.getItem(storageKey);
    if (!sid) {
      sid = 'session_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
      localStorage.setItem(storageKey, sid);
    }
    setSessionId(sid);

    fetch(`/api/chat/session?sessionId=${sid}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.messages && data.messages.length > 0) {
          setMessages([
            { id: 'welcome', role: 'model', content: `مرحباً بعودتك إلى سجلات "${selectedNovel.title}". المخطوطات جاهزة... 📜` },
            ...data.messages
          ]);
        } else {
          setMessages([
            { id: 'welcome', role: 'model', content: `أهلاً بك في سجلات "${selectedNovel.title}". تفضل بطرح أسئلتك... 👁️` }
          ]);
        }
      })
      .catch(e => console.error('Error fetching chat history:', e));

  }, [selectedNovel]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isLoading]);

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
          sessionId: sessionId,
          history: messages.slice(1)
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

  const floatingIcons = [Book, Sword, ScrollText, Eye, Sparkles];

  return (
    <main className="h-[100dvh] w-[100dvw] bg-[#050505] flex flex-col overflow-hidden text-gray-200 font-tajawal relative" dir="rtl">
      
      {/* Professional Grid & Immersive Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Core Gradients */}
        <div className="absolute top-0 right-0 w-full h-[50vh] bg-gradient-to-b from-[#111] to-transparent opacity-90" />
        <div className="absolute bottom-0 left-0 w-[50vw] h-[50vw] bg-[var(--theme-primary)]/5 blur-[150px] rounded-full mix-blend-screen" />
        <div className="absolute top-1/4 right-1/4 w-[40vw] h-[40vw] bg-[var(--theme-primary)]/10 blur-[150px] rounded-full mix-blend-screen animate-pulse" />
        
        {/* Grid Background */}
        <div 
          className="absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: 'linear-gradient(var(--theme-primary) 1px, transparent 1px), linear-gradient(90deg, var(--theme-primary) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />
        
        {/* Fade out edges */}
        <div className="absolute inset-0 shadow-[inset_0_0_150px_100px_#050505]" />

        {/* Floating Icons */}
        {isMounted && (
          <div className="absolute inset-0 overflow-hidden opacity-[0.03]">
            {[...Array(15)].map((_, i) => {
              const Icon = floatingIcons[i % floatingIcons.length];
              return (
                <motion.div
                  key={i}
                  initial={{ 
                    y: '110vh', 
                    x: `${Math.random() * 100}vw`,
                    rotate: 0,
                    scale: Math.random() * 1.5 + 0.5
                  }}
                  animate={{ 
                    y: '-10vh',
                    x: `${Math.random() * 100}vw`,
                    rotate: 360,
                  }}
                  transition={{ 
                    duration: 20 + Math.random() * 30,
                    repeat: Infinity,
                    ease: 'linear',
                    delay: Math.random() * 10
                  }}
                  className="absolute text-[var(--theme-primary)]"
                >
                  <Icon className="w-12 h-12" />
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* App Header */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-20 h-16 sm:h-20 flex items-center justify-between px-4 sm:px-8 bg-black/50 backdrop-blur-2xl border-b border-[var(--theme-primary)]/10 shrink-0 shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
      >
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push('/')}
            className="p-2 sm:p-2.5 rounded-xl bg-white/5 hover:bg-[var(--theme-primary)]/10 transition-colors border border-white/10 hover:border-[var(--theme-primary)]/30 flex items-center justify-center group"
          >
            <svg className="w-5 h-5 text-gray-400 group-hover:text-[var(--theme-primary)] transition-colors rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          </button>
          
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[var(--theme-primary)]/20 to-black rounded-2xl border border-[var(--theme-primary)]/30 shadow-[0_0_15px_var(--theme-primary)]/20">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--theme-primary)] animate-pulse" />
            </div>
            <div>
              <h1 className="font-cairo font-black text-lg sm:text-xl text-white tracking-wide">الرائي العليم</h1>
              <p className="text-[10px] sm:text-xs text-[var(--theme-primary)]/80 font-bold">ذكاء اصطناعي تفاعلي</p>
            </div>
          </div>
        </div>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 bg-white/5 hover:bg-[var(--theme-primary)]/10 border border-white/10 hover:border-[var(--theme-primary)]/30 rounded-xl px-4 py-2 sm:py-2.5 transition-all group shadow-sm"
          >
            {selectedNovel ? (
              <span className="font-cairo font-bold text-sm sm:text-base text-gray-200 group-hover:text-white hidden sm:block">{selectedNovel.title}</span>
            ) : (
              <span className="font-cairo font-bold text-sm text-gray-500">جاري التحميل...</span>
            )}
            <ChevronDown className={`w-4 h-4 text-gray-400 group-hover:text-[var(--theme-primary)] transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 sm:right-0 sm:left-auto mt-3 w-64 bg-[#111]/95 backdrop-blur-xl border border-[var(--theme-primary)]/20 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden z-50 p-2"
              >
                {novels.map(novel => (
                  <button
                    key={novel.id}
                    onClick={() => { setSelectedNovel(novel); setIsDropdownOpen(false); }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                      selectedNovel?.id === novel.id 
                        ? 'bg-[var(--theme-primary)]/20 text-[var(--theme-primary)] font-bold' 
                        : 'hover:bg-white/5 text-gray-300'
                    }`}
                  >
                    <span className="font-cairo text-sm truncate">{novel.title}</span>
                    {selectedNovel?.id === novel.id && <Check className="w-4 h-4" />}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      {/* Main Chat Area */}
      <div className="flex-1 relative z-10 flex flex-col w-full h-full">
        
        {/* Messages List */}
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto px-4 sm:px-8 py-8 space-y-8 custom-scrollbar scroll-smooth w-full max-w-5xl mx-auto"
        >
          <AnimatePresence initial={false}>
            {messages.map((msg, idx) => (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20, delay: idx === 0 ? 0 : 0.1 }}
                className={`flex gap-3 sm:gap-4 w-full ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
                  msg.role === 'user' 
                    ? 'bg-gradient-to-br from-[var(--theme-primary)] to-black text-white border border-white/10' 
                    : 'bg-[#111]/90 border border-[var(--theme-primary)]/30 text-[var(--theme-primary)] shadow-[0_0_15px_var(--theme-primary)]/20 backdrop-blur-sm'
                }`}>
                  {msg.role === 'user' ? <User className="w-5 h-5 sm:w-6 sm:h-6" /> : <Bot className="w-5 h-5 sm:w-6 sm:h-6" />}
                </div>

                {/* Message Bubble */}
                <div className={`max-w-[85%] md:max-w-[75%] rounded-[2rem] p-5 sm:p-6 shadow-2xl text-sm sm:text-base leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-[var(--theme-primary)]/10 backdrop-blur-xl border border-[var(--theme-primary)]/20 text-white rounded-tr-sm shadow-[0_0_30px_var(--theme-primary)]/5' 
                    : 'bg-[#111]/80 backdrop-blur-xl border border-white/5 text-gray-200 rounded-tl-sm'
                }`}>
                  <p className="whitespace-pre-wrap leading-loose">{msg.content}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3 sm:gap-4 w-full"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#111]/90 border border-[var(--theme-primary)]/30 text-[var(--theme-primary)] flex items-center justify-center shrink-0 shadow-[0_0_15px_var(--theme-primary)]/20 backdrop-blur-sm">
                <Bot className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="rounded-[2rem] rounded-tl-sm p-5 sm:p-6 bg-[#111]/80 backdrop-blur-xl border border-white/5 flex items-center gap-3 w-fit shadow-2xl">
                <div className="flex gap-1.5">
                  <motion.div className="w-2.5 h-2.5 rounded-full bg-[var(--theme-primary)]" animate={{ y: [0, -5, 0], opacity: [0.5, 1, 0.5] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} />
                  <motion.div className="w-2.5 h-2.5 rounded-full bg-white/50" animate={{ y: [0, -5, 0], opacity: [0.5, 1, 0.5] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} />
                  <motion.div className="w-2.5 h-2.5 rounded-full bg-[var(--theme-primary)]" animate={{ y: [0, -5, 0], opacity: [0.5, 1, 0.5] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} />
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} className="h-4" />
        </div>

        {/* Input Form Area */}
        <div className="p-4 sm:p-6 bg-gradient-to-t from-[#050505] via-[#050505]/95 to-transparent shrink-0">
          <div className="w-full max-w-4xl mx-auto relative group">
            <div className="absolute inset-0 bg-[var(--theme-primary)]/5 rounded-full blur-xl group-focus-within:bg-[var(--theme-primary)]/15 transition-all duration-500" />
            <form onSubmit={handleSend} className="relative flex items-center w-full">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="تحدث مع الرائي، اسأله عن الأسرار والمخطوطات..."
                className="w-full bg-[#111]/90 backdrop-blur-2xl border border-white/10 focus:border-[var(--theme-primary)]/50 rounded-full pl-6 pr-16 py-4 sm:py-5 text-white focus:outline-none transition-all shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] font-tajawal text-sm sm:text-base z-10"
                disabled={isLoading || !selectedNovel}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={isLoading || !input.trim() || !selectedNovel}
                className="absolute right-2 top-2 bottom-2 z-20 aspect-square flex items-center justify-center bg-[var(--theme-primary)] text-white rounded-full transition-all disabled:opacity-50 disabled:grayscale shadow-[0_0_20px_var(--theme-primary)]/40 hover:shadow-[0_0_30px_var(--theme-primary)]/60"
              >
                <Send className="w-5 h-5 sm:w-6 sm:h-6 rtl:-scale-x-100" />
              </motion.button>
            </form>
          </div>
        </div>

      </div>
    </main>
  );
}
