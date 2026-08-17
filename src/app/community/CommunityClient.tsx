'use client';

import { useState, useEffect } from 'react';
import type { Novel } from '@prisma/client';
import CreatePostForm from '@/components/community/CreatePostForm';
import PostCard from '@/components/community/PostCard';
import { Loader2, MessageSquareOff, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import NovelFilterDropdown from '@/components/ui/NovelFilterDropdown';

interface CommunityClientProps {
  novel: Novel | null;
  user: any;
  novels?: { id: string; title: string }[];
}

export default function CommunityClient({ novel, user, novels }: CommunityClientProps) {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const url = novel ? `/api/community/posts?novelId=${novel.id}` : '/api/community/posts';
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch posts');
      const data = await res.json();
      setPosts(data);
    } catch (error) {
      toast.error('حدث خطأ أثناء جلب المنشورات');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [novel?.id]);

  const handlePostCreated = (newPost: any) => {
    setPosts([newPost, ...posts]);
  };

  const handlePostDeleted = (postId: string) => {
    setPosts(posts.filter(p => p.id !== postId));
  };

  const handleNovelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === 'all') {
      router.push('/community');
    } else {
      router.push(`/community?novelId=${val}`);
    }
  };

  return (
    <div className="w-full mx-auto space-y-12" dir="rtl">
      
      {/* Top Header Area: Filter & Create Post Stacked Elegantly */}
      <div className="flex flex-col gap-6 max-w-5xl mx-auto">
        {novels && novels.length > 0 && (
          <div className="w-full flex flex-col sm:flex-row items-center gap-4 bg-[#111]/80 border border-[var(--theme-primary)]/20 p-4 rounded-2xl backdrop-blur-xl shadow-[0_0_20px_var(--theme-primary)]/10 z-50 relative">
            <div className="flex items-center gap-2 text-[var(--theme-primary)] whitespace-nowrap shrink-0">
              <AlertCircle className="w-5 h-5" />
              <span className="font-tajawal font-bold text-gray-200">تصفح المجتمع:</span>
            </div>
            <div className="w-full sm:flex-1">
              <NovelFilterDropdown
                novels={novels}
                value={novel?.id || 'all'}
                onChange={(val) => {
                  if (val === 'all') router.push('/community');
                  else router.push(`/community?novelId=${val}`);
                }}
                allLabel="مجتمع جميع الروايات"
              />
            </div>
          </div>
        )}

        <div className="w-full relative z-10">
          {novel ? (
            <CreatePostForm novelId={novel.id} user={user} onPostCreated={handlePostCreated} />
          ) : (
            <div className="bg-[#111]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 text-center shadow-lg flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="p-3 bg-yellow-500/10 rounded-full border border-yellow-500/20">
                <AlertCircle className="w-8 h-8 text-yellow-500 shrink-0" />
              </div>
              <p className="text-gray-300 font-tajawal text-lg">
                يجب عليك اختيار رواية معينة من القائمة أعلاه حتى تتمكن من نشر مشاركة جديدة.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Posts Feed (True CSS Grid) */}
      <div className="w-full relative z-0">
        {isLoading ? (
          <div className="flex justify-center items-center py-20 bg-[#111]/30 rounded-3xl border border-white/5 backdrop-blur-sm max-w-5xl mx-auto">
            <Loader2 className="w-10 h-10 animate-spin text-[var(--theme-primary)]" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center bg-[#111]/50 backdrop-blur-md rounded-3xl p-12 border border-white/5 max-w-3xl mx-auto">
            <MessageSquareOff className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2 font-cairo">لا توجد منشورات بعد</h3>
            <p className="text-gray-400 font-tajawal text-lg mb-8">
              {novel ? `كن أول من يشارك أفكاره في مجتمع ${novel.title}!` : 'كن أول من يشارك أفكاره في مجتمع القراء!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start pb-20">
            {posts.map(post => (
              <PostCard 
                key={post.id} 
                post={post} 
                currentUser={user} 
                onDeleted={() => handlePostDeleted(post.id)} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
