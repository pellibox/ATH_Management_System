import { useState } from "react";
import { useDrag } from "react-dnd";
import { PERSON_TYPES } from "./constants";
import { PersonData } from "./types";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import { Trash2 } from "lucide-react";

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

  const getPersonSize = () => {
    if (total <= 2) return "w-10 h-10 text-sm";
    if (total <= 4) return "w-8 h-8 text-xs";
    if (total <= 8) return "w-7 h-7 text-xs";
    return "w-6 h-6 text-[10px]";
  };

  const getPersonPosition = (index: number, total: number, position?: {x: number, y: number}) => {
    if (position) return position;
    
    if (total <= 4) {
      const positions = [
        {x: 0.25, y: 0.25},
        {x: 0.75, y: 0.25},
        {x: 0.25, y: 0.75},
        {x: 0.75, y: 0.75},
      ];
      return positions[index % positions.length];
    } else {
      const angle = (Math.PI * 2 * index) / total;
      const radius = 0.35;
      const centerX = 0.5;
      const centerY = 0.5;
      return {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
      };
    }
  };

  const calculatedPosition = getPersonPosition(index, total, position);
  const personSize = getPersonSize();
  
  const getBackgroundColor = () => {
    if (person.programColor) return person.programColor;
    
    if (person.programId || (person.programIds && person.programIds.length > 0)) {
      return person.type === PERSON_TYPES.PLAYER ? "#3b82f6" : "#ef4444";
    }
    
    return person.type === PERSON_TYPES.PLAYER ? "bg-ath-blue text-white" : "bg-ath-black text-white";
  };

  const getColorStyle = () => {
    const color = getBackgroundColor();
    
    if (color.startsWith('#')) {
      return { backgroundColor: color, color: '#ffffff' };
    }
    
    return {};
  };

  const getColorClass = () => {
    const color = getBackgroundColor();
    return color.startsWith('#') 
      ? "" 
      : person.type === PERSON_TYPES.PLAYER ? "bg-ath-blue text-white" : "bg-ath-black text-white";
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          ref={drag}
          className={`absolute z-10 ${personSize} rounded-full flex items-center justify-center font-medium shadow-sm transform -translate-x-1/2 -translate-y-1/2 ${
            getColorClass()
          } ${isDragging ? "opacity-50" : ""} cursor-grab`}
          style={{
            left: `${calculatedPosition.x * 100}%`,
            top: `${calculatedPosition.y * 100}%`,
            ...getColorStyle()
          }}
          title={person.name}
        >
          {person.name.substring(0, 2)}
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
