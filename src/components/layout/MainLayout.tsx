
import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function MainLayout() {
  const location = useLocation();
  
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
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 ml-16 md:ml-64 transition-all duration-300 flex flex-col">
        <Header />
        
        <main className="p-6 flex-1">
          <Outlet />
        </main>
        
        <footer className="mt-auto border-t py-4 px-6 bg-white text-sm">
          <div className="flex justify-between items-center">
            <div>
              <span className="font-bold text-ath-blue">ATH</span>
              <span className="text-gray-600"> Management System</span>
              <span className="ml-2 text-gray-500">© 2024 All rights reserved</span>
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
