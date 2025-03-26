
import React from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface SidebarLogoProps {
  collapsed: boolean;
  toggleSidebar: () => void;
}

export default function SidebarLogo({ collapsed, toggleSidebar }: SidebarLogoProps) {
  return (
    <div className="p-4 border-b">
      <div className="flex items-center justify-between">
        {!collapsed && (
          <div className="font-bold text-lg text-ath-blue">ATH System</div>
        )}
        <button
          onClick={toggleSidebar}
          className={`${collapsed ? 'mx-auto' : 'ml-auto'} text-gray-500 hover:text-gray-700 focus:outline-none`}
          aria-label="Toggle sidebar"
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </button>
      </div>
    </div>
  );
}
