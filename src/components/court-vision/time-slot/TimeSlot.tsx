
import React from "react";
import { PersonData, ActivityData } from "../types";
import { TimeSlotHeader } from "./TimeSlotHeader";
import { TimeSlotActivities } from "./TimeSlotActivities";
import { TimeSlotOccupants } from "./TimeSlotOccupants";
import { TimeSlotIndicators } from "./TimeSlotIndicators";
import { TimeSlotDropArea } from "./TimeSlotDropArea";
import { calculateProgramDuration } from "./utils";

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
  // Calculate duration and end time slot based on program
  const handlePersonDrop = (person: PersonData, timeSlot: string) => {
    const duration = calculateProgramDuration(person);
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
