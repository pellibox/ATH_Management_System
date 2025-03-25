
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

// Mock data types
interface CourseEvent {
  id: string;
  title: string;
  instructor: string;
  students: string[];
  time: string;
  duration: number; // in hours
  courtType: "clay" | "grass" | "hard" | "central";
  courtNumber: number;
  objective?: string;
}

// Mock data
const mockEvents: CourseEvent[] = [
  {
    id: "event1",
    title: "Advanced Training",
    instructor: "Coach Smith",
    students: ["Alex Kim", "Lisa Johnson", "Mark Davis"],
    time: "09:00",
    duration: 1.5,
    courtType: "clay",
    courtNumber: 1,
    objective: "Service technique"
  },
  {
    id: "event2",
    title: "Junior Group",
    instructor: "Coach Williams",
    students: ["Emma Wilson", "James Brown"],
    time: "11:00",
    duration: 1,
    courtType: "hard",
    courtNumber: 3,
    objective: "Forehand practice"
  },
  {
    id: "event3",
    title: "Private Lesson",
    instructor: "Coach Martinez",
    students: ["Robert Taylor"],
    time: "14:00",
    duration: 1,
    courtType: "grass",
    courtNumber: 2,
  },
  {
    id: "event4",
    title: "Tournament Prep",
    instructor: "Coach Johnson",
    students: ["Sarah Lee", "Michael Clark", "Jessica Adams", "David Wilson"],
    time: "16:00",
    duration: 2,
    courtType: "central",
    courtNumber: 1,
    objective: "Match play"
  },
];

// Days of the week
const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Time slots from 8:00 to 20:00
const timeSlots = Array.from({ length: 13 }, (_, i) => `${i + 8}:00`);

interface CalendarViewProps {
  currentView?: "week" | "day" | "month";
}

export default function CalendarView({ currentView = "week" }: CalendarViewProps) {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const { toast } = useToast();

  // Get the dates for the current week
  const getWeekDates = () => {
    const dates = [];
    const dayOfWeek = currentWeek.getDay();
    const diff = currentWeek.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    const monday = new Date(currentWeek);
    monday.setDate(diff);

    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      dates.push(date);
    }

    return dates;
  };

  const weekDates = getWeekDates();

  // Format date as "DD"
  const formatDay = (date: Date) => {
    return date.getDate().toString().padStart(2, "0");
  };

  // Check if date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Navigate to previous/next week
  const navigateWeek = (direction: number) => {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() + direction * 7);
    setCurrentWeek(newDate);
  };

  // Format month and year for header
  const formatMonthYear = () => {
    const firstDay = weekDates[0];
    const lastDay = weekDates[6];
    
    const firstMonth = firstDay.toLocaleString("default", { month: "short" });
    const lastMonth = lastDay.toLocaleString("default", { month: "short" });
    
    if (firstMonth === lastMonth) {
      return `${firstMonth} ${firstDay.getFullYear()}`;
    }
    
    return `${firstMonth} - ${lastMonth} ${firstDay.getFullYear()}`;
  };

  // Get court events for a specific time slot and day
  const getEventsForTimeSlot = (time: string, dayIndex: number) => {
    return mockEvents.filter(event => {
      const eventHour = parseInt(event.time.split(":")[0]);
      const slotHour = parseInt(time.split(":")[0]);
      
      // Check if event starts at this time slot and on this day
      // For simplicity, we're using a modulo operation to distribute events across days
      return eventHour === slotHour && (parseInt(event.id.replace("event", "")) % 7) === dayIndex;
    });
  };

  const handleEventClick = (event: CourseEvent) => {
    toast({
      title: event.title,
      description: `${event.instructor} - ${event.students.length} students - Court ${event.courtNumber}`,
    });
  };

  // Effect to show a message when view changes
  useEffect(() => {
    if (currentView !== "week") {
      toast({
        title: `${currentView.charAt(0).toUpperCase() + currentView.slice(1)} View`,
        description: `${currentView.charAt(0).toUpperCase() + currentView.slice(1)} view will be implemented soon.`,
      });
    }
  }, [currentView, toast]);

  return (
    <div className="rounded-xl bg-white shadow-soft overflow-hidden animate-fade-in">
      {/* Calendar Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="text-xl font-semibold">{formatMonthYear()}</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateWeek(-1)}
            className="rounded-full p-1.5 hover:bg-gray-100 transition-colors"
            aria-label="Previous week"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            className="px-3 py-1 text-sm bg-ath-blue-light text-ath-blue rounded-md font-medium"
            onClick={() => setCurrentWeek(new Date())}
          >
            Today
          </button>
          <button
            onClick={() => navigateWeek(1)}
            className="rounded-full p-1.5 hover:bg-gray-100 transition-colors"
            aria-label="Next week"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Days Header */}
          <div className="grid grid-cols-8 border-b">
            <div className="p-2 border-r bg-gray-50"></div>
            {weekDays.map((day, index) => (
              <div
                key={day}
                className={cn(
                  "p-3 text-center border-r",
                  isToday(weekDates[index]) ? "bg-ath-blue-light" : "bg-gray-50"
                )}
              >
                <p className="text-sm font-medium">{day}</p>
                <p
                  className={cn(
                    "text-2xl font-semibold mt-1",
                    isToday(weekDates[index]) ? "text-ath-blue" : ""
                  )}
                >
                  {formatDay(weekDates[index])}
                </p>
              </div>
            ))}
          </div>

          {/* Time Slots and Events */}
          <div className="divide-y">
            {timeSlots.map((time) => (
              <div key={time} className="grid grid-cols-8">
                {/* Time Column */}
                <div className="p-2 border-r bg-gray-50 flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-500">{time}</span>
                </div>

                {/* Days Columns */}
                {weekDays.map((_, dayIndex) => {
                  const events = getEventsForTimeSlot(time, dayIndex);
                  
                  return (
                    <div key={dayIndex} className="p-1 border-r min-h-[80px] relative">
                      {events.map((event) => (
                        <div
                          key={event.id}
                          className={cn(
                            "court-event card-hover cursor-pointer",
                            `court-${event.courtType}`
                          )}
                          style={{ height: `${event.duration * 80}px` }}
                          onClick={() => handleEventClick(event)}
                        >
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium text-sm">{event.title}</h4>
                            <span className="text-xs bg-white/80 rounded px-1.5 py-0.5 shadow-sm">
                              Court {event.courtNumber}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">
                            {event.instructor}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {event.students.length} students
                          </p>
                          {event.objective && (
                            <p className="text-xs bg-white/60 rounded px-1.5 py-0.5 mt-1 inline-block">
                              {event.objective}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
