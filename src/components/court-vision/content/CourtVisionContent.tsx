
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
    handleRenameCourt,
    handleChangeCourtType,
    handleChangeCourtNumber
  } = useCourtVision();

  console.log("CourtVisionContent rendering", { 
    filteredCourtsCount: filteredCourts.length
  });

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
