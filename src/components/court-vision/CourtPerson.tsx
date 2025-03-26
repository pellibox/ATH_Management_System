
import { useState } from "react";
import { useDrag } from "react-dnd";
import { PERSON_TYPES } from "./constants";
import { PersonData } from "./types";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import { Trash2, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface CourtPersonProps {
  person: PersonData;
  index: number;
  total: number;
  position?: { x: number; y: number };
  onRemove: (personId: string) => void;
}

export function CourtPerson({ person, index, total, position, onRemove }: CourtPersonProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: person.type,
    item: { ...person },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const getBackgroundColor = () => {
    // First check if we have a direct program color
    if (person.programColor && typeof person.programColor === 'string') {
      return person.programColor;
    }
    
    // Default colors based on type
    return person.type === PERSON_TYPES.PLAYER ? "#3b82f6" : "#ef4444";
  };

  const getTextColor = () => {
    return "#ffffff"; // White text for better contrast
  };

  const bgColor = getBackgroundColor();

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          ref={drag}
          className={`flex items-center rounded-md px-2 py-1 shadow-sm border transition-opacity ${
            isDragging ? "opacity-50" : ""
          } cursor-grab`}
          style={{
            backgroundColor: bgColor,
            color: getTextColor(),
            borderColor: "rgba(255,255,255,0.3)"
          }}
        >
          <Avatar className="h-6 w-6 mr-2 flex-shrink-0">
            <AvatarFallback style={{ backgroundColor: bgColor }}>
              {person.name.substring(0, 2)}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs font-medium truncate max-w-[120px]">{person.name}</span>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="bg-white shadow-md border border-gray-200">
        <ContextMenuItem 
          className="flex items-center text-red-500 cursor-pointer"
          onClick={() => onRemove(person.id)}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          <span>Rimuovi</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
