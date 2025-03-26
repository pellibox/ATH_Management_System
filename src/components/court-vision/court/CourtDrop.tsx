
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
    accept: [PERSON_TYPES.PLAYER, PERSON_TYPES.COACH, "activity"],
    drop: (item: any, monitor) => {
      const clientOffset = monitor.getClientOffset();
      const initialOffset = monitor.getInitialClientOffset();
      const containerRect = document.getElementById(`court-${courtId}`)?.getBoundingClientRect();
      
      if (clientOffset && containerRect && initialOffset) {
        const position = {
          x: (clientOffset.x - containerRect.left) / containerRect.width,
          y: (clientOffset.y - containerRect.top) / containerRect.height
        };
        
        if (item.type === PERSON_TYPES.PLAYER || item.type === PERSON_TYPES.COACH) {
          if (viewMode === "layout") {
            onDrop(courtId, item as PersonData, position);
          } else {
            console.log("Court component: schedule view drop - no direct action needed");
          }
        } else if (item.type === "activity") {
          if (viewMode === "layout") {
            onActivityDrop(courtId, item as ActivityData);
          } else {
            console.log("Court component: schedule view activity drop - no direct action needed");
          }
        }
      } else {
        if (item.type === PERSON_TYPES.PLAYER || item.type === PERSON_TYPES.COACH) {
          if (viewMode === "layout") {
            onDrop(courtId, item as PersonData);
          } else {
            console.log("Court component: schedule view drop without position - no direct action needed");
          }
        } else if (item.type === "activity") {
          if (viewMode === "layout") {
            onActivityDrop(courtId, item as ActivityData);
          } else {
            console.log("Court component: schedule view activity drop without position - no direct action needed");
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
