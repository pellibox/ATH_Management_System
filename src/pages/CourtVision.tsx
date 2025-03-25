
import { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useToast } from "@/hooks/use-toast";
import { format, addDays, startOfWeek, addWeeks, parseISO } from "date-fns";
import { 
  CalendarIcon, 
  Clock, 
  Plus, 
  MenuIcon, 
  Settings, 
  Users, 
  PlusCircle, 
  Calendar, 
  Film,
  Layers 
} from "lucide-react";

// Import court vision components
import { Court } from "@/components/court-vision/Court";
import { AvailablePeople } from "@/components/court-vision/AvailablePeople";
import { AvailableActivities } from "@/components/court-vision/AvailableActivities";
import { ScheduleTemplates } from "@/components/court-vision/ScheduleTemplates";
import { DateSelector } from "@/components/court-vision/DateSelector";
import { PeopleManagement } from "@/components/court-vision/PeopleManagement";
import { CourtLegend } from "@/components/court-vision/CourtLegend";
import { CourtAssignmentDialog } from "@/components/court-vision/CourtAssignmentDialog";
import { TimeSlotSelector } from "@/components/court-vision/TimeSlotSelector";
import { CourtManagement } from "@/components/court-vision/CourtManagement";
import { COURT_TYPES, PERSON_TYPES, ACTIVITY_TYPES } from "@/components/court-vision/constants";
import { PersonData, ActivityData, CourtProps, ScheduleTemplate, DateSchedule } from "@/components/court-vision/types";
import { useIsMobile } from "@/hooks/use-mobile";

