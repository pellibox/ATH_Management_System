
import { useState, useEffect } from "react";
import CourtGrid from "@/components/court-vision/court-grid/CourtGrid";
import { useCourtVision } from "../context/CourtVisionContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import "../TimeSlotStyles.css";
import { PersonData, ActivityData } from "../types";

export function CourtVisionContent() {
  const { 
    filteredCourts, 
    timeSlots, 
    selectedDate,
    playersList,
    activities,
    handleDrop,
    handleActivityDrop,
    handleRemovePerson,
    handleRemoveActivity,
    handleRenameCourt,
    handleChangeCourtType,
    handleChangeCourtNumber
  } = useCourtVision();
  
  // Initialize active hour to current hour
  const [activeHour, setActiveHour] = useState<string | null>(() => {
    const currentHour = new Date().getHours();
    // Find the closest available hour in timeSlots
    const availableHours = timeSlots.map(slot => parseInt(slot.split(':')[0]));
    const closestHour = availableHours.reduce((prev, curr) => 
      Math.abs(curr - currentHour) < Math.abs(prev - currentHour) ? curr : prev
    );
    return `${closestHour}:00`;
  });

  console.log("CourtVisionContent rendering", { 
    filteredCourtsCount: filteredCourts.length,
    activeHour
  });

  // Create adapter functions that convert between the two function signatures
  const handleDropAdapter = (courtId: string, personId: string, timeSlot?: string) => {
    // Find the person in playersList by ID
    const person = playersList.find(p => p.id === personId);
    if (person) {
      handleDrop(courtId, person, undefined, timeSlot);
    }
  };

  const handleActivityDropAdapter = (courtId: string, activityId: string, timeSlot?: string) => {
    // Find the activity in activities by ID
    const activity = activities.find(a => a.id === activityId);
    if (activity) {
      handleActivityDrop(courtId, activity, timeSlot);
    }
  };

  return (
    <div className="flex-1 overflow-hidden flex flex-col ml-0">
      <div className="py-4 px-4 bg-white border-b border-gray-200">
        <h2 className="text-xl font-bold">Pianificazione Campi</h2>
        <p className="text-sm text-gray-500">
          Trascina giocatori e allenatori dalla sidebar per assegnarli ai campi
        </p>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <CourtGrid
          courts={filteredCourts}
          timeSlots={timeSlots}
          availablePeople={playersList}
          availableActivities={activities}
          onDrop={handleDropAdapter}
          onActivityDrop={handleActivityDropAdapter}
          onRemovePerson={handleRemovePerson}
          onRemoveActivity={handleRemoveActivity}
          onRenameCourt={handleRenameCourt}
          onChangeCourtType={handleChangeCourtType}
          onChangeCourtNumber={handleChangeCourtNumber}
          activeHour={activeHour || undefined}
        />
      </div>
    </div>
  );
}
