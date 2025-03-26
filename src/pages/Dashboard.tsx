
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { CourtProps } from "@/components/court-vision/types";
import { AssignmentsDashboard } from "@/components/court-vision/AssignmentsDashboard";
import { DashboardSummary } from "@/components/dashboard/DashboardSummary";

export default function Dashboard() {
  const [isVisible, setIsVisible] = useState(false);
  const [courts, setCourts] = useState<CourtProps[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  // Trigger animations after mount
  useEffect(() => {
    // Set visibility immediately to avoid blank screen
    setIsVisible(true);
    
    const defaultCourts: CourtProps[] = [
      { 
        id: "court1", 
        type: "Tennis Clay", 
        name: "Center Court", 
        number: 1, 
        occupants: [
          { id: "player1", name: "Alex Smith", type: "player" },
          { id: "coach1", name: "Coach Anderson", type: "coach" }
        ], 
        activities: [
          { id: "activity1", name: "Singles Match", type: "match" }
        ] 
      },
      { 
        id: "court2", 
        type: "Tennis Hard", 
        name: "Tennis", 
        number: 2, 
        occupants: [
          { id: "player2", name: "Emma Johnson", type: "player" }
        ], 
        activities: [
          { id: "activity2", name: "Group Training", type: "training" }
        ] 
      },
      { 
        id: "court3", 
        type: "Padel", 
        name: "Padel", 
        number: 1, 
        occupants: [
          { id: "player3", name: "Michael Brown", type: "player" },
          { id: "player4", name: "Sophia Davis", type: "player" }
        ], 
        activities: [
          { id: "activity3", name: "Padel Match", type: "match" }
        ] 
      },
    ];
    
    setCourts(defaultCourts);
  }, []);
  
  // Add console logs to debug rendering
  console.log("Dashboard rendering, isVisible:", isVisible);
  console.log("Courts:", courts);
  
  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className={cn(
        "mb-8 opacity-100 transform transition-all duration-700",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )}>
        <h1 className="text-3xl font-bold">Benvenuto in ATH Management System</h1>
        <p className="text-gray-600 mt-1">Ecco cosa sta succedendo nella tua accademia oggi</p>
      </div>
      
      {/* Dashboard Summary */}
      <DashboardSummary />
      
      {/* Court Assignments Dashboard */}
      <div className="mt-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Assignazione Campi</h2>
          <AssignmentsDashboard courts={courts} selectedDate={selectedDate} />
        </div>
      </div>
    </div>
  );
}
