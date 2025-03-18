
import { useState } from 'react';
import { ArrowBigDown, ArrowBigUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VoteButtonsProps {
  initialVotes: number;
  orientation?: 'vertical' | 'horizontal';
  size?: 'sm' | 'md' | 'lg';
  onVote?: (value: number) => void;
  className?: string;
}

export function VoteButtons({
  initialVotes,
  orientation = 'vertical',
  size = 'md',
  onVote,
  className
}: VoteButtonsProps) {
  const [votes, setVotes] = useState(initialVotes);
  const [userVote, setUserVote] = useState<1 | -1 | 0>(0);

  const handleVote = (value: 1 | -1) => {
    let newVote: 1 | -1 | 0;
    
    // If clicking the same button twice, remove the vote
    if (userVote === value) {
      newVote = 0;
      setVotes(votes - value);
    } else {
      // If changing vote from up to down or vice versa, adjust by 2
      if (userVote !== 0) {
        setVotes(votes + (value * 2));
      } else {
        setVotes(votes + value);
      }
      newVote = value;
    }
    
    setUserVote(newVote);
    onVote?.(newVote);
  };

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24
  };

  return (
    <div 
      className={cn(
        'flex items-center gap-1',
        orientation === 'vertical' ? 'flex-col py-2' : 'flex-row px-2',
        sizeClasses[size],
        className
      )}
    >
      <button
        onClick={() => handleVote(1)}
        className={cn(
          'p-1 rounded transition-colors duration-200',
          userVote === 1 ? 'text-reddit-orange hover:bg-orange-100' : 'text-gray-400 hover:text-gray-800 hover:bg-gray-100',
          'focus:outline-none focus:ring-2 focus:ring-reddit-orange focus:ring-opacity-50'
        )}
        aria-label="Upvote"
      >
        <ArrowBigUp size={iconSizes[size]} className={cn(
          userVote === 1 && 'animate-vote-up'
        )} />
      </button>
      
      <span className={cn(
        'font-medium transition-all duration-300',
        userVote === 1 ? 'text-reddit-orange' : userVote === -1 ? 'text-blue-600' : 'text-gray-800'
      )}>
        {votes}
      </span>
      
      <button
        onClick={() => handleVote(-1)}
        className={cn(
          'p-1 rounded transition-colors duration-200',
          userVote === -1 ? 'text-blue-600 hover:bg-blue-100' : 'text-gray-400 hover:text-gray-800 hover:bg-gray-100',
          'focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50'
        )}
        aria-label="Downvote"
      >
        <ArrowBigDown size={iconSizes[size]} className={cn(
          userVote === -1 && 'animate-vote-down'
        )} />
      </button>
    </div>
  );
}
