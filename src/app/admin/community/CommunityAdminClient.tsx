'use client';

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Trash2, ShieldAlert, Loader2, Search } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CommunityAdminClient({ initialPosts, currentUser }: { initialPosts: any[], currentUser: any }) {
  const [posts, setPosts] = useState(initialPosts);
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (postId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المنشور؟ لا يمكن التراجع عن هذا الإجراء.')) return;
    
    setDeletingId(postId);
    try {
      const res = await fetch(`/api/community/posts?id=${postId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      
      setPosts(posts.filter(p => p.id !== postId));
      toast.success('تم حذف المنشور بنجاح');
    } catch (error) {
      toast.error('حدث خطأ أثناء الحذف');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredPosts = posts.filter(post => 
    post.content.toLowerCase().includes(search.toLowerCase()) || 
    post.user.name?.toLowerCase().includes(search.toLowerCase()) ||
    post.novel.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6" dir="rtl">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/5 border border-white/10 p-4 rounded-2xl">
        <div className="relative w-full md:w-96">
          <input 
            type="text" 
            placeholder="البحث في المنشورات..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 pl-10 text-white focus:outline-none focus:border-[var(--color-magma)]/50 transition-all font-tajawal text-sm"
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
        
        <div className="text-sm text-gray-400 font-bold bg-black/40 px-4 py-2 rounded-xl border border-white/5">
          إجمالي المنشورات: {filteredPosts.length}
        </div>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map(post => (
          <div key={post.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-black shrink-0">
                  {post.user.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={post.user.image} alt={post.user.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-[var(--color-magma)] bg-white/5">
                      {post.user.name?.[0] || 'U'}
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm font-cairo line-clamp-1">{post.user.name}</h4>
                  <p className="text-xs text-gray-500 font-tajawal" dir="ltr">
                    {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: ar })}
                  </p>
                </div>
              </div>
              
              <div className="text-xs font-bold text-[var(--color-milky-blue)] bg-[var(--color-milky-blue)]/10 px-2 py-1 rounded-md border border-[var(--color-milky-blue)]/20 truncate max-w-[100px]">
                {post.novel.title}
              </div>
            </div>

            <div className="flex-1 text-gray-300 text-sm font-tajawal mb-4 whitespace-pre-wrap line-clamp-4">
              {post.content}
            </div>

            {post.imageUrl && (
              <div className="h-32 rounded-xl overflow-hidden border border-white/5 mb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={post.imageUrl} alt="مرفق" className="w-full h-full object-cover" />
              </div>
            )}

            <div className="pt-4 border-t border-white/5 flex items-center justify-between mt-auto">
              {post.isReported ? (
                <span className="flex items-center gap-1 text-red-400 text-xs font-bold bg-red-400/10 px-2 py-1 rounded-md">
                  <ShieldAlert className="w-3 h-3" /> مبلّغ عنه
                </span>
              ) : (
                <span />
              )}
              
              <button
                onClick={() => handleDelete(post.id)}
                disabled={deletingId === post.id}
                className="flex items-center gap-1.5 text-xs font-bold text-red-400 hover:text-white hover:bg-red-500/20 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
              >
                {deletingId === post.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                حذف
              </button>
            </div>
          </div>
        ))}
        
        {filteredPosts.length === 0 && (
          <div className="col-span-full text-center py-20 text-gray-500 font-cairo">
            لا توجد منشورات مطابقة للبحث.
          </div>
        )}
      </div>
    </div>
  );
}
