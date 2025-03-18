import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { PostCard } from '@/components/posts/PostCard';
import { subredditsAPI, postsAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const Subreddit = () => {
  const { subreddit } = useParams<{ subreddit: string }>();
  const { isAuthenticated, openAuthModal } = useAuth();
  
  const [isLoading, setIsLoading] = useState(true);
  const [subredditData, setSubredditData] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [isMember, setIsMember] = useState(false);
  const [sortBy, setSortBy] = useState<'hot' | 'new' | 'top'>('hot');
  
  // Fetch subreddit data
  useEffect(() => {
    const fetchSubredditData = async () => {
      if (!subreddit) return;
      
      setIsLoading(true);
      try {
        const data = await subredditsAPI.getSubredditByName(subreddit);
        setSubredditData(data);
        
        // Check if user is a member
        if (isAuthenticated && data.members) {
          const user = JSON.parse(localStorage.getItem('user') || '{}');
          setIsMember(data.members.includes(user._id));
        }
        
        // Fetch posts for this subreddit
        const postsData = await postsAPI.getPosts({ 
          subreddit: data._id,
          sort: sortBy
        });
        setPosts(postsData.posts);
      } catch (error) {
        console.error('Failed to fetch subreddit:', error);
        toast.error('Failed to load subreddit');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSubredditData();
  }, [subreddit, isAuthenticated, sortBy]);
  
  // Handle joining/leaving subreddit
  const handleMembershipToggle = async () => {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    
    try {
      if (isMember) {
        await subredditsAPI.leaveSubreddit(subredditData._id);
        toast.success(`Left r/${subredditData.name}`);
      } else {
        await subredditsAPI.joinSubreddit(subredditData._id);
        toast.success(`Joined r/${subredditData.name}`);
      }
      
      // Update membership status
      setIsMember(!isMember);
      
      // Update member count
      setSubredditData(prev => ({
        ...prev,
        memberCount: isMember ? prev.memberCount - 1 : prev.memberCount + 1
      }));
    } catch (error) {
      console.error('Failed to update membership:', error);
      toast.error('Failed to update membership');
    }
  };
  
  // Handle sort change
  const handleSortChange = (sort: 'hot' | 'new' | 'top') => {
    setSortBy(sort);
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-reddit-mediumGray">
        <Header />
        <Sidebar />
        <main className="pt-20 pb-10 px-4 md:ml-16">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4 animate-pulse">
              <div className="h-24 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }
  
  if (!subredditData) {
    return (
      <div className="min-h-screen bg-reddit-mediumGray">
        <Header />
        <Sidebar />
        <main className="pt-20 pb-10 px-4 md:ml-16">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
              <h2 className="text-xl font-semibold mb-2">Subreddit Not Found</h2>
              <p>The subreddit you're looking for doesn't exist or has been removed.</p>
            </div>
          </div>
        </main>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-reddit-mediumGray">
      <Header />
      <Sidebar />
      
      <main className="pt-20 pb-10 px-4 md:ml-16">
        <div className="max-w-3xl mx-auto">
          {/* Subreddit Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 overflow-hidden">
            {/* Banner */}
            {subredditData.banner ? (
              <div 
                className="h-24 bg-cover bg-center" 
                style={{ backgroundImage: `url(${subredditData.banner})` }}
              ></div>
            ) : (
              <div className="h-24 bg-reddit-orange"></div>
            )}
            
            {/* Subreddit Info */}
            <div className="p-4">
              <div className="flex items-center gap-3">
                {/* Icon */}
                <div className="w-16 h-16 rounded-full bg-white border-4 border-white -mt-10 overflow-hidden">
                  <img 
                    src={subredditData.icon || `https://api.dicebear.com/7.x/bottts/svg?seed=${subredditData.name}`} 
                    alt={subredditData.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1">
                  <h1 className="text-2xl font-bold">r/{subredditData.name}</h1>
                  <p className="text-sm text-gray-500">{subredditData.memberCount.toLocaleString()} members</p>
                </div>
                
                {/* Join/Leave Button */}
                <button
                  onClick={handleMembershipToggle}
                  className={`px-4 py-1.5 rounded-full font-medium ${
                    isMember 
                      ? 'bg-white text-reddit-blue border border-reddit-blue hover:bg-gray-100' 
                      : 'bg-reddit-blue text-white hover:bg-reddit-blueHover'
                  }`}
                >
                  {isMember ? 'Joined' : 'Join'}
                </button>
              </div>
              
              {/* Description */}
              {subredditData.description && (
                <p className="mt-3 text-sm text-gray-700">{subredditData.description}</p>
              )}
            </div>
          </div>
          
          {/* Sort Options */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 mb-4 flex items-center gap-1">
            <button
              onClick={() => handleSortChange('hot')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                sortBy === 'hot' 
                  ? 'bg-gray-100 text-black' 
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              Hot
            </button>
            
            <button
              onClick={() => handleSortChange('new')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                sortBy === 'new' 
                  ? 'bg-gray-100 text-black' 
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              New
            </button>
            
            <button
              onClick={() => handleSortChange('top')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                sortBy === 'top' 
                  ? 'bg-gray-100 text-black' 
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              Top
            </button>
          </div>
          
          {/* Posts List */}
          <div className="space-y-4">
            {posts.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
                <h3 className="text-lg font-medium mb-2">No posts yet</h3>
                <p className="text-gray-600">Be the first to post in r/{subredditData.name}</p>
              </div>
            ) : (
              posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Subreddit;
