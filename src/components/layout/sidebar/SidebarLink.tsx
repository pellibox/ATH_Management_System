
import React from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

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
        className={`flex items-center py-2 px-4 rounded-md ${
          isActive ? 'bg-ath-blue text-white' : 'text-gray-700 hover:bg-gray-100'
        } ${collapsed ? 'justify-center' : ''}`}
      >
        <Icon className="h-5 w-5" />
        {!collapsed && <span className="ml-3">{label}</span>}
      </Link>
    </li>
  );
}
