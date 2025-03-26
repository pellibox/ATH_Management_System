
import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";
import AnimationProvider from "./AnimationProvider";
import { useIsMobile } from "@/hooks/use-mobile";

export default function MainLayout() {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Toggle sidebar collapse state
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };
  
  // Auto-collapse sidebar on mobile when navigation occurs
  useEffect(() => {
    if (isMobile) {
      setSidebarCollapsed(true);
    }
  }, [location.pathname, isMobile]);
  
  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <AnimationProvider>
      <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
        <Sidebar collapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} />
        
        <div className={`flex-1 transition-all duration-300 flex flex-col ${sidebarCollapsed ? 'md:ml-16' : 'md:ml-64'}`}>
          <Header toggleSidebar={toggleSidebar} sidebarCollapsed={sidebarCollapsed} />
          
          <main className="p-4 md:p-6 flex-1 overflow-x-hidden">
            <Outlet />
          </main>
          
          <Footer />
        </div>
      </div>
    </AnimationProvider>
  );
}
