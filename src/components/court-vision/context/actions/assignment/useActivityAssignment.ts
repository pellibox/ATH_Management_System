
import { useToast } from "@/hooks/use-toast";
import { ActivityData } from "../../../types";
import { calculateSlotsDuration, getActivityDurationHours } from "./utils";

export const useActivityAssignment = (
  courts: any[],
  setCourts: React.Dispatch<React.SetStateAction<any[]>>,
  selectedDate: Date,
  timeSlots: string[]
) => {
  const { toast } = useToast();

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
        const activityExists = court.activities.some((a: ActivityData) => 
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

  const handleRemoveActivity = (activityId: string, timeSlot?: string) => {
    const updatedCourts = courts.map(court => ({
      ...court,
      activities: court.activities.filter((activity: ActivityData) => 
        activity.id !== activityId || activity.timeSlot !== timeSlot
      )
    }));
    
    setCourts(updatedCourts);
    
    toast({
      title: "Attività Rimossa",
      description: "L'attività è stata rimossa dal campo",
    });
  };

  const handleAssignPlayerToActivity = (activityId: string, playerId: string) => {
    let updatedCourts = JSON.parse(JSON.stringify(courts));
    
    updatedCourts = updatedCourts.map((court: any) => {
      const activityIndex = court.activities.findIndex((a: ActivityData) => a.id === activityId);
      
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

  return {
    handleActivityDrop,
    handleRemoveActivity,
    handleAssignPlayerToActivity
  };
};
