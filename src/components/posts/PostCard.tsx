import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowBigUp, ArrowBigDown, MessageSquare, Share } from 'lucide-react';
import { cn } from '@/lib/utils';
import { postsAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

export interface PostCardProps {
  post: {
    _id: string;
    title: string;
    content: string;
    author: {
      _id: string;
      username: string;
    };
    subreddit: {
      _id: string;
      name: string;
    };
    votes: number;
    commentCount: number;
    createdAt: string;
    image?: string;
    userVote?: number;
  };
}

export const PostCard = ({ post }: PostCardProps) => {
  const { isAuthenticated, openAuthModal } = useAuth();
  const [voteCount, setVoteCount] = useState(post.votes);
  const [userVote, setUserVote] = useState<number | undefined>(post.userVote);
  
  const handleVote = async (vote: 1 | -1) => {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    
    try {
      // If user is clicking the same vote button again, remove their vote
      const newVote = userVote === vote ? 0 : vote;
      
      // Calculate the vote difference
      let diff = 0;
      if (userVote === undefined && newVote !== 0) {
        diff = newVote;
      } else if (userVote !== undefined && newVote === 0) {
        diff = -userVote;
      } else if (userVote !== undefined && newVote !== 0 && userVote !== newVote) {
        diff = newVote * 2; // Switching from upvote to downvote or vice versa
      }
      
      // Optimistically update UI
      setVoteCount(prevCount => prevCount + diff);
      setUserVote(newVote === 0 ? undefined : newVote);
      
      // Send API request
      await postsAPI.votePost(post._id, vote);
    } catch (error) {
      console.error('Failed to vote:', error);
      // Revert on error
      setVoteCount(post.votes);
      setUserVote(post.userVote);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:border-gray-300">
      <div className="flex">
        {/* Vote buttons */}
        <div className="w-10 bg-gray-50 rounded-l-lg flex flex-col items-center py-2">
          <button 
            onClick={() => handleVote(1)}
            className={cn(
              "p-1 rounded hover:bg-gray-200",
              userVote === 1 && "text-orange-500"
            )}
            aria-label="Upvote"
          >
            <ArrowBigUp size={18} />
          </button>
          
          <span className="text-xs font-medium my-1">{voteCount}</span>
          
          <button 
            onClick={() => handleVote(-1)}
            className={cn(
              "p-1 rounded hover:bg-gray-200",
              userVote === -1 && "text-blue-500"
            )}
            aria-label="Downvote"
          >
            <ArrowBigDown size={18} />
          </button>
        </div>
        
        {/* Post content */}
        <div className="p-3 flex-1">
          {/* Post metadata */}
          <div className="flex items-center text-xs text-gray-500 mb-2">
            <Link 
              to={`/r/${post.subreddit.name}`} 
              className="font-medium text-black hover:underline"
            >
              r/{post.subreddit.name}
            </Link>
            <span className="mx-1">•</span>
            <span>Posted by</span>
            <Link 
              to={`/user/${post.author.username}`} 
              className="ml-1 hover:underline"
            >
              u/{post.author.username}
            </Link>
            <span className="mx-1">•</span>
            <span>
              {new Date(post.createdAt).toLocaleDateString()}
            </span>
          </div>
          
          {/* Post title */}
          <Link to={`/post/${post._id}`}>
            <h2 className="text-lg font-medium mb-2 hover:underline">
              {post.title}
            </h2>
          </Link>
          
          {/* Post content */}
          <div className="mb-3">
            <p className="text-gray-800 line-clamp-3">
              {post.content}
            </p>
          </div>
          
          {/* Post image if exists */}
          {post.image && (
            <div className="mb-3">
              <img 
                src={post.image} 
                alt={post.title}
                className="max-h-96 rounded object-contain"
              />
            </div>
          )}
          
          {/* Post actions */}
          <div className="flex items-center text-gray-500 text-sm">
            <Link 
              to={`/post/${post._id}`}
              className="flex items-center hover:bg-gray-100 rounded-full px-2 py-1"
            >
              <MessageSquare size={16} className="mr-1" />
              <span>{post.commentCount} Comments</span>
            </Link>
            
            <button className="flex items-center hover:bg-gray-100 rounded-full px-2 py-1 ml-2">
              <Share size={16} className="mr-1" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
