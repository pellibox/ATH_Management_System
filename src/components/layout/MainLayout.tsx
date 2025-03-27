
import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";
import AnimationProvider from "./AnimationProvider";
import { useIsMobile } from "@/hooks/use-mobile";
import { TennisBallLoader } from "../ui/TennisBallLoader";

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
    if (isMobile) {
      setSidebarCollapsed(true); // Always collapse on mobile
    }
  }, [location.pathname, isMobile]);
  
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
    return <TennisBallLoader text="Caricamento layout..." />;
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
