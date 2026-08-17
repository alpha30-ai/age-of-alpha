'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Loader2, Sparkles, ChevronDown, Check, Book, Sword, ScrollText, Eye, Plus, MessageSquare, Menu, X, Trash2 } from 'lucide-react';
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

type ChatSessionMeta = {
  id: string;
  title: string;
  date: number;
};

export default function ChatClient() {
  const searchParams = useSearchParams();
  const initialNovelId = searchParams.get('novelId');
  const [novels, setNovels] = useState<Novel[]>([]);
  const [selectedNovel, setSelectedNovel] = useState<Novel | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // History State
  const [sessions, setSessions] = useState<ChatSessionMeta[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [isMounted, setIsMounted] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // 1. Fetch Novels
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

  // 2. Load History for Selected Novel
  useEffect(() => {
    if (!selectedNovel) return;
    
    const historyKey = `chat_history_${selectedNovel.id}`;
    let savedHistory: ChatSessionMeta[] = [];
    try {
      const stored = localStorage.getItem(historyKey);
      if (stored) savedHistory = JSON.parse(stored);
    } catch (e) {}

    // If no history, create initial
    if (savedHistory.length === 0) {
      const initialSessionId = 'session_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
      savedHistory = [{
        id: initialSessionId,
        title: 'محادثة جديدة',
        date: Date.now()
      }];
      localStorage.setItem(historyKey, JSON.stringify(savedHistory));
    }

    setSessions(savedHistory);
    setCurrentSessionId(savedHistory[0].id); // Select most recent or first
  }, [selectedNovel]);

  // 3. Load Messages when Session Changes
  useEffect(() => {
    if (!selectedNovel || !currentSessionId) return;

    setIsLoading(true);
    fetch(`/api/chat/session?sessionId=${currentSessionId}`)
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
      .catch(e => {
        console.error('Error fetching chat history:', e);
        setMessages([
          { id: 'welcome', role: 'model', content: `أهلاً بك في سجلات "${selectedNovel.title}". تفضل بطرح أسئلتك... 👁️` }
        ]);
      })
      .finally(() => setIsLoading(false));

  }, [currentSessionId, selectedNovel]);

  // Handle New Session
  const handleNewSession = () => {
    if (!selectedNovel) return;
    const newSessionId = 'session_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    const newSession: ChatSessionMeta = {
      id: newSessionId,
      title: 'محادثة جديدة',
      date: Date.now()
    };
    const updatedSessions = [newSession, ...sessions];
    
    setSessions(updatedSessions);
    localStorage.setItem(`chat_history_${selectedNovel.id}`, JSON.stringify(updatedSessions));
    setCurrentSessionId(newSessionId);
    if (window.innerWidth < 1024) setIsSidebarOpen(false);
  };

  const handleDeleteSession = async (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    if (!selectedNovel) return;
    
    const updatedSessions = sessions.filter(s => s.id !== sessionId);
    setSessions(updatedSessions);
    localStorage.setItem(`chat_history_${selectedNovel.id}`, JSON.stringify(updatedSessions));
    
    if (currentSessionId === sessionId) {
      if (updatedSessions.length > 0) {
        setCurrentSessionId(updatedSessions[0].id);
      } else {
        // Create a new session automatically if we deleted the last one
        const newSessionId = 'session_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
        const newSession: ChatSessionMeta = { id: newSessionId, title: 'محادثة جديدة', date: Date.now() };
        setSessions([newSession]);
        localStorage.setItem(`chat_history_${selectedNovel.id}`, JSON.stringify([newSession]));
        setCurrentSessionId(newSessionId);
      }
    }

    try {
      await fetch(`/api/chat/session?sessionId=${sessionId}`, { method: 'DELETE' });
      toast.success('تم حذف المحادثة');
    } catch (err) {
      console.error(err);
      toast.error('فشل الحذف');
    }
  };

  // Scroll to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isLoading]);

  // Close dropdown on outside click
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
    if (!input.trim() || !selectedNovel || !currentSessionId || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    const newMessages = [...messages, { id: Date.now().toString(), role: 'user' as const, content: userMsg }];
    setMessages(newMessages);
    setIsLoading(true);

    // Update Session Title if it's the first user message
    if (messages.length <= 1) {
      const updatedSessions = sessions.map(s => {
        if (s.id === currentSessionId && s.title === 'محادثة جديدة') {
          return { ...s, title: userMsg.substring(0, 30) + (userMsg.length > 30 ? '...' : '') };
        }
        return s;
      });
      setSessions(updatedSessions);
      localStorage.setItem(`chat_history_${selectedNovel.id}`, JSON.stringify(updatedSessions));
    }

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          novelId: selectedNovel.id,
          message: userMsg,
          sessionId: currentSessionId,
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

  const floatingIcons = [Book, Sword, ScrollText, Eye, Sparkles];

  return (
    <main className="h-[100dvh] w-full bg-[#050505] flex flex-col md:flex-row overflow-hidden text-gray-200 font-tajawal relative" dir="rtl">
      
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-full h-[50vh] bg-gradient-to-b from-[#111] to-transparent opacity-90" />
        <div className="absolute bottom-0 left-0 w-[50vw] h-[50vw] bg-[var(--theme-primary)]/5 blur-[150px] rounded-full mix-blend-screen" />
        <div className="absolute top-1/4 right-1/4 w-[40vw] h-[40vw] bg-[var(--theme-primary)]/10 blur-[150px] rounded-full mix-blend-screen animate-pulse" />
        
        <div 
          className="absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: 'linear-gradient(var(--theme-primary) 1px, transparent 1px), linear-gradient(90deg, var(--theme-primary) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />
        
        {isMounted && (
          <div className="absolute inset-0 overflow-hidden opacity-[0.03]">
            {[...Array(15)].map((_, i) => {
              const Icon = floatingIcons[i % floatingIcons.length];
              return (
                <motion.div
                  key={i}
                  initial={{ y: '110vh', x: `${Math.random() * 100}vw`, rotate: 0, scale: Math.random() * 1.5 + 0.5 }}
                  animate={{ y: '-10vh', x: `${Math.random() * 100}vw`, rotate: 360 }}
                  transition={{ duration: 20 + Math.random() * 30, repeat: Infinity, ease: 'linear', delay: Math.random() * 10 }}
                  className="absolute text-[var(--theme-primary)]"
                >
                  <Icon className="w-12 h-12" />
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Sidebar Overlay for Mobile */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar (Chat History) */}
      <motion.aside 
        initial={{ x: 300 }}
        animate={{ x: isSidebarOpen ? 0 : (typeof window !== 'undefined' && window.innerWidth >= 768 ? 0 : 300) }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed md:static top-0 right-0 h-full w-72 sm:w-80 bg-[#111]/90 backdrop-blur-2xl border-l border-white/10 flex flex-col z-50 shrink-0 shadow-2xl md:shadow-none"
      >
        <div className="p-4 flex items-center justify-between border-b border-white/10 shrink-0">
          <h2 className="font-cairo font-bold text-white flex items-center gap-2">
            <ScrollText className="w-5 h-5 text-[var(--theme-primary)]" />
            سجل المحادثات
          </h2>
          <button className="md:hidden p-2 text-gray-400 hover:text-white" onClick={() => setIsSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Novel Selector in Sidebar */}
        <div className="p-4 shrink-0 relative z-20" ref={dropdownRef}>
          <label className="text-xs text-gray-500 mb-2 block font-bold">الرواية المحددة:</label>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full flex items-center justify-between bg-black/40 border border-white/10 hover:border-[var(--theme-primary)]/30 rounded-xl px-4 py-3 transition-all group"
          >
            <span className="font-cairo font-bold text-sm text-gray-200 truncate">
              {selectedNovel ? selectedNovel.title : 'جاري التحميل...'}
            </span>
            <ChevronDown className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="absolute top-full right-4 left-4 mt-2 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 max-h-64 overflow-y-auto custom-scrollbar"
              >
                {novels.map(novel => (
                  <button
                    key={novel.id}
                    onClick={() => { setSelectedNovel(novel); setIsDropdownOpen(false); }}
                    className={`w-full flex items-center justify-between px-4 py-3 text-sm text-right transition-colors ${
                      selectedNovel?.id === novel.id ? 'bg-[var(--theme-primary)]/20 text-[var(--theme-primary)]' : 'hover:bg-white/5 text-gray-300'
                    }`}
                  >
                    <span className="truncate">{novel.title}</span>
                    {selectedNovel?.id === novel.id && <Check className="w-4 h-4 shrink-0" />}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* New Chat Button */}
        <div className="px-4 pb-4 shrink-0">
          <button 
            onClick={handleNewSession}
            className="w-full flex items-center justify-center gap-2 bg-[var(--theme-primary)]/10 hover:bg-[var(--theme-primary)]/20 text-[var(--theme-primary)] border border-[var(--theme-primary)]/20 rounded-xl py-3 font-bold transition-all"
          >
            <Plus className="w-5 h-5" />
            محادثة جديدة
          </button>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2 custom-scrollbar z-10">
          {sessions.map(session => (
            <div key={session.id} className="relative group flex items-center w-full">
              <button
                onClick={() => { setCurrentSessionId(session.id); if(window.innerWidth < 1024) setIsSidebarOpen(false); }}
                className={`w-full text-right p-3 pl-10 rounded-xl border flex items-start gap-3 transition-all ${
                  currentSessionId === session.id 
                    ? 'bg-white/10 border-white/20' 
                    : 'bg-transparent border-transparent hover:bg-white/5'
                }`}
              >
                <MessageSquare className={`w-5 h-5 shrink-0 mt-0.5 ${currentSessionId === session.id ? 'text-[var(--theme-primary)]' : 'text-gray-500'}`} />
                <div className="overflow-hidden w-full">
                  <p className="text-sm text-white font-bold truncate pr-1">{session.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{new Date(session.date).toLocaleDateString('ar-SA')}</p>
                </div>
              </button>
              <button
                onClick={(e) => handleDeleteSession(e, session.id)}
                className="absolute left-2 p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                title="حذف المحادثة"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </motion.aside>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative z-10 w-full h-full min-w-0">
        
        {/* Header */}
        <header className="h-16 sm:h-20 shrink-0 flex items-center justify-between px-4 sm:px-8 bg-black/40 backdrop-blur-xl border-b border-white/10">
          <div className="flex items-center gap-3">
            <button 
              className="md:hidden p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-[var(--theme-primary)]/20 to-black rounded-xl border border-[var(--theme-primary)]/30">
              <Sparkles className="w-5 h-5 text-[var(--theme-primary)] animate-pulse" />
            </div>
            <div>
              <h1 className="font-cairo font-black text-lg text-white">الرائي العليم</h1>
              <p className="text-xs text-[var(--theme-primary)]">ذكاء اصطناعي تفاعلي</p>
            </div>
          </div>
          <button 
            onClick={() => router.push('/')}
            className="p-2 rounded-xl bg-white/5 hover:bg-[var(--theme-primary)]/10 text-gray-400 hover:text-white transition-all border border-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Messages */}
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto px-4 py-6 sm:p-8 space-y-6 custom-scrollbar scroll-smooth">
          <div className="max-w-4xl mx-auto space-y-6">
            <AnimatePresence initial={false}>
              {messages.map((msg, idx) => (
                <motion.div 
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 sm:gap-4 w-full ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    msg.role === 'user' 
                      ? 'bg-[var(--theme-primary)] text-white' 
                      : 'bg-[#1a1a1a] border border-[var(--theme-primary)]/30 text-[var(--theme-primary)]'
                  }`}>
                    {msg.role === 'user' ? <User className="w-4 h-4 sm:w-5 sm:h-5" /> : <Bot className="w-4 h-4 sm:w-5 sm:h-5" />}
                  </div>

                  <div className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-4 sm:p-5 text-sm sm:text-base leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-[var(--theme-primary)]/10 border border-[var(--theme-primary)]/20 text-white rounded-tr-sm' 
                      : 'bg-[#1a1a1a]/80 border border-white/5 text-gray-200 rounded-tl-sm'
                  }`}>
                    <p className="whitespace-pre-wrap leading-loose">{msg.content}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isLoading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3 sm:gap-4 w-full">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#1a1a1a] border border-[var(--theme-primary)]/30 text-[var(--theme-primary)] flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="rounded-2xl rounded-tl-sm p-4 sm:p-5 bg-[#1a1a1a]/80 border border-white/5 flex items-center gap-2">
                  <motion.div className="w-2 h-2 rounded-full bg-[var(--theme-primary)]" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} />
                  <motion.div className="w-2 h-2 rounded-full bg-white/50" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} />
                  <motion.div className="w-2 h-2 rounded-full bg-[var(--theme-primary)]" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} />
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} className="h-2" />
          </div>
        </div>

        {/* Input Area */}
        <div className="shrink-0 p-4 sm:p-6 bg-[#0a0a0a] border-t border-white/5 relative z-20">
          <div className="max-w-4xl mx-auto relative group">
            <form onSubmit={handleSend} className="relative flex items-center w-full">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="تحدث مع الرائي..."
                className="w-full bg-[#111] border border-white/10 focus:border-[var(--theme-primary)]/50 rounded-full pl-4 pr-14 py-4 text-white focus:outline-none transition-colors text-sm sm:text-base z-10"
                disabled={isLoading || !selectedNovel || !currentSessionId}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim() || !selectedNovel || !currentSessionId}
                className="absolute right-2 top-2 bottom-2 z-20 aspect-square flex items-center justify-center bg-[var(--theme-primary)] text-white rounded-full transition-transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
              >
                <Send className="w-5 h-5 rtl:-scale-x-100" />
              </button>
            </form>
          </div>
        </div>

      </div>
    </main>
  );
}
