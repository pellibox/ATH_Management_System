
import { useState } from "react";
import CourtGrid from "@/components/court-vision/CourtGrid";
import { useCourtVision } from "../context/CourtVisionContext";
import { Slider } from "@/components/ui/slider";
import { Clock } from "lucide-react";
import "../TimeSlotStyles.css";

export function CourtVisionContent() {
  const { 
    filteredCourts, 
    timeSlots, 
    selectedDate,
    handleDrop,
    handleActivityDrop,
    handleRemovePerson,
    handleRemoveActivity,
    handleRenameCourt,
    handleChangeCourtType,
    handleChangeCourtNumber,
    playersList,
    activities
  } = useCourtVision();
  
  const [activeHour, setActiveHour] = useState<string | null>(new Date().getHours() + ":00");
  
  // Get unique hours from time slots for the slider
  const uniqueHours = Array.from(new Set(timeSlots.map(slot => slot.split(':')[0]))).sort();
  
  // Convert hours to slider values (0 to uniqueHours.length - 1)
  const hourToSliderValue = (hour: string | null): number => {
    if (!hour) return 0;
    const hourNumber = parseInt(hour.split(':')[0]);
    return uniqueHours.indexOf(hourNumber.toString());
  };
  
  // Convert slider value to hour
  const sliderValueToHour = (value: number): string => {
    return `${uniqueHours[value]}:00`;
  };
  
  const handleSliderChange = (value: number[]) => {
    setActiveHour(sliderValueToHour(value[0]));
  };

  console.log("CourtVisionContent rendering", { 
    filteredCourtsCount: filteredCourts.length,
    activeHour
  });

  return (
    <div className="flex-1 overflow-hidden flex flex-col ml-0">
      <div className="py-4 px-4 bg-white border-b border-gray-200">
        <h2 className="text-xl font-bold">Pianificazione Campi</h2>
        <p className="text-sm text-gray-500">
          Trascina giocatori e allenatori dalla sidebar per assegnarli ai campi
        </p>
      </div>
      
      {/* Time navigation slider */}
      <div className="px-6 py-3 bg-white border-b border-gray-200 flex items-center space-x-4">
        <Clock className="h-5 w-5 text-gray-500" />
        <div className="flex-1">
          <Slider 
            value={[hourToSliderValue(activeHour)]} 
            max={uniqueHours.length - 1} 
            step={1} 
            onValueChange={handleSliderChange}
            className="w-full"
          />
        </div>
        <div className="text-sm font-medium text-gray-700 min-w-16">
          {activeHour ? `${activeHour}` : "Seleziona ora"}
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <CourtGrid
          courts={filteredCourts}
          availablePeople={playersList}
          availableActivities={activities}
          timeSlots={timeSlots}
          onDrop={handleDrop}
          onActivityDrop={handleActivityDrop}
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
