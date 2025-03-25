
import { useDrop } from "react-dnd";
import { COURT_TYPES, PERSON_TYPES } from "./constants";
import { CourtProps, PersonData, ActivityData } from "./types";

interface CourtComponentProps {
  court: CourtProps;
  onDrop: (courtId: string, person: PersonData, position?: { x: number, y: number }) => void;
  onActivityDrop: (courtId: string, activity: ActivityData) => void;
}

export function Court({ court, onDrop, onActivityDrop }: CourtComponentProps) {
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
        return "bg-ath-clay/20 border-ath-clay";
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

  return (
    <div
      id={`court-${court.id}`}
      ref={drop}
      className={`relative rounded-lg border-2 ${getCourtStyles()} ${
        isOver ? "ring-2 ring-ath-blue" : ""
      } transition-all h-44 sm:h-56 flex flex-col`}
    >
      <div className="absolute top-2 left-2 right-2 flex justify-between items-center">
        <span className="text-xs font-medium bg-white/80 px-2 py-1 rounded">
          {court.name} #{court.number}
        </span>
        <span className="text-xs bg-white/80 px-2 py-1 rounded">{getCourtLabel()}</span>
      </div>

      {(court.type === COURT_TYPES.TENNIS_CLAY || court.type === COURT_TYPES.TENNIS_HARD) && (
        <div className="w-3/4 h-3/4 border border-white/70 relative flex items-center justify-center">
          <div className="absolute left-0 right-0 h-[1px] bg-white/70"></div>
          <div className="absolute top-0 bottom-0 w-[1px] bg-white/70"></div>
        </div>
      )}
      
      {court.type === COURT_TYPES.PADEL && (
        <div className="w-3/4 h-3/4 border border-white/70 relative">
          <div className="absolute left-0 right-0 top-1/3 h-[1px] bg-white/70"></div>
          <div className="absolute inset-0 border-4 border-transparent border-b-white/70 -mb-4"></div>
        </div>
      )}
      
      {court.type === COURT_TYPES.PICKLEBALL && (
        <div className="w-2/3 h-3/4 border border-white/70 relative">
          <div className="absolute left-0 right-0 top-1/3 bottom-1/3 border-t border-b border-white/70"></div>
        </div>
      )}
      
      {court.type === COURT_TYPES.TOUCH_TENNIS && (
        <div className="w-2/3 h-2/3 border border-white/70 relative">
          <div className="absolute left-0 right-0 h-[1px] top-1/2 bg-white/70"></div>
        </div>
      )}

      {court.occupants.map((person) => (
        <div
          key={person.id}
          className={`absolute z-10 w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium shadow-sm transform -translate-x-1/2 -translate-y-1/2 ${
            person.type === PERSON_TYPES.PLAYER ? "bg-blue-500 text-white" : "bg-orange-500 text-white"
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

      {court.activities.length > 0 && (
        <div className="absolute top-10 left-2 right-2 bg-black/10 p-1 rounded">
          <div className="flex flex-wrap gap-1">
            {court.activities.map((activity) => (
              <div
                key={activity.id}
                className={`text-xs px-2 py-1 rounded-full ${
                  activity.type === ACTIVITY_TYPES.MATCH
                    ? "bg-purple-100 text-purple-800"
                    : activity.type === ACTIVITY_TYPES.TRAINING
                    ? "bg-green-100 text-green-800"
                    : activity.type === ACTIVITY_TYPES.BASKET_DRILL
                    ? "bg-yellow-100 text-yellow-800"
                    : activity.type === ACTIVITY_TYPES.GAME
                    ? "bg-blue-100 text-blue-800"
                    : "bg-pink-100 text-pink-800"
                }`}
              >
                {activity.name}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/5 max-h-20 overflow-y-auto">
        {court.occupants.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {court.occupants.map((person) => (
              <div
                key={person.id}
                className={`text-xs px-2 py-1 rounded-full ${
                  person.type === PERSON_TYPES.PLAYER
                    ? "bg-blue-100 text-blue-800"
                    : "bg-orange-100 text-orange-800"
                }`}
              >
                {person.name}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-xs text-gray-500 italic">Empty court</div>
        )}
      </div>
    </div>
  );
}
