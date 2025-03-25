
import { useDrag } from "react-dnd";
import { User, Users, Clock, Layers } from "lucide-react";
import { PERSON_TYPES } from "./constants";
import { PersonData } from "./types";
import { ScrollArea } from "../ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface PersonProps {
  person: PersonData;
  onRemove: () => void;
  courts?: { id: string; name: string; number: number }[];
  timeSlots?: string[];
  onChangeTimeSlot?: (personId: string, timeSlot: string) => void;
  onChangeCourt?: (personId: string, courtId: string) => void;
  showControls?: boolean;
}

export function Person({ 
  person, 
  onRemove, 
  courts = [], 
  timeSlots = [], 
  onChangeTimeSlot, 
  onChangeCourt,
  showControls = false
}: PersonProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: person.type,
    item: { 
      ...person,
      sourceTimeSlot: person.timeSlot // Add source time slot to identify where the person came from
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`flex flex-col p-2 rounded-md mb-1 ${
        isDragging ? "opacity-40" : "opacity-100"
      } cursor-move`}
      style={person.programColor ? { backgroundColor: `${person.programColor}20` } : {}}
    >
      <div className="flex items-center">
        <div 
          className="h-5 w-5 rounded-full flex items-center justify-center text-xs text-white mr-2"
          style={{ backgroundColor: person.programColor || 
            (person.type === PERSON_TYPES.PLAYER ? "#8B5CF6" : "#1A1F2C") }}
        >
          {person.name.substring(0, 1)}
        </div>
        <span className="text-sm">{person.name}</span>
        <button
          onClick={onRemove}
          className="ml-auto text-gray-500 hover:text-red-500"
          aria-label="Remove person"
        >
          ×
        </button>
      </div>

      {showControls && person.courtId && (
        <div className="mt-2 space-y-2 text-sm">
          {onChangeCourt && courts.length > 0 && (
            <div className="flex items-center gap-1">
              <Layers className="h-3 w-3 text-gray-500" />
              <Select 
                value={person.courtId} 
                onValueChange={(value) => onChangeCourt(person.id, value)}
              >
                <SelectTrigger className="h-7 text-xs py-0 px-2">
                  <SelectValue placeholder="Select court" />
                </SelectTrigger>
                <SelectContent>
                  <ScrollArea className="h-[200px]">
                    {courts.map((court) => (
                      <SelectItem key={court.id} value={court.id} className="text-xs">
                        {court.name} #{court.number}
                      </SelectItem>
                    ))}
                  </ScrollArea>
                </SelectContent>
              </Select>
            </div>
          )}

          {onChangeTimeSlot && timeSlots.length > 0 && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-gray-500" />
              <Select 
                value={person.timeSlot || ''} 
                onValueChange={(value) => onChangeTimeSlot(person.id, value)}
              >
                <SelectTrigger className="h-7 text-xs py-0 px-2">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  <ScrollArea className="h-[200px]">
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time} className="text-xs">
                        {time}
                      </SelectItem>
                    ))}
                  </ScrollArea>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
