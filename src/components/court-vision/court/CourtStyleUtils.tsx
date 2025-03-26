
import { COURT_TYPES } from "../constants";

export function getCourtStyles(courtType: string): string {
  switch (courtType) {
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
}

export function getCourtLabel(courtType: string): string {
  const type = courtType.split("-");
  const surface = type.length > 1 ? ` (${type[1]})` : "";
  return `${type[0].charAt(0).toUpperCase() + type[0].slice(1)}${surface}`;
}

export function isTimeSlotOccupied(object: any, timeSlot: string, timeSlots: string[]): boolean {
  const isPerson = 'type' in object && (object.type === "player" || object.type === "coach");
  const isActivity = 'type' in object && object.type.startsWith('activity');
  
  let startSlot: string | undefined;
  
  if (isPerson && 'timeSlot' in object) {
    startSlot = object.timeSlot;
  } else if (isActivity && 'startTime' in object) {
    startSlot = object.startTime;
  } else {
    return false;
  }
  
  if (!startSlot) return false;
  
  const startIndex = timeSlots.indexOf(startSlot);
  const currentIndex = timeSlots.indexOf(timeSlot);
  
  if (startIndex === -1 || currentIndex === -1) return false;
  
  const duration = object.durationHours || 1;
  const slotsNeeded = Math.ceil(duration * 2);
  const endIndex = startIndex + slotsNeeded - 1;
  
  return currentIndex >= startIndex && currentIndex <= endIndex;
}
