
import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";
import AnimationProvider from "./AnimationProvider";
import { useIsMobile } from "@/hooks/use-mobile";

export default function MainLayout() {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true); // Default to collapsed
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Toggle sidebar collapse state
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };
  
  // Auto-collapse sidebar on mobile when navigation occurs
  useEffect(() => {
    setSidebarCollapsed(true); // Always collapse on navigation
  }, [location.pathname]);
  
  // Initialize component
  useEffect(() => {
    console.log("MainLayout initializing");
    
    // Force initialization after a brief delay to ensure DOM is ready
    const initTimer = setTimeout(() => {
      setIsInitialized(true);
      console.log("MainLayout initialized");
    }, 100);
    
    // Simulate short loading to ensure smooth transitions
    const loadTimer = setTimeout(() => {
      setIsLoading(false);
      console.log("MainLayout finished loading");
    }, 200);
    
    // Scroll to top on route change
    window.scrollTo(0, 0);
    
    return () => {
      clearTimeout(initTimer);
      clearTimeout(loadTimer);
    };
  }, []);
  
  // Handle route changes
  useEffect(() => {
    console.log("Route changed to:", location.pathname);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  console.log("MainLayout rendering, path:", location.pathname, "initialized:", isInitialized, "isLoading:", isLoading);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="48" 
            height="48" 
            viewBox="0 0 24 24" 
            className="mx-auto"
            style={{animation: 'spin 1.5s linear infinite'}}
          >
            {/* Tennis ball with dashed lines */}
            <circle cx="12" cy="12" r="10" fill="none" stroke="#FFC107" strokeWidth="2" />
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" 
                  fill="none" 
                  stroke="#FFC107" 
                  strokeWidth="1.5" 
                  strokeDasharray="5,5" />
            <path d="M2 12h20M12 2v20" 
                  stroke="#FFC107" 
                  strokeWidth="1.5" 
                  strokeDasharray="2,3" />
          </svg>
          <p className="mt-4 text-gray-600">Caricamento layout...</p>
        </div>
      </div>
    );
  }

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
