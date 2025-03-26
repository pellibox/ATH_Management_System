
import { CourtLayout } from "../CourtLayout";
import { CourtPerson } from "../CourtPerson";
import { CourtActivity } from "../CourtActivity";
import { PersonData, ActivityData } from "../types";

interface CourtLayoutViewProps {
  courtId: string;
  courtType: string;
  occupants: PersonData[];
  activities: ActivityData[];
  onRemovePerson: (personId: string) => void;
  onRemoveActivity: (activityId: string) => void;
}

export function CourtLayoutView({
  courtId,
  courtType,
  occupants,
  activities,
  onRemovePerson,
  onRemoveActivity
}: CourtLayoutViewProps) {
  // Filter occupants without timeSlot (for layout view)
  const visibleOccupants = occupants.filter(person => !person.timeSlot).slice(0, 12);
  const hasMoreOccupants = occupants.length > 12;

  return (
    <>
      <CourtLayout type={courtType} />
      
      {visibleOccupants.map((person, index) => (
        <CourtPerson
          key={person.id}
          person={person}
          index={index}
          total={visibleOccupants.length}
          position={person.position}
          onRemove={() => onRemovePerson(person.id)}
        />
      ))}

      {hasMoreOccupants && (
        <div className="absolute right-3 bottom-3 z-10 bg-ath-black text-white text-xs px-2 py-1 rounded-full">
          +{occupants.length - 12}
        </div>
      )}

      {activities.filter(activity => !activity.startTime).length > 0 && (
        <div className="absolute top-10 left-2 right-2 bg-ath-black/30 p-1 rounded">
          <div className="flex flex-wrap gap-1">
            {activities.filter(activity => !activity.startTime).map((activity) => (
              <CourtActivity
                key={activity.id}
                activity={activity}
                onRemove={() => onRemoveActivity(activity.id)}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
