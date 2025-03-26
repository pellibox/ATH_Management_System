
import React from "react";
import { CourtProps, ActivityData } from "../types";
import { CourtSelector } from "./CourtSelector";
import { ActivitiesList } from "./ActivitiesList";
import { ToggleViewButton } from "./ToggleViewButton";

interface ActivitiesTabContentProps {
  courts: CourtProps[];
  availableActivities: ActivityData[];
  selectedCourt: CourtProps | null;
  selectedTimeSlot?: string;
  showAssigned: boolean;
  setSelectedCourt: (court: CourtProps) => void;
  setShowAssigned: (show: boolean) => void;
  onAssignActivity: (courtId: string, activity: ActivityData, timeSlot?: string) => void;
  onRemoveActivity?: (activityId: string, timeSlot?: string) => void;
}

export function ActivitiesTabContent({ 
  courts, 
  availableActivities, 
  selectedCourt, 
  selectedTimeSlot,
  showAssigned, 
  setSelectedCourt,
  setShowAssigned,
  onAssignActivity,
  onRemoveActivity
}: ActivitiesTabContentProps) {
  return (
    <div>
      <CourtSelector 
        courts={courts}
        selectedCourt={selectedCourt}
        setSelectedCourt={setSelectedCourt}
      />

      {selectedCourt && (
        <>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">
              {showAssigned ? "Assigned Activities" : "Assign Activities"}
            </h3>
            <ToggleViewButton 
              showAssigned={showAssigned}
              setShowAssigned={setShowAssigned}
            />
          </div>

          {showAssigned ? (
            <ActivitiesList
              activities={selectedCourt.activities}
              showAssigned={true}
              selectedTimeSlot={selectedTimeSlot}
              onRemove={onRemoveActivity}
            />
          ) : (
            <ActivitiesList
              activities={availableActivities}
              showAssigned={false}
              onAssign={(activity) => onAssignActivity(selectedCourt.id, activity, selectedTimeSlot)}
            />
          )}
        </>
      )}
    </div>
  );
}
