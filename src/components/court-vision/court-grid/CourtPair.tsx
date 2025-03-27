
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Court } from "../Court";
import { VerticalTimeSlotSelector } from "../time-slot/VerticalTimeSlotSelector";
import { CourtPairProps } from "./types";
import { PersonData, ActivityData } from "../types";

export function CourtPair({
  courtPair: pair,
  type,
  pairIndex,
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
}: CourtPairProps) {
  // Get group ID for this pair of courts
  const groupId = getGroupId(type);
  
  // Get active hour for this court group
  const groupActiveHour = activeHoursByGroup[groupId] || null;
  
  // Get visible court index for this pair (mobile only)
  const key = `${type}-${pairIndex}`;
  const visibleCourtIndex = isMobile ? (visibleCourtIndices[key] || 0) : -1;
  
  // Create adapter functions to bridge the type mismatches
  const handlePersonDrop = (courtId: string, person: PersonData, position?: { x: number, y: number }, time?: string) => {
    onDrop(courtId, person.id, time);
  };

  const handleActivityDrop = (courtId: string, activity: ActivityData, time?: string) => {
    onActivityDrop(courtId, activity.id, time);
  };
  
  return (
    <div key={`pair-${type}-${pairIndex}`} className="flex gap-4 md:gap-6 px-4">
      {/* Vertical time slot selector for this pair */}
      <div className="w-16 md:w-20">
        <VerticalTimeSlotSelector
          timeSlots={timeSlots}
          activeHour={groupActiveHour}
          onHourChange={(hour) => handleHourChangeForGroup(hour, groupId)}
          groupId={groupId}
        />
      </div>
      
      {/* Courts in this pair */}
      <div className="flex-1 relative">
        {/* Mobile navigation controls */}
        {isMobile && pair.length > 1 && (
          <div className="absolute top-1/2 left-0 right-0 z-50 flex justify-between transform -translate-y-1/2 pointer-events-none">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => navigateCourt(key, 'prev')}
              disabled={visibleCourtIndex === 0}
              className="h-8 w-8 rounded-full bg-white/90 shadow-md pointer-events-auto"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => navigateCourt(key, 'next')}
              disabled={visibleCourtIndex === 1 || pair.length === 1}
              className="h-8 w-8 rounded-full bg-white/90 shadow-md pointer-events-auto"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
        
        {/* Modified grid/display logic for mobile */}
        <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'} gap-4 md:gap-6`}>
          {isMobile ? (
            // In mobile, only show one court at a time
            <Court
              key={pair[visibleCourtIndex].id}
              court={pair[visibleCourtIndex]}
              timeSlots={timeSlots}
              onDrop={handlePersonDrop}
              onActivityDrop={handleActivityDrop}
              onRemovePerson={onRemovePerson}
              onRemoveActivity={onRemoveActivity}
              onRename={onRenameCourt}
              onChangeType={onChangeCourtType}
              onChangeNumber={onChangeCourtNumber}
              isSidebarCollapsed={isMobile}
              activeHour={groupActiveHour}
            />
          ) : (
            // On desktop, show both courts
            pair.map((court) => (
              <Court
                key={court.id}
                court={court}
                timeSlots={timeSlots}
                onDrop={handlePersonDrop}
                onActivityDrop={handleActivityDrop}
                onRemovePerson={onRemovePerson}
                onRemoveActivity={onRemoveActivity}
                onRename={onRenameCourt}
                onChangeType={onChangeCourtType}
                onChangeNumber={onChangeCourtNumber}
                isSidebarCollapsed={isMobile}
                activeHour={groupActiveHour}
              />
            ))
          )}
        </div>
        
        {/* Court pagination indicator for mobile */}
        {isMobile && pair.length > 1 && (
          <div className="flex justify-center mt-2 gap-1">
            <div 
              className={`h-2 w-2 rounded-full ${
                visibleCourtIndex === 0 ? 'bg-blue-500' : 'bg-gray-300'
              }`} 
            />
            <div 
              className={`h-2 w-2 rounded-full ${
                visibleCourtIndex === 1 ? 'bg-blue-500' : 'bg-gray-300'
              }`} 
            />
          </div>
        )}
      </div>
    </div>
  );
}
