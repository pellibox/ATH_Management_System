
import React from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon, ChevronDown, ChevronRight } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

interface SubmenuItem {
  label: string;
  path: string;
  icon?: LucideIcon;
}

interface SidebarSubmenuProps {
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  collapsed: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: SubmenuItem[];
  currentPath: string;
  searchParams?: string;
}

export default function SidebarSubmenu({
  icon: Icon,
  label,
  isActive,
  collapsed,
  open,
  onOpenChange,
  items,
  currentPath,
  searchParams = ''
}: SidebarSubmenuProps) {
  
  const isItemActive = (path: string) => {
    if (path.includes('?')) {
      // For paths with query parameters
      return currentPath + searchParams === path;
    }
    return currentPath === path;
  };

  // Not using Collapsible when collapsed
  if (collapsed) {
    return (
      <li className="relative group">
        <button
          onClick={() => onOpenChange(!open)}
          className={cn(
            "flex items-center py-2 px-3 rounded-md text-sm w-full transition-colors",
            isActive 
              ? "bg-ath-blue text-white font-medium" 
              : "text-gray-600 hover:bg-gray-100"
          )}
        >
          <Icon className={cn(
            "h-5 w-5 flex-shrink-0 mx-auto",
            isActive ? "text-white" : "text-gray-500 group-hover:text-gray-700"
          )} />
        </button>
        
        {/* Popup menu on hover for collapsed state */}
        <div className="absolute left-full top-0 ml-2 bg-white rounded-md shadow-md py-1 w-48 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity z-50">
          <div className="text-xs text-gray-500 px-3 py-1 uppercase font-medium">{label}</div>
          
          {items.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center px-3 py-2 text-sm hover:bg-gray-100 transition-colors",
                isItemActive(item.path) && "bg-gray-100 text-ath-blue font-medium"
              )}
            >
              {item.icon && <item.icon className="h-4 w-4 mr-2 text-gray-500" />}
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </li>
    );
  }

  // Using Collapsible when not collapsed
  return (
    <li>
      <Collapsible open={open} onOpenChange={onOpenChange}>
        <CollapsibleTrigger className="w-full">
          <div
            className={cn(
              "flex items-center justify-between py-2 px-3 rounded-md text-sm transition-colors",
              isActive 
                ? "bg-ath-blue text-white font-medium" 
                : "text-gray-600 hover:bg-gray-100"
            )}
          >
            <div className="flex items-center">
              <Icon className={cn(
                "h-5 w-5 flex-shrink-0 mr-2",
                isActive ? "text-white" : "text-gray-500"
              )} />
              <span className="truncate">{label}</span>
            </div>
            
            {open ? 
              <ChevronDown className={cn("h-4 w-4", isActive ? "text-white" : "text-gray-500")} /> : 
              <ChevronRight className={cn("h-4 w-4", isActive ? "text-white" : "text-gray-500")} />
            }
          </div>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <ul className="mt-1 ml-5 pl-2 border-l border-gray-200 space-y-1">
            {items.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center py-1.5 px-2 rounded-md text-sm transition-colors",
                    isItemActive(item.path)
                      ? "bg-gray-100 text-ath-blue font-medium"
                      : "text-gray-600 hover:bg-gray-100"
                  )}
                >
                  {item.icon && (
                    <item.icon 
                      className={cn(
                        "h-4 w-4 mr-2", 
                        isItemActive(item.path) ? "text-ath-blue" : "text-gray-500"
                      )} 
                    />
                  )}
                  <span className="truncate">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </CollapsibleContent>
      </Collapsible>
    </li>
  );
}
