import { useState } from "react";
import { PersonData, ActivityData, CourtProps, Program } from "../../types";
import { useToast } from "@/hooks/use-toast";

export const useAssignmentActions = (
  courts: CourtProps[],
  setCourts: React.Dispatch<React.SetStateAction<CourtProps[]>>,
  people: PersonData[],
  setPeople: React.Dispatch<React.SetStateAction<PersonData[]>>,
  programs: Program[],
  selectedDate: Date,
  timeSlots: string[]
) => {
  const { toast } = useToast();

  const handleDrop = (courtId: string, person: PersonData, position?: { x: number, y: number }, timeSlot?: string) => {
    console.log("handleDrop called:", { courtId, person, position, timeSlot });
    
    const isMovingFromExistingAssignment = courts.some(court => 
      court.occupants.some(p => p.id === person.id)
    );

    const personDuration = person.durationHours || 1;
    
    const program = programs.find(p => p.id === person.programId);
    
    // Fix: Make a deep copy of the person object to avoid reference issues
    const personWithCourtInfo = { 
      ...JSON.parse(JSON.stringify(person)), 
      courtId,
      position: position || { x: Math.random() * 0.8 + 0.1, y: Math.random() * 0.8 + 0.1 },
      timeSlot: timeSlot || person.timeSlot, // Keep the existing timeSlot if not provided
      date: selectedDate.toISOString().split('T')[0],
      durationHours: personDuration,
      programColor: program?.color
    };

    // Important: Only set the timeSlot if explicitly provided in the drop
    // This ensures players/coaches can be dropped on specific time slots
    if (timeSlot) {
      console.log(`Setting timeSlot to ${timeSlot}`);
      personWithCourtInfo.timeSlot = timeSlot;
      
      // Calculate end time slot if duration > 1
      const timeSlotIndex = timeSlots.indexOf(timeSlot);
      if (timeSlotIndex >= 0 && personDuration > 1) {
        const endSlotIndex = Math.min(timeSlotIndex + personDuration - 1, timeSlots.length - 1);
        personWithCourtInfo.endTimeSlot = timeSlots[endSlotIndex];
      }
    }

    // Fix: Create a new courts array and properly handle occupant updates
    let updatedCourts = JSON.parse(JSON.stringify(courts));

    // If moving from one time slot to another on same court, make sure to only remove from the source time slot
    if (person.sourceTimeSlot && person.courtId === courtId && person.sourceTimeSlot !== timeSlot) {
      console.log(`Moving from time slot ${person.sourceTimeSlot} to ${timeSlot} on same court`);
      updatedCourts = updatedCourts.map((court: CourtProps) => {
        if (court.id === courtId) {
          return {
            ...court,
            occupants: court.occupants.filter((p: PersonData) => 
              !(p.id === person.id && p.timeSlot === person.sourceTimeSlot)
            )
          };
        }
        return court;
      });
    } else {
      // Otherwise, remove person from any existing courts
      updatedCourts = updatedCourts.map((court: CourtProps) => {
        return {
          ...court,
          occupants: court.occupants.filter((p: PersonData) => p.id !== person.id)
        };
      });
    }

    // Add person to the target court
    updatedCourts = updatedCourts.map((court: CourtProps) => {
      if (court.id === courtId) {
        return {
          ...court,
          occupants: [...court.occupants, personWithCourtInfo],
        };
      }
      return court;
    });

    console.log("Updated courts:", updatedCourts);
    setCourts(updatedCourts);

    const isFromAvailableList = people.some(p => p.id === person.id);
    if (isFromAvailableList) {
      setPeople(people.filter(p => p.id !== person.id));
    }

    toast({
      title: isMovingFromExistingAssignment ? "Persona Spostata" : "Persona Assegnata",
      description: `${person.name} è stata ${isMovingFromExistingAssignment ? "spostata" : "assegnata"} al campo ${courts.find(c => c.id === courtId)?.name} #${courts.find(c => c.id === courtId)?.number}${timeSlot ? ` alle ${timeSlot}` : ''}${personDuration > 1 ? ` per ${personDuration} ore` : ''}`,
    });
  };

  const handleActivityDrop = (courtId: string, activity: ActivityData, timeSlot?: string) => {
    const updatedCourts = courts.map(court => {
      if (court.id === courtId) {
        return {
          ...court,
          activities: [...court.activities, { ...activity, timeSlot }],
        };
      }
      return court;
    });
    
    setCourts(updatedCourts);
    
    toast({
      title: "Attività Assegnata",
      description: `${activity.name} è stata assegnata al campo ${courts.find(c => c.id === courtId)?.name} #${courts.find(c => c.id === courtId)?.number}${timeSlot ? ` alle ${timeSlot}` : ''}`,
    });
  };

  const handleRemovePerson = (personId: string, timeSlot?: string) => {
    console.log("handleRemovePerson:", { personId, timeSlot });
    
    let updatedCourts;
    
    if (timeSlot) {
      // Remove person only from specific time slot
      updatedCourts = courts.map(court => ({
        ...court,
        occupants: court.occupants.filter(person => 
          !(person.id === personId && person.timeSlot === timeSlot)
        )
      }));
    } else {
      // Remove person from all time slots
      updatedCourts = courts.map(court => ({
        ...court,
        occupants: court.occupants.filter(person => person.id !== personId)
      }));
    }
    
    setCourts(updatedCourts);
    
    toast({
      title: "Persona Rimossa",
      description: "La persona è stata rimossa dal campo",
    });
  };

  const handleRemoveActivity = (activityId: string, timeSlot?: string) => {
    const updatedCourts = courts.map(court => ({
      ...court,
      activities: court.activities.filter(activity => activity.id !== activityId || activity.timeSlot !== timeSlot)
    }));
    
    setCourts(updatedCourts);
    
    toast({
      title: "Attività Rimossa",
      description: "L'attività è stata rimossa dal campo",
    });
  };

  const handleAddToDragArea = (person: PersonData) => {
    setPeople([...people, person]);
    toast({
      title: "Persona Aggiunta",
      description: `${person.name} è stata aggiunta all'area di trascinamento`,
    });
  };

  return {
    handleDrop,
    handleActivityDrop,
    handleRemovePerson,
    handleRemoveActivity,
    handleAddToDragArea
  };
};