// Tabs
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CourtVision() {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [templates, setTemplates] = useState<ScheduleTemplate[]>([]);
  const [dateSchedules, setDateSchedules] = useState<DateSchedule[]>([]);
  const [activeTab, setActiveTab] = useState<"courts" | "people" | "activities" | "time-slots" | "templates">("courts");
  
  // Define time slots
  const [timeSlots, setTimeSlots] = useState<string[]>([
    "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", 
    "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"
  ]);
  
  // Initialize empty courts
  const defaultCourts: CourtProps[] = [
    { id: "court1", type: COURT_TYPES.TENNIS_CLAY, name: "Center Court", number: 1, occupants: [], activities: [] },
    { id: "court2", type: COURT_TYPES.TENNIS_CLAY, name: "Tennis", number: 2, occupants: [], activities: [] },
    { id: "court3", type: COURT_TYPES.TENNIS_CLAY, name: "Tennis", number: 3, occupants: [], activities: [] },
    { id: "court5", type: COURT_TYPES.TENNIS_HARD, name: "Tennis", number: 5, occupants: [], activities: [] },
    { id: "court6", type: COURT_TYPES.TENNIS_HARD, name: "Tennis", number: 6, occupants: [], activities: [] },
    { id: "padel1", type: COURT_TYPES.PADEL, name: "Padel", number: 1, occupants: [], activities: [] },
    { id: "padel2", type: COURT_TYPES.PADEL, name: "Padel", number: 2, occupants: [], activities: [] },
  ];
  
  const [courts, setCourts] = useState<CourtProps[]>(defaultCourts);

  const [people, setPeople] = useState<PersonData[]>([
    { id: "player1", name: "Alex Smith", type: PERSON_TYPES.PLAYER },
    { id: "player2", name: "Emma Johnson", type: PERSON_TYPES.PLAYER },
    { id: "player3", name: "Michael Brown", type: PERSON_TYPES.PLAYER },
    { id: "coach1", name: "Coach Anderson", type: PERSON_TYPES.COACH },
    { id: "coach2", name: "Coach Martinez", type: PERSON_TYPES.COACH },
  ]);

  const [activities, setActivities] = useState<ActivityData[]>([
    { id: "activity1", name: "Singles Match", type: ACTIVITY_TYPES.MATCH, duration: "1h" },
    { id: "activity2", name: "Group Training", type: ACTIVITY_TYPES.TRAINING, duration: "1.5h" },
    { id: "activity3", name: "Basket Drill", type: ACTIVITY_TYPES.BASKET_DRILL, duration: "45m" },
  ]);

  const [playersList, setPlayersList] = useState<PersonData[]>([
    { id: "player1", name: "Alex Smith", type: PERSON_TYPES.PLAYER },
    { id: "player2", name: "Emma Johnson", type: PERSON_TYPES.PLAYER },
    { id: "player3", name: "Michael Brown", type: PERSON_TYPES.PLAYER },
    { id: "player4", name: "Sophia Davis", type: PERSON_TYPES.PLAYER },
    { id: "player5", name: "James Wilson", type: PERSON_TYPES.PLAYER },
  ]);
  
  const [coachesList, setCoachesList] = useState<PersonData[]>([
    { id: "coach1", name: "Coach Anderson", type: PERSON_TYPES.COACH },
    { id: "coach2", name: "Coach Martinez", type: PERSON_TYPES.COACH },
    { id: "coach3", name: "Coach Thompson", type: PERSON_TYPES.COACH },
  ]);

  // Load courts for the selected date
  useEffect(() => {
    const dateString = selectedDate.toISOString().split('T')[0];
    const existingSchedule = dateSchedules.find(schedule => schedule.date === dateString);
    
    if (existingSchedule) {
      setCourts(existingSchedule.courts);
    } else {
      setCourts(defaultCourts);
    }
  }, [selectedDate, dateSchedules]);

  // Save courts when they change
  useEffect(() => {
    const dateString = selectedDate.toISOString().split('T')[0];
    const existingScheduleIndex = dateSchedules.findIndex(schedule => schedule.date === dateString);
    
    if (existingScheduleIndex >= 0) {
      const updatedSchedules = [...dateSchedules];
      updatedSchedules[existingScheduleIndex] = { date: dateString, courts };
      setDateSchedules(updatedSchedules);
    } else {
      setDateSchedules([...dateSchedules, { date: dateString, courts }]);
    }
  }, [courts]);

  const handleDrop = (courtId: string, person: PersonData, position?: { x: number, y: number }, timeSlot?: string) => {
    // Create a copy of the person with court information
    const personWithCourtInfo = { 
      ...person, 
      courtId,
      position: position || { x: Math.random() * 0.8 + 0.1, y: Math.random() * 0.8 + 0.1 },
      timeSlot,
      date: selectedDate.toISOString().split('T')[0]
    };

    let updatedCourts = [...courts];

    // If person is already on a court for this time slot, remove them
    if (timeSlot) {
      // Look for the person in this specific time slot
      updatedCourts = updatedCourts.map((court) => {
        return {
          ...court,
          occupants: court.occupants.filter((p) => {
            // Keep the person if they're not the same person or not in the same time slot
            return !(p.id === person.id && p.timeSlot === timeSlot);
          })
        };
      });
    } else {
      // For general court assignment (no time slot), check all courts
      updatedCourts = updatedCourts.map((court) => {
        return {
          ...court,
          occupants: court.occupants.filter((p) => {
            // Keep the person if they're not the same person or they have a specific time slot
            return !(p.id === person.id && !p.timeSlot);
          })
        };
      });
    }

    // Add person to the target court
    updatedCourts = updatedCourts.map(court => {
      if (court.id === courtId) {
        // Add new person
        return {
          ...court,
          occupants: [...court.occupants, personWithCourtInfo],
        };
      }
      return court;
    });

    setCourts(updatedCourts);

    // If the person is from the available list, remove them
    const isFromAvailableList = people.some(p => p.id === person.id);
    if (isFromAvailableList) {
      setPeople(people.filter(p => p.id !== person.id));
    }

    toast({
      title: "Persona Assegnata",
      description: `${person.name} è stata assegnata al campo ${courts.find(c => c.id === courtId)?.name} #${courts.find(c => c.id === courtId)?.number}${timeSlot ? ` alle ${timeSlot}` : ''}`,
    });
  };

  const handleActivityDrop = (courtId: string, activity: ActivityData, timeSlot?: string) => {
    const draggableActivity = activities.find((a) => a.id === activity.id) || 
                              courts.flatMap(c => c.activities).find(a => a.id === activity.id);
    
    if (!draggableActivity) return;

    const activityCopy = { 
      ...draggableActivity, 
      courtId, 
      startTime: timeSlot,
      date: selectedDate.toISOString().split('T')[0]
    };

    let updatedCourts = [...courts];

    // If activity is already scheduled for this time slot, remove it
    if (timeSlot) {
      updatedCourts = updatedCourts.map((court) => {
        return {
          ...court,
          activities: court.activities.filter(a => 
            !(a.id === activity.id && a.startTime === timeSlot)
          )
        };
      });
    } else {
      // For general assignment (no time slot), check all courts
      updatedCourts = updatedCourts.map((court) => {
        return {
          ...court,
          activities: court.activities.filter(a => 
            !(a.id === activity.id && !a.startTime)
          )
        };
      });
    }

    // Add activity to the target court
    updatedCourts = updatedCourts.map(court => {
      if (court.id === courtId) {
        return {
          ...court,
          activities: [...court.activities, activityCopy],
        };
      }
      return court;
    });

    setCourts(updatedCourts);

    const wasOnCourt = courts.some(court => 
      court.activities.some(a => a.id === activity.id)
    );
    
    if (!wasOnCourt) {
      setActivities(activities.filter((a) => a.id !== activity.id));
    }

    toast({
      title: "Attività Assegnata",
      description: `${draggableActivity.name} è stata assegnata al campo ${courts.find(c => c.id === courtId)?.name} #${courts.find(c => c.id === courtId)?.number}${timeSlot ? ` alle ${timeSlot}` : ''}`,
    });
  };

  const handleAssignPerson = (courtId: string, person: PersonData, timeSlot?: string) => {
    handleDrop(courtId, person, { x: 0.5, y: 0.5 }, timeSlot);
  };

  const handleAssignActivity = (courtId: string, activity: ActivityData, timeSlot?: string) => {
    handleActivityDrop(courtId, activity, timeSlot);
  };

  const handleRemovePerson = (personId: string, timeSlot?: string) => {
    const personToRemove = courts.flatMap(c => c.occupants).find(p => 
      p.id === personId && p.timeSlot === timeSlot
    );
    
    if (personToRemove) {
      const { courtId, position, timeSlot, date, ...personWithoutCourtInfo } = personToRemove;
      
      // Only add back to available people if they don't have other assignments
      const hasOtherAssignments = courts.some(court => 
        court.occupants.some(p => p.id === personId && p.timeSlot !== timeSlot)
      );
      
      if (!hasOtherAssignments) {
        setPeople([...people, personWithoutCourtInfo]);
      }
      
      setCourts(
        courts.map((court) => ({
          ...court,
          occupants: court.occupants.filter((p) => !(p.id === personId && p.timeSlot === timeSlot)),
        }))
      );

      toast({
        title: "Persona Rimossa",
        description: `${personToRemove.name} è stata rimossa dal campo${timeSlot ? ` alle ${timeSlot}` : ''}`,
      });
    }
  };

  const handleRemoveActivity = (activityId: string, timeSlot?: string) => {
    const activityToRemove = courts.flatMap(c => c.activities).find(a => 
      a.id === activityId && a.startTime === timeSlot
    );
    
    if (activityToRemove) {
      const { courtId, startTime, date, ...activityWithoutCourtInfo } = activityToRemove;
      
      // Only add back to available activities if they don't have other assignments
      const hasOtherAssignments = courts.some(court => 
        court.activities.some(a => a.id === activityId && a.startTime !== timeSlot)
      );
      
      if (!hasOtherAssignments) {
        setActivities([...activities, activityWithoutCourtInfo]);
      }
      
      setCourts(
        courts.map((court) => ({
          ...court,
          activities: court.activities.filter((a) => !(a.id === activityId && a.startTime === timeSlot)),
        }))
      );

      toast({
        title: "Attività Rimossa",
        description: `${activityToRemove.name} è stata rimossa dal campo${timeSlot ? ` alle ${timeSlot}` : ''}`,
      });
    }
  };

  const handleAddPerson = (personData: {name: string, type: string}) => {
    if (personData.name.trim() === "") {
      toast({
        title: "Error",
        description: "Please enter a name",
        variant: "destructive",
      });
      return;
    }

    const newId = `${personData.type}-${Date.now()}`;
    const personToAdd = {
      id: newId,
      name: personData.name,
      type: personData.type,
    };

    // Add to people list
    setPeople(prevPeople => [...prevPeople, personToAdd]);
    
    // Also add to the appropriate list based on type
    if (personData.type === PERSON_TYPES.PLAYER) {
      setPlayersList(prevList => [...prevList, personToAdd]);
    } else if (personData.type === PERSON_TYPES.COACH) {
      setCoachesList(prevList => [...prevList, personToAdd]);
    }

    toast({
      title: "Persona Aggiunta",
      description: `${personToAdd.name} è stata aggiunta alla lista disponibile`,
    });
  };

  const handleAddActivity = (activityData: {name: string, type: string, duration: string}) => {
    if (activityData.name.trim() === "") {
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
      name: activityData.name,
      type: activityData.type,
      duration: activityData.duration,
    };

    setActivities([...activities, activityToAdd]);

    toast({
      title: "Attività Aggiunta",
      description: `${activityToAdd.name} è stata aggiunta alla lista disponibile`,
    });
  };

  const handleAddTimeSlot = (time: string) => {
    setTimeSlots([...timeSlots, time].sort());
    
    toast({
      title: "Fascia Oraria Aggiunta",
      description: `Fascia oraria ${time} è stata aggiunta al programma`,
    });
  };

  const handleRemoveTimeSlot = (time: string) => {
    // Check if this time slot is in use
    const isTimeSlotInUse = courts.some(court => 
      court.occupants.some(p => p.timeSlot === time) || 
      court.activities.some(a => a.startTime === time)
    );
    
    if (isTimeSlotInUse) {
      toast({
        title: "Fascia Oraria In Uso",
        description: `Non è possibile rimuovere la fascia oraria ${time} perché è in uso`,
        variant: "destructive",
      });
      return;
    }
    
    setTimeSlots(timeSlots.filter(t => t !== time));
    
    toast({
      title: "Fascia Oraria Rimossa",
      description: `Fascia oraria ${time} è stata rimossa dal programma`,
    });
  };

  const saveAsTemplate = (name: string) => {
    if (name.trim() === "") {
      toast({
        title: "Error",
        description: "Please enter a template name",
        variant: "destructive",
      });
      return;
    }

    const template: ScheduleTemplate = {
      id: `template-${Date.now()}`,
      name: name,
      date: selectedDate,
      courts: [...courts],
    };

    setTemplates([...templates, template]);

    toast({
      title: "Template Salvato",
      description: `Template "${name}" è stato salvato e può essere applicato a giorni futuri`,
    });
  };

  const applyTemplate = (template: ScheduleTemplate) => {
    setCourts(template.courts);

    // Add to date schedules
    const dateString = selectedDate.toISOString().split('T')[0];
    const existingScheduleIndex = dateSchedules.findIndex(schedule => schedule.date === dateString);
    
    if (existingScheduleIndex >= 0) {
      const updatedSchedules = [...dateSchedules];
      updatedSchedules[existingScheduleIndex] = { date: dateString, courts: template.courts };
      setDateSchedules(updatedSchedules);
    } else {
      setDateSchedules([...dateSchedules, { date: dateString, courts: template.courts }]);
    }

    toast({
      title: "Template Applicato",
      description: `Template "${template.name}" è stato applicato al giorno ${format(selectedDate, "MMMM d, yyyy")}`,
    });
  };

  const copyToNextDay = () => {
    const nextDay = addDays(selectedDate, 1);
    const nextDayString = nextDay.toISOString().split('T')[0];
    
    // Save current courts to the next day
    const existingScheduleIndex = dateSchedules.findIndex(schedule => schedule.date === nextDayString);
    
    if (existingScheduleIndex >= 0) {
      const updatedSchedules = [...dateSchedules];
      updatedSchedules[existingScheduleIndex] = { date: nextDayString, courts };
      setDateSchedules(updatedSchedules);
    } else {
      setDateSchedules([...dateSchedules, { date: nextDayString, courts }]);
    }
    
    setSelectedDate(nextDay);

    toast({
      title: "Piano Copiato",
      description: `Le assegnazioni del campo sono state copiate al giorno ${format(nextDay, "MMMM d, yyyy")}`,
    });
  };

  const copyToWeek = () => {
    const startOfCurrentWeek = startOfWeek(selectedDate);
    const nextWeekStart = addWeeks(startOfCurrentWeek, 1);
    
    // Loop through each day of the week and copy courts
    for (let i = 0; i < 7; i++) {
      const targetDay = addDays(nextWeekStart, i);
      const targetDayString = targetDay.toISOString().split('T')[0];
      
      // Save current courts to the target day
      const existingScheduleIndex = dateSchedules.findIndex(schedule => schedule.date === targetDayString);
      
      if (existingScheduleIndex >= 0) {
        const updatedSchedules = [...dateSchedules];
        updatedSchedules[existingScheduleIndex] = { date: targetDayString, courts };
        setDateSchedules(updatedSchedules);
      } else {
        setDateSchedules([...dateSchedules, { date: targetDayString, courts }]);
      }
    }
    
    setSelectedDate(nextWeekStart);

    toast({
      title: "Piano Copiato alla Prossima Settimana",
      description: `Le assegnazioni del campo sono state copiate alla settimana che inizia ${format(nextWeekStart, "MMMM d, yyyy")}`,
    });
  };

  const handleAddToDragArea = (person: PersonData) => {
    const isAlreadyAvailable = people.some(p => p.id === person.id);
    
    if (!isAlreadyAvailable) {
      const isOnCourt = courts.some(court => 
        court.occupants.some(p => p.id === person.id)
      );
      
      if (!isOnCourt) {
        setPeople(prevPeople => [...prevPeople, person]);
        
        toast({
          title: "Persona Aggiunta",
          description: `${person.name} è stata aggiunta all'area di trascinamento`,
        });
      } else {
        toast({
          title: "Persona già assegnata",
          description: `${person.name} è già assegnata ad un campo. Rimuovila prima.`,
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Persona già disponibile",
        description: `${person.name} è già nell'area di trascinamento`,
        variant: "destructive",
      });
    }
  };

  // New court management handlers
  const handleAddCourt = (courtData: { name: string; type: string; number: number }) => {
    const newId = `court-${Date.now()}`;
    const newCourt: CourtProps = {
      id: newId,
      name: courtData.name,
      type: courtData.type,
      number: courtData.number,
      occupants: [],
      activities: []
    };
    
    setCourts([...courts, newCourt]);
  };

  const handleRemoveCourt = (courtId: string) => {
    // Check if court has occupants or activities
    const courtToRemove = courts.find(c => c.id === courtId);
    
    if (!courtToRemove) return;
    
    // Return people to the available list
    courtToRemove.occupants.forEach(person => {
      const { courtId, position, timeSlot, date, ...personWithoutCourtInfo } = person;
      setPeople(prev => [...prev, personWithoutCourtInfo]);
    });
    
    // Return activities to the available list
    courtToRemove.activities.forEach(activity => {
      const { courtId, startTime, date, ...activityWithoutCourtInfo } = activity;
      setActivities(prev => [...prev, activityWithoutCourtInfo]);
    });
    
    // Remove the court
    setCourts(courts.filter(c => c.id !== courtId));
    
    toast({
      title: "Campo Rimosso",
      description: `${courtToRemove.name} #${courtToRemove.number} è stato rimosso`
    });
  };

  const handleRenameCourt = (courtId: string, name: string) => {
    setCourts(
      courts.map(court =>
        court.id === courtId ? { ...court, name } : court
      )
    );
  };

  const handleChangeCourtType = (courtId: string, type: string) => {
    setCourts(
      courts.map(court =>
        court.id === courtId ? { ...court, type } : court
      )
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container mx-auto py-4">
        <h1 className="text-2xl font-bold mb-4">Court Vision</h1>
        
        {/* Top navigation and date controls */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="grid grid-cols-1 md:flex md:justify-between md:items-center gap-4 mb-4">
            <div className="flex-grow max-w-md">
              <DateSelector 
                selectedDate={selectedDate} 
                onDateChange={setSelectedDate} 
              />
            </div>
            <div className="flex space-x-2">
              <button 
                className="flex-1 bg-ath-black text-white py-2 px-3 rounded hover:bg-ath-black-light transition-colors text-sm"
                onClick={copyToNextDay}
              >
                <span className="flex items-center justify-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Copia Giorno
                </span>
              </button>
              <button 
                className="flex-1 bg-ath-black text-white py-2 px-3 rounded hover:bg-ath-black-light transition-colors text-sm"
                onClick={copyToWeek}
              >
                <span className="flex items-center justify-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Copia Settimana
                </span>
              </button>
            </div>
          </div>
          
          {/* Court Type Legend */}
          <div className="mb-4">
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-sm font-medium">Court Types:</span>
              <div className="flex items-center gap-1">
                <span className="w-4 h-4 bg-ath-red-clay rounded-full"></span>
                <span className="text-sm">Tennis (Clay)</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-4 h-4 bg-ath-black rounded-full"></span>
                <span className="text-sm">Tennis (Hard)</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-4 h-4 bg-green-500 rounded-full"></span>
                <span className="text-sm">Padel</span>
              </div>
            </div>
          </div>
          
          {/* Top Tab Navigation */}
          <Tabs defaultValue="courts" className="w-full">
            <TabsList className="w-full justify-start mb-4 bg-gray-100 p-1 rounded-md">
              <TabsTrigger value="courts" className="data-[state=active]:bg-ath-black data-[state=active]:text-white">
                <Layers className="h-4 w-4 mr-1" />
                Courts
              </TabsTrigger>
              <TabsTrigger value="people" className="data-[state=active]:bg-ath-black data-[state=active]:text-white">
                <Users className="h-4 w-4 mr-1" />
                People
              </TabsTrigger>
              <TabsTrigger value="activities" className="data-[state=active]:bg-ath-black data-[state=active]:text-white">
                <Film className="h-4 w-4 mr-1" />
                Activities
              </TabsTrigger>
              <TabsTrigger value="time-slots" className="data-[state=active]:bg-ath-black data-[state=active]:text-white">
                <Clock className="h-4 w-4 mr-1" />
                Time Slots
              </TabsTrigger>
              <TabsTrigger value="templates" className="data-[state=active]:bg-ath-black data-[state=active]:text-white">
                <CalendarIcon className="h-4 w-4 mr-1" />
                Templates
              </TabsTrigger>
            </TabsList>
            
            <div className="flex justify-between items-center mb-4">
              <TabsContent value="courts" className="mt-0 w-full">
                <CourtManagement 
                  courts={courts}
                  onAddCourt={handleAddCourt}
                  onRemoveCourt={handleRemoveCourt}
                  onRenameCourt={handleRenameCourt}
                  onChangeCourtType={handleChangeCourtType}
                />
              </TabsContent>
              
              <TabsContent value="people" className="mt-0 w-full">
                <AvailablePeople 
                  people={people} 
                  onAddPerson={handleAddPerson}
                  onRemovePerson={(personId) => handleRemovePerson(personId)}
                />
              </TabsContent>
              
              <TabsContent value="activities" className="mt-0 w-full">
                <AvailableActivities 
                  activities={activities}
                  onAddActivity={handleAddActivity}
                  onRemoveActivity={(activityId) => handleRemoveActivity(activityId)}
                />
              </TabsContent>
              
              <TabsContent value="time-slots" className="mt-0 w-full">
                <TimeSlotSelector
                  timeSlots={timeSlots}
                  onAddTimeSlot={handleAddTimeSlot}
                  onRemoveTimeSlot={handleRemoveTimeSlot}
                />
              </TabsContent>
              
              <TabsContent value="templates" className="mt-0 w-full">
                <ScheduleTemplates 
                  templates={templates} 
                  onApplyTemplate={applyTemplate} 
                  onSaveTemplate={saveAsTemplate}
                />
              </TabsContent>
            </div>
            
            <div className="flex justify-between items-center mb-4">
              <CourtAssignmentDialog 
                courts={courts}
                availablePeople={people}
                availableActivities={activities}
                timeSlots={timeSlots}
                onAssignPerson={handleAssignPerson}
                onAssignActivity={handleAssignActivity}
                onRemovePerson={handleRemovePerson}
                onRemoveActivity={handleRemoveActivity}
              />
            </div>
          </Tabs>
        </div>
        
        {/* Courts Grid - Make courts larger */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courts.map((court) => (
            <Court
              key={court.id}
              court={court}
              date={selectedDate}
              timeSlots={timeSlots}
              onDrop={handleDrop}
              onActivityDrop={handleActivityDrop}
              onRemovePerson={handleRemovePerson}
              onRemoveActivity={handleRemoveActivity}
              onCourtRename={handleRenameCourt}
              onCourtTypeChange={handleChangeCourtType}
              onCourtRemove={handleRemoveCourt}
            />
          ))}
        </div>
      </div>
    </DndProvider>
  );
}
