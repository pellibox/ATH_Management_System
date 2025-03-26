
import React from "react";
import { useDrop } from "react-dnd";
import { PERSON_TYPES } from "../constants";
import { PersonData, ActivityData } from "../types";

interface TimeSlotDropAreaProps {
  children: React.ReactNode;
  courtId: string;
  time: string;
  onDrop: (courtId: string, person: PersonData, position?: { x: number, y: number }, timeSlot?: string) => void;
  onActivityDrop: (courtId: string, activity: ActivityData, timeSlot?: string) => void;
}

export function TimeSlotDropArea({
  children,
  courtId,
  time,
  onDrop,
  onActivityDrop
}: TimeSlotDropAreaProps) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: [PERSON_TYPES.PLAYER, PERSON_TYPES.COACH, "activity"],
    drop: (item: any) => {
      if (item.type === "activity") {
        // Handle activity drop
        const activity = item as ActivityData;
        onActivityDrop(courtId, activity, time);
      } else {
        // Handle person drop
        const person = item as PersonData;
        onDrop(courtId, person, undefined, time);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }), [courtId, time, onDrop, onActivityDrop]);

  return (
    <div
      ref={drop}
      className={`min-h-20 border-b border-gray-200 p-2 relative ${
        isOver ? "bg-gray-100" : ""
      }`}
    >
      {children}
    </div>
  );
}
