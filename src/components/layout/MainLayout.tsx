
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
  const [isInitialized, setIsInitialized] = useState(false);
  
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
  
  // Initialize component
  useEffect(() => {
    console.log("MainLayout initializing");
    
    // Force initialization after a brief delay to ensure DOM is ready
    const timer = setTimeout(() => {
      setIsInitialized(true);
      console.log("MainLayout initialized");
    }, 100);
    
    // Scroll to top on route change
    window.scrollTo(0, 0);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Handle route changes
  useEffect(() => {
    console.log("Route changed to:", location.pathname);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  console.log("MainLayout rendering, path:", location.pathname, "initialized:", isInitialized);

  return (
    <AnimationProvider>
      <div className={`min-h-screen flex flex-col md:flex-row bg-gray-50 ${isInitialized ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}>
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
