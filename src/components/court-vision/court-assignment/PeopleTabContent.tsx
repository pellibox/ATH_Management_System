
import React from "react";
import { CourtProps, PersonData } from "../types";
import { CourtSelector } from "./CourtSelector";
import { PeopleList } from "./PeopleList";
import { ToggleViewButton } from "./ToggleViewButton";

interface PeopleTabContentProps {
  courts: CourtProps[];
  availablePeople: PersonData[];
  selectedCourt: CourtProps | null;
  selectedTimeSlot?: string;
  showAssigned: boolean;
  setSelectedCourt: (court: CourtProps) => void;
  setShowAssigned: (show: boolean) => void;
  onAssignPerson: (courtId: string, person: PersonData, timeSlot?: string) => void;
  onRemovePerson?: (personId: string, timeSlot?: string) => void;
}

export function PeopleTabContent({ 
  courts, 
  availablePeople, 
  selectedCourt, 
  selectedTimeSlot,
  showAssigned, 
  setSelectedCourt,
  setShowAssigned,
  onAssignPerson,
  onRemovePerson
}: PeopleTabContentProps) {
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
              {showAssigned ? "Assigned People" : "Assign People"}
            </h3>
            <ToggleViewButton 
              showAssigned={showAssigned}
              setShowAssigned={setShowAssigned}
            />
          </div>

          {showAssigned ? (
            <PeopleList
              people={selectedCourt.occupants}
              showAssigned={true}
              selectedTimeSlot={selectedTimeSlot}
              onRemove={onRemovePerson}
            />
          ) : (
            <PeopleList
              people={availablePeople}
              showAssigned={false}
              onAssign={(person) => onAssignPerson(selectedCourt.id, person, selectedTimeSlot)}
            />
          )}
        </>
      )}
    </div>
  );
}
