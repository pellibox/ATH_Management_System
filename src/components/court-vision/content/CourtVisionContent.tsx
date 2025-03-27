
import CourtGrid from "@/components/court-vision/CourtGrid";
import { useCourtVision } from "../context/CourtVisionContext";
import { ScrollArea } from "@/components/ui/scroll-area";

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
    handleChangeCourtNumber
  } = useCourtVision();

  console.log("CourtVisionContent rendering", { 
    filteredCourtsCount: filteredCourts.length
  });

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
          onDrop={handleDrop}
          onActivityDrop={handleActivityDrop}
          onRemovePerson={handleRemovePerson}
          onRemoveActivity={handleRemoveActivity}
          onRenameCourt={handleRenameCourt}
          onChangeCourtType={handleChangeCourtType}
          onChangeCourtNumber={handleChangeCourtNumber}
        />
      </div>
    </div>
  );
}
