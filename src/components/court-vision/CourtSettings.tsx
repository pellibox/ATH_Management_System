
import { Input } from "@/components/ui/input";
import { CourtProps, PersonData, ActivityData } from "./types";
import { COURT_TYPES, PERSON_TYPES, ACTIVITY_TYPES } from "./constants";
import { Trash2, Clock } from "lucide-react";

interface CourtSettingsProps {
  court: CourtProps;
  timeSlots: string[];
  onRename?: (courtId: string, name: string) => void;
  onChangeType?: (courtId: string, type: string) => void;
  onChangeNumber?: (courtId: string, number: number) => void;
  onCourtRemove?: (courtId: string) => void;
  onRemovePerson?: (personId: string, timeSlot?: string) => void;
  onRemoveActivity?: (activityId: string, timeSlot?: string) => void;
  onSetIsOpen: (isOpen: boolean) => void;
  onChangePersonTimeSlot: (personId: string, timeSlot: string) => void;
}

export function CourtSettings({
  court,
  timeSlots,
  onRename,
  onChangeType,
  onChangeNumber,
  onCourtRemove,
  onRemovePerson,
  onRemoveActivity,
  onSetIsOpen,
  onChangePersonTimeSlot
}: CourtSettingsProps) {
  return (
    <div className="p-4">
      <h4 className="font-medium text-sm mb-2 text-ath-black-light">Opzioni Campo</h4>
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm">Tipo di Superficie:</span>
          <select 
            className="text-sm border rounded px-2 py-1"
            value={court.type}
            onChange={(e) => onChangeType && onChangeType(court.id, e.target.value)}
          >
            <option value={COURT_TYPES.TENNIS_CLAY}>Terra Rossa</option>
            <option value={COURT_TYPES.TENNIS_HARD}>Cemento</option>
            <option value={COURT_TYPES.PADEL}>Padel</option>
            <option value={COURT_TYPES.PICKLEBALL}>Pickleball</option>
            <option value={COURT_TYPES.TOUCH_TENNIS}>Touch Tennis</option>
          </select>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">Numero Campo:</span>
          <Input
            type="number"
            value={court.number}
            onChange={(e) => onChangeNumber && onChangeNumber(court.id, parseInt(e.target.value) || 1)}
            className="w-16 text-sm"
            min={1}
          />
        </div>
        {onCourtRemove && (
          <button 
            onClick={() => {
              if (window.confirm("Sei sicuro di voler rimuovere questo campo?")) {
                onCourtRemove(court.id);
                onSetIsOpen(false);
              }
            }}
            className="w-full text-red-500 border border-red-500 rounded px-2 py-1 text-sm hover:bg-red-50 transition-colors"
          >
            Rimuovi Campo
          </button>
        )}
      </div>
      
      <h4 className="font-medium text-sm mb-2 text-ath-black-light">Persone sul campo</h4>
      
      {court.occupants.length === 0 ? (
        <p className="text-sm text-gray-500 italic">Nessuna persona assegnata</p>
      ) : (
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {court.occupants.map((person) => (
            <div 
              key={person.id} 
              className="flex flex-col p-2 rounded-md bg-gray-50 hover:bg-gray-100"
            >
              <div className="flex items-center">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                    person.type === PERSON_TYPES.PLAYER ? "bg-ath-red-clay text-white" : "bg-ath-black text-white"
                  }`}
                  style={person.programColor ? { backgroundColor: person.programColor } : {}}
                >
                  {person.name.substring(0, 2)}
                </div>
                <div>
                  <p className="font-medium text-sm">{person.name}</p>
                  <p className="text-xs text-gray-500">
                    {person.type === PERSON_TYPES.PLAYER ? "Giocatore" : "Allenatore"}
                  </p>
                </div>
                <button
                  onClick={() => onRemovePerson && onRemovePerson(person.id, person.timeSlot)}
                  className="ml-auto text-red-500 hover:text-red-700"
                  aria-label="Remove person"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              
              {/* Time slot and court selection */}
              <div className="mt-2 space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3 text-gray-500" />
                  <select 
                    value={person.timeSlot || ''} 
                    onChange={(e) => onChangePersonTimeSlot(person.id, e.target.value)}
                    className="flex-1 h-7 text-xs py-0 px-2 border rounded"
                  >
                    <option value="">Seleziona orario</option>
                    {timeSlots.map((time) => (
                      <option key={time} value={time} className="text-xs">
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
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
                    {activity.duration && `Durata: ${activity.duration}`}
                    {activity.startTime && ` - Inizio: ${activity.startTime}`}
                    {activity.durationHours && activity.durationHours > 1 && 
                     ` (${activity.durationHours}h${activity.endTimeSlot ? ` fino ${activity.endTimeSlot}` : ''})`}
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
  );
}
