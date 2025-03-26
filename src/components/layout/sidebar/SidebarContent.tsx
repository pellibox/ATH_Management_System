
import React from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Calendar, Settings, Users, Activity, Layout, 
  Dumbbell, User, Award, BookOpen
} from 'lucide-react';
import SidebarLogo from './SidebarLogo';
import SidebarLink from './SidebarLink';
import SidebarSubmenu from './SidebarSubmenu';

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
            to="/" 
            icon={Layout} 
            label="Dashboard" 
            isActive={isLinkActive('/')} 
            collapsed={collapsed} 
          />

          <SidebarSubmenu
            icon={Dumbbell}
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
            icon={Users}
            label="People"
            isActive={isLinkActive('/players') || isLinkActive('/coaches')}
            collapsed={collapsed}
            open={peopleOpen}
            onOpenChange={setPeopleOpen}
            currentPath={location.pathname}
            items={[
              { 
                label: 'Players', 
                path: '/players',
                icon: User 
              },
              { 
                label: 'Coaches', 
                path: '/coaches',
                icon: Award 
              },
            ]}
          />

          <SidebarSubmenu
            icon={Activity}
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
                icon: BookOpen 
              },
              { 
                label: 'Attività', 
                path: '/activities',
                icon: Activity 
              }
            ]}
          />

          <SidebarLink 
            to="/calendar" 
            icon={Calendar} 
            label="Calendar" 
            isActive={isLinkActive('/calendar')} 
            collapsed={collapsed} 
          />

          <SidebarLink 
            to="/settings" 
            icon={Settings} 
            label="Settings" 
            isActive={isLinkActive('/settings')} 
            collapsed={collapsed} 
          />
        </ul>
      </nav>
    </div>
  );
}
