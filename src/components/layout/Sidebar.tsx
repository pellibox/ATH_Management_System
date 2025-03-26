
import React, { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import SidebarContent from './sidebar/SidebarContent';
import SidebarMobile from './sidebar/SidebarMobile';
import { useLocation } from 'react-router-dom';

interface SidebarProps {
  collapsed: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ collapsed, toggleSidebar }: SidebarProps) {
  const isMobile = useIsMobile();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [courtsOpen, setCourtsOpen] = useState(false);
  const [peopleOpen, setPeopleOpen] = useState(false);
  const [activitiesOpen, setActivitiesOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Close mobile sidebar when route changes
  useEffect(() => {
    if (isMobile) {
      setOpen(false);
    }
  }, [location.pathname, location.search, isMobile]);

  // Close sidebar dropdowns when route changes
  useEffect(() => {
    setCourtsOpen(false);
    setPeopleOpen(false);
    setActivitiesOpen(false);
  }, [location.pathname, location.search]);

  const handleMouseEnter = () => {
    if (!isMobile && collapsed) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setIsHovered(false);
    }
  };

  const sidebarContent = (
    <SidebarContent 
      collapsed={collapsed && !isHovered} 
      toggleSidebar={toggleSidebar}
      courtsOpen={courtsOpen}
      setCourtsOpen={setCourtsOpen}
      peopleOpen={peopleOpen}
      setPeopleOpen={setPeopleOpen}
      activitiesOpen={activitiesOpen}
      setActivitiesOpen={setActivitiesOpen}
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

  // For desktop, we render the sidebar directly with hover functionality
  return (
    <div
      className={`${
        collapsed && !isHovered ? 'w-16' : 'w-64'
      } bg-white border-r border-gray-200 transition-all duration-300 hidden md:block flex-shrink-0 h-screen sticky top-0 z-10`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {sidebarContent}
    </div>
  );
}
