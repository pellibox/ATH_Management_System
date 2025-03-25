import React, { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useToast } from "@/hooks/use-toast";
import { format, addDays, startOfWeek, addWeeks } from "date-fns";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  CalendarIcon, 
  Clock, 
  Plus, 
  Users, 
  Calendar, 
  Film,
  Layers,
  ArrowDown,
  ArrowUp,
} from "lucide-react";

// Import court vision components
import { Court } from "@/components/court-vision/Court";
import { Person } from "@/components/court-vision/Person";
import { AvailablePeople } from "@/components/court-vision/AvailablePeople";
import { AvailableActivities } from "@/components/court-vision/AvailableActivities";
import { ScheduleTemplates } from "@/components/court-vision/ScheduleTemplates";
import { DateSelector } from "@/components/court-vision/DateSelector";
import { PeopleManagement } from "@/components/court-vision/PeopleManagement";
import { CourtAssignmentDialog } from "@/components/court-vision/CourtAssignmentDialog";
import { TimeSlotSelector } from "@/components/court-vision/TimeSlotSelector";
import { CourtManagement } from "@/components/court-vision/CourtManagement";
import { SendScheduleDialog } from "@/components/court-vision/SendScheduleDialog";
import { ProgramManagement } from "@/components/court-vision/ProgramManagement";
import { AssignmentsDashboard } from "@/components/court-vision/AssignmentsDashboard";
import { COURT_TYPES, PERSON_TYPES, ACTIVITY_TYPES, DEFAULT_PROGRAMS } from "@/components/court-vision/constants";
import { PersonData, ActivityData, CourtProps, ScheduleTemplate, DateSchedule, Program } from "@/components/court-vision/types";
import { useIsMobile } from "@/hooks/use-mobile";

// Tabs
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define sport types
const SPORT_TYPES = {
  TENNIS: "tennis",
  PADEL: "padel",
  PICKLEBALL: "pickleball",
  TOUCHTENNIS: "touchtennis"
};

const FloatingMenuPanel = ({ children }: { children: React.ReactNode }) => (
  <div className="fixed bottom-4 left-4 right-4 z-50 bg-white rounded-xl shadow-lg p-4 border border-gray-200">
    <div className="flex space-x-4 overflow-x-auto pb-2">
      {children}
    </div>
  </div>
);

const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};

