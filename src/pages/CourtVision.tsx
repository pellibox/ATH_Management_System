
import { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ChartBar, Users, User, Calendar, Copy, CalendarDays, Clock, CalendarIcon } from "lucide-react";
import { format, addDays, startOfWeek, addWeeks } from "date-fns";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Court types and their properties
const COURT_TYPES = {
  TENNIS_CLAY: "tennis-clay",
  TENNIS_HARD: "tennis-hard",
  PADEL: "padel",
  PICKLEBALL: "pickleball",
  TOUCH_TENNIS: "touch-tennis",
};

// Draggable person types
const PERSON_TYPES = {
  PLAYER: "player",
  COACH: "coach",
};

// Activity types
const ACTIVITY_TYPES = {
  MATCH: "match",
  TRAINING: "training",
  BASKET_DRILL: "basket-drill",
  GAME: "game",
  LESSON: "lesson",
};

interface CourtProps {
  id: string;
  type: string;
  name: string;
  number: number;
  occupants: PersonData[];
  activities: ActivityData[];
}

interface PersonData {
  id: string;
  name: string;
  type: string;
  courtId?: string;
  position?: { x: number, y: number };
}

interface ActivityData {
  id: string;
  name: string;
  type: string;
  courtId?: string;
  duration?: string;
  startTime?: string;
}

interface ScheduleTemplate {
  id: string;
  name: string;
  date: Date;
  courts: CourtProps[];
}

// Draggable Person component
const Person = ({ person, onRemove }: { person: PersonData; onRemove: () => void }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: person.type,
    item: { id: person.id, type: person.type, name: person.name },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`flex items-center p-2 rounded-md mb-1 ${
        isDragging ? "opacity-40" : "opacity-100"
      } ${person.type === PERSON_TYPES.PLAYER ? "bg-ath-blue-light" : "bg-orange-100"}`}
    >
      {person.type === PERSON_TYPES.PLAYER ? (
        <User className="h-4 w-4 mr-2" />
      ) : (
        <Users className="h-4 w-4 mr-2" />
      )}
      <span className="text-sm">{person.name}</span>
      <button
        onClick={onRemove}
        className="ml-auto text-gray-500 hover:text-red-500"
        aria-label="Remove person"
      >
        ×
      </button>
    </div>
  );
};

