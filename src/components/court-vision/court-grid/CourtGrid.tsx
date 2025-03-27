
import React, { forwardRef, useRef, useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCourtGridUtils } from "./useCourtGridUtils";
import { GlobalControls } from "./GlobalControls";
import { CourtTypeGroup } from "./CourtTypeGroup";
import { EmptyCourtMessage } from "./EmptyCourtMessage";
import { CourtGridProps } from "./types";

const CourtGrid = forwardRef<HTMLDivElement, CourtGridProps>(({
  courts,
  timeSlots,
  onDrop,
  onActivityDrop,
  onRemovePerson,
  onRemoveActivity,
  onRenameCourt,
  onChangeCourtType,
  onChangeCourtNumber,
  activeHour: propActiveHour
}: CourtGridProps, ref) => {
  const {
    isMobile,
    activeHoursByGroup,
    visibleCourtIndices,
    renderedCourtsRef,
    diagnosticMode,
    setDiagnosticMode,
    getGroupId,
    handleHourChangeForGroup,
    syncAllSliders,
    navigateCourt,
    getCurrentBusinessHour
  } = useCourtGridUtils(courts, timeSlots, propActiveHour);
  
  // Get current business hour for "jump to now" feature
  const currentBusinessHour = getCurrentBusinessHour();
  
  // Group courts by type for display
  const courtsByType: Record<string, CourtProps[]> = {};
  
  courts.forEach(court => {
    if (!courtsByType[court.type]) {
      courtsByType[court.type] = [];
    }
    courtsByType[court.type].push(court);
  });

  return (
    <ScrollArea className="h-full" scrollHideDelay={0} ref={ref}>
      <div className="space-y-6 md:space-y-8 pb-16 pt-4">
        {/* Global navigation controls */}
        <GlobalControls 
          timeSlots={timeSlots}
          syncAllSliders={syncAllSliders}
          currentBusinessHour={currentBusinessHour}
          diagnosticMode={diagnosticMode}
          setDiagnosticMode={setDiagnosticMode}
        />
        
        {/* Court type groups */}
        {Object.entries(courtsByType).map(([type, typeCourts]) => (
          <CourtTypeGroup
            key={type}
            type={type}
            courts={typeCourts}
            timeSlots={timeSlots}
            onDrop={onDrop}
            onActivityDrop={onActivityDrop}
            onRemovePerson={onRemovePerson}
            onRemoveActivity={onRemoveActivity}
            onRenameCourt={onRenameCourt}
            onChangeCourtType={onChangeCourtType}
            onChangeCourtNumber={onChangeCourtNumber}
            activeHoursByGroup={activeHoursByGroup}
            visibleCourtIndices={visibleCourtIndices}
            handleHourChangeForGroup={handleHourChangeForGroup}
            navigateCourt={navigateCourt}
            isMobile={isMobile}
            getGroupId={getGroupId}
          />
        ))}
        
        {/* Empty state message */}
        {Object.keys(courtsByType).length === 0 && <EmptyCourtMessage />}
      </div>
    </ScrollArea>
  );
});

CourtGrid.displayName = "CourtGrid";

export default CourtGrid;
