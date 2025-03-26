
import React from "react";
import { PersonData, ActivityData } from "../types";
import { TimeSlotHeader } from "./TimeSlotHeader";
import { TimeSlotActivities } from "./TimeSlotActivities";
import { TimeSlotOccupants } from "./TimeSlotOccupants";
import { TimeSlotIndicators } from "./TimeSlotIndicators";
import { TimeSlotDropArea } from "./TimeSlotDropArea";
import { calculateProgramDuration, calculateMaxProgramDuration } from "./utils";

interface TimeSlotProps {
  time: string;
  courtId: string;
  occupants: PersonData[];
  activities: ActivityData[];
  onRemovePerson: (personId: string, timeSlot?: string) => void;
  onRemoveActivity: (activityId: string, timeSlot?: string) => void;
  onDrop: (courtId: string, person: PersonData, position?: { x: number, y: number }, timeSlot?: string) => void;
  onActivityDrop: (courtId: string, activity: ActivityData, timeSlot?: string) => void;
}

export function TimeSlot({ 
  time, 
  courtId, 
  occupants, 
  activities,
  onRemovePerson,
  onRemoveActivity,
  onDrop,
  onActivityDrop
}: TimeSlotProps) {
  // Define the timeSlots array for this component's internal use
  // This should be passed from a parent component in a real implementation
  const timeSlots = ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", 
                     "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", 
                     "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", 
                     "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"];
  
  // Drop handler for people (players or coaches)
  const handlePersonDrop = (person: PersonData, timeSlot: string) => {
    let duration = calculateProgramDuration(person);
    
    // For coaches, we need to check if there are players already assigned to this time slot
    if (person.type === "coach") {
      const maxPlayerDuration = calculateMaxProgramDuration(courtId, timeSlot, [{ id: courtId, occupants }]);
      
      // Use the max duration of players if it's greater than coach's default duration
      if (maxPlayerDuration > duration) {
        duration = maxPlayerDuration;
        console.log(`Adjusted coach duration to match players: ${duration} hours`);
      }
    }
    
    console.log("Dropping person with duration:", duration, person);
    onDrop(courtId, { ...person, durationHours: duration }, undefined, timeSlot);
  };
  
  // Filter occupants for this time slot and spanning slots
  const slotOccupants = occupants.filter(occupant => {
    // Check if this slot is the start time
    if (occupant.timeSlot === time) return true;
    
    // Check if this slot is within a span
    if (occupant.timeSlot && occupant.endTimeSlot) {
      const slotIndex = timeSlots.indexOf(time);
      const startIndex = timeSlots.indexOf(occupant.timeSlot);
      const endIndex = timeSlots.indexOf(occupant.endTimeSlot);
      return slotIndex > startIndex && slotIndex <= endIndex;
    }
    
    return false;
  });
  
  // Filter activities for this time slot
  const slotActivities = activities.filter(
    activity => activity.timeSlot === time
  );
  
  return (
    <TimeSlotDropArea
      courtId={courtId}
      time={time}
      onDrop={(courtId, person, position, timeSlot) => {
        if (timeSlot) {
          handlePersonDrop(person, timeSlot);
        }
      }}
      onActivityDrop={onActivityDrop}
      data-time-slot={time}
    >
      <TimeSlotHeader time={time} />
      
      <TimeSlotActivities 
        activities={slotActivities} 
        onRemoveActivity={onRemoveActivity}
        time={time}
      />
      
      <TimeSlotOccupants 
        occupants={slotOccupants} 
        onRemovePerson={onRemovePerson}
        time={time}
      />
      
      <TimeSlotIndicators 
        occupantsCount={slotOccupants.length} 
        activitiesCount={slotActivities.length} 
      />
    </TimeSlotDropArea>
  );
}
