
import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useIsMobile } from "@/hooks/use-mobile";

export default function MainLayout() {
  const location = useLocation();
  const isMobile = useIsMobile();
  
  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Setup intersection observer for animation on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".animate-on-scroll").forEach((el) => {
      observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 transition-all duration-300 flex flex-col md:ml-16 lg:ml-64">
        <Header />
        
        <main className="p-4 md:p-6 flex-1 overflow-x-hidden">
          <Outlet />
        </main>
        
        <footer className="mt-auto border-t py-3 md:py-4 px-4 md:px-6 bg-white text-xs md:text-sm">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2">
            <div className="text-center md:text-left">
              <span className="font-bold text-ath-blue">ATH</span>
              <span className="text-gray-600"> Management System</span>
              <span className="hidden md:inline ml-2 text-gray-500">© 2024 All rights reserved</span>
            </div>
            <div className="text-gray-500">
              Version 1.0.0
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
