
import { useState } from "react";
import { useDrop } from "react-dnd";
import { PERSON_TYPES } from "../constants";
import { PersonData, ActivityData } from "../types";

interface CourtDropProps {
  courtId: string;
  children: React.ReactNode;
  viewMode: "layout" | "schedule";
  onDrop: (courtId: string, person: PersonData, position?: { x: number, y: number }, time?: string) => void;
  onActivityDrop: (courtId: string, activity: ActivityData, time?: string) => void;
}

export function CourtDrop({ 
  courtId, 
  children, 
  viewMode,
  onDrop, 
  onActivityDrop
}: CourtDropProps) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: [PERSON_TYPES.PLAYER, PERSON_TYPES.COACH, "activity", "person"],
    drop: (item: any, monitor) => {
      const clientOffset = monitor.getClientOffset();
      const initialOffset = monitor.getInitialClientOffset();
      const containerRect = document.getElementById(`court-${courtId}`)?.getBoundingClientRect();
      
      if (clientOffset && containerRect && initialOffset) {
        const position = {
          x: (clientOffset.x - containerRect.left) / containerRect.width,
          y: (clientOffset.y - containerRect.top) / containerRect.height
        };
        
        if (item.type === PERSON_TYPES.PLAYER || item.type === PERSON_TYPES.COACH || item.type === "person") {
          if (viewMode === "layout") {
            onDrop(courtId, item as PersonData, position);
          } else {
            console.log("Court component: schedule view drop - sending to schedule handler");
            // In schedule view, we'll still process the drop but let the TimeSlotDropArea handle the specific time
            onDrop(courtId, item as PersonData, position);
          }
        } else if (item.type === "activity") {
          if (viewMode === "layout") {
            onActivityDrop(courtId, item as ActivityData);
          } else {
            console.log("Court component: schedule view activity drop - sending to schedule handler");
            onActivityDrop(courtId, item as ActivityData);
          }
        }
      } else {
        if (item.type === PERSON_TYPES.PLAYER || item.type === PERSON_TYPES.COACH || item.type === "person") {
          if (viewMode === "layout") {
            onDrop(courtId, item as PersonData);
          } else {
            console.log("Court component: schedule view drop without position - sending to schedule handler");
            onDrop(courtId, item as PersonData);
          }
        } else if (item.type === "activity") {
          if (viewMode === "layout") {
            onActivityDrop(courtId, item as ActivityData);
          } else {
            console.log("Court component: schedule view activity drop without position - sending to schedule handler");
            onActivityDrop(courtId, item as ActivityData);
          }
        }
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }), [courtId, onDrop, onActivityDrop, viewMode]);

  return (
    <div
      ref={drop}
      className={isOver ? "ring-2 ring-ath-red-clay" : ""}
    >
      {children}
    </div>
  );
}
