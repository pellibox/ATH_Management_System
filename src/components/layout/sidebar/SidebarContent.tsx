
import React from 'react';
import { useLocation } from 'react-router-dom';
import { 
  LayoutGrid,
  CalendarDays,
  Settings,
  Activity,
  BookOpen,
  Users,
  UserCog
} from 'lucide-react';
import SidebarLogo from './SidebarLogo';
import SidebarLink from './SidebarLink';
import SidebarSubmenu from './SidebarSubmenu';

// Create a React forwardRef component to match Lucide icon shape
const TennisBallIcon = React.forwardRef<SVGSVGElement, React.ComponentPropsWithoutRef<'svg'>>((props, ref) => (
  <span className="flex items-center justify-center" {...props}>
    <img 
      src="/lovable-uploads/c5b8ef71-836a-4093-9cc3-8aa9a53b59f3.png" 
      alt="Tennis Ball" 
      className="w-5 h-5 flex-shrink-0"
    />
  </span>
));
TennisBallIcon.displayName = 'TennisBallIcon';

interface SidebarContentProps {
  collapsed: boolean;
  toggleSidebar: () => void;
  courtsOpen: boolean;
  setCourtsOpen: (open: boolean) => void;
  peopleOpen: boolean;
  setPeopleOpen: (open: boolean) => void;
  activitiesOpen: boolean;
  setActivitiesOpen: (open: boolean) => void;
}

export default function SidebarContent({
  collapsed,
  toggleSidebar,
  courtsOpen,
  setCourtsOpen,
  peopleOpen,
  setPeopleOpen,
  activitiesOpen,
  setActivitiesOpen
}: SidebarContentProps) {
  const location = useLocation();

  const isLinkActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <div className="flex flex-col h-full">
      <SidebarLogo collapsed={collapsed} toggleSidebar={toggleSidebar} />

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          <SidebarLink 
            to="/dashboard" 
            icon={TennisBallIcon}
            label="Dashboard" 
            isActive={isLinkActive('/dashboard')} 
            collapsed={collapsed} 
          />

          <SidebarSubmenu
            icon={TennisBallIcon}
            label="Court Vision"
            isActive={isLinkActive('/court-vision')}
            collapsed={collapsed}
            open={courtsOpen}
            onOpenChange={setCourtsOpen}
            currentPath={location.pathname}
            searchParams={location.search}
            items={[
              { label: 'All Courts', path: '/court-vision' },
              { label: 'Tennis', path: '/court-vision?sport=tennis' },
              { label: 'Padel', path: '/court-vision?sport=padel' },
              { label: 'Pickleball', path: '/court-vision?sport=pickleball' },
              { label: 'Touch Tennis', path: '/court-vision?sport=touchtennis' },
            ]}
          />

          <SidebarSubmenu
            icon={TennisBallIcon}
            label="Persone"
            isActive={isLinkActive('/players') || isLinkActive('/coaches')}
            collapsed={collapsed}
            open={peopleOpen}
            onOpenChange={setPeopleOpen}
            currentPath={location.pathname}
            items={[
              { 
                label: 'Giocatori', 
                path: '/players',
                icon: TennisBallIcon 
              },
              { 
                label: 'Allenatori', 
                path: '/coaches',
                icon: TennisBallIcon 
              }
            ]}
          />

          <SidebarSubmenu
            icon={TennisBallIcon}
            label="Programmi e Attività"
            isActive={isLinkActive('/activities') || isLinkActive('/programs')}
            collapsed={collapsed}
            open={activitiesOpen}
            onOpenChange={setActivitiesOpen}
            currentPath={location.pathname}
            items={[
              { 
                label: 'Programmi', 
                path: '/programs',
                icon: TennisBallIcon 
              },
              { 
                label: 'Attività', 
                path: '/activities',
                icon: TennisBallIcon 
              }
            ]}
          />

          <SidebarLink 
            to="/calendar" 
            icon={TennisBallIcon}
            label="Calendar" 
            isActive={isLinkActive('/calendar')} 
            collapsed={collapsed} 
          />

          <SidebarLink 
            to="/settings" 
            icon={TennisBallIcon} 
            label="Settings" 
            isActive={isLinkActive('/settings')} 
            collapsed={collapsed} 
          />
        </ul>
      </nav>
    </div>
  );
}
