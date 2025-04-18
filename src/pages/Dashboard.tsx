
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { CourtProps } from "@/components/court-vision/types";
import { AssignmentsDashboard } from "@/components/court-vision/AssignmentsDashboard";
import { DashboardSummary } from "@/components/dashboard/DashboardSummary";
import { useToast } from "@/hooks/use-toast";
import { CourtVisionProvider } from "@/components/court-vision/context/CourtVisionContext";
import { format } from "date-fns";
import { PlayerProvider } from "@/contexts/PlayerContext";
import { useSharedPlayers } from "@/contexts/shared/SharedPlayerContext";

export default function Dashboard() {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [selectedDate] = useState(new Date()); // Explicit date initialization
  const { toast } = useToast();
  const { sharedPlayers } = useSharedPlayers();
  
  useEffect(() => {
    console.log("Dashboard component mounted");
    
    try {
      const visibilityTimer = setTimeout(() => {
        setIsVisible(true);
        console.log("Dashboard visibility set to true");
      }, 100);
      
      const loadingTimer = setTimeout(() => {
        setIsLoading(false);
        console.log("Dashboard finished loading");
      }, 500);
      
      return () => {
        clearTimeout(visibilityTimer);
        clearTimeout(loadingTimer);
      };
    } catch (error) {
      console.error("Error in Dashboard initialization:", error);
      setHasError(true);
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive"
      });
    }
  }, [toast]);
  
  console.log("Dashboard rendering, isVisible:", isVisible, "isLoading:", isLoading, "hasError:", hasError);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <img 
            src="/lovable-uploads/1d4cf35c-0a44-4354-ba59-335096dbc4b6.png" 
            alt="Tennis Ball Loading" 
            className="w-16 h-16 mx-auto animate-spin"
          />
          <p className="mt-4 text-gray-600">Caricamento dashboard...</p>
        </div>
      </div>
    );
  }
  
  if (hasError) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-xl text-red-500">Si è verificato un errore durante il caricamento della dashboard.</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-ath-blue text-white rounded hover:bg-blue-600 transition-colors"
          >
            Riprova
          </button>
        </div>
      </div>
    );
  }
  
  // Creiamo campi vuoti per la dashboard
  const emptyCourts: CourtProps[] = [];
  
  return (
    <CourtVisionProvider initialPlayers={sharedPlayers}>
      <div className="max-w-7xl mx-auto p-4">
        <div className={cn(
          "mb-8 transition-all duration-700",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          <h1 className="text-3xl font-bold">Benvenuto in ATH Management System</h1>
          <p className="text-gray-600 mt-1">
            Ecco cosa sta succedendo nella tua accademia oggi ({format(selectedDate, 'dd/MM/yyyy')})
          </p>
        </div>
        
        <PlayerProvider>
          <DashboardSummary />
        </PlayerProvider>
        
        <div className={cn(
          "mt-8 transition-all duration-700 delay-200",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Assignazione Campi</h2>
            <AssignmentsDashboard 
              courts={emptyCourts} 
              selectedDate={selectedDate} 
            />
          </div>
        </div>
      </div>
    </CourtVisionProvider>
  );
}
