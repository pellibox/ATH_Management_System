
import { useState } from "react";
import { PersonData, ActivityData, CourtProps, Program } from "../../types";
import { useToast } from "@/hooks/use-toast";
import { PERSON_TYPES } from "../../constants";

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
  const [showExtraHoursDialog, setShowExtraHoursDialog] = useState(false);
  const [pendingAssignment, setPendingAssignment] = useState<{
    courtId: string;
    person: PersonData;
    position?: { x: number, y: number };
    timeSlot?: string;
  } | null>(null);

  // Helper function to check if a player already has assignments for the day
  const getPlayerDailyHours = (playerId: string) => {
    let totalHours = 0;
    courts.forEach(court => {
      court.occupants
        .filter(p => p.id === playerId && p.type === PERSON_TYPES.PLAYER)
        .forEach(p => {
          totalHours += p.durationHours || 1;
        });
    });
    
    // Also add hours from activities
    courts.forEach(court => {
      court.activities.forEach(activity => {
        // Check if this activity has assigned participants that include this player
        if (activity.participants && activity.participants.includes(playerId)) {
          totalHours += activity.durationHours || 1;
        }
      });
    });
    
    return totalHours;
  };

  const handleDrop = (courtId: string, person: PersonData, position?: { x: number, y: number }, timeSlot?: string) => {
    console.log("handleDrop called:", { courtId, person, position, timeSlot });
    
    // Check if this is a player with existing assignments
    if (person.type === PERSON_TYPES.PLAYER) {
      const currentHours = getPlayerDailyHours(person.id);
      // If player already has assignments and this would add more hours
      if (currentHours > 0) {
        // Store the pending assignment and show dialog
        setPendingAssignment({ courtId, person, position, timeSlot });
        setShowExtraHoursDialog(true);
        return;
      }
    }
    
    // Proceed with assignment
    processAssignment(courtId, person, position, timeSlot);
  };

  // Helper to calculate exact duration from hours that may be fractions
  const calculateSlotsDuration = (hours: number): number => {
    // For 30-minute time slots, multiply by 2 to get number of slots
    return Math.ceil(hours * 2);
  };

  const processAssignment = (courtId: string, person: PersonData, position?: { x: number, y: number }, timeSlot?: string) => {
    const isMovingFromExistingAssignment = courts.some(court => 
      court.occupants.some(p => p.id === person.id && p.timeSlot === person.sourceTimeSlot)
    );

    const personDuration = person.durationHours || 1;
    const program = programs.find(p => p.id === person.programId);
    
    // Create a deep copy of the person object to avoid reference issues
    const personWithCourtInfo = { 
      ...JSON.parse(JSON.stringify(person)), 
      courtId,
      position: position || { x: Math.random() * 0.8 + 0.1, y: Math.random() * 0.8 + 0.1 },
      date: selectedDate.toISOString().split('T')[0],
      durationHours: personDuration,
      programColor: program?.color
    };

    // IMPORTANT: Set the timeSlot if explicitly provided in the drop
    // This ensures players/coaches can be dropped on specific time slots
    if (timeSlot) {
      console.log(`Setting timeSlot to ${timeSlot} for ${person.name}`);
      personWithCourtInfo.timeSlot = timeSlot;
      
      // Calculate end time slot if duration > 1 or has fractional hours (like 1.5)
      if (personDuration !== 1) {
        const timeSlotIndex = timeSlots.indexOf(timeSlot);
        if (timeSlotIndex >= 0) {
          // Convert duration to number of slots (considering half-hour slots)
          const slotsNeeded = calculateSlotsDuration(personDuration);
          const endSlotIndex = Math.min(timeSlotIndex + slotsNeeded - 1, timeSlots.length - 1);
          personWithCourtInfo.endTimeSlot = timeSlots[endSlotIndex];
          console.log(`Setting endTimeSlot to ${personWithCourtInfo.endTimeSlot} (spanning ${slotsNeeded} slots)`);
        }
      }
    }

    // Create a new courts array and properly handle occupant updates
    let updatedCourts = JSON.parse(JSON.stringify(courts));

    // For coaches, we allow multiple assignments across different time slots
    // For players, we want to move them from any existing assignment
    if (person.type === PERSON_TYPES.COACH) {
      // If moving a coach within the same court but to a different time slot
      if (person.sourceTimeSlot && person.courtId === courtId && person.sourceTimeSlot !== timeSlot) {
        console.log(`Moving coach from time slot ${person.sourceTimeSlot} to ${timeSlot} on same court`);
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
      } 
      // If we're moving the coach from another time slot assignment, just remove that specific assignment
      else if (person.sourceTimeSlot && person.courtId) {
        updatedCourts = updatedCourts.map((court: CourtProps) => {
          if (court.id === person.courtId) {
            return {
              ...court,
              occupants: court.occupants.filter((p: PersonData) => 
                !(p.id === person.id && p.timeSlot === person.sourceTimeSlot)
              )
            };
          }
          return court;
        });
      }
      // Note: For coaches, we don't remove other time slot assignments
    } else {
      // For players, remove from any existing courts (only one assignment allowed)
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

    console.log("Updated courts after drop:", updatedCourts);
    setCourts(updatedCourts);

    // Remove from available list if coming from there
    // IMPORTANT: Only remove players from available list, keep coaches always available
    const isFromAvailableList = people.some(p => p.id === person.id);
    if (isFromAvailableList && person.type === PERSON_TYPES.PLAYER) {
      setPeople(people.filter(p => p.id !== person.id));
    }

    // Show success notification
    toast({
      title: isMovingFromExistingAssignment ? "Persona Spostata" : "Persona Assegnata",
      description: `${person.name} è stata ${isMovingFromExistingAssignment ? "spostata" : "assegnata"} al campo ${courts.find(c => c.id === courtId)?.name} #${courts.find(c => c.id === courtId)?.number}${timeSlot ? ` alle ${timeSlot}` : ''}${personDuration > 1 ? ` per ${personDuration} ore` : ''}`,
    });
  };

  const handleActivityDrop = (courtId: string, activity: ActivityData, timeSlot?: string) => {
    // Calculate duration hours if not already present
    const durationHours = activity.durationHours || getActivityDurationHours(activity.duration);
    
    // Prepare activity with additional information
    const activityWithDetails = {
      ...activity,
      timeSlot,
      startTime: timeSlot, // Set both for compatibility
      date: selectedDate.toISOString().split('T')[0],
      durationHours
    };
    
    // Calculate end time slot if applicable
    if (timeSlot && durationHours !== 1) {
      const timeSlotIndex = timeSlots.indexOf(timeSlot);
      if (timeSlotIndex >= 0) {
        const slotsNeeded = calculateSlotsDuration(durationHours);
        const endSlotIndex = Math.min(timeSlotIndex + slotsNeeded - 1, timeSlots.length - 1);
        activityWithDetails.endTimeSlot = timeSlots[endSlotIndex];
      }
    }
    
    // Update courts array with the new activity
    const updatedCourts = courts.map(court => {
      if (court.id === courtId) {
        // If already exists with this timeSlot, don't add it again
        const activityExists = court.activities.some(a => 
          a.id === activity.id && a.timeSlot === timeSlot
        );
        
        if (activityExists) {
          return court;
        }
        
        // For activities with participants, track hours for each participant
        if (activity.participants && activity.participants.length > 0) {
          // We would need a way to update the player's hours here
          // This would be tracked in a separate system
          console.log(`Activity ${activity.name} has ${activity.participants.length} participants`);
        }
        
        return {
          ...court,
          activities: [...court.activities, activityWithDetails],
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

  // Helper to get duration hours from string
  const getActivityDurationHours = (duration?: string): number => {
    if (!duration) return 1;
    if (duration === "30m") return 0.5;
    if (duration === "45m") return 0.75;
    if (duration === "1h") return 1;
    if (duration === "1.5h") return 1.5;
    if (duration === "2h") return 2;
    return 1; // Default
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

  // Function to assign a player to an activity
  const handleAssignPlayerToActivity = (activityId: string, playerId: string) => {
    let updatedCourts = JSON.parse(JSON.stringify(courts));
    
    updatedCourts = updatedCourts.map((court: CourtProps) => {
      const activityIndex = court.activities.findIndex(a => a.id === activityId);
      
      if (activityIndex >= 0) {
        const activities = [...court.activities];
        const activity = activities[activityIndex];
        
        // Initialize participants array if it doesn't exist
        if (!activity.participants) {
          activity.participants = [];
        }
        
        // Add player if not already in participants
        if (!activity.participants.includes(playerId)) {
          activity.participants.push(playerId);
          
          // Update the activity in the array
          activities[activityIndex] = activity;
          
          // Log for tracking
          console.log(`Player ${playerId} assigned to activity ${activity.name}`);
          
          // Update player's activity history if needed
          // This would connect to a player history tracking system
        }
        
        return {
          ...court,
          activities
        };
      }
      
      return court;
    });
    
    setCourts(updatedCourts);
    
    toast({
      title: "Giocatore Assegnato",
      description: "Il giocatore è stato assegnato all'attività",
    });
  };

  const handleConfirmExtraHours = () => {
    if (pendingAssignment) {
      const { courtId, person, position, timeSlot } = pendingAssignment;
      processAssignment(courtId, person, position, timeSlot);
      setPendingAssignment(null);
      setShowExtraHoursDialog(false);
    }
  };

  const handleCancelExtraHours = () => {
    setPendingAssignment(null);
    setShowExtraHoursDialog(false);
  };

  const getCurrentHours = (): number => {
    if (!pendingAssignment) return 0;
    return getPlayerDailyHours(pendingAssignment.person.id);
  };

  const getNewHours = (): number => {
    if (!pendingAssignment) return 0;
    const currentHours = getCurrentHours();
    return currentHours + (pendingAssignment.person.durationHours || 1);
  };

  return {
    handleDrop,
    handleActivityDrop,
    handleRemovePerson,
    handleRemoveActivity,
    handleAddToDragArea,
    handleAssignPlayerToActivity,
    showExtraHoursDialog,
    setShowExtraHoursDialog,
    pendingAssignment,
    getCurrentHours,
    getNewHours,
    handleConfirmExtraHours,
    handleCancelExtraHours
  };
};
