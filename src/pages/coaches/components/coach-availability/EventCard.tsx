
import { format } from "date-fns";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CoachAvailabilityEvent } from "@/contexts/programs/types";
import { getEventTypeColor, getEventTypeLabel } from "./utils";

interface EventCardProps {
  event: CoachAvailabilityEvent;
  onRemove: (eventId: string) => void;
  isCoachView?: boolean;
}

export function EventCard({ event, onRemove, isCoachView = false }: EventCardProps) {
  return (
    <div key={event.id} className="flex items-start justify-between p-3 border rounded-md">
      <div>
        <div className="flex items-center gap-2">
          <Badge className={getEventTypeColor(event.type)}>
            {getEventTypeLabel(event.type)}
          </Badge>
          <h3 className="font-medium">{event.title}</h3>
        </div>
        <div className="text-sm text-gray-500 mt-1">
          {event.endDate 
            ? `${format(new Date(event.date), "dd/MM/yyyy")} - ${format(new Date(event.endDate), "dd/MM/yyyy")}`
            : format(new Date(event.date), "dd/MM/yyyy")}
          {event.allDay && " (Tutto il giorno)"}
        </div>
        {event.notes && (
          <p className="text-sm mt-1">{event.notes}</p>
        )}
      </div>
      {!isCoachView && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onRemove(event.id)}
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
