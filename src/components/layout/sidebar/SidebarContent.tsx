
import React from 'react';
import { useLocation } from 'react-router-dom';
import { 
  LayoutGrid,
  DumbbellIcon,
  CalendarDays,
  Settings,
  Activity,
  BookOpen,
  Users,
  UserCog,
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

  // Use red clay color for active items
  const activeClasses = "bg-ath-red-clay/20 text-ath-red-clay font-medium";

  return (
    <div className="flex flex-col h-full">
      <SidebarLogo collapsed={collapsed} toggleSidebar={toggleSidebar} />

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          <SidebarLink 
            to="/dashboard" 
            icon={LayoutGrid}
            label="Dashboard" 
            isActive={isLinkActive('/dashboard')} 
            collapsed={collapsed}
            activeClass={activeClasses}
          />

          <SidebarSubmenu
            icon={DumbbellIcon}
            label="Court Vision"
            isActive={isLinkActive('/court-vision')}
            collapsed={collapsed}
            open={courtsOpen}
            onOpenChange={setCourtsOpen}
            currentPath={location.pathname}
            searchParams={location.search}
            activeClass={activeClasses}
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
            label="Persone"
            isActive={isLinkActive('/players') || isLinkActive('/coaches')}
            collapsed={collapsed}
            open={peopleOpen}
            onOpenChange={setPeopleOpen}
            currentPath={location.pathname}
            activeClass={activeClasses}
            items={[
              { 
                label: 'Giocatori', 
                path: '/players',
                icon: Users 
              },
              { 
                label: 'Allenatori', 
                path: '/coaches',
                icon: UserCog 
              }
            ]}
          />

          <SidebarSubmenu
            icon={Activity}
            label="Programmi e Attività"
            isActive={isLinkActive('/activities') || isLinkActive('/programs') || isLinkActive('/tournaments') || isLinkActive('/extra-activities')}
            collapsed={collapsed}
            open={activitiesOpen}
            onOpenChange={setActivitiesOpen}
            currentPath={location.pathname}
            activeClass={activeClasses}
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
              },
              { 
                label: 'Tornei', 
                path: '/tournaments',
                icon: Activity 
              },
              { 
                label: 'Attività Extra', 
                path: '/extra-activities',
                icon: Activity 
              }
            ]}
          />

          <SidebarLink 
            to="/calendar" 
            icon={CalendarDays}
            label="Calendar" 
            isActive={isLinkActive('/calendar')} 
            collapsed={collapsed}
            activeClass={activeClasses}
          />
          
          <SidebarLink 
            to="/reports" 
            icon={Activity}
            label="Reports" 
            isActive={isLinkActive('/reports')} 
            collapsed={collapsed}
            activeClass={activeClasses}
          />
          
          <SidebarLink 
            to="/videos" 
            icon={Activity}
            label="Videos" 
            isActive={isLinkActive('/videos')} 
            collapsed={collapsed}
            activeClass={activeClasses}
          />

          <SidebarLink 
            to="/settings" 
            icon={Settings} 
            label="Settings" 
            isActive={isLinkActive('/settings')} 
            collapsed={collapsed}
            activeClass={activeClasses}
          />
        </ul>
      </nav>
    </div>
  );
}
