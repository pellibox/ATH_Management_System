
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import SidebarContent from './sidebar/SidebarContent';
import SidebarMobile from './sidebar/SidebarMobile';

interface SidebarProps {
  collapsed: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ collapsed, toggleSidebar }: SidebarProps) {
  const isMobile = useIsMobile();
  const [open, setOpen] = React.useState(false);
  const [courtsOpen, setCourtsOpen] = React.useState(false);
  const [peopleOpen, setPeopleOpen] = React.useState(false);

  const sidebarContent = (
    <SidebarContent 
      collapsed={collapsed} 
      toggleSidebar={toggleSidebar}
      courtsOpen={courtsOpen}
      setCourtsOpen={setCourtsOpen}
      peopleOpen={peopleOpen}
      setPeopleOpen={setPeopleOpen}
    />
  );

  // For mobile, we use a Sheet component
  if (isMobile) {
    return (
      <SidebarMobile open={open} setOpen={setOpen}>
        {sidebarContent}
      </SidebarMobile>
    );
  }

  // For desktop, we render the sidebar directly
  return (
    <div
      className={`${
        collapsed ? 'w-16' : 'w-64'
      } bg-white border-r border-gray-200 transition-all duration-300 hidden md:block flex-shrink-0 h-screen sticky top-0`}
    >
      {sidebarContent}
    </div>
  );
}
