
import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Calendar, Settings, Home, Users, BookOpen, Layers, Trophy, BarChart3, Video, Link, View, UserCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  isCollapsed: boolean;
}

interface SubNavItemProps {
  to: string;
  label: string;
  isCollapsed: boolean;
  sportType?: string;
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
          ? "bg-ath-red-clay/10 text-ath-red-clay font-medium" 
          : "text-gray-600 hover:bg-gray-100",
        isCollapsed ? "justify-center" : ""
      )}
    >
      <Icon className={cn("h-5 w-5", isActive ? "text-ath-red-clay" : "text-gray-500")} />
      {!isCollapsed && <span className="whitespace-nowrap">{label}</span>}
    </NavLink>
  );
};

const SubNavItem = ({ to, label, isCollapsed, sportType }: SubNavItemProps) => {
  const location = useLocation();
  const isActive = location.pathname === to && 
                   (sportType ? location.search === `?sport=${sportType}` : true);
  
  return (
    <NavLink
      to={sportType ? `${to}?sport=${sportType}` : to}
      className={({ isActive }) => cn(
        "flex items-center rounded-md px-3 py-2 text-sm transition-all duration-300 ml-8",
        isActive 
          ? "bg-ath-red-clay/10 text-ath-red-clay font-medium" 
          : "text-gray-600 hover:bg-gray-100",
        isCollapsed ? "justify-center ml-0" : ""
      )}
    >
      {!isCollapsed && <span className="whitespace-nowrap">{label}</span>}
    </NavLink>
  );
};

export default function Sidebar() {
  const isMobile = useIsMobile();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  
  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Calendario", href: "/calendar", icon: Calendar },
    { name: "Campi", href: "/courts", icon: Layers },
    { 
      name: "Visione Campo", 
      href: "/court-vision", 
      icon: View,
      submenu: [
        { name: "Tutti gli Sport", href: "/court-vision", sportType: "" },
        { name: "Tennis", href: "/court-vision", sportType: "tennis" },
        { name: "Padel", href: "/court-vision", sportType: "padel" },
        { name: "Pickleball", href: "/court-vision", sportType: "pickleball" },
        { name: "Touch Tennis", href: "/court-vision", sportType: "touchtennis" },
        { name: "Layout View", href: "/court-vision/layout", sportType: "" }
      ]
    },
    { name: "Staff", href: "/staff", icon: Users },
    { name: "Giocatori", href: "/players", icon: UserCircle },
    { name: "Programmi", href: "/programs", icon: BookOpen },
    { name: "Tornei", href: "/tournaments", icon: Trophy },
    { name: "Rapporti", href: "/reports", icon: BarChart3 },
    { name: "Video", href: "/videos", icon: Video },
    { name: "Integrazioni", href: "/integrations", icon: Link },
    { name: "Impostazioni", href: "/settings", icon: Settings },
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

  useEffect(() => {
    // Dispatch a custom event when sidebar state changes
    const event = new CustomEvent('sidebarStateChange', { detail: { isCollapsed } });
    window.dispatchEvent(event);
  }, [isCollapsed]);

  // Toggle submenu expansion
  const toggleSubmenu = (path: string) => {
    if (expandedMenus.includes(path)) {
      setExpandedMenus(expandedMenus.filter(menu => menu !== path));
    } else {
      setExpandedMenus([...expandedMenus, path]);
    }
  };

  // Check if submenu is expanded
  const isSubmenuExpanded = (path: string) => {
    return expandedMenus.includes(path) || location.pathname.startsWith(path);
  };

  if (!mounted) return null; // Prevent hydration mismatch
  
  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 z-20 flex h-full flex-col border-r bg-white shadow-soft transition-all duration-300",
        isCollapsed ? "w-16 p-2" : "w-64 p-4"
      )}
      data-collapsed={isCollapsed ? "true" : "false"}
    >
      <div className="flex items-center justify-between mb-6 md:mb-8">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-ath-red-clay">ATH</span>
            <span className="text-xl font-medium">Sistema</span>
          </div>
        )}
        {!isMobile && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="rounded-full p-1 hover:bg-gray-100"
            aria-label={isCollapsed ? "Espandi sidebar" : "Comprimi sidebar"}
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
          <div key={item.href}>
            {item.submenu ? (
              <>
                <div 
                  className={cn(
                    "flex items-center justify-between gap-3 rounded-md px-3 py-2 text-sm cursor-pointer transition-all duration-300",
                    location.pathname.startsWith(item.href)
                      ? "bg-ath-red-clay/10 text-ath-red-clay font-medium" 
                      : "text-gray-600 hover:bg-gray-100",
                    isCollapsed ? "justify-center" : ""
                  )}
                  onClick={() => !isCollapsed && toggleSubmenu(item.href)}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={cn("h-5 w-5", location.pathname.startsWith(item.href) ? "text-ath-red-clay" : "text-gray-500")} />
                    {!isCollapsed && <span className="whitespace-nowrap">{item.name}</span>}
                  </div>
                  {!isCollapsed && (
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      className={cn("transition-transform", isSubmenuExpanded(item.href) ? "rotate-180" : "")}
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  )}
                </div>
                
                {/* Submenu items */}
                {(isSubmenuExpanded(item.href) || isCollapsed) && (
                  <div className={cn("mt-1 space-y-1", isCollapsed ? "text-center" : "")}>
                    {item.submenu.map((subItem) => (
                      <SubNavItem 
                        key={`${subItem.href}-${subItem.sportType}`} 
                        to={subItem.href} 
                        label={subItem.name} 
                        isCollapsed={isCollapsed}
                        sportType={subItem.sportType} 
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <NavItem 
                to={item.href}
                icon={item.icon}
                label={item.name}
                isCollapsed={isCollapsed}
              />
            )}
          </div>
        ))}
      </nav>
      
      <div className="mt-auto pt-3 md:pt-4 border-t">
        <NavItem to="/settings" icon={Settings} label="Impostazioni" isCollapsed={isCollapsed} />
      </div>
    </aside>
  );
}
