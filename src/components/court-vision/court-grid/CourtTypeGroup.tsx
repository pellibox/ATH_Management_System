
import React from "react";
import { CourtGroupProps } from "./types";
import { CourtPair } from "./CourtPair";
import { CourtProps } from "../types";

export function CourtTypeGroup({
  type,
  courts: typeCourts,
  timeSlots,
  onDrop,
  onActivityDrop,
  onRemovePerson,
  onRemoveActivity,
  onRenameCourt,
  onChangeCourtType,
  onChangeCourtNumber,
  activeHoursByGroup,
  visibleCourtIndices,
  handleHourChangeForGroup,
  navigateCourt,
  isMobile,
  getGroupId
}: CourtGroupProps) {
  // Organize courts in pairs (or single if odd number)
  const courtPairs: CourtProps[][] = [];
  for (let i = 0; i < typeCourts.length; i += 2) {
    if (i + 1 < typeCourts.length) {
      courtPairs.push([typeCourts[i], typeCourts[i+1]]);
    } else {
      courtPairs.push([typeCourts[i]]);
    }
  }
  
  return (
    <div key={type} className="space-y-3 md:space-y-4">
      <h3 className="text-base md:text-lg font-semibold px-4">{type}</h3>
      
      {courtPairs.map((pair, pairIndex) => (
        <CourtPair
          key={`${type}-pair-${pairIndex}`}
          courtPair={pair}
          type={type}
          pairIndex={pairIndex}
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
    </div>
  );
}
