
import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Calendar, Settings, Home, Users, BookOpen, MapPin, ChartBar, Video, Award, GitMerge, Layers, Trophy, BarChart3, Link } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  isCollapsed: boolean;
}

const NavItem = ({ to, icon: Icon, label, isCollapsed }: NavItemProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <NavLink
      to={to}
      className={({ isActive }) => cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all duration-300",
        isActive 
          ? "bg-ath-blue-light text-ath-blue font-medium" 
          : "text-gray-600 hover:bg-gray-100",
        isCollapsed ? "justify-center" : ""
      )}
    >
      <Icon className={cn("h-5 w-5", isActive ? "text-ath-blue" : "text-gray-500")} />
      {!isCollapsed && <span className="whitespace-nowrap">{label}</span>}
    </NavLink>
  );
};

export default function Sidebar() {
  const isMobile = useIsMobile();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Calendar", href: "/calendar", icon: Calendar },
    { name: "Courts", href: "/courts", icon: Layers },
    { name: "Court Vision", href: "/court-vision", icon: ChartBar },
    { name: "Staff", href: "/staff", icon: Users },
    { name: "Programs", href: "/programs", icon: BookOpen },
    { name: "Tournaments", href: "/tournaments", icon: Trophy },
    { name: "Reports", href: "/reports", icon: BarChart3 },
    { name: "Videos", href: "/videos", icon: Video },
    { name: "Integrations", href: "/integrations", icon: Link },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  // Handle window resize to collapse sidebar on mobile
  useEffect(() => {
    setMounted(true);
    
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (!mounted) return null; // Prevent hydration mismatch
  
  return (
    <aside className={cn(
      "fixed left-0 top-0 z-20 flex h-full flex-col border-r bg-white shadow-soft transition-all duration-300",
      isCollapsed ? "w-16 p-2" : "w-64 p-4"
    )}>
      <div className="flex items-center justify-between mb-6 md:mb-8">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-ath-blue">ATH</span>
            <span className="text-xl font-medium">System</span>
          </div>
        )}
        {!isMobile && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="rounded-full p-1 hover:bg-gray-100"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                <path d="m9 18 6-6-6-6" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                <path d="m15 18-6-6 6-6" />
              </svg>
            )}
          </button>
        )}
      </div>
      
      <nav className="space-y-1 flex-1 overflow-y-auto">
        {navigation.map((item) => (
          <NavItem key={item.href} to={item.href} icon={item.icon} label={item.name} isCollapsed={isCollapsed} />
        ))}
      </nav>
      
      <div className="mt-auto pt-3 md:pt-4 border-t">
        <NavItem to="/settings" icon={Settings} label="Settings" isCollapsed={isCollapsed} />
      </div>
    </aside>
  );
}
