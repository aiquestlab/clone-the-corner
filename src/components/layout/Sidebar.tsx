
import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Home, Compass, Rocket, TrendingUp, Bookmark, Award, Settings, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { subreddits } from '@/lib/data';

export function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobileVisible, setIsMobileVisible] = useState(false);
  const location = useLocation();

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileVisible(false);
  }, [location.pathname]);

  // Close mobile sidebar on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && isMobileVisible) {
        setIsMobileVisible(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileVisible]);

  const topItems = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'Popular', icon: TrendingUp, path: '/popular' },
    { name: 'All', icon: Compass, path: '/all' },
    { name: 'Rising', icon: Rocket, path: '/rising' }
  ];

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleMobileSidebar = () => {
    setIsMobileVisible(!isMobileVisible);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileVisible && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden animate-fade-in"
          onClick={() => setIsMobileVisible(false)}
        />
      )}

      {/* Mobile Toggle Button */}
      <button
        onClick={toggleMobileSidebar}
        className="fixed left-4 top-4 z-50 p-2 bg-white rounded-full shadow-md md:hidden"
        aria-label="Toggle Sidebar"
      >
        {isMobileVisible ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 h-full bg-white shadow-md z-50 transition-all duration-300 ease-out-expo',
          'flex flex-col overflow-hidden',
          isExpanded ? 'w-64' : 'w-16',
          isMobileVisible ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
          'animate-fade-in'
        )}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <div className={cn(
            'flex items-center gap-2 transition-opacity duration-300',
            isExpanded ? 'opacity-100' : 'opacity-0'
          )}>
            <div className="w-8 h-8 bg-reddit-orange rounded-full flex items-center justify-center text-white font-bold">
              r
            </div>
            <span className="font-semibold">Reddit Clone</span>
          </div>
          
          <button 
            onClick={toggleSidebar}
            className="p-1 text-gray-500 hover:text-gray-700 rounded-full hidden md:block"
            aria-label={isExpanded ? 'Collapse Sidebar' : 'Expand Sidebar'}
          >
            {isExpanded ? (
              <ChevronLeftIcon className="w-5 h-5" />
            ) : (
              <ChevronRightIcon className="w-5 h-5" />
            )}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <nav className="p-2">
            <div className="mb-6">
              <div className={cn(
                'text-xs font-medium text-gray-500 px-4 py-2',
                !isExpanded && 'sr-only'
              )}>
                FEEDS
              </div>
              <ul className="space-y-1">
                {topItems.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      className={cn(
                        'flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200',
                        'hover:bg-gray-100',
                        location.pathname === item.path ? 'bg-gray-100 text-reddit-orange' : 'text-gray-700',
                        !isExpanded && 'justify-center'
                      )}
                    >
                      <item.icon size={20} />
                      {isExpanded && <span>{item.name}</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-6">
              <div className={cn(
                'text-xs font-medium text-gray-500 px-4 py-2',
                !isExpanded && 'sr-only'
              )}>
                TOP COMMUNITIES
              </div>
              <ul className="space-y-1">
                {subreddits.slice(0, 5).map((subreddit) => (
                  <li key={subreddit.id}>
                    <Link
                      to={`/r/${subreddit.name}`}
                      className={cn(
                        'flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200',
                        'hover:bg-gray-100 text-gray-700',
                        !isExpanded && 'justify-center'
                      )}
                    >
                      {subreddit.icon ? (
                        <img 
                          src={subreddit.icon} 
                          alt={subreddit.name} 
                          className="w-5 h-5 rounded-full"
                        />
                      ) : (
                        <div className="w-5 h-5 bg-reddit-orange rounded-full" />
                      )}
                      {isExpanded && (
                        <span className="truncate">r/{subreddit.name}</span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>

        <div className="p-2 border-t">
          <div className={cn(
            'flex items-center gap-3 px-4 py-2 rounded-lg transition-all hover:bg-gray-100 text-gray-700',
            !isExpanded && 'justify-center'
          )}>
            <Settings size={20} />
            {isExpanded && <span>Settings</span>}
          </div>
        </div>
      </aside>
    </>
  );
}

// Custom icons as most basic shapes
function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}
