'use client';

import { useState, useEffect } from 'react';
import { Novel } from '@prisma/client';
import CreatePostForm from '@/components/community/CreatePostForm';
import PostCard from '@/components/community/PostCard';
import { Loader2, MessageSquareOff } from 'lucide-react';
import toast from 'react-hot-toast';

interface CommunityClientProps {
  novel: Novel;
  user: any;
}

export default function CommunityClient({ novel, user }: CommunityClientProps) {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const res = await fetch(`/api/community/posts?novelId=${novel.id}`);
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
  }, [novel.id]);

  const handlePostCreated = (newPost: any) => {
    setPosts([newPost, ...posts]);
  };

  const handlePostDeleted = (postId: string) => {
    setPosts(posts.filter(p => p.id !== postId));
  };

  return (
    <div className="space-y-8" dir="rtl">
      {/* Create Post Section */}
      <CreatePostForm novelId={novel.id} user={user} onPostCreated={handlePostCreated} />

      {/* Posts List */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-[var(--color-magma)]" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center bg-[#111]/50 backdrop-blur-md rounded-3xl p-12 border border-white/5">
            <MessageSquareOff className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2 font-cairo">لا توجد منشورات بعد</h3>
            <p className="text-gray-400 font-tajawal">كن أول من يشارك أفكاره في مجتمع {novel.title}!</p>
          </div>
        ) : (
          posts.map(post => (
            <PostCard 
              key={post.id} 
              post={post} 
              currentUser={user} 
              onDeleted={() => handlePostDeleted(post.id)} 
            />
          ))
        )}
      </div>
    </div>
  );
}
