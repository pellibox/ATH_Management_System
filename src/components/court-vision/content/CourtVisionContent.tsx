
import CourtGrid from "@/components/court-vision/CourtGrid";
import { useCourtVision } from "../context/CourtVisionContext";

export function CourtVisionContent() {
  const { 
    filteredCourts, 
    timeSlots, 
    selectedDate,
    handleDrop,
    handleActivityDrop,
    handleRemovePerson,
    handleRemoveActivity,
    handleUpdateCourt
  } = useCourtVision();

  console.log("CourtVisionContent rendering", { 
    filteredCourtsCount: filteredCourts.length
  });

  // Create wrapper functions to support the court grid component
  const handleRenameCourt = (courtId: string, name: string) => {
    handleUpdateCourt(courtId, { name });
  };

  const handleChangeCourtType = (courtId: string, type: string) => {
    handleUpdateCourt(courtId, { type });
  };

  const handleChangeCourtNumber = (courtId: string, number: number) => {
    handleUpdateCourt(courtId, { number });
  };

  return (
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
  );
}
