import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { PostCard } from '@/components/posts/PostCard';
import { postsAPI } from '@/lib/api';
import { cn } from '@/lib/utils';
import { Post } from '@/lib/data';

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [sortBy, setSortBy] = useState<'hot' | 'new' | 'top'>('hot');
  
  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await postsAPI.getPosts({ sort: sortBy });
        setPosts(response.posts);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPosts();
  }, [sortBy]);
  
  // Handle sort change
  const handleSortChange = (sort: 'hot' | 'new' | 'top') => {
    setSortBy(sort);
  };
  
  return (
    <div className="min-h-screen bg-reddit-mediumGray">
      <Header />
      <Sidebar />
      
      <main className="pt-20 pb-10 px-4 md:ml-16">
        <div className="max-w-3xl mx-auto">
          {/* Sort Options */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 mb-4 flex items-center gap-1">
            <button
              onClick={() => handleSortChange('hot')}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm font-medium',
                sortBy === 'hot' 
                  ? 'bg-gray-100 text-black' 
                  : 'text-gray-500 hover:bg-gray-50'
              )}
            >
              Hot
            </button>
            
            <button
              onClick={() => handleSortChange('new')}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm font-medium',
                sortBy === 'new' 
                  ? 'bg-gray-100 text-black' 
                  : 'text-gray-500 hover:bg-gray-50'
              )}
            >
              New
            </button>
            
            <button
              onClick={() => handleSortChange('top')}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm font-medium',
                sortBy === 'top' 
                  ? 'bg-gray-100 text-black' 
                  : 'text-gray-500 hover:bg-gray-50'
              )}
            >
              Top
            </button>
          </div>
          
          {/* Posts List */}
          <div className="space-y-4">
            {isLoading ? (
              // Loading skeletons
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 animate-pulse">
                  <div className="flex gap-3">
                    <div className="w-10 bg-gray-200 h-20"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                      <div className="h-10 bg-gray-100 rounded w-full mt-4"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
