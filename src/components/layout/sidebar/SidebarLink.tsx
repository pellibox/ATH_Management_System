
import React from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

interface SidebarLinkProps {
  to: string;
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  collapsed: boolean;
  activeClass?: string;
}

export default function SidebarLink({ 
  to, 
  icon: Icon, 
  label, 
  isActive, 
  collapsed,
  activeClass = "bg-gray-100" 
}: SidebarLinkProps) {
  return (
    <li>
      <Link
        to={to}
        className={`flex items-center p-2 rounded-md transition-colors duration-150 hover:bg-gray-100 ${
          isActive ? activeClass : ''
        }`}
      >
        <Icon className={`h-5 w-5 ${isActive ? 'text-ath-red-clay' : 'text-gray-500'}`} />
        {!collapsed && (
          <span className="ml-3 whitespace-nowrap">{label}</span>
        )}
      </Link>
    </li>
  );
}
