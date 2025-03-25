
import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Calendar, 
  Settings, 
  Home, 
  Users, 
  BookOpen, 
  Layers, 
  Trophy, 
  BarChart3, 
  Video, 
  Link as LinkIcon, 
  View, 
  UserCircle,
  ChevronRight,
  ChevronLeft,
  MenuIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

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
        "flex items-center rounded-md px-3 py-2 text-sm transition-all duration-300",
        isActive 
          ? "bg-ath-red-clay/10 text-ath-red-clay font-medium" 
          : "text-gray-600 hover:bg-gray-100",
        isCollapsed ? "justify-center ml-0" : "ml-8"
      )}
    >
      {!isCollapsed && <span className="whitespace-nowrap">{label}</span>}
    </NavLink>
  );
};

export default function Sidebar() {
  const isMobile = useIsMobile();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
    { name: "Integrazioni", href: "/integrations", icon: LinkIcon },
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

    // Close mobile menu when route changes
    if (isMobile) {
      setIsMenuOpen(false);
    }
  }, [isCollapsed, location.pathname, isMobile]);

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

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobileMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  if (!mounted) return null; // Prevent hydration mismatch
  
  if (isMobile) {
    return (
      <>
        <button 
          onClick={toggleMobileMenu}
          className="fixed top-4 left-4 z-50 md:hidden bg-white p-2 rounded-md shadow-md"
          aria-label="Toggle menu"
        >
          <MenuIcon className="h-6 w-6 text-gray-600" />
        </button>
        
        <aside 
          className={cn(
            "fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out",
            isMenuOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-ath-red-clay">ATH</span>
              <span className="text-xl font-medium">Sistema</span>
            </div>
            <button
              onClick={toggleMobileMenu}
              className="rounded-full p-1 hover:bg-gray-100"
              aria-label="Close menu"
            >
              <ChevronLeft className="h-6 w-6 text-gray-500" />
            </button>
          </div>
          
          <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-4rem)]">
            {navigation.map((item) => (
              <div key={item.href}>
                {item.submenu ? (
                  <Collapsible 
                    open={isSubmenuExpanded(item.href)} 
                    onOpenChange={() => toggleSubmenu(item.href)}
                  >
                    <div className="flex items-center justify-between">
                      <NavLink
                        to={item.href}
                        className={({ isActive }) => cn(
                          "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all duration-300 flex-grow",
                          isActive || location.pathname.startsWith(item.href)
                            ? "bg-ath-red-clay/10 text-ath-red-clay font-medium" 
                            : "text-gray-600 hover:bg-gray-100"
                        )}
                      >
                        <item.icon className={cn(
                          "h-5 w-5", 
                          location.pathname.startsWith(item.href) ? "text-ath-red-clay" : "text-gray-500"
                        )} />
                        <span>{item.name}</span>
                      </NavLink>
                      <CollapsibleTrigger className="px-2 py-1 rounded-md hover:bg-gray-100">
                        {isSubmenuExpanded(item.href) ? (
                          <ChevronRight className="h-4 w-4 transform rotate-90 text-gray-500" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-gray-500" />
                        )}
                      </CollapsibleTrigger>
                    </div>
                    <CollapsibleContent>
                      <div className="mt-1 ml-6 space-y-1 border-l pl-2">
                        {item.submenu.map((subItem) => (
                          <NavLink
                            key={`${subItem.href}-${subItem.sportType || 'default'}`}
                            to={subItem.sportType ? `${subItem.href}?sport=${subItem.sportType}` : subItem.href}
                            className={({ isActive }) => cn(
                              "flex items-center rounded-md px-3 py-2 text-sm transition-all",
                              (isActive || 
                                (location.pathname === subItem.href && 
                                  (subItem.sportType ? location.search === `?sport=${subItem.sportType}` : !location.search)))
                                ? "bg-ath-red-clay/10 text-ath-red-clay font-medium" 
                                : "text-gray-600 hover:bg-gray-100"
                            )}
                          >
                            <span>{subItem.name}</span>
                          </NavLink>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ) : (
                  <NavLink
                    to={item.href}
                    className={({ isActive }) => cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all duration-300",
                      isActive 
                        ? "bg-ath-red-clay/10 text-ath-red-clay font-medium" 
                        : "text-gray-600 hover:bg-gray-100"
                    )}
                  >
                    <item.icon className={cn("h-5 w-5", location.pathname === item.href ? "text-ath-red-clay" : "text-gray-500")} />
                    <span>{item.name}</span>
                  </NavLink>
                )}
              </div>
            ))}
          </nav>
        </aside>
      </>
    );
  }
  
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

        <button
          onClick={toggleSidebar}
          className="rounded-full p-1 hover:bg-gray-100"
          aria-label={isCollapsed ? "Espandi sidebar" : "Comprimi sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronLeft className="h-5 w-5 text-gray-500" />
          )}
        </button>
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
                    <ChevronRight className={cn(
                      "h-4 w-4 transition-transform",
                      isSubmenuExpanded(item.href) ? "rotate-90" : ""
                    )} />
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
