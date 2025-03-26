
import React from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarLinkProps {
  to: string;
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  collapsed: boolean;
}

export default function SidebarLink({ to, icon: Icon, label, isActive, collapsed }: SidebarLinkProps) {
  return (
    <li>
      <Link
        to={to}
        className={cn(
          "flex items-center py-2 px-3 rounded-md text-sm transition-colors relative group",
          isActive 
            ? "bg-ath-blue text-white font-medium" 
            : "text-gray-600 hover:bg-gray-100"
        )}
      >
        <Icon className={cn(
          "h-5 w-5 flex-shrink-0",
          isActive ? "text-white" : "text-gray-500 group-hover:text-gray-700",
          collapsed ? "mx-auto" : "mr-2"
        )} />
        
        {!collapsed && (
          <span className="truncate">{label}</span>
        )}
        
        {collapsed && (
          <span className="absolute left-full ml-2 rounded bg-gray-900 px-2 py-1 text-xs text-white invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity whitespace-nowrap">
            {label}
          </span>
        )}
      </Link>
    </li>
  );
}
