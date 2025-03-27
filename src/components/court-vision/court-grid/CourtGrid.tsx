
import React, { forwardRef, useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCourtGridUtils } from "./useCourtGridUtils";
import { GlobalControls } from "./GlobalControls";
import { CourtTypeGroup } from "./CourtTypeGroup";
import { EmptyCourtMessage } from "./EmptyCourtMessage";
import { useCoachValidation } from "../validation/CoachValidationManager";
import { CourtGridProps } from "./types";
import { CourtProps } from "../types";

const CourtGrid = forwardRef<HTMLDivElement, CourtGridProps>(({
  courts,
  timeSlots,
  availablePeople,
  availableActivities,
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
  
  // Get validation tools
  const { getCoachConflicts } = useCoachValidation();
  
  // Add conflict filtering state
  const [showOnlyConflicts, setShowOnlyConflicts] = useState(false);
  const [filteredCourts, setFilteredCourts] = useState<CourtProps[]>(courts);
  const [conflictsCount, setConflictsCount] = useState(0);
  
  // Filter courts based on conflicts when needed
  useEffect(() => {
    if (showOnlyConflicts) {
      // Get all coach conflicts
      const allConflicts = getCoachConflicts(courts, timeSlots);
      
      // Calculate total conflicts
      let totalConflicts = 0;
      const courtsWithConflicts = new Set<string>();
      
      Object.entries(allConflicts).forEach(([courtId, timeSlotConflicts]) => {
        Object.values(timeSlotConflicts).forEach(conflicts => {
          if (conflicts.length > 0) {
            courtsWithConflicts.add(courtId);
            totalConflicts += conflicts.length;
          }
        });
      });
      
      // Filter courts to only show those with conflicts
      const filtered = courts.filter(court => courtsWithConflicts.has(court.id));
      setFilteredCourts(filtered);
      setConflictsCount(totalConflicts);
    } else {
      // Show all courts
      setFilteredCourts(courts);
      
      // Still calculate conflicts count for display
      const allConflicts = getCoachConflicts(courts, timeSlots);
      let totalConflicts = 0;
      
      Object.values(allConflicts).forEach(courtConflicts => {
        Object.values(courtConflicts).forEach(conflicts => {
          totalConflicts += conflicts.length;
        });
      });
      
      setConflictsCount(totalConflicts);
    }
  }, [courts, showOnlyConflicts, timeSlots]);
  
  // Group courts by type for display
  const courtsByType: Record<string, CourtProps[]> = {};
  
  filteredCourts.forEach(court => {
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
          showOnlyConflicts={showOnlyConflicts}
          setShowOnlyConflicts={setShowOnlyConflicts}
          conflictsCount={conflictsCount}
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
        {Object.keys(courtsByType).length === 0 && (
          showOnlyConflicts ? (
            <div className="text-center py-12">
              <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-green-100">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Nessun conflitto rilevato</h3>
              <p className="mt-1 text-sm text-gray-500">Non ci sono conflitti di assegnazione coach da visualizzare.</p>
              <button 
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                onClick={() => setShowOnlyConflicts(false)}
              >
                Mostra tutti i campi
              </button>
            </div>
          ) : (
            <EmptyCourtMessage />
          )
        )}
      </div>
    </ScrollArea>
  );
});

CourtGrid.displayName = "CourtGrid";

export default CourtGrid;
