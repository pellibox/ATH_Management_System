import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { PersonData } from "../../../types";
import { PERSON_TYPES } from "../../../constants";
import { calculateSlotsDuration } from "./utils";
import { PendingAssignment } from "./types";

export const usePersonAssignment = (
  courts: any[],
  setCourts: React.Dispatch<React.SetStateAction<any[]>>,
  people: PersonData[],
  setPeople: React.Dispatch<React.SetStateAction<PersonData[]>>,
  selectedDate: Date,
  timeSlots: string[]
) => {
  const { toast } = useToast();
  const [showExtraHoursDialog, setShowExtraHoursDialog] = useState(false);
  const [pendingAssignment, setPendingAssignment] = useState<PendingAssignment | null>(null);

  const processAssignment = (courtId: string, person: PersonData, position?: { x: number, y: number }, timeSlot?: string) => {
    // Check if moving from an existing assignment (with source info)
    const isMovingFromExistingAssignment = person.sourceTimeSlot || person.courtId;

    // Create a deep copy of the person object to avoid reference issues
    const personWithCourtInfo = { 
      ...JSON.parse(JSON.stringify(person)), 
      courtId,
      position: position || { x: Math.random() * 0.8 + 0.1, y: Math.random() * 0.8 + 0.1 },
      date: selectedDate.toISOString().split('T')[0],
      durationHours: person.durationHours || 1,
      programColor: person.programColor || (person.type === PERSON_TYPES.PLAYER ? "#3b82f6" : "#ef4444")
    };

    // Keep track of the source time slot and court ID for possible removal later
    const sourceTimeSlot = person.timeSlot || person.sourceTimeSlot;
    const sourceCourtId = person.courtId;

    // IMPORTANT: Set the timeSlot if explicitly provided in the drop
    if (timeSlot) {
      console.log(`Setting timeSlot to ${timeSlot} for ${person.name}`);
      personWithCourtInfo.timeSlot = timeSlot;
      
      // Calculate end time slot if duration > 1 or has fractional hours (like 1.5)
      if (personWithCourtInfo.durationHours !== 1) {
        const timeSlotIndex = timeSlots.indexOf(timeSlot);
        if (timeSlotIndex >= 0) {
          // Convert duration to number of slots (considering half-hour slots)
          const slotsNeeded = calculateSlotsDuration(personWithCourtInfo.durationHours);
          const endSlotIndex = Math.min(timeSlotIndex + slotsNeeded - 1, timeSlots.length - 1);
          personWithCourtInfo.endTimeSlot = timeSlots[endSlotIndex];
          console.log(`Setting endTimeSlot to ${personWithCourtInfo.endTimeSlot} (spanning ${slotsNeeded} slots)`);
        }
      }
    }

    // Create a new courts array
    let updatedCourts = JSON.parse(JSON.stringify(courts));

    // Handle assignments differently based on person type
    if (person.type === PERSON_TYPES.COACH) {
      // For coaches, we only remove them from a specific time slot, not from all
      if (sourceTimeSlot && sourceCourtId) {
        updatedCourts = updatedCourts.map((court: any) => {
          if (court.id === sourceCourtId) {
            return {
              ...court,
              occupants: court.occupants.filter((p: PersonData) => 
                !(p.id === person.id && p.timeSlot === sourceTimeSlot)
              )
            };
          }
          return court;
        });
      }
    } else {
      // For players, if dropping to a new time slot, remove from old time slot if exists
      if (timeSlot) {
        updatedCourts = updatedCourts.map((court: any) => {
          return {
            ...court,
            occupants: court.occupants.filter((p: PersonData) => 
              !(p.id === person.id && p.timeSlot === timeSlot)
            )
          };
        });
      } else {
        // For layout view (non-time-slot), remove from all time slots
        updatedCourts = updatedCourts.map((court: any) => {
          return {
            ...court,
            occupants: court.occupants.filter((p: PersonData) => p.id !== person.id)
          };
        });
      }
    }

    // Add person to the target court
    updatedCourts = updatedCourts.map((court: any) => {
      if (court.id === courtId) {
        return {
          ...court,
          occupants: [...court.occupants, personWithCourtInfo],
        };
      }
      return court;
    });

    console.log("Updated courts after drop:", updatedCourts);
    setCourts(updatedCourts);

    // Remove from available list if coming from there (for players only)
    const isFromAvailableList = people.some(p => p.id === person.id);
    if (isFromAvailableList && person.type === PERSON_TYPES.PLAYER) {
      setPeople(people.filter(p => p.id !== person.id));
    }

    // Show success notification
    toast({
      title: isMovingFromExistingAssignment ? "Persona Spostata" : "Persona Assegnata",
      description: `${person.name} è stata ${isMovingFromExistingAssignment ? "spostata" : "assegnata"} al campo ${courts.find(c => c.id === courtId)?.name} #${courts.find(c => c.id === courtId)?.number}${timeSlot ? ` alle ${timeSlot}` : ''}`,
    });
  };

  const handleRemovePerson = (personId: string, timeSlot?: string) => {
    console.log("handleRemovePerson:", { personId, timeSlot });
    
    // First, find the person in the courts
    let personToReset: PersonData | null = null;
    let isPlayer = false;
    
    // Identify the person and their type
    courts.forEach(court => {
      court.occupants.forEach((occupant: PersonData) => {
        if (occupant.id === personId && (!timeSlot || occupant.timeSlot === timeSlot)) {
          personToReset = { ...occupant };
          isPlayer = occupant.type === PERSON_TYPES.PLAYER;
        }
      });
    });
    
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
    
    // If it's a player, add them back to the available list
    if (personToReset && isPlayer) {
      // Reset assignment-specific properties
      const resetPerson: PersonData = {
        ...personToReset,
        courtId: undefined,
        timeSlot: undefined,
        sourceTimeSlot: undefined,
        endTimeSlot: undefined,
        position: undefined,
        // Maintain other properties like name, programId, etc.
      };
      
      // Check if already in available people list
      const alreadyInList = people.some(p => p.id === personId);
      
      if (!alreadyInList) {
        // Only add to available list if not already there
        setPeople(prev => [...prev, resetPerson]);
        console.log("Player added back to available list:", resetPerson.name);
      }
    }
    
    toast({
      title: "Persona Rimossa",
      description: "La persona è stata rimossa dal campo",
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
    processAssignment,
    handleRemovePerson,
    handleAddToDragArea,
    showExtraHoursDialog,
    setShowExtraHoursDialog,
    pendingAssignment,
    setPendingAssignment,
  };
};
