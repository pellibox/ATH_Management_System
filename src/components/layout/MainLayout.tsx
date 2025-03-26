
import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Circle } from "lucide-react";
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
          <Circle 
            className="mx-auto animate-spin text-ath-clay" 
            size={48} 
            strokeWidth={2} 
            fill="none"
            style={{
              animation: 'spin 1.5s linear infinite',
              stroke: 'var(--ath-clay)',
              strokeDasharray: '50 50', // Creates a dashed line effect
              strokeLinecap: 'round'
            }}
          />
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
