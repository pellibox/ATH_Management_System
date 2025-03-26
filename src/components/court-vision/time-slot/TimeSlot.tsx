
import React from "react";
import { PersonData, ActivityData } from "../types";
import { TimeSlotHeader } from "./TimeSlotHeader";
import { TimeSlotActivities } from "./TimeSlotActivities";
import { TimeSlotOccupants } from "./TimeSlotOccupants";
import { TimeSlotIndicators } from "./TimeSlotIndicators";
import { TimeSlotDropArea } from "./TimeSlotDropArea";

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
  // Filter occupants for this time slot
  const slotOccupants = occupants.filter(
    occupant => occupant.timeSlot === time
  );
  
  // Filter activities for this time slot
  const slotActivities = activities.filter(
    activity => activity.timeSlot === time
  );
  
  return (
    <TimeSlotDropArea
      courtId={courtId}
      time={time}
      onDrop={(courtId, person, position, timeSlot) => {
        console.log("Dropping at time:", timeSlot, person);
        onDrop(courtId, person, position, timeSlot);
      }}
      onActivityDrop={(courtId, activity, timeSlot) => {
        console.log("Dropping activity at time:", timeSlot, activity);
        onActivityDrop(courtId, activity, timeSlot);
      }}
    >
      <TimeSlotHeader time={time} />
      
      {/* Activities */}
      <TimeSlotActivities 
        activities={slotActivities} 
        onRemoveActivity={onRemoveActivity}
        time={time}
      />
      
      {/* Court occupants (people) */}
      <TimeSlotOccupants 
        occupants={slotOccupants} 
        onRemovePerson={onRemovePerson}
        time={time}
      />
      
      {/* Indicators for number of people and activities */}
      <TimeSlotIndicators 
        occupantsCount={slotOccupants.length} 
        activitiesCount={slotActivities.length} 
      />
    </TimeSlotDropArea>
  );
}
