
import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Bell, Mail, User, ChevronDown } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';

export function Header() {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle click outside search
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-30 transition-all duration-300',
      'py-2 px-4 md:px-6',
      'bg-white',
      scrolled ? 'shadow-md' : 'shadow-sm',
      'ml-0 md:ml-16',
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between h-12">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-reddit-orange rounded-full flex items-center justify-center text-white font-bold">
            r
          </div>
          <span className="font-semibold hidden sm:inline">Reddit Clone</span>
        </Link>

        {/* Search Bar */}
        <div 
          ref={searchRef}
          className={cn(
            'relative max-w-md w-full mx-4 transition-all duration-300 ease-out-expo',
            isSearchFocused ? 'scale-105' : 'scale-100'
          )}
        >
          <div className={cn(
            'absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400',
            isSearchFocused && 'text-reddit-orange'
          )}>
            <Search size={18} />
          </div>
          <Input
            type="search"
            placeholder="Search Reddit"
            className={cn(
              'w-full pl-10 py-2 bg-gray-100 border-gray-200',
              'rounded-full text-sm',
              'transition-all duration-300 ease-out-expo',
              'focus:border-reddit-orange focus:ring-reddit-orange/20 focus:ring-4 focus:bg-white',
              'placeholder:text-gray-500'
            )}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <div className="hidden md:flex gap-1">
            <Button variant="ghost" size="icon" className="rounded-full" aria-label="Notifications">
              <Bell size={20} />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full" aria-label="Messages">
              <Mail size={20} />
            </Button>
          </div>
          
          <Button 
            variant="ghost" 
            className="hidden sm:flex items-center gap-2 hover:bg-gray-100"
          >
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <User size={16} />
            </div>
            <span className="text-sm font-medium">Sign In</span>
            <ChevronDown size={16} />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full sm:hidden"
            aria-label="User Menu"
          >
            <User size={20} />
          </Button>
        </div>
      </div>
    </header>
  );
}
