
import { useState } from "react";
import { useDrop } from "react-dnd";
import { COURT_TYPES, PERSON_TYPES, ACTIVITY_TYPES } from "./constants";
import { CourtProps, PersonData, ActivityData } from "./types";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { X } from "lucide-react";

interface CourtComponentProps {
  court: CourtProps;
  onDrop: (courtId: string, person: PersonData, position?: { x: number, y: number }) => void;
  onActivityDrop: (courtId: string, activity: ActivityData) => void;
}

export function Court({ court, onDrop, onActivityDrop }: CourtComponentProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const [{ isOver }, drop] = useDrop(() => ({
    accept: [PERSON_TYPES.PLAYER, PERSON_TYPES.COACH, "activity"],
    drop: (item: any, monitor) => {
      const clientOffset = monitor.getClientOffset();
      const initialOffset = monitor.getInitialClientOffset();
      const containerRect = document.getElementById(`court-${court.id}`)?.getBoundingClientRect();
      
      if (clientOffset && containerRect && initialOffset) {
        const position = {
          x: (clientOffset.x - containerRect.left) / containerRect.width,
          y: (clientOffset.y - containerRect.top) / containerRect.height
        };
        
        if (item.type === PERSON_TYPES.PLAYER || item.type === PERSON_TYPES.COACH) {
          onDrop(court.id, item as PersonData, position);
        } else {
          onActivityDrop(court.id, item as ActivityData);
        }
      } else {
        if (item.type === PERSON_TYPES.PLAYER || item.type === PERSON_TYPES.COACH) {
          onDrop(court.id, item as PersonData);
        } else {
          onActivityDrop(court.id, item as ActivityData);
        }
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const getCourtStyles = () => {
    switch (court.type) {
      case COURT_TYPES.TENNIS_CLAY:
        return "bg-ath-red-clay/10 border-ath-red-clay";
      case COURT_TYPES.TENNIS_HARD:
        return "bg-ath-hard/20 border-ath-hard";
      case COURT_TYPES.PADEL:
        return "bg-ath-grass/20 border-ath-grass";
      case COURT_TYPES.PICKLEBALL:
        return "bg-yellow-100 border-yellow-400";
      case COURT_TYPES.TOUCH_TENNIS:
        return "bg-purple-100 border-purple-400";
      default:
        return "bg-gray-100 border-gray-300";
    }
  };

  const getCourtLabel = () => {
    const type = court.type.split("-");
    const surface = type.length > 1 ? ` (${type[1]})` : "";
    return `${type[0].charAt(0).toUpperCase() + type[0].slice(1)}${surface}`;
  };

  // Show a limited number of occupants on the main court view
  const visibleOccupants = court.occupants.slice(0, 3);
  const hasMoreOccupants = court.occupants.length > 3;
  
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div
          id={`court-${court.id}`}
          ref={drop}
          className={`relative rounded-lg border-2 ${getCourtStyles()} ${
            isOver ? "ring-2 ring-ath-red-clay" : ""
          } transition-all h-44 sm:h-56 flex flex-col cursor-pointer`}
        >
          <div className="absolute top-2 left-2 right-2 flex justify-between items-center">
            <span className="text-xs font-medium bg-ath-black/70 text-white px-2 py-1 rounded">
              {court.name} #{court.number}
            </span>
            <span className="text-xs bg-ath-black/70 text-white px-2 py-1 rounded">{getCourtLabel()}</span>
          </div>

          {(court.type === COURT_TYPES.TENNIS_CLAY || court.type === COURT_TYPES.TENNIS_HARD) && (
            <div className="w-3/4 h-3/4 border border-white/70 relative flex items-center justify-center self-center mt-auto mb-auto">
              <div className="absolute left-0 right-0 h-[1px] bg-white/70"></div>
              <div className="absolute top-0 bottom-0 w-[1px] bg-white/70"></div>
            </div>
          )}
          
          {court.type === COURT_TYPES.PADEL && (
            <div className="w-3/4 h-3/4 border border-white/70 relative self-center mt-auto mb-auto">
              <div className="absolute left-0 right-0 top-1/3 h-[1px] bg-white/70"></div>
              <div className="absolute inset-0 border-4 border-transparent border-b-white/70 -mb-4"></div>
            </div>
          )}
          
          {court.type === COURT_TYPES.PICKLEBALL && (
            <div className="w-2/3 h-3/4 border border-white/70 relative self-center mt-auto mb-auto">
              <div className="absolute left-0 right-0 top-1/3 bottom-1/3 border-t border-b border-white/70"></div>
            </div>
          )}
          
          {court.type === COURT_TYPES.TOUCH_TENNIS && (
            <div className="w-2/3 h-2/3 border border-white/70 relative self-center mt-auto mb-auto">
              <div className="absolute left-0 right-0 h-[1px] top-1/2 bg-white/70"></div>
            </div>
          )}

          {visibleOccupants.map((person) => (
            <div
              key={person.id}
              className={`absolute z-10 w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium shadow-sm transform -translate-x-1/2 -translate-y-1/2 ${
                person.type === PERSON_TYPES.PLAYER ? "bg-ath-red-clay text-white" : "bg-ath-black text-white"
              }`}
              style={{
                left: `${(person.position?.x || 0.5) * 100}%`,
                top: `${(person.position?.y || 0.5) * 100}%`,
              }}
              title={person.name}
            >
              {person.name.substring(0, 2)}
            </div>
          ))}

          {hasMoreOccupants && (
            <div className="absolute right-3 bottom-3 z-10 bg-ath-black text-white text-xs px-2 py-1 rounded-full">
              +{court.occupants.length - 3}
            </div>
          )}

          {court.activities.length > 0 && (
            <div className="absolute top-10 left-2 right-2 bg-ath-black/30 p-1 rounded">
              <div className="flex flex-wrap gap-1">
                {court.activities.map((activity) => (
                  <div
                    key={activity.id}
                    className={`text-xs px-2 py-1 rounded-full ${
                      activity.type === ACTIVITY_TYPES.MATCH
                        ? "bg-ath-black-light text-white"
                        : activity.type === ACTIVITY_TYPES.TRAINING
                        ? "bg-ath-red-clay-dark/90 text-white"
                        : activity.type === ACTIVITY_TYPES.BASKET_DRILL
                        ? "bg-ath-red-clay/90 text-white"
                        : activity.type === ACTIVITY_TYPES.GAME
                        ? "bg-ath-black text-white"
                        : "bg-ath-gray-medium text-white"
                    }`}
                  >
                    {activity.name}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 p-2 bg-ath-black/10 max-h-20 overflow-y-auto">
            {court.occupants.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                <div className="text-xs text-gray-800 font-medium">
                  {court.occupants.length} {court.occupants.length === 1 ? 'persona' : 'persone'}
                </div>
              </div>
            ) : (
              <div className="text-xs text-gray-500 italic">Campo vuoto</div>
            )}
          </div>
        </div>
      </PopoverTrigger>
      
      <PopoverContent className="w-80 p-0 bg-white shadow-lg rounded-lg border border-gray-200" sideOffset={5}>
        <div className="flex items-center justify-between bg-ath-black p-3 text-white rounded-t-lg">
          <h3 className="font-semibold">{court.name} #{court.number} - {getCourtLabel()}</h3>
          <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-300">
            <X className="h-4 w-4" />
          </button>
        </div>
        
        <div className="p-4">
          <h4 className="font-medium text-sm mb-2 text-ath-black-light">Persone sul campo</h4>
          
          {court.occupants.length === 0 ? (
            <p className="text-sm text-gray-500 italic">Nessuna persona assegnata</p>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {court.occupants.map((person) => (
                <div 
                  key={person.id} 
                  className="flex items-center p-2 rounded-md bg-gray-50 hover:bg-gray-100"
                >
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                      person.type === PERSON_TYPES.PLAYER ? "bg-ath-red-clay text-white" : "bg-ath-black text-white"
                    }`}
                  >
                    {person.name.substring(0, 2)}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{person.name}</p>
                    <p className="text-xs text-gray-500">
                      {person.type === PERSON_TYPES.PLAYER ? "Giocatore" : "Allenatore"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {court.activities.length > 0 && (
            <>
              <h4 className="font-medium text-sm mt-4 mb-2 text-ath-black-light">Attività sul campo</h4>
              <div className="space-y-1">
                {court.activities.map((activity) => (
                  <div 
                    key={activity.id}
                    className={`text-sm px-3 py-2 rounded-md ${
                      activity.type === ACTIVITY_TYPES.MATCH
                        ? "bg-ath-black-light/10 text-ath-black-light"
                        : activity.type === ACTIVITY_TYPES.TRAINING
                        ? "bg-ath-red-clay-dark/10 text-ath-red-clay-dark"
                        : activity.type === ACTIVITY_TYPES.BASKET_DRILL
                        ? "bg-ath-red-clay/10 text-ath-red-clay"
                        : activity.type === ACTIVITY_TYPES.GAME
                        ? "bg-ath-black/10 text-ath-black"
                        : "bg-ath-gray-medium/10 text-ath-gray-medium"
                    }`}
                  >
                    <div className="font-medium">{activity.name}</div>
                    <div className="text-xs">
                      Durata: {activity.duration}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
