
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SidebarLinkProps {
  to: string;
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  collapsed: boolean;
}

export default function SidebarLink({ to, icon: Icon, label, isActive, collapsed }: SidebarLinkProps) {
  const location = useLocation();
  
  const linkContent = (
    <>
      <Icon className={`h-5 w-5 ${isActive ? 'text-ath-blue' : 'text-gray-500'}`} />
      {!collapsed && (
        <span className={`ml-3 transition-opacity ${collapsed ? 'opacity-0' : 'opacity-100'}`}>
          {label}
        </span>
      )}
    </>
  );
  
  return collapsed ? (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <li>
            <Link
              to={to}
              className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                isActive 
                  ? 'bg-ath-blue-light text-ath-blue' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {linkContent}
            </Link>
          </li>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : (
    <li>
      <Link
        to={to}
        className={`flex items-center px-3 py-2 rounded-md transition-colors ${
          isActive 
            ? 'bg-ath-blue-light text-ath-blue' 
            : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        {linkContent}
      </Link>
    </li>
  );
}
