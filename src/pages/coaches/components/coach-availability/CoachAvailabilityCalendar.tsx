
import { useState } from "react";
import { format } from "date-fns";
import { ExtraActivitiesCalendar } from "@/components/extra-activities/ExtraActivitiesCalendar";
import { CoachAvailabilityEvent } from "@/contexts/programs/types";
import { EventList } from "./EventList";
import { EventForm } from "./EventForm";

interface CoachAvailabilityCalendarProps {
  coachId: string;
  coachName: string;
  availabilityEvents: CoachAvailabilityEvent[];
  onAddEvent: (event: CoachAvailabilityEvent) => void;
  onRemoveEvent: (eventId: string) => void;
  onUpdateEvent: (eventId: string, event: Partial<CoachAvailabilityEvent>) => void;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  currentView: "week" | "day" | "month";
  setCurrentView: (view: "week" | "day" | "month") => void;
  isCoachView?: boolean;
}

export function CoachAvailabilityCalendar({
  coachId,
  coachName,
  availabilityEvents,
  onAddEvent,
  onRemoveEvent,
  onUpdateEvent,
  selectedDate,
  setSelectedDate,
  currentView,
  setCurrentView,
  isCoachView = false
}: CoachAvailabilityCalendarProps) {
  const [isAddingEvent, setIsAddingEvent] = useState(false);

  // Get events for the selected date
  const eventsForSelectedDate = availabilityEvents.filter(event => {
    const eventDate = new Date(event.date);
    const selectedDateStr = selectedDate.toDateString();
    
    // Check if event falls on selected date
    if (event.endDate) {
      const endDate = new Date(event.endDate);
      return eventDate.toDateString() <= selectedDateStr && endDate.toDateString() >= selectedDateStr;
    }
    
    return eventDate.toDateString() === selectedDateStr;
  });

  return (
    <div className="space-y-6">
      <ExtraActivitiesCalendar
        currentView={currentView}
        setCurrentView={setCurrentView}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />

      <EventList 
        events={eventsForSelectedDate}
        onRemoveEvent={onRemoveEvent}
        onAddEvent={() => setIsAddingEvent(true)}
        selectedDate={selectedDate}
        isCoachView={isCoachView}
      />

      <EventForm 
        isOpen={isAddingEvent}
        onOpenChange={setIsAddingEvent}
        onAddEvent={onAddEvent}
        initialDate={selectedDate}
      />
    </div>
  );
}
