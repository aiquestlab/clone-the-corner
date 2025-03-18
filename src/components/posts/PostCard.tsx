
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Share2 } from 'lucide-react';
import { VoteButtons } from '@/components/ui/VoteButtons';
import { Button } from '@/components/ui/button';
import { Post } from '@/lib/data';
import { cn } from '@/lib/utils';

interface PostCardProps {
  post: Post;
  showFullContent?: boolean;
  className?: string;
}

export function PostCard({ post, showFullContent = false, className }: PostCardProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  
  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  
  const formattedComments = post.commentCount > 999 
    ? `${(post.commentCount / 1000).toFixed(1)}k` 
    : post.commentCount;

  return (
    <div className={cn(
      'bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden',
      'transition-all duration-300 ease-out-expo hover-scale hover:shadow-md',
      className
    )}>
      <div className="flex">
        {/* Vote Buttons */}
        <VoteButtons
          initialVotes={post.votes}
          orientation="vertical"
          className="bg-gray-50"
        />
          
        {/* Content */}
        <div className="flex-1 p-3">
          {/* Post Header */}
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
            {/* Subreddit */}
            <Link to={`/r/${post.subreddit}`} className="font-medium text-black hover:underline">
              r/{post.subreddit}
            </Link>
            
            <span>•</span>
            
            {/* Author */}
            <span>Posted by <Link to={`/user/${post.author.username}`} className="hover:underline">
              u/{post.author.username}
            </Link></span>
            
            <span>•</span>
            
            {/* Date */}
            <span>{formattedDate}</span>
          </div>
          
          {/* Title */}
          <Link to={`/post/${post.id}`}>
            <h2 className="text-lg font-medium text-gray-900 mb-2 hover:text-reddit-blue transition-colors">
              {post.title}
            </h2>
          </Link>
          
          {/* Content */}
          <div className="mb-3">
            {showFullContent ? (
              <p className="text-gray-800">{post.content}</p>
            ) : (
              <p className="text-gray-800 line-clamp-3">{post.content}</p>
            )}
          </div>
          
          {/* Post Image */}
          {post.image && (
            <Link to={`/post/${post.id}`} className="block mb-3">
              <div className="relative rounded-md overflow-hidden bg-gray-100 aspect-video">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className={cn(
                    'w-full h-full object-cover transition-opacity duration-500',
                    isImageLoaded ? 'opacity-100' : 'opacity-0'
                  )}
                  onLoad={() => setIsImageLoaded(true)}
                />
                {!isImageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 border-4 border-gray-200 border-t-reddit-orange rounded-full animate-spin" />
                  </div>
                )}
              </div>
            </Link>
          )}
          
          {/* Actions */}
          <div className="flex items-center gap-4 text-gray-500">
            <Link 
              to={`/post/${post.id}`}
              className="flex items-center gap-1 hover:bg-gray-100 rounded-full py-1 px-2 transition-colors"
            >
              <MessageSquare size={18} />
              <span className="text-xs">{formattedComments} Comments</span>
            </Link>
            
            <Button variant="ghost" size="sm" className="rounded-full h-8 gap-1 text-xs">
              <Share2 size={16} />
              <span>Share</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
