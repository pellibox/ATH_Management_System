
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { PersonData, ActivityData, CourtProps } from "../types";
import { TabSelector } from "./TabSelector";
import { TimeSlotSelector } from "./TimeSlotSelector";
import { PeopleTabContent } from "./PeopleTabContent";
import { ActivitiesTabContent } from "./ActivitiesTabContent";
import { useIsMobile } from "@/hooks/use-mobile";

interface AssignmentDialogContentProps {
  courts: CourtProps[];
  availablePeople: PersonData[];
  availableActivities: ActivityData[];
  timeSlots: string[];
  onAssignPerson: (courtId: string, person: PersonData, timeSlot?: string) => void;
  onAssignActivity: (courtId: string, activity: ActivityData, timeSlot?: string) => void;
  onRemovePerson?: (personId: string, timeSlot?: string) => void;
  onRemoveActivity?: (activityId: string, timeSlot?: string) => void;
  onClose: () => void;
}

export function AssignmentDialogContent({
  courts,
  availablePeople,
  availableActivities,
  timeSlots = [],
  onAssignPerson,
  onAssignActivity,
  onRemovePerson,
  onRemoveActivity,
  onClose
}: AssignmentDialogContentProps) {
  const [selectedTab, setSelectedTab] = useState<"people" | "activities">("people");
  const [selectedCourt, setSelectedCourt] = useState<CourtProps | null>(null);
  const [showAssigned, setShowAssigned] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | undefined>(undefined);
  const isMobile = useIsMobile();

  return (
    <div className={`${isMobile ? 'p-2' : 'p-4'}`}>
      <TabSelector 
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />

      <TimeSlotSelector 
        timeSlots={timeSlots}
        selectedTimeSlot={selectedTimeSlot}
        setSelectedTimeSlot={setSelectedTimeSlot}
      />

      {selectedTab === "people" ? (
        <PeopleTabContent 
          courts={courts}
          availablePeople={availablePeople}
          selectedCourt={selectedCourt}
          selectedTimeSlot={selectedTimeSlot}
          showAssigned={showAssigned}
          setSelectedCourt={setSelectedCourt}
          setShowAssigned={setShowAssigned}
          onAssignPerson={onAssignPerson}
          onRemovePerson={onRemovePerson}
        />
      ) : (
        <ActivitiesTabContent 
          courts={courts}
          availableActivities={availableActivities}
          selectedCourt={selectedCourt}
          selectedTimeSlot={selectedTimeSlot}
          showAssigned={showAssigned}
          setSelectedCourt={setSelectedCourt}
          setShowAssigned={setShowAssigned}
          onAssignActivity={onAssignActivity}
          onRemoveActivity={onRemoveActivity}
        />
      )}
      
      <div className="mt-4 flex justify-end">
        <Button 
          variant="outline" 
          onClick={onClose}
          className="border-ath-red-clay text-ath-red-clay"
        >
          Done
        </Button>
      </div>
    </div>
  );
}
