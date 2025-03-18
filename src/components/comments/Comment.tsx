
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Reply } from 'lucide-react';
import { VoteButtons } from '@/components/ui/VoteButtons';
import { Button } from '@/components/ui/button';
import { Comment as CommentType } from '@/lib/data';
import { cn } from '@/lib/utils';

interface CommentProps {
  comment: CommentType;
  level?: number;
  className?: string;
}

export function Comment({ comment, level = 0, className }: CommentProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  
  const timeSince = (dateString: string) => {
    const date = new Date(dateString);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + ' years ago';
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + ' months ago';
    
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + ' days ago';
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + ' hours ago';
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + ' minutes ago';
    
    return Math.floor(seconds) + ' seconds ago';
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  // Maximum nesting level
  const MAX_LEVEL = 4;
  const hasReplies = comment.replies && comment.replies.length > 0;
  
  return (
    <div
      className={cn(
        'animate-fade-in transition-all duration-300',
        isExpanded ? 'opacity-100' : 'opacity-60',
        className
      )}
    >
      <div className="flex">
        {/* Vote Buttons */}
        <VoteButtons
          initialVotes={comment.votes}
          orientation="vertical"
          size="sm"
          className="pt-2"
        />
        
        <div className="flex-1 pl-2">
          {/* Comment Header */}
          <div className="flex items-center gap-2 text-xs mb-1">
            {/* Author */}
            <Link
              to={`/user/${comment.author.username}`}
              className="font-medium hover:underline"
            >
              {comment.author.username}
            </Link>
            
            {/* Time */}
            <span className="text-gray-500">{timeSince(comment.createdAt)}</span>
          </div>
          
          {/* Comment Content */}
          <div className={cn(
            'text-sm text-gray-800 mb-2',
            !isExpanded && 'line-clamp-1'
          )}>
            {isExpanded ? comment.content : `${comment.content.substring(0, 100)}...`}
          </div>
          
          {/* Comment Actions */}
          <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
            <button
              onClick={toggleExpanded}
              className="hover:text-gray-700"
            >
              {isExpanded ? 'Collapse' : 'Expand'}
            </button>
            
            <button className="flex items-center gap-1 hover:text-gray-700">
              <Reply size={14} className="transform -scale-x-100" />
              Reply
            </button>
            
            {hasReplies && !isExpanded && (
              <button
                onClick={toggleExpanded}
                className="flex items-center gap-1 text-reddit-blue hover:text-reddit-orange"
              >
                <MessageSquare size={14} />
                {comment.replies?.length} replies
              </button>
            )}
          </div>
          
          {/* Replies */}
          {isExpanded && hasReplies && level < MAX_LEVEL && (
            <div className={cn(
              'pl-3 border-l-2',
              level === 0 ? 'border-reddit-blue' :
              level === 1 ? 'border-green-500' :
              level === 2 ? 'border-purple-500' :
              'border-orange-500'
            )}>
              {comment.replies?.map((reply) => (
                <Comment
                  key={reply.id}
                  comment={reply}
                  level={level + 1}
                  className="mt-3"
                />
              ))}
            </div>
          )}
          
          {/* Show "Continue Thread" for deep nesting */}
          {isExpanded && hasReplies && level >= MAX_LEVEL && (
            <div className="mt-2 pl-3">
              <Button
                variant="ghost"
                size="sm"
                className="text-reddit-blue hover:text-reddit-orange text-xs"
              >
                Continue this thread →
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
