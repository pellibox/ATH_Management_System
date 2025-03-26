
import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, LucideIcon } from 'lucide-react';

interface SidebarSubmenuProps {
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  collapsed: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPath: string;
  searchParams?: string;
  items: {
    label: string;
    path: string;
    icon?: LucideIcon;
  }[];
  activeClass?: string;
}

export default function SidebarSubmenu({
  icon: Icon,
  label,
  isActive,
  collapsed,
  open,
  onOpenChange,
  currentPath,
  searchParams = '',
  items,
  activeClass = "bg-gray-100"
}: SidebarSubmenuProps) {
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);

  // Handle uncollapse on submenu trigger click when sidebar is collapsed
  const handleTriggerClick = () => {
    if (collapsed) {
      onOpenChange(true);
    } else {
      onOpenChange(!open);
    }
  };

  // Handle item click
  const handleItemClick = (path: string) => {
    // Navigate to the selected path
    navigate(path);
    
    // Close the submenu after clicking (especially useful on mobile)
    if (window.innerWidth < 768) {
      onOpenChange(false);
    }
  };

  // Check if an item is active based on path
  const isItemActive = (path: string) => {
    if (path.includes('?')) {
      // Special case for paths with query parameters
      const basePath = currentPath;
      const fullPath = basePath + searchParams;
      return fullPath === path;
    }
    return currentPath === path;
  };

  // Close the menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node) && open && collapsed) {
        onOpenChange(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, collapsed, onOpenChange]);

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={handleTriggerClick}
        className={`w-full flex items-center justify-between p-2 rounded-md transition-colors duration-150 hover:bg-gray-100 ${
          isActive ? activeClass : ''
        }`}
      >
        <div className="flex items-center">
          <Icon className={`h-5 w-5 ${isActive ? 'text-ath-red-clay' : 'text-gray-500'}`} />
          {!collapsed && (
            <span className="ml-3 whitespace-nowrap">{label}</span>
          )}
        </div>
        
        {!collapsed && (
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-200 ${
              open ? 'transform rotate-180' : ''
            }`}
          />
        )}
      </button>

      {(open || (isActive && collapsed)) && (
        <div className={`overflow-hidden transition-all duration-200 ${
          collapsed ? 'absolute left-full top-0 ml-1 w-48 bg-white shadow-lg rounded-md z-20' : ''
        }`}>
          <ul className={`${collapsed ? 'p-2' : 'pl-9 mt-1'} space-y-1`}>
            {items.map((item) => {
              const ItemIcon = item.icon;
              const active = isItemActive(item.path);
              
              return (
                <li key={item.label}>
                  <Link
                    to={item.path}
                    onClick={() => handleItemClick(item.path)}
                    className={`flex items-center p-2 rounded-md ${
                      active ? activeClass : 'hover:bg-gray-100'
                    }`}
                  >
                    {ItemIcon && <ItemIcon className={`h-4 w-4 mr-2 ${active ? 'text-ath-red-clay' : 'text-gray-500'}`} />}
                    <span className={active ? 'text-ath-red-clay font-medium' : ''}>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
