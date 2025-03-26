
import { useDrag } from "react-dnd";
import { User, Users, Clock, Layers, Move, Mail, Phone } from "lucide-react";
import { PERSON_TYPES } from "./constants";
import { PersonData } from "./types";
import { ScrollArea } from "../ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface PersonProps {
  person: PersonData;
  onRemove?: () => void;
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
      sourceTimeSlot: person.timeSlot, // Aggiungi sourceTimeSlot per tracciare la sorgente
      id: person.id,
      name: person.name,
      type: person.type,
      timeSlot: person.timeSlot,
      programColor: person.programColor,
      programId: person.programId,
      courtId: person.courtId,
      durationHours: person.durationHours,
      hoursAssigned: person.hoursAssigned, // Include tracking hours
      sportTypes: person.sportTypes, // Include sport types for filtering
      email: person.email, // Include email for contact info
      phone: person.phone // Include phone for contact info
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    end: (item, monitor) => {
      const didDrop = monitor.didDrop();
      if (!didDrop) {
        console.log("Il trascinamento della persona è stato annullato");
      }
    }
  }));

  // Show sport types badges if available
  const hasSportTypes = person.sportTypes && person.sportTypes.length > 0;
  const hasContactInfo = person.email || person.phone;

  return (
    <div
      ref={drag}
      className={`flex flex-col p-2 rounded-md mb-1 ${
        isDragging ? "opacity-40" : "opacity-100"
      } cursor-move relative`}
      style={person.programColor ? { backgroundColor: `${person.programColor}20` } : {}}
    >
      <div className="flex items-center">
        <div 
          className="h-5 w-5 rounded-full flex items-center justify-center text-xs text-white mr-2 flex-shrink-0"
          style={{ backgroundColor: person.programColor || 
            (person.type === PERSON_TYPES.PLAYER ? "#8B5CF6" : "#1A1F2C") }}
        >
          {person.name.substring(0, 1)}
        </div>
        <span className="text-sm truncate">{person.name}</span>
        <Move className="h-3 w-3 ml-2 opacity-50 flex-shrink-0" aria-label="Trascina per assegnare" />
        {onRemove && (
          <button
            onClick={onRemove}
            className="ml-auto text-gray-500 hover:text-red-500 flex-shrink-0"
            aria-label="Rimuovi persona"
          >
            ×
          </button>
        )}
      </div>

      {hasContactInfo && (
        <div className="flex flex-col gap-1 mt-1 text-xs text-gray-600">
          {person.email && (
            <div className="flex items-center">
              <Mail className="h-3 w-3 mr-1" />
              <span className="truncate">{person.email}</span>
            </div>
          )}
          {person.phone && (
            <div className="flex items-center">
              <Phone className="h-3 w-3 mr-1" />
              <span>{person.phone}</span>
            </div>
          )}
        </div>
      )}

      {hasSportTypes && (
        <div className="flex flex-wrap gap-1 mt-1">
          {person.sportTypes.map(sport => (
            <span 
              key={sport} 
              className="text-xs px-1.5 py-0.5 bg-gray-100 rounded-full truncate"
            >
              {sport}
            </span>
          ))}
        </div>
      )}

      {showControls && (
        <div className="mt-2 space-y-2 text-sm">
          {onChangeCourt && courts.length > 0 && (
            <div className="flex items-center gap-1">
              <Layers className="h-3 w-3 text-gray-500 flex-shrink-0" />
              <Select 
                value={person.courtId || ''} 
                onValueChange={(value) => onChangeCourt(person.id, value)}
              >
                <SelectTrigger className="h-7 text-xs py-0 px-2">
                  <SelectValue placeholder="Seleziona campo" />
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
              <Clock className="h-3 w-3 text-gray-500 flex-shrink-0" />
              <Select 
                value={person.timeSlot || ''} 
                onValueChange={(value) => onChangeTimeSlot(person.id, value)}
              >
                <SelectTrigger className="h-7 text-xs py-0 px-2">
                  <SelectValue placeholder="Seleziona orario" />
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