export default function CourtVision() {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract sport from URL query params
  const searchParams = new URLSearchParams(location.pathname === "/court-vision/layout" ? "" : location.search);
  const sportFilter = searchParams.get("sport") || "";
  const isLayoutView = location.pathname === "/court-vision/layout";
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [templates, setTemplates] = useState<ScheduleTemplate[]>([]);
  const [dateSchedules, setDateSchedules] = useState<DateSchedule[]>([]);
  const [activeTab, setActiveTab] = useState<"courts" | "people" | "activities" | "time-slots" | "templates">("courts");
  
  const [timeSlots, setTimeSlots] = useState<string[]>([
    "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", 
    "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"
  ]);
  
  const defaultCourts: CourtProps[] = [
    { id: "court1", type: COURT_TYPES.TENNIS_CLAY, name: "Center Court", number: 1, occupants: [], activities: [] },
    { id: "court2", type: COURT_TYPES.TENNIS_CLAY, name: "Tennis", number: 2, occupants: [], activities: [] },
    { id: "court3", type: COURT_TYPES.TENNIS_CLAY, name: "Tennis", number: 3, occupants: [], activities: [] },
    { id: "court5", type: COURT_TYPES.TENNIS_HARD, name: "Tennis", number: 5, occupants: [], activities: [] },
    { id: "court6", type: COURT_TYPES.TENNIS_HARD, name: "Tennis", number: 6, occupants: [], activities: [] },
    { id: "padel1", type: COURT_TYPES.PADEL, name: "Padel", number: 1, occupants: [], activities: [] },
    { id: "padel2", type: COURT_TYPES.PADEL, name: "Padel", number: 2, occupants: [], activities: [] },
    { id: "pickle1", type: "pickleball", name: "Pickleball", number: 1, occupants: [], activities: [] },
    { id: "touch1", type: "touchtennis", name: "Touch Tennis", number: 1, occupants: [], activities: [] },
  ];
  
  const [courts, setCourts] = useState<CourtProps[]>(defaultCourts);
  const [filteredCourts, setFilteredCourts] = useState<CourtProps[]>(defaultCourts);

  const [people, setPeople] = useState<PersonData[]>([
    { id: "player1", name: "Alex Smith", type: PERSON_TYPES.PLAYER, sportType: SPORT_TYPES.TENNIS },
    { id: "player2", name: "Emma Johnson", type: PERSON_TYPES.PLAYER, sportType: SPORT_TYPES.TENNIS },
    { id: "player3", name: "Michael Brown", type: PERSON_TYPES.PLAYER, sportType: SPORT_TYPES.TENNIS },
    { id: "player4", name: "Carlo Rossi", type: PERSON_TYPES.PLAYER, sportType: SPORT_TYPES.PADEL },
    { id: "player5", name: "Laura Bianchi", type: PERSON_TYPES.PLAYER, sportType: SPORT_TYPES.PADEL },
    { id: "coach1", name: "Coach Anderson", type: PERSON_TYPES.COACH, sportType: SPORT_TYPES.TENNIS },
    { id: "coach2", name: "Coach Martinez", type: PERSON_TYPES.COACH, sportType: SPORT_TYPES.TENNIS },
    { id: "coach3", name: "Coach Pickleball", type: PERSON_TYPES.COACH, sportType: SPORT_TYPES.PICKLEBALL },
    { id: "coach4", name: "Coach Touchtennis", type: PERSON_TYPES.COACH, sportType: SPORT_TYPES.TOUCHTENNIS },
  ]);

  const [filteredPeople, setFilteredPeople] = useState<PersonData[]>(people);

  const [activities, setActivities] = useState<ActivityData[]>([
    { id: "activity1", name: "Singles Match", type: ACTIVITY_TYPES.MATCH, duration: "1h", sportType: SPORT_TYPES.TENNIS },
    { id: "activity2", name: "Group Training", type: ACTIVITY_TYPES.TRAINING, duration: "1.5h", sportType: SPORT_TYPES.TENNIS },
    { id: "activity3", name: "Basket Drill", type: ACTIVITY_TYPES.BASKET_DRILL, duration: "45m", sportType: SPORT_TYPES.TENNIS },
    { id: "activity4", name: "Padel Match", type: ACTIVITY_TYPES.MATCH, duration: "1h", sportType: SPORT_TYPES.PADEL },
    { id: "activity5", name: "Pickleball Drill", type: ACTIVITY_TYPES.TRAINING, duration: "1h", sportType: SPORT_TYPES.PICKLEBALL },
  ]);

  const [filteredActivities, setFilteredActivities] = useState<ActivityData[]>(activities);

  const [playersList, setPlayersList] = useState<PersonData[]>([
    { id: "player1", name: "Alex Smith", type: PERSON_TYPES.PLAYER, sportType: SPORT_TYPES.TENNIS },
    { id: "player2", name: "Emma Johnson", type: PERSON_TYPES.PLAYER, sportType: SPORT_TYPES.TENNIS },
    { id: "player3", name: "Michael Brown", type: PERSON_TYPES.PLAYER, sportType: SPORT_TYPES.TENNIS },
    { id: "player4", name: "Sophia Davis", type: PERSON_TYPES.PLAYER, sportType: SPORT_TYPES.TENNIS },
    { id: "player5", name: "James Wilson", type: PERSON_TYPES.PLAYER, sportType: SPORT_TYPES.TENNIS },
    { id: "player6", name: "Carlo Rossi", type: PERSON_TYPES.PLAYER, sportType: SPORT_TYPES.PADEL },
    { id: "player7", name: "Laura Bianchi", type: PERSON_TYPES.PLAYER, sportType: SPORT_TYPES.PADEL },
    { id: "player8", name: "John Pickle", type: PERSON_TYPES.PLAYER, sportType: SPORT_TYPES.PICKLEBALL },
    { id: "player9", name: "Tim Touch", type: PERSON_TYPES.PLAYER, sportType: SPORT_TYPES.TOUCHTENNIS },
  ]);
  
  const [filteredPlayersList, setFilteredPlayersList] = useState<PersonData[]>(playersList);
  
  const [coachesList, setCoachesList] = useState<PersonData[]>([
    { id: "coach1", name: "Coach Anderson", type: PERSON_TYPES.COACH, sportType: SPORT_TYPES.TENNIS },
    { id: "coach2", name: "Coach Martinez", type: PERSON_TYPES.COACH, sportType: SPORT_TYPES.TENNIS },
    { id: "coach3", name: "Coach Thompson", type: PERSON_TYPES.COACH, sportType: SPORT_TYPES.TENNIS },
    { id: "coach4", name: "Coach Padel", type: PERSON_TYPES.COACH, sportType: SPORT_TYPES.PADEL },
    { id: "coach5", name: "Coach Pickleball", type: PERSON_TYPES.COACH, sportType: SPORT_TYPES.PICKLEBALL },
    { id: "coach6", name: "Coach Touchtennis", type: PERSON_TYPES.COACH, sportType: SPORT_TYPES.TOUCHTENNIS },
  ]);

  const [filteredCoachesList, setFilteredCoachesList] = useState<PersonData[]>(coachesList);

  const [programs, setPrograms] = useState<Program[]>(DEFAULT_PROGRAMS);

  // Apply filters based on sport type
  useEffect(() => {
    if (sportFilter) {
      setFilteredCourts(courts.filter(court => {
        if (sportFilter === SPORT_TYPES.TENNIS) {
          return court.type.includes("tennis");
        } else {
          return court.type.includes(sportFilter);
        }
      }));
      
      setFilteredPeople(people.filter(person => 
        !person.sportType || person.sportType === sportFilter
      ));
      
      setFilteredActivities(activities.filter(activity => 
        !activity.sportType || activity.sportType === sportFilter
      ));
      
      setFilteredPlayersList(playersList.filter(player => 
        !player.sportType || player.sportType === sportFilter
      ));
      
      setFilteredCoachesList(coachesList.filter(coach => 
        !coach.sportType || coach.sportType === sportFilter
      ));
    } else {
      setFilteredCourts(courts);
      setFilteredPeople(people);
      setFilteredActivities(activities);
      setFilteredPlayersList(playersList);
      setFilteredCoachesList(coachesList);
    }
  }, [sportFilter, courts, people, activities, playersList, coachesList]);

  useEffect(() => {
    const dateString = selectedDate.toISOString().split('T')[0];
    const existingSchedule = dateSchedules.find(schedule => schedule.date === dateString);
    
    if (existingSchedule) {
      setCourts(existingSchedule.courts);
    } else {
      setCourts(defaultCourts);
    }
  }, [selectedDate, dateSchedules]);

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
    const isMovingFromExistingAssignment = courts.some(court => 
      court.occupants.some(p => p.id === person.id)
    );

    const personDuration = person.durationHours || 1;
    
    const program = programs.find(p => p.id === person.programId);
    
    const personWithCourtInfo = { 
      ...person, 
      courtId,
      position: position || { x: Math.random() * 0.8 + 0.1, y: Math.random() * 0.8 + 0.1 },
      timeSlot,
      date: selectedDate.toISOString().split('T')[0],
      durationHours: personDuration,
      programColor: program?.color
    };

    if (timeSlot) {
      const timeSlotIndex = timeSlots.indexOf(timeSlot);
      if (timeSlotIndex >= 0 && personDuration > 1) {
        const endSlotIndex = Math.min(timeSlotIndex + personDuration - 1, timeSlots.length - 1);
        personWithCourtInfo.endTimeSlot = timeSlots[endSlotIndex];
      }
    }

    let updatedCourts = [...courts];

    updatedCourts = updatedCourts.map((court) => {
      return {
        ...court,
        occupants: court.occupants.filter((p) => p.id !== person.id)
      };
    });

    updatedCourts = updatedCourts.map(court => {
      if (court.id === courtId) {
        return {
          ...court,
          occupants: [...court.occupants, personWithCourtInfo],
        };
      }
      return court;
    });

    setCourts(updatedCourts);

    const isFromAvailableList = people.some(p => p.id === person.id);
    if (isFromAvailableList) {
      setPeople(people.filter(p => p.id !== person.id));
    }

    toast({
      title: isMovingFromExistingAssignment ? "Persona Spostata" : "Persona Assegnata",
      description: `${person.name} è stata ${isMovingFromExistingAssignment ? "spostata" : "assegnata"} al campo ${courts.find(c => c.id === courtId)?.name} #${courts.find(c => c.id === courtId)?.number}${timeSlot ? ` alle ${timeSlot}` : ''}${personDuration > 1 ? ` per ${personDuration} ore` : ''}`,
    });
  };

  const handleActivityDrop = (courtId: string, activity: ActivityData, timeSlot?: string) => {
    const isMovingFromExistingAssignment = courts.some(court => 
      court.activities.some(a => a.id === activity.id)
    );

    const draggableActivity = activities.find((a) => a.id === activity.id) || 
                              courts.flatMap(c => c.activities).find(a => a.id === activity.id);
    
    if (!draggableActivity) return;

    let durationHours = 1;
    if (draggableActivity.duration) {
      const durationMatch = draggableActivity.duration.match(/(\d+(\.\d+)?)(h|m)/);
      if (durationMatch) {
        if (durationMatch[3] === 'h') {
          durationHours = parseFloat(durationMatch[1]);
        } else if (durationMatch[3] === 'm') {
          durationHours = parseFloat(durationMatch[1]) / 60;
        }
      }
    }

    const activityCopy = { 
      ...draggableActivity, 
      courtId, 
      startTime: timeSlot,
      date: selectedDate.toISOString().split('T')[0],
      durationHours
    };

    if (timeSlot) {
      const timeSlotIndex = timeSlots.indexOf(timeSlot);
      if (timeSlotIndex >= 0 && durationHours > 1) {
        const endSlotIndex = Math.min(timeSlotIndex + Math.ceil(durationHours) - 1, timeSlots.length - 1);
        activityCopy.endTimeSlot = timeSlots[endSlotIndex];
      }
    }

    let updatedCourts = [...courts];

    updatedCourts = updatedCourts.map((court) => {
      return {
        ...court,
        activities: court.activities.filter(a => a.id !== activity.id)
      };
    });

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
      title: isMovingFromExistingAssignment ? "Attività Spostata" : "Attività Assegnata",
      description: `${draggableActivity.name} è stata ${isMovingFromExistingAssignment ? "spostata" : "assegnata"} al campo ${courts.find(c => c.id === courtId)?.name} #${courts.find(c => c.id === courtId)?.number}${timeSlot ? ` alle ${timeSlot}` : ''}${durationHours > 1 ? ` per ${durationHours} ore` : ''}`,
    });
  };

  const handleAssignPerson = (courtId: string, person: PersonData, timeSlot?: string, durationHours?: number) => {
    const updatedPerson = {
      ...person,
      durationHours: durationHours || 1
    };
    handleDrop(courtId, updatedPerson, { x: 0.5, y: 0.5 }, timeSlot);
  };

  const handleAssignActivity = (courtId: string, activity: ActivityData, timeSlot?: string, durationHours?: number) => {
    const updatedActivity = {
      ...activity,
      durationHours: durationHours || 1
    };
    handleActivityDrop(courtId, updatedActivity, timeSlot);
  };

  const handleRemovePerson = (personId: string, timeSlot?: string) => {
    const personToRemove = courts.flatMap(c => c.occupants).find(p => 
      p.id === personId && p.timeSlot === timeSlot
    );
    
    if (personToRemove) {
      const { courtId, position, timeSlot, date, ...personWithoutCourtInfo } = personToRemove;
      
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

  const handleAddPerson = (personData: {name: string, type: string, sportType?: string}) => {
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
      sportType: personData.sportType || sportFilter || undefined
    };

    setPeople(prevPeople => [...prevPeople, personToAdd]);
    
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
    
    for (let i = 0; i < 7; i++) {
      const targetDay = addDays(nextWeekStart, i);
      const targetDayString = targetDay.toISOString().split('T')[0];
      
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

  const handleAddCourt = (courtData: { name: string, type: string, number: number }) => {
    const newCourtId = `court-${Date.now()}`;
    const newCourt: CourtProps = {
      id: newCourtId,
      name: courtData.name,
      type: courtData.type,
      number: courtData.number,
      occupants: [],
      activities: []
    };
    
    setCourts([...courts, newCourt]);
    
    toast({
      title: "Campo Aggiunto",
      description: `${courtData.name} #${courtData.number} è stato aggiunto`,
    });
  };
  
  const handleRemoveCourt = (courtId: string) => {
    const courtToRemove = courts.find(c => c.id === courtId);
    if (!courtToRemove) return;
    
    if (courtToRemove.occupants.length > 0 || courtToRemove.activities.length > 0) {
      toast({
        title: "Impossibile Rimuovere",
        description: "Questo campo ha persone o attività assegnate. Rimuovile prima.",
        variant: "destructive",
      });
      return;
    }
    
    setCourts(courts.filter(court => court.id !== courtId));
    
    toast({
      title: "Campo Rimosso",
      description: `${courtToRemove.name} #${courtToRemove.number} è stato rimosso`,
    });
  };
  
  const handleRenameCourt = (courtId: string, name: string) => {
    setCourts(
      courts.map(court => 
        court.id === courtId 
          ? { ...court, name } 
          : court
      )
    );
  };
  
  const handleChangeCourtType = (courtId: string, type: string) => {
    setCourts(
      courts.map(court => 
        court.id === courtId 
          ? { ...court, type } 
          : court
      )
    );
  };

  const handleChangeCourtNumber = (courtId: string, number: number) => {
    if (isNaN(number) || number < 1) return;
    
    setCourts(
      courts.map(court => 
        court.id === courtId 
          ? { ...court, number } 
          : court
      )
    );
    
    toast({
      title: "Numero Campo Aggiornato",
      description: `Il campo è stato aggiornato al numero ${number}`,
    });
  };

  const handleAddProgram = (program: Program) => {
    setPrograms([...programs, program]);
    
    toast({
      title: "Programma Aggiunto",
      description: `${program.name} è stato aggiunto ai programmi disponibili`,
    });
  };

  const handleRemoveProgram = (programId: string) => {
    const isProgramInUse = playersList.some(p => p.programId === programId) || 
                           coachesList.some(c => c.programId === programId);
    
    if (isProgramInUse) {
      toast({
        title: "Impossibile Rimuovere",
        description: "Questo programma è assegnato a persone. Rimuovi prima le assegnazioni.",
        variant: "destructive",
      });
      return;
    }
    
    setPrograms(programs.filter(p => p.id !== programId));
    
    toast({
      title: "Programma Rimosso",
      description: `Il programma è stato rimosso`,
    });
  };

  const handleAssignProgram = (personId: string, programId: string) => {
    const program = programs.find(p => p.id === programId);
    
    const updatePerson = (person: PersonData): PersonData => {
      if (person.id === personId) {
        return {
          ...person,
          programId: programId || undefined,
          programColor: program?.color
        };
      }
      return person;
    };
    
    setPlayersList(prev => prev.map(updatePerson));
    setCoachesList(prev => prev.map(updatePerson));
    
    setPeople(prev => prev.map(updatePerson));
    
    setCourts(prev => prev.map(court => ({
      ...court,
      occupants: court.occupants.map(updatePerson)
    })));
    
    toast({
      title: programId ? "Programma Assegnato" : "Programma Rimosso",
      description: programId 
        ? `La persona è stata assegnata al programma ${program?.name}`
        : `La persona è stata rimossa dal programma`,
    });
  };

  const [showFloatingPanel, setShowFloatingPanel] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  useEffect(() => {
    const checkSidebarState = () => {
      const sidebar = document.querySelector('aside');
      if (sidebar) {
        setIsSidebarCollapsed(sidebar.classList.contains('w-16'));
      }
    };
    
    checkSidebarState();
    
    const observer = new MutationObserver(checkSidebarState);
    const sidebar = document.querySelector('aside');
    if (sidebar) {
      observer.observe(sidebar, { attributes: true, attributeFilter: ['class'] });
    }
    
    return () => {
      observer.disconnect();
    };
  }, []);

  const handleChangePersonTimeSlot = (personId: string, timeSlot: string) => {
    const person = courts.flatMap(c => c.occupants).find(p => p.id === personId);
    if (person) {
      handleRemovePerson(personId, person.timeSlot);
      handleDrop(person.courtId || "", {...person, timeSlot}, person.position, timeSlot);
    }
  };

  const handleChangePersonCourt = (personId: string, courtId: string) => {
    const person = courts.flatMap(c => c.occupants).find(p => p.id === personId);
    if (person && courtId !== person.courtId) {
      handleRemovePerson(personId, person.timeSlot);
      handleDrop(courtId, {...person}, {x: 0.5, y: 0.5}, person.timeSlot);
    }
  };

  const checkUnassignedPeople = (scheduleType: "day" | "week" | "month") => {
    const relevantPeople = sportFilter 
      ? [...playersList, ...coachesList].filter(p => !p.sportType || p.sportType === sportFilter)
      : [...playersList, ...coachesList];
      
    const unassigned: PersonData[] = [];
    
    // Get all assigned people for the current schedule scope
    const getAssignedForDate = (date: Date) => {
      const dateStr = date.toISOString().split('T')[0];
      const schedule = dateSchedules.find(s => s.date === dateStr);
      return schedule?.courts.flatMap(c => c.occupants) || [];
    };
    
    relevantPeople.forEach(person => {
      let isAssigned = false;
      
      if (scheduleType === "day") {
        const assigned = getAssignedForDate(selectedDate);
        isAssigned = assigned.some(p => p.id === person.id);
      } else if (scheduleType === "week") {
        for (let i = 0; i < 7; i++) {
          const date = addDays(selectedDate, i);
          const assigned = getAssignedForDate(date);
          if (assigned.some(p => p.id === person.id)) {
            isAssigned = true;
            break;
          }
        }
      } else {
        for (let i = 0; i < 30; i++) {
          const date = addDays(selectedDate, i);
          const assigned = getAssignedForDate(date);
          if (assigned.some(p => p.id === person.id)) {
            isAssigned = true;
            break;
          }
        }
      }
      
      if (!isAssigned) {
        unassigned.push(person);
      }
    });
    
    return unassigned;
  };

  const CourtLayoutView = () => {
    const dateString = selectedDate.toISOString().split('T')[0];
    
    return (
      <div className="grid gap-6">
        {filteredCourts.map((court) => {
          const courtOccupants = court.occupants.filter(p => p.date === dateString);
          const courtActivities = court.activities.filter(a => a.date === dateString);
          
          return (
            <div key={court.id} className="bg-white rounded-xl shadow p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">
                  {court.name} #{court.number}
                </h3>
                <span 
                  className={cn(
                    "w-3 h-3 rounded-full",
                    court.type.includes("clay") ? "bg-ath-red-clay" : 
                    court.type.includes("hard") ? "bg-ath-black" : 
                    court.type.includes("padel") ? "bg-green-500" :
                    court.type.includes("pickle") ? "bg-blue-500" : "bg-purple-500"
                  )}
                ></span>
              </div>
              
              {/* Scheduled People */}
              {courtOccupants.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">Persone</h4>
                  <div className="grid gap-2">
                    {courtOccupants.map((person) => (
                      <div 
                        key={`${person.id}-${person.timeSlot}`} 
                        className="flex items-center justify-between p-2 bg-gray-50 rounded"
                      >
                        <div className="flex items-center">
                          <div 
                            className="w-6 h-6 rounded-full mr-2 flex items-center justify-center text-white text-xs"
                            style={{ 
                              backgroundColor: person.programColor || (person.type === PERSON_TYPES.PLAYER 
                                ? "#8B5CF6" 
                                : "#1A1F2C"
                              ) 
                            }}
                          >
                            {person.name.substring(0, 2)}
                          </div>
                          <span className="text-sm">{person.name}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {person.timeSlot} {person.endTimeSlot && `- ${person.endTimeSlot}`}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Scheduled Activities */}
              {courtActivities.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Attività</h4>
                  <div className="grid gap-2">
                    {courtActivities.map((activity) => (
                      <div 
                        key={`${activity.id}-${activity.startTime}`} 
                        className="flex items-center justify-between p-2 bg-gray-50 rounded"
                      >
                        <span className="text-sm">{activity.name}</span>
                        <div className="text-xs text-gray-500">
                          {activity.startTime} {activity.endTimeSlot && `- ${activity.endTimeSlot}`}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {courtOccupants.length === 0 && courtActivities.length === 0 && (
                <div className="text-sm text-gray-500 italic">Nessuna assegnazione per questo campo</div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="mx-auto py-4 relative h-screen flex flex-col overflow-hidden">
        <div className="px-4 sticky top-0 z-50 bg-white pb-4">
          <h1 className="text-2xl font-bold mb-4">
            Court Vision
            {sportFilter && ` - ${sportFilter.charAt(0).toUpperCase() + sportFilter.slice(1)}`}
            {isLayoutView && " - Layout View"}
          </h1>
          
          <div className={`transition-all duration-300 ${showFloatingPanel ? 'opacity-100' : 'opacity-40 hover:opacity-100'}`}>
            <div className="bg-white rounded-xl shadow-md p-4 mb-6">
              <div className="flex justify-between items-center mb-4">
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
                  <SendScheduleDialog 
                    courts={filteredCourts}
                    selectedDate={selectedDate}
                    playersList={filteredPlayersList}
                    coachesList={filteredCoachesList}
                    onCheckUnassigned={checkUnassignedPeople}
                  />
                  {!isLayoutView && (
                    <button 
                      className="flex-1 bg-ath-black text-white py-2 px-3 rounded hover:bg-ath-black-light transition-colors text-sm"
                      onClick={() => navigate("/court-vision/layout")}
                    >
                      <span className="flex items-center justify-center">
                        <Layers className="h-4 w-4 mr-1" />
                        Campo View
                      </span>
                    </button>
                  )}
                  {isLayoutView && (
                    <button 
                      className="flex-1 bg-ath-black text-white py-2 px-3 rounded hover:bg-ath-black-light transition-colors text-sm"
                      onClick={() => navigate("/court-vision")}
                    >
                      <span className="flex items-center justify-center">
                        <Layers className="h-4 w-4 mr-1" />
                        Schedule View
                      </span>
                    </button>
                  )}
                  <button
                    className="ml-2 bg-gray-200 hover:bg-gray-300 p-2 rounded-md"
                    onClick={() => setShowFloatingPanel(!showFloatingPanel)}
                    title={showFloatingPanel ? "Minimize Panel" : "Expand Panel"}
                  >
                    {showFloatingPanel ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                  </button>
                </div>
              </div>
              
              {showFloatingPanel && !isLayoutView && (
                <>
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
                      <div className="flex items-center gap-1">
                        <span className="w-4 h-4 bg-blue-500 rounded-full"></span>
                        <span className="text-sm">Pickleball</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="w-4 h-4 bg-purple-500 rounded-full"></span>
                        <span className="text-sm">Touch Tennis</span>
                      </div>
                    </div>
                  </div>
                  
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
                        <Calendar className="h-4 w-4 mr-1" />
                        Templates
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Main content area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Courts grid */}
          <div className="flex-1 overflow-auto px-4">
            {isLayoutView ? (
              <CourtLayoutView />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredCourts.map((court) => (
                  <Court 
                    key={court.id} 
                    court={court} 
                    timeSlots={timeSlots}
                    onDrop={handleDrop}
                    onActivityDrop={handleActivityDrop}
                    onRemovePerson={handleRemovePerson}
                    onRemoveActivity={handleRemoveActivity}
                    onAssignPerson={handleAssignPerson}
                    onAssignActivity={handleAssignActivity}
                    people={filteredPeople}
                    activities={filteredActivities}
                    programs={programs}
                  />
                ))}
              </div>
            )}
          </div>
          
          {/* Side panels - always visible */}
          <div className="w-80 bg-gray-50 p-4 flex flex-col gap-4 overflow-auto border-l border-gray-200">
            <AssignmentsDashboard 
              courts={filteredCourts}
              people={filteredPeople}
              programs={programs}
              onChangeTimeSlot={handleChangePersonTimeSlot}
              onChangeCourt={handleChangePersonCourt}
              onRemovePerson={handleRemovePerson}
            />
            
            <AvailablePeople
              people={filteredPeople}
              programs={programs}
              onAddPerson={handleAddPerson}
              onRemovePerson={handleRemovePerson}
            />
            
            <AvailableActivities 
              activities={filteredActivities}
              onAddActivity={handleAddActivity}
              onRemoveActivity={handleRemoveActivity}
            />
            
            <TimeSlotSelector 
              timeSlots={timeSlots}
              onAddTimeSlot={handleAddTimeSlot}
              onRemoveTimeSlot={handleRemoveTimeSlot}
            />
            
            <ScheduleTemplates 
              templates={templates}
              onSaveTemplate={saveAsTemplate}
              onApplyTemplate={applyTemplate}
            />
          </div>
        </div>
      </div>
    </DndProvider>
  );
}