// Draggable Activity component
const Activity = ({ activity, onRemove }: { activity: ActivityData; onRemove: () => void }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "activity",
    item: { id: activity.id, type: activity.type, name: activity.name },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const getActivityColor = () => {
    switch (activity.type) {
      case ACTIVITY_TYPES.MATCH:
        return "bg-purple-100 text-purple-800";
      case ACTIVITY_TYPES.TRAINING:
        return "bg-green-100 text-green-800";
      case ACTIVITY_TYPES.BASKET_DRILL:
        return "bg-yellow-100 text-yellow-800";
      case ACTIVITY_TYPES.GAME:
        return "bg-blue-100 text-blue-800";
      case ACTIVITY_TYPES.LESSON:
        return "bg-pink-100 text-pink-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getActivityIcon = () => {
    switch (activity.type) {
      case ACTIVITY_TYPES.MATCH:
        return <ChartBar className="h-4 w-4 mr-2" />;
      case ACTIVITY_TYPES.TRAINING:
        return <Users className="h-4 w-4 mr-2" />;
      case ACTIVITY_TYPES.BASKET_DRILL:
        return <Users className="h-4 w-4 mr-2" />;
      case ACTIVITY_TYPES.GAME:
        return <Users className="h-4 w-4 mr-2" />;
      case ACTIVITY_TYPES.LESSON:
        return <User className="h-4 w-4 mr-2" />;
      default:
        return <ChartBar className="h-4 w-4 mr-2" />;
    }
  };

  return (
    <div
      ref={drag}
      className={`flex items-center p-2 rounded-md mb-1 ${
        isDragging ? "opacity-40" : "opacity-100"
      } ${getActivityColor()}`}
    >
      {getActivityIcon()}
      <span className="text-sm">{activity.name}</span>
      {activity.duration && (
        <span className="text-xs ml-2">({activity.duration})</span>
      )}
      <button
        onClick={onRemove}
        className="ml-auto text-gray-500 hover:text-red-500"
        aria-label="Remove activity"
      >
        ×
      </button>
    </div>
  );
};

// Court component
const Court = ({ 
  court, 
  onDrop, 
  onActivityDrop 
}: { 
  court: CourtProps; 
  onDrop: (courtId: string, person: PersonData, position?: { x: number, y: number }) => void;
  onActivityDrop: (courtId: string, activity: ActivityData) => void;
}) => {
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

      {/* Court markings */}
      <div className="flex-1 flex items-center justify-center relative">
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

        {/* Display people on the court at their positions */}
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
      </div>

      {/* Court activities */}
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

      {/* Court occupants */}
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
};

export default function CourtVision() {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [templates, setTemplates] = useState<ScheduleTemplate[]>([]);
  const [courts, setCourts] = useState<CourtProps[]>([
    // Tennis courts (6) - alternating clay and hard
    { id: "court1", type: COURT_TYPES.TENNIS_CLAY, name: "Tennis", number: 1, occupants: [], activities: [] },
    { id: "court2", type: COURT_TYPES.TENNIS_HARD, name: "Tennis", number: 2, occupants: [], activities: [] },
    { id: "court3", type: COURT_TYPES.TENNIS_CLAY, name: "Tennis", number: 3, occupants: [], activities: [] },
    { id: "court4", type: COURT_TYPES.TENNIS_HARD, name: "Tennis", number: 4, occupants: [], activities: [] },
    { id: "court5", type: COURT_TYPES.TENNIS_CLAY, name: "Tennis", number: 5, occupants: [], activities: [] },
    { id: "court6", type: COURT_TYPES.TENNIS_HARD, name: "Tennis", number: 6, occupants: [], activities: [] },
    // Padel courts (2)
    { id: "padel1", type: COURT_TYPES.PADEL, name: "Padel", number: 1, occupants: [], activities: [] },
    { id: "padel2", type: COURT_TYPES.PADEL, name: "Padel", number: 2, occupants: [], activities: [] },
    // Pickleball court
    { id: "pickleball", type: COURT_TYPES.PICKLEBALL, name: "Pickleball", number: 1, occupants: [], activities: [] },
    // Touch tennis court
    { id: "touch", type: COURT_TYPES.TOUCH_TENNIS, name: "Touch Tennis", number: 1, occupants: [], activities: [] },
  ]);

  const [people, setPeople] = useState<PersonData[]>([
    { id: "player1", name: "Alex Smith", type: PERSON_TYPES.PLAYER },
    { id: "player2", name: "Emma Johnson", type: PERSON_TYPES.PLAYER },
    { id: "player3", name: "Michael Brown", type: PERSON_TYPES.PLAYER },
    { id: "player4", name: "Sophia Davis", type: PERSON_TYPES.PLAYER },
    { id: "player5", name: "James Wilson", type: PERSON_TYPES.PLAYER },
    { id: "player6", name: "Olivia Moore", type: PERSON_TYPES.PLAYER },
    { id: "coach1", name: "Coach Anderson", type: PERSON_TYPES.COACH },
    { id: "coach2", name: "Coach Martinez", type: PERSON_TYPES.COACH },
    { id: "coach3", name: "Coach Thompson", type: PERSON_TYPES.COACH },
  ]);

  const [activities, setActivities] = useState<ActivityData[]>([
    { id: "activity1", name: "Singles Match", type: ACTIVITY_TYPES.MATCH, duration: "1h" },
    { id: "activity2", name: "Group Training", type: ACTIVITY_TYPES.TRAINING, duration: "1.5h" },
    { id: "activity3", name: "Basket Drill", type: ACTIVITY_TYPES.BASKET_DRILL, duration: "45m" },
    { id: "activity4", name: "Practice Game", type: ACTIVITY_TYPES.GAME, duration: "1h" },
    { id: "activity5", name: "Private Lesson", type: ACTIVITY_TYPES.LESSON, duration: "1h" },
  ]);

  const [newPerson, setNewPerson] = useState({ name: "", type: PERSON_TYPES.PLAYER });
  const [newActivity, setNewActivity] = useState({ 
    name: "", 
    type: ACTIVITY_TYPES.MATCH,
    duration: "1h"
  });
  const [newTemplateName, setNewTemplateName] = useState("");

  const handleDrop = (courtId: string, person: PersonData, position?: { x: number, y: number }) => {
    // Find the person in our list (could be from another court)
    const draggablePerson = people.find((p) => p.id === person.id) || 
                            courts.flatMap(c => c.occupants).find(p => p.id === person.id);
    
    if (!draggablePerson) return;

    // If moving from another court, remove from old court
    const updatedCourts = courts.map((court) => {
      if (court.id !== courtId && court.occupants.some((p) => p.id === person.id)) {
        return {
          ...court,
          occupants: court.occupants.filter((p) => p.id !== person.id),
        };
      }
      return court;
    });

    // Move to new court
    const targetCourtIndex = updatedCourts.findIndex((court) => court.id === courtId);
    
    if (targetCourtIndex !== -1) {
      // Check if person is already on this court
      if (!updatedCourts[targetCourtIndex].occupants.some(p => p.id === person.id)) {
        updatedCourts[targetCourtIndex] = {
          ...updatedCourts[targetCourtIndex],
          occupants: [
            ...updatedCourts[targetCourtIndex].occupants,
            { ...draggablePerson, courtId, position },
          ],
        };
      } else {
        // Update position if the person is already on the court
        updatedCourts[targetCourtIndex] = {
          ...updatedCourts[targetCourtIndex],
          occupants: updatedCourts[targetCourtIndex].occupants.map(p => 
            p.id === person.id ? { ...p, position } : p
          ),
        };
      }
    }

    // Remove from available people list if it's coming from there
    setPeople(people.filter((p) => p.id !== person.id));
    setCourts(updatedCourts);

    toast({
      title: "Person Assigned",
      description: `${draggablePerson.name} has been assigned to ${courts.find(c => c.id === courtId)?.name} #${courts.find(c => c.id === courtId)?.number}`,
    });
  };

  const handleActivityDrop = (courtId: string, activity: ActivityData) => {
    // Find the activity in our list (could be from another court)
    const draggableActivity = activities.find((a) => a.id === activity.id) || 
                              courts.flatMap(c => c.activities).find(a => a.id === activity.id);
    
    if (!draggableActivity) return;

    // If moving from another court, remove from old court
    const updatedCourts = courts.map((court) => {
      if (court.id !== courtId && court.activities.some((a) => a.id === activity.id)) {
        return {
          ...court,
          activities: court.activities.filter((a) => a.id !== activity.id),
        };
      }
      return court;
    });

    // Move to new court
    const targetCourtIndex = updatedCourts.findIndex((court) => court.id === courtId);
    
    if (targetCourtIndex !== -1) {
      // Check if activity is already on this court
      if (!updatedCourts[targetCourtIndex].activities.some(a => a.id === activity.id)) {
        updatedCourts[targetCourtIndex] = {
          ...updatedCourts[targetCourtIndex],
          activities: [
            ...updatedCourts[targetCourtIndex].activities,
            { ...draggableActivity, courtId },
          ],
        };
      }
    }

    // Remove from available activities list if it's coming from there
    setActivities(activities.filter((a) => a.id !== activity.id));
    setCourts(updatedCourts);

    toast({
      title: "Activity Assigned",
      description: `${draggableActivity.name} has been assigned to ${courts.find(c => c.id === courtId)?.name} #${courts.find(c => c.id === courtId)?.number}`,
    });
  };

  const handleRemovePerson = (personId: string) => {
    // Add back to available list
    const personToRemove = courts.flatMap(c => c.occupants).find(p => p.id === personId);
    
    if (personToRemove) {
      setPeople([...people, { ...personToRemove, courtId: undefined, position: undefined }]);
      
      // Remove from court
      setCourts(
        courts.map((court) => ({
          ...court,
          occupants: court.occupants.filter((p) => p.id !== personId),
        }))
      );

      toast({
        title: "Person Removed",
        description: `${personToRemove.name} has been removed from the court`,
      });
    }
  };

  const handleRemoveActivity = (activityId: string) => {
    // Add back to available list
    const activityToRemove = courts.flatMap(c => c.activities).find(a => a.id === activityId);
    
    if (activityToRemove) {
      setActivities([...activities, { ...activityToRemove, courtId: undefined }]);
      
      // Remove from court
      setCourts(
        courts.map((court) => ({
          ...court,
          activities: court.activities.filter((a) => a.id !== activityId),
        }))
      );

      toast({
        title: "Activity Removed",
        description: `${activityToRemove.name} has been removed from the court`,
      });
    }
  };

  const handleAddPerson = () => {
    if (newPerson.name.trim() === "") {
      toast({
        title: "Error",
        description: "Please enter a name",
        variant: "destructive",
      });
      return;
    }

    const newId = `${newPerson.type}-${Date.now()}`;
    const personToAdd = {
      id: newId,
      name: newPerson.name,
      type: newPerson.type,
    };

    setPeople([...people, personToAdd]);
    setNewPerson({ name: "", type: PERSON_TYPES.PLAYER });

    toast({
      title: "Person Added",
      description: `${personToAdd.name} has been added to the available list`,
    });
  };

  const handleAddActivity = () => {
    if (newActivity.name.trim() === "") {
      toast({
        title: "Error",
        description: "Please enter an activity name",
        variant: "destructive",
      });
      return;
    }

    const newId = `activity-${Date.now()}`;
    const activityToAdd = {
      id: newId,
      name: newActivity.name,
      type: newActivity.type,
      duration: newActivity.duration,
    };

    setActivities([...activities, activityToAdd]);
    setNewActivity({ name: "", type: ACTIVITY_TYPES.MATCH, duration: "1h" });

    toast({
      title: "Activity Added",
      description: `${activityToAdd.name} has been added to the available list`,
    });
  };

  const saveAsTemplate = () => {
    if (newTemplateName.trim() === "") {
      toast({
        title: "Error",
        description: "Please enter a template name",
        variant: "destructive",
      });
      return;
    }

    const template: ScheduleTemplate = {
      id: `template-${Date.now()}`,
      name: newTemplateName,
      date: selectedDate,
      courts: [...courts],
    };

    setTemplates([...templates, template]);
    setNewTemplateName("");

    toast({
      title: "Template Saved",
      description: `Template "${newTemplateName}" has been saved and can be applied to other days`,
    });
  };

  const applyTemplate = (template: ScheduleTemplate) => {
    setCourts(template.courts);

    toast({
      title: "Template Applied",
      description: `Template "${template.name}" has been applied to ${format(selectedDate, "MMMM d, yyyy")}`,
    });
  };

  const copyToNextDay = () => {
    const nextDay = addDays(selectedDate, 1);
    setSelectedDate(nextDay);

    toast({
      title: "Schedule Copied",
      description: `Court assignments have been copied to ${format(nextDay, "MMMM d, yyyy")}`,
    });
  };

  const copyToWeek = () => {
    const startOfCurrentWeek = startOfWeek(selectedDate);
    const nextWeekStart = addWeeks(startOfCurrentWeek, 1);
    setSelectedDate(nextWeekStart);

    toast({
      title: "Schedule Copied to Next Week",
      description: `Court assignments have been copied to week of ${format(nextWeekStart, "MMMM d, yyyy")}`,
    });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="max-w-7xl mx-auto animate-fade-in p-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Court Vision</h1>
          <p className="text-gray-600 mt-1">Drag and drop players, coaches, and activities to assign them to courts</p>
        </div>

        {/* Date Selector and Schedule Controls */}
        <div className="flex flex-wrap items-center gap-3 mb-6 bg-white p-3 rounded-xl shadow-soft">
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-ath-blue mr-2" />
            <span className="font-medium">Schedule for:</span>
          </div>
          
          <Popover open={showCalendar} onOpenChange={setShowCalendar}>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className="border border-gray-300 bg-white"
              >
                <span>{format(selectedDate, "MMMM d, yyyy")}</span>
                <CalendarIcon className="ml-2 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  setSelectedDate(date || new Date());
                  setShowCalendar(false);
                }}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
          
          <div className="flex items-center gap-2 ml-auto">
            <Button 
              variant="outline" 
              className="text-sm" 
              onClick={copyToNextDay}
            >
              <Copy className="h-4 w-4 mr-1.5" />
              Copy to Next Day
            </Button>
            
            <Button 
              variant="outline" 
              className="text-sm" 
              onClick={copyToWeek}
            >
              <CalendarDays className="h-4 w-4 mr-1.5" />
              Copy to Next Week
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left sidebar - Available people & activities */}
          <div className="md:col-span-3 lg:col-span-2 space-y-4">
            {/* Available people */}
            <div className="bg-white rounded-xl shadow-soft p-4">
              <h2 className="font-medium mb-3 flex items-center">
                <Users className="h-4 w-4 mr-2" /> Available People
              </h2>
              
              {/* Add new person form */}
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium mb-2">Add New Person</h3>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Name"
                    className="w-full px-3 py-2 text-sm border rounded"
                    value={newPerson.name}
                    onChange={(e) => setNewPerson({ ...newPerson, name: e.target.value })}
                  />
                  <div className="flex space-x-2">
                    <button
                      className={`flex-1 text-xs py-1.5 rounded ${
                        newPerson.type === PERSON_TYPES.PLAYER
                          ? "bg-ath-blue text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                      onClick={() => setNewPerson({ ...newPerson, type: PERSON_TYPES.PLAYER })}
                    >
                      Player
                    </button>
                    <button
                      className={`flex-1 text-xs py-1.5 rounded ${
                        newPerson.type === PERSON_TYPES.COACH
                          ? "bg-ath-orange text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                      onClick={() => setNewPerson({ ...newPerson, type: PERSON_TYPES.COACH })}
                    >
                      Coach
                    </button>
                  </div>
                  <button
                    className="w-full bg-green-500 text-white text-sm py-1.5 rounded hover:bg-green-600 transition-colors"
                    onClick={handleAddPerson}
                  >
                    Add Person
                  </button>
                </div>
              </div>

              <div className="max-h-[180px] overflow-y-auto">
                {people.length > 0 ? (
                  people.map((person) => (
                    <Person
                      key={person.id}
                      person={person}
                      onRemove={() => handleRemovePerson(person.id)}
                    />
                  ))
                ) : (
                  <div className="text-sm text-gray-500 italic p-2">
                    All people assigned to courts
                  </div>
                )}
              </div>
            </div>
            
            {/* Available activities */}
            <div className="bg-white rounded-xl shadow-soft p-4">
              <h2 className="font-medium mb-3 flex items-center">
                <ChartBar className="h-4 w-4 mr-2" /> Available Activities
              </h2>
              
              {/* Add new activity form */}
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium mb-2">Add New Activity</h3>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Activity Name"
                    className="w-full px-3 py-2 text-sm border rounded"
                    value={newActivity.name}
                    onChange={(e) => setNewActivity({ ...newActivity, name: e.target.value })}
                  />
                  <select
                    className="w-full px-3 py-2 text-sm border rounded"
                    value={newActivity.type}
                    onChange={(e) => setNewActivity({ ...newActivity, type: e.target.value })}
                  >
                    <option value={ACTIVITY_TYPES.MATCH}>Match</option>
                    <option value={ACTIVITY_TYPES.TRAINING}>Training</option>
                    <option value={ACTIVITY_TYPES.BASKET_DRILL}>Basket Drill</option>
                    <option value={ACTIVITY_TYPES.GAME}>Game</option>
                    <option value={ACTIVITY_TYPES.LESSON}>Lesson</option>
                  </select>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 mr-2">Duration:</span>
                    <select
                      className="flex-1 px-3 py-2 text-sm border rounded"
                      value={newActivity.duration}
                      onChange={(e) => setNewActivity({ ...newActivity, duration: e.target.value })}
                    >
                      <option value="30m">30 minutes</option>
                      <option value="45m">45 minutes</option>
                      <option value="1h">1 hour</option>
                      <option value="1.5h">1.5 hours</option>
                      <option value="2h">2 hours</option>
                    </select>
                  </div>
                  <button
                    className="w-full bg-green-500 text-white text-sm py-1.5 rounded hover:bg-green-600 transition-colors"
                    onClick={handleAddActivity}
                  >
                    Add Activity
                  </button>
                </div>
              </div>

              <div className="max-h-[180px] overflow-y-auto">
                {activities.length > 0 ? (
                  activities.map((activity) => (
                    <Activity
                      key={activity.id}
                      activity={activity}
                      onRemove={() => handleRemoveActivity(activity.id)}
                    />
                  ))
                ) : (
                  <div className="text-sm text-gray-500 italic p-2">
                    All activities assigned to courts
                  </div>
                )}
              </div>
            </div>
            
            {/* Templates */}
            <div className="bg-white rounded-xl shadow-soft p-4">
              <h2 className="font-medium mb-3 flex items-center">
                <Clock className="h-4 w-4 mr-2" /> Schedule Templates
              </h2>
              
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium mb-2">Save Current Schedule</h3>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Template Name"
                    className="w-full px-3 py-2 text-sm border rounded"
                    value={newTemplateName}
                    onChange={(e) => setNewTemplateName(e.target.value)}
                  />
                  <button
                    className="w-full bg-ath-blue text-white text-sm py-1.5 rounded hover:bg-ath-blue-dark transition-colors"
                    onClick={saveAsTemplate}
                  >
                    Save as Template
                  </button>
                </div>
              </div>
              
              {templates.length > 0 ? (
                <div className="space-y-2">
                  {templates.map((template) => (
                    <div key={template.id} className="p-2 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{template.name}</span>
                        <button
                          className="text-xs bg-ath-blue-light px-2 py-1 rounded text-ath-blue hover:bg-ath-blue-light/80"
                          onClick={() => applyTemplate(template)}
                        >
                          Apply
                        </button>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Created: {format(template.date, "MMM d, yyyy")}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-500 italic p-2">
                  No saved templates yet
                </div>
              )}
            </div>
          </div>

          {/* Courts grid */}
          <div className="md:col-span-9 lg:col-span-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {courts.map((court) => (
                <Court 
                  key={court.id} 
                  court={court} 
                  onDrop={handleDrop} 
                  onActivityDrop={handleActivityDrop}
                />
              ))}
            </div>
            
            {/* Color legend */}
            <div className="mt-6 p-3 bg-white rounded-lg shadow-sm">
              <h3 className="text-sm font-medium mb-2">Court Types</h3>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-ath-clay mr-1.5"></span>
                  <span className="text-xs text-gray-600">Tennis (Clay)</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-ath-hard mr-1.5"></span>
                  <span className="text-xs text-gray-600">Tennis (Hard)</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-ath-grass mr-1.5"></span>
                  <span className="text-xs text-gray-600">Padel</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-yellow-400 mr-1.5"></span>
                  <span className="text-xs text-gray-600">Pickleball</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-purple-400 mr-1.5"></span>
                  <span className="text-xs text-gray-600">Touch Tennis</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}
