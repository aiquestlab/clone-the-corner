
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Share2, Bookmark, Flag } from 'lucide-react';
import { VoteButtons } from '@/components/ui/VoteButtons';
import { Comment } from '@/components/comments/Comment';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { getPostById, getCommentsForPost, Post as PostType, Comment as CommentType } from '@/lib/data';
import { cn } from '@/lib/utils';

export function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<PostType | null>(null);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  
  useEffect(() => {
    if (id) {
      // Simulate loading delay for a smoother experience
      setIsLoading(true);
      setTimeout(() => {
        const postData = getPostById(id);
        const commentsData = getCommentsForPost(id);
        
        if (postData) {
          setPost(postData);
          setComments(commentsData);
        }
        
        setIsLoading(false);
      }, 500);
    }
  }, [id]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-reddit-orange rounded-full animate-spin" />
      </div>
    );
  }
  
  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Post Not Found</h1>
        <p className="text-gray-600 mb-6">The post you're looking for doesn't exist or has been removed.</p>
        <Link to="/">
          <Button>Return to Home</Button>
        </Link>
      </div>
    );
  }
  
  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="animate-fade-in">
      <div className="pb-4 mb-4 border-b">
        <Link to="/" className="inline-flex items-center gap-1 text-gray-500 mb-4 hover:text-gray-700 transition-colors">
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </Link>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex">
            {/* Vote Buttons */}
            <VoteButtons
              initialVotes={post.votes}
              orientation="vertical"
              className="bg-gray-50 py-4"
            />
              
            {/* Content */}
            <div className="flex-1 p-4">
              {/* Post Header */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mb-3">
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
                <span title={formattedDate}>{formattedDate}</span>
              </div>
              
              {/* Title */}
              <h1 className="text-2xl font-semibold text-gray-900 mb-4">
                {post.title}
              </h1>
              
              {/* Content */}
              <div className="mb-4">
                <p className="text-gray-800 whitespace-pre-line">{post.content}</p>
              </div>
              
              {/* Post Image */}
              {post.image && (
                <div className="mb-4">
                  <div className="relative rounded-md overflow-hidden bg-gray-100">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className={cn(
                        'w-full object-contain max-h-[70vh] transition-opacity duration-500',
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
                </div>
              )}
              
              {/* Actions */}
              <div className="flex flex-wrap items-center gap-2 text-gray-500">
                <Button variant="ghost" size="sm" className="rounded-full h-8 gap-1">
                  <Share2 size={16} />
                  <span>Share</span>
                </Button>
                
                <Button variant="ghost" size="sm" className="rounded-full h-8 gap-1">
                  <Bookmark size={16} />
                  <span>Save</span>
                </Button>
                
                <Button variant="ghost" size="sm" className="rounded-full h-8 gap-1">
                  <Flag size={16} />
                  <span>Report</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Comment Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
        <h3 className="text-base font-medium mb-3">Comment as <span className="text-reddit-blue">guest</span></h3>
        <Textarea 
          placeholder="What are your thoughts?" 
          className="w-full mb-3 focus:border-reddit-blue focus:ring-reddit-blue/20"
        />
        <div className="flex justify-end">
          <Button>Comment</Button>
        </div>
      </div>
      
      {/* Comments List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="mb-4 pb-2 border-b">
          <h2 className="text-base font-medium">{comments.length} Comments</h2>
        </div>
        
        <div className="space-y-4">
          {comments.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <p>No comments yet. Be the first to comment!</p>
            </div>
          ) : (
            comments.map((comment) => (
              <Comment key={comment.id} comment={comment} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
