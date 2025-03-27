
import { format } from "date-fns";
import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CoachAvailabilityEvent } from "@/contexts/programs/types";
import { EventCard } from "./EventCard";

interface EventListProps {
  events: CoachAvailabilityEvent[];
  onRemoveEvent: (eventId: string) => void;
  onAddEvent: () => void;
  selectedDate: Date;
  isCoachView?: boolean;
}

export function EventList({ 
  events, 
  onRemoveEvent, 
  onAddEvent, 
  selectedDate, 
  isCoachView = false 
}: EventListProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">
          Indisponibilità - {format(selectedDate, "dd/MM/yyyy")}
        </CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onAddEvent}
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" />
          Aggiungi
        </Button>
      </CardHeader>
      <CardContent>
        {events.length > 0 ? (
          <div className="space-y-3">
            {events.map((event) => (
              <EventCard 
                key={event.id} 
                event={event} 
                onRemove={onRemoveEvent} 
                isCoachView={isCoachView} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Nessuna indisponibilità programmata per questa data
          </div>
        )}
      </CardContent>
    </Card>
  );
}
