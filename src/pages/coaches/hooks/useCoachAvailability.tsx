
import { useState } from "react";
import { CoachAvailabilityEvent } from "@/contexts/programs/types";

export function useCoachAvailability() {
  const [availabilityEvents, setAvailabilityEvents] = useState<CoachAvailabilityEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentView, setCurrentView] = useState<"week" | "day" | "month">("week");

  // Handle adding a new availability event
  const handleAddAvailabilityEvent = (event: CoachAvailabilityEvent) => {
    setAvailabilityEvents(prev => [...prev, event]);
  };

  // Handle removing an availability event
  const handleRemoveAvailabilityEvent = (eventId: string) => {
    setAvailabilityEvents(prev => prev.filter(event => event.id !== eventId));
  };

  // Handle updating an availability event
  const handleUpdateAvailabilityEvent = (eventId: string, updatedEvent: Partial<CoachAvailabilityEvent>) => {
    setAvailabilityEvents(prev => 
      prev.map(event => event.id === eventId ? { ...event, ...updatedEvent } : event)
    );
  };

  return {
    availabilityEvents,
    handleAddAvailabilityEvent,
    handleRemoveAvailabilityEvent,
    handleUpdateAvailabilityEvent,
    selectedDate,
    setSelectedDate,
    currentView,
    setCurrentView
  };
}
