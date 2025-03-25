
import { useState, useEffect } from 'react';
import { Bell, User, Search, Mail, Sun, Moon, Menu, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface HeaderProps {
  toggleSidebar: () => void;
  sidebarCollapsed: boolean;
}

export default function Header({ toggleSidebar, sidebarCollapsed }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [showSearch, setShowSearch] = useState(false);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
    // In a real implementation, we would also update the document class or CSS variables
  };
  
  return (
    <header className={cn(
      "sticky top-0 z-10 w-full transition-all duration-300",
      scrolled 
        ? "bg-white/80 backdrop-blur-md shadow-sm" 
        : "bg-transparent"
    )}>
      <div className="flex h-14 md:h-16 items-center justify-between px-3 md:px-6">
        <div className="flex items-center gap-2">
          {!isMobile && (
            <button
              onClick={toggleSidebar}
              className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-full transition-colors hidden md:flex"
              aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {sidebarCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            </button>
          )}
          
          {isMobile ? (
            <button 
              className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
              onClick={() => setShowSearch(!showSearch)}
            >
              <Search className="h-5 w-5" />
            </button>
          ) : (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="search"
                placeholder="Search..."
                className="h-9 w-48 md:w-64 rounded-full bg-gray-100 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ath-blue/20"
              />
            </div>
          )}
        </div>
        
        {showSearch && isMobile && (
          <div className="absolute top-14 left-0 right-0 bg-white p-3 shadow-md z-30">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="search"
                placeholder="Search..."
                className="h-9 w-full rounded-full bg-gray-100 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ath-blue/20"
                autoFocus
              />
            </div>
          </div>
        )}
        
        <div className="flex items-center gap-1 md:gap-4">
          <button 
            className="rounded-full p-1.5 md:p-2 text-gray-500 hover:bg-gray-100 transition-colors"
            onClick={toggleTheme}
          >
            {theme === 'light' ? (
              <Moon className="h-4 w-4 md:h-5 md:w-5" />
            ) : (
              <Sun className="h-4 w-4 md:h-5 md:w-5" />
            )}
          </button>
          
          <button className="relative rounded-full p-1.5 md:p-2 text-gray-500 hover:bg-gray-100 transition-colors">
            <Mail className="h-4 w-4 md:h-5 md:w-5" />
            <span className="absolute top-1 md:top-1.5 right-1 md:right-1.5 h-1.5 md:h-2 w-1.5 md:w-2 rounded-full bg-ath-orange"></span>
          </button>
          
          <button className="relative rounded-full p-1.5 md:p-2 text-gray-500 hover:bg-gray-100 transition-colors">
            <Bell className="h-4 w-4 md:h-5 md:w-5" />
            <span className="absolute top-1 md:top-1.5 right-1 md:right-1.5 h-1.5 md:h-2 w-1.5 md:w-2 rounded-full bg-ath-blue"></span>
          </button>
          
          <div className="flex items-center gap-2 md:gap-3">
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium">Marco Rossi</p>
              <p className="text-xs text-gray-500">Head Coach</p>
            </div>
            <div className="h-8 w-8 md:h-9 md:w-9 rounded-full bg-ath-blue-light flex items-center justify-center text-ath-blue font-medium text-xs md:text-sm">
              MR
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
