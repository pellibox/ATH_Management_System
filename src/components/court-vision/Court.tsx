
import { useState } from "react";
import { useDrop } from "react-dnd";
import { COURT_TYPES, PERSON_TYPES, ACTIVITY_TYPES } from "./constants";
import { CourtProps, PersonData, ActivityData } from "./types";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import { X, Trash2, Edit, Clock } from "lucide-react";
import { TimeSlot } from "./TimeSlot";

interface CourtComponentProps {
  court: CourtProps;
  date: Date;
  timeSlots: string[];
  onDrop: (courtId: string, person: PersonData, position?: { x: number, y: number }, time?: string) => void;
  onActivityDrop: (courtId: string, activity: ActivityData, time?: string) => void;
  onRemovePerson?: (personId: string, time?: string) => void;
  onRemoveActivity?: (activityId: string, time?: string) => void;
}

export function Court({ 
  court, 
  date,
  timeSlots,
  onDrop, 
  onActivityDrop, 
  onRemovePerson, 
  onRemoveActivity 
}: CourtComponentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"layout" | "schedule">("layout");
  
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
        return "bg-ath-clay/10 border-ath-clay";
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

  // Find occupants and activities for a specific time slot
  const getOccupantsForTimeSlot = (time: string) => {
    return court.occupants.filter(person => 
      person.timeSlot === time || (!person.timeSlot && time === timeSlots[0])
    );
  };

  const getActivitiesForTimeSlot = (time: string) => {
    return court.activities.filter(activity => 
      activity.startTime === time || (!activity.startTime && time === timeSlots[0])
    );
  };

  // Calculate person marker size based on how many people are on the court
  const getPersonSize = () => {
    const count = court.occupants.length;
    if (count <= 2) return "w-10 h-10 text-sm";
    if (count <= 4) return "w-8 h-8 text-xs";
    if (count <= 8) return "w-7 h-7 text-xs";
    return "w-6 h-6 text-[10px]";
  };
  
  // Distribute people around the court based on their count
  const getPersonPosition = (index: number, total: number, position?: {x: number, y: number}) => {
    if (position) return position;
    
    // If person has a custom position, use it
    if (total <= 4) {
      // Simple positions for 4 or fewer people
      const positions = [
        {x: 0.25, y: 0.25}, // top left
        {x: 0.75, y: 0.25}, // top right
        {x: 0.25, y: 0.75}, // bottom left
        {x: 0.75, y: 0.75}, // bottom right
      ];
      return positions[index % positions.length];
    } else {
      // More distributed positions for more people
      const angle = (Math.PI * 2 * index) / total;
      const radius = 0.35; // Distance from center
      const centerX = 0.5;
      const centerY = 0.5;
      return {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
      };
    }
  };
  
  // Only show people without specific time slots in the layout view
  const visibleOccupants = viewMode === "layout" 
    ? court.occupants.filter(person => !person.timeSlot).slice(0, 12)
    : [];
  const hasMoreOccupants = visibleOccupants.length > 12;
  const personSize = getPersonSize();
  
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div
          id={`court-${court.id}`}
          ref={drop}
          className={`relative rounded-lg border-2 ${getCourtStyles()} ${
            isOver ? "ring-2 ring-ath-red-clay" : ""
          } transition-all h-44 sm:h-56 flex flex-col cursor-pointer animate-fade-in`}
        >
          <div className="absolute top-2 left-2 right-2 flex justify-between items-center">
            <span className="text-xs font-medium bg-ath-black/70 text-white px-2 py-1 rounded">
              {court.name} #{court.number}
            </span>
            <span className="text-xs bg-ath-black/70 text-white px-2 py-1 rounded">{getCourtLabel()}</span>
          </div>

          <div className="absolute top-10 right-2 flex gap-1">
            <button 
              className={`text-xs px-2 py-1 rounded ${viewMode === "layout" ? "bg-ath-black text-white" : "bg-gray-200"}`}
              onClick={(e) => {
                e.stopPropagation();
                setViewMode("layout");
              }}
            >
              Layout
            </button>
            <button 
              className={`text-xs px-2 py-1 rounded ${viewMode === "schedule" ? "bg-ath-black text-white" : "bg-gray-200"}`}
              onClick={(e) => {
                e.stopPropagation();
                setViewMode("schedule");
              }}
            >
              <Clock className="h-3 w-3" />
            </button>
          </div>

          {viewMode === "layout" && (
            <>
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

              {visibleOccupants.map((person, index) => {
                const position = getPersonPosition(index, visibleOccupants.length, person.position);
                
                return (
                  <ContextMenu key={person.id}>
                    <ContextMenuTrigger>
                      <div
                        className={`absolute z-10 ${personSize} rounded-full flex items-center justify-center font-medium shadow-sm transform -translate-x-1/2 -translate-y-1/2 ${
                          person.type === PERSON_TYPES.PLAYER ? "bg-ath-red-clay text-white" : "bg-ath-black text-white"
                        }`}
                        style={{
                          left: `${position.x * 100}%`,
                          top: `${position.y * 100}%`,
                        }}
                        title={person.name}
                      >
                        {person.name.substring(0, 2)}
                      </div>
                    </ContextMenuTrigger>
                    <ContextMenuContent className="bg-white shadow-md border border-gray-200">
                      <ContextMenuItem 
                        className="flex items-center text-red-500 cursor-pointer"
                        onClick={() => onRemovePerson && onRemovePerson(person.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        <span>Rimuovi</span>
                      </ContextMenuItem>
                    </ContextMenuContent>
                  </ContextMenu>
                );
              })}

              {hasMoreOccupants && (
                <div className="absolute right-3 bottom-3 z-10 bg-ath-black text-white text-xs px-2 py-1 rounded-full">
                  +{court.occupants.length - 12}
                </div>
              )}

              {court.activities.filter(activity => !activity.startTime).length > 0 && (
                <div className="absolute top-10 left-2 right-2 bg-ath-black/30 p-1 rounded">
                  <div className="flex flex-wrap gap-1">
                    {court.activities.filter(activity => !activity.startTime).map((activity) => (
                      <ContextMenu key={activity.id}>
                        <ContextMenuTrigger>
                          <div
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
                        </ContextMenuTrigger>
                        <ContextMenuContent className="bg-white shadow-md border border-gray-200">
                          <ContextMenuItem 
                            className="flex items-center text-red-500 cursor-pointer"
                            onClick={() => onRemoveActivity && onRemoveActivity(activity.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            <span>Rimuovi</span>
                          </ContextMenuItem>
                        </ContextMenuContent>
                      </ContextMenu>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {viewMode === "schedule" && (
            <div className="flex-1 overflow-y-auto mt-12 mb-1">
              {timeSlots.map((time) => (
                <TimeSlot
                  key={`${court.id}-${time}`}
                  courtId={court.id}
                  time={time}
                  occupants={getOccupantsForTimeSlot(time)}
                  activities={getActivitiesForTimeSlot(time)}
                  onDrop={(courtId, time, person) => onDrop(courtId, person, undefined, time)}
                  onActivityDrop={(courtId, time, activity) => onActivityDrop(courtId, activity, time)}
                  onRemovePerson={(personId, time) => onRemovePerson && onRemovePerson(personId, time)}
                  onRemoveActivity={(activityId, time) => onRemoveActivity && onRemoveActivity(activityId, time)}
                />
              ))}
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
                  className="flex items-center justify-between p-2 rounded-md bg-gray-50 hover:bg-gray-100"
                >
                  <div className="flex items-center">
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
                        {person.timeSlot && ` - ${person.timeSlot}`}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => onRemovePerson && onRemovePerson(person.id, person.timeSlot)}
                    className="text-red-500 hover:text-red-700"
                    aria-label="Remove person"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
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
                    className={`flex items-center justify-between text-sm px-3 py-2 rounded-md ${
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
                    <div>
                      <div className="font-medium">{activity.name}</div>
                      <div className="text-xs">
                        Durata: {activity.duration}
                        {activity.startTime && ` - Inizio: ${activity.startTime}`}
                      </div>
                    </div>
                    <button
                      onClick={() => onRemoveActivity && onRemoveActivity(activity.id, activity.startTime)}
                      className="text-red-500 hover:text-red-700"
                      aria-label="Remove activity"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
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
