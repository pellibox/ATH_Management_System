
import React from "react";
import { useDrop } from "react-dnd";
import { PersonData, ActivityData } from "../types";

interface TimeSlotDropAreaProps {
  courtId: string;
  time: string;
  children: React.ReactNode;
  onDrop: (
    courtId: string,
    person: PersonData,
    position?: { x: number; y: number },
    timeSlot?: string
  ) => void;
  onActivityDrop: (
    courtId: string,
    activity: ActivityData,
    timeSlot?: string
  ) => void;
  "data-time-slot"?: string;
}

export function TimeSlotDropArea({
  courtId,
  time,
  children,
  onDrop,
  onActivityDrop,
  "data-time-slot": dataTimeSlot,
  ...rest
}: TimeSlotDropAreaProps) {
  // Handle dropping a person
  const [{ isOver }, dropRef] = useDrop(() => ({
    accept: ["person", "activity"],
    drop: (item: any, monitor) => {
      // Get drop position
      const dropPosition = monitor.getClientOffset();
      
      if (item.type === "person" || item.type === "player" || item.type === "coach") {
        // Person drop
        const person = item;
        onDrop(courtId, person, undefined, time);
        return { dropped: true };
      } else if (item.type === "activity") {
        // Activity drop
        const activity = item;
        onActivityDrop(courtId, activity, time);
        return { dropped: true };
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver()
    })
  }), [courtId, time, onDrop, onActivityDrop]);

  return (
    <div
      ref={dropRef}
      className={`relative border-b border-gray-200 p-2 transition-colors ${
        isOver ? "bg-green-50" : ""
      }`}
      data-time-slot={dataTimeSlot || time}
      {...rest}
    >
      {children}
    </div>
  );
}
