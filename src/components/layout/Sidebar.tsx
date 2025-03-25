
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Calendar, Settings, Users, Activity, Layout, ChevronRight, ChevronDown,
  Menu, X, Dumbbell
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface SidebarProps {
  collapsed: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ collapsed, toggleSidebar }: SidebarProps) {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [open, setOpen] = React.useState(false);
  const [courtsOpen, setCourtsOpen] = React.useState(false);

  const isLinkActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
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

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          <li>
            <Link
              to="/"
              className={`flex items-center py-2 px-4 rounded-md ${
                isLinkActive('/') ? 'bg-ath-blue text-white' : 'text-gray-700 hover:bg-gray-100'
              } ${collapsed ? 'justify-center' : ''}`}
            >
              <Layout className="h-5 w-5" />
              {!collapsed && <span className="ml-3">Dashboard</span>}
            </Link>
          </li>

          <li>
            <Collapsible
              open={courtsOpen}
              onOpenChange={setCourtsOpen}
              className="w-full"
            >
              <CollapsibleTrigger asChild>
                <button
                  className={`w-full flex items-center py-2 px-4 rounded-md ${
                    isLinkActive('/court-vision') ? 'bg-ath-blue text-white' : 'text-gray-700 hover:bg-gray-100'
                  } ${collapsed ? 'justify-center' : 'justify-between'}`}
                >
                  <div className="flex items-center">
                    <Dumbbell className="h-5 w-5" />
                    {!collapsed && <span className="ml-3">Court Vision</span>}
                  </div>
                  {!collapsed && <ChevronDown className="h-4 w-4" />}
                </button>
              </CollapsibleTrigger>
              {!collapsed && (
                <CollapsibleContent>
                  <ul className="mt-1 space-y-1 pl-9">
                    <li>
                      <Link
                        to="/court-vision"
                        className={`block py-2 px-4 rounded-md ${
                          location.pathname === '/court-vision' && !location.search
                            ? 'bg-ath-blue-light text-ath-blue'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        All Courts
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/court-vision?sport=tennis"
                        className={`block py-2 px-4 rounded-md ${
                          location.search.includes('sport=tennis')
                            ? 'bg-ath-blue-light text-ath-blue'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        Tennis
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/court-vision?sport=padel"
                        className={`block py-2 px-4 rounded-md ${
                          location.search.includes('sport=padel')
                            ? 'bg-ath-blue-light text-ath-blue'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        Padel
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/court-vision?sport=pickleball"
                        className={`block py-2 px-4 rounded-md ${
                          location.search.includes('sport=pickleball')
                            ? 'bg-ath-blue-light text-ath-blue'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        Pickleball
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/court-vision?sport=touchtennis"
                        className={`block py-2 px-4 rounded-md ${
                          location.search.includes('sport=touchtennis')
                            ? 'bg-ath-blue-light text-ath-blue'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        Touch Tennis
                      </Link>
                    </li>
                  </ul>
                </CollapsibleContent>
              )}
            </Collapsible>
          </li>

          <li>
            <Link
              to="/staff"
              className={`flex items-center py-2 px-4 rounded-md ${
                isLinkActive('/staff') ? 'bg-ath-blue text-white' : 'text-gray-700 hover:bg-gray-100'
              } ${collapsed ? 'justify-center' : ''}`}
            >
              <Users className="h-5 w-5" />
              {!collapsed && <span className="ml-3">Staff</span>}
            </Link>
          </li>

          <li>
            <Link
              to="/activities"
              className={`flex items-center py-2 px-4 rounded-md ${
                isLinkActive('/activities') ? 'bg-ath-blue text-white' : 'text-gray-700 hover:bg-gray-100'
              } ${collapsed ? 'justify-center' : ''}`}
            >
              <Activity className="h-5 w-5" />
              {!collapsed && <span className="ml-3">Activities</span>}
            </Link>
          </li>

          <li>
            <Link
              to="/calendar"
              className={`flex items-center py-2 px-4 rounded-md ${
                isLinkActive('/calendar') ? 'bg-ath-blue text-white' : 'text-gray-700 hover:bg-gray-100'
              } ${collapsed ? 'justify-center' : ''}`}
            >
              <Calendar className="h-5 w-5" />
              {!collapsed && <span className="ml-3">Calendar</span>}
            </Link>
          </li>

          <li>
            <Link
              to="/settings"
              className={`flex items-center py-2 px-4 rounded-md ${
                isLinkActive('/settings') ? 'bg-ath-blue text-white' : 'text-gray-700 hover:bg-gray-100'
              } ${collapsed ? 'justify-center' : ''}`}
            >
              <Settings className="h-5 w-5" />
              {!collapsed && <span className="ml-3">Settings</span>}
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );

  // For mobile, we use a Sheet component
  if (isMobile) {
    return (
      <>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden fixed top-4 left-4 z-50"
          onClick={() => setOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent side="left" className="p-0 w-64">
            {sidebarContent}
          </SheetContent>
        </Sheet>
      </>
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

// Define the ChevronLeft component since it's used but missing from the imports
function ChevronLeft(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}
