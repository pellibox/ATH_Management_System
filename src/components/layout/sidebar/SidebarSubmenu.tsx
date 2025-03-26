
import React from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon, ChevronDown } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

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
  items: SubmenuItem[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPath: string;
  searchParams?: string;
}

export default function SidebarSubmenu({
  icon: Icon,
  label,
  isActive,
  collapsed,
  items,
  open,
  onOpenChange,
  currentPath,
  searchParams
}: SidebarSubmenuProps) {
  return (
    <li>
      <Collapsible
        open={open}
        onOpenChange={onOpenChange}
        className="w-full"
      >
        <CollapsibleTrigger asChild>
          <button
            className={`w-full flex items-center py-2 px-4 rounded-md ${
              isActive ? 'bg-ath-blue text-white' : 'text-gray-700 hover:bg-gray-100'
            } ${collapsed ? 'justify-center' : 'justify-between'}`}
          >
            <div className="flex items-center">
              <Icon className="h-5 w-5" />
              {!collapsed && <span className="ml-3">{label}</span>}
            </div>
            {!collapsed && <ChevronDown className="h-4 w-4" />}
          </button>
        </CollapsibleTrigger>
        {!collapsed && (
          <CollapsibleContent>
            <ul className="mt-1 space-y-1 pl-9">
              {items.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`block py-2 px-4 rounded-md ${
                      (searchParams 
                        ? item.path.includes(searchParams)
                        : currentPath === item.path)
                          ? 'bg-ath-blue-light text-ath-blue'
                          : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {item.icon ? (
                      <div className="flex items-center">
                        <item.icon className="h-4 w-4 mr-2" />
                        <span>{item.label}</span>
                      </div>
                    ) : (
                      item.label
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </CollapsibleContent>
        )}
      </Collapsible>
    </li>
  );
}
