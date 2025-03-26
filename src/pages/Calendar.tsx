
import { useState } from "react";
import { Calendar as CalendarIcon, Filter, ListFilter, MessageSquarePlus } from "lucide-react";
import CalendarView from "@/components/ui/CalendarView";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { CourtVisionProvider } from "@/components/court-vision/context/CourtVisionContext";

export default function Calendar() {
  const [view, setView] = useState<"week" | "day" | "month">("week");
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const handleNewBooking = () => {
    toast({
      title: "New Booking",
      description: "Booking creation functionality will be implemented soon.",
    });
  };

  const handleFilterClick = () => {
    toast({
      title: "Filters",
      description: "Filtering functionality will be implemented soon.",
    });
  };

  const handleViewClick = () => {
    toast({
      title: "View Options",
      description: "Additional view options will be implemented soon.",
    });
  };
  
  return (
    <CourtVisionProvider>
      <div className="max-w-7xl mx-auto animate-fade-in">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Schedule Calendar</h1>
            <p className="text-gray-600 mt-1">Manage all court bookings and sessions</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <button 
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white shadow-sm text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={handleFilterClick}
              >
                <Filter className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Filter</span>
              </button>
            </div>
            
            <div className="relative">
              <button 
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white shadow-sm text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={handleViewClick}
              >
                <ListFilter className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">View</span>
              </button>
            </div>
            
            <button 
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-ath-blue text-white hover:bg-ath-blue-dark transition-colors"
              onClick={handleNewBooking}
            >
              <MessageSquarePlus className="h-4 w-4" />
              <span className="text-sm font-medium">{isMobile ? "Book" : "New Booking"}</span>
            </button>
          </div>
        </div>
        
        {/* Calendar View Selector */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <div className="bg-white shadow-sm rounded-lg p-1 flex items-center">
            <button
              onClick={() => setView("day")}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                view === "day"
                  ? "bg-ath-blue-light text-ath-blue"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Day
            </button>
            <button
              onClick={() => setView("week")}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                view === "week"
                  ? "bg-ath-blue-light text-ath-blue"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setView("month")}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                view === "month"
                  ? "bg-ath-blue-light text-ath-blue"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Month
            </button>
          </div>
          
          <div className="flex flex-wrap items-center gap-1.5 ml-0 md:ml-4">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-ath-clay"></span>
              <span className="text-xs text-gray-500">Clay</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-ath-grass"></span>
              <span className="text-xs text-gray-500">Grass</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-ath-hard"></span>
              <span className="text-xs text-gray-500">Hard</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-ath-central"></span>
              <span className="text-xs text-gray-500">Central</span>
            </div>
          </div>
        </div>
        
        {/* Calendar Component */}
        <CalendarView currentView={view} />
      </div>
    </CourtVisionProvider>
  );
}
