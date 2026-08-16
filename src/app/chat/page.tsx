'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, BookOpen, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

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

export default function ChatPage() {
  const [novels, setNovels] = useState<Novel[]>([]);
  const [selectedNovelId, setSelectedNovelId] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([
    { id: 'welcome', role: 'model', content: 'أهلاً بك أيها المستكشف. أنا حارس سجلات هذه العوالم. اختر الرواية التي تود التحدث عنها وسأجيب على كافة أسئلتك.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/admin/novels')
      .then(res => res.json())
      .then(data => {
        setNovels(data);
        if (data.length > 0) setSelectedNovelId(data[0].id);
      })
      .catch(() => toast.error('فشل في جلب الروايات'));
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !selectedNovelId || isLoading) return;

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
          novelId: selectedNovelId,
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
    <div className="min-h-screen bg-[#050505] flex flex-col items-center pt-24 pb-12 px-4 relative z-0">
      
      {/* Background Gradients */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-[-1]">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-magma/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="w-full max-w-4xl space-y-6">
        
        {/* Header & Novel Selector */}
        <div className="bg-[#111]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-magma/10 rounded-full border border-magma/20">
              <Sparkles className="w-8 h-8 text-magma animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">الرائي العليم (AI RAG)</h1>
              <p className="text-sm text-gray-400">اسأل الذكاء الاصطناعي أي شيء عن أحداث وشخصيات الرواية</p>
            </div>
          </div>
          
          <div className="w-full md:w-64">
            <label className="block text-xs text-gray-500 mb-2 font-bold uppercase tracking-wider">الرواية المحددة</label>
            <select
              value={selectedNovelId}
              onChange={(e) => setSelectedNovelId(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-magma transition-colors cursor-pointer font-bold appearance-none"
            >
              {novels.length === 0 ? <option value="">جاري التحميل...</option> : null}
              {novels.map(n => (
                <option key={n.id} value={n.id}>{n.title}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Chat Area */}
        <div className="bg-[#111]/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl flex flex-col h-[600px] overflow-hidden">
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-lg ${msg.role === 'user' ? 'bg-magma text-white' : 'bg-gray-800 text-magma border border-white/10'}`}>
                  {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>
                <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${msg.role === 'user' ? 'bg-magma/10 border border-magma/20 text-white rounded-tr-none' : 'bg-[#1a1a1a] border border-white/5 text-gray-300 rounded-tl-none leading-relaxed'}`}>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-800 border border-white/10 text-magma flex items-center justify-center shrink-0 shadow-lg">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="max-w-[80%] rounded-2xl rounded-tl-none p-4 bg-[#1a1a1a] border border-white/5 text-gray-400 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-magma" />
                  يستحضر المعلومات...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-white/10 bg-[#0a0a0a]">
            <form onSubmit={handleSend} className="relative flex items-center gap-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="اسأل عن أي شيء في الرواية المحددة..."
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-full px-6 py-4 text-white focus:outline-none focus:border-magma transition-colors pr-16"
                disabled={isLoading || !selectedNovelId}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim() || !selectedNovelId}
                className="absolute right-2 p-3 bg-magma hover:bg-magma-light text-white rounded-full transition-colors disabled:opacity-50"
              >
                <Send className="w-5 h-5 rtl:-scale-x-100" />
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
