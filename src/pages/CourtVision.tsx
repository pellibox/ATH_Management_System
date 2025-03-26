import React, { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useToast } from "@/hooks/use-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { format, addDays, startOfWeek, addWeeks } from "date-fns";
import { 
  Calendar as CalendarIcon, 
  Layers, 
  LayoutGrid
} from "lucide-react";

// Import court vision components
import { Person } from "@/components/court-vision/Person";
import CourtVisionHeader from "@/components/court-vision/CourtVisionHeader";
import CourtGrid from "@/components/court-vision/CourtGrid";
import CourtTypeLegend from "@/components/court-vision/CourtTypeLegend";
import { AssignmentsDashboard } from "@/components/court-vision/AssignmentsDashboard";
import { COURT_TYPES, PERSON_TYPES, ACTIVITY_TYPES, DEFAULT_PROGRAMS } from "@/components/court-vision/constants";
import { PersonData, ActivityData, CourtProps, ScheduleTemplate, DateSchedule, Program } from "@/components/court-vision/types";

// Tabs
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CourtVision() {
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const currentSport = params.get('sport') || '';
  const isLayoutView = location.pathname.includes('/layout');
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [templates, setTemplates] = useState<ScheduleTemplate[]>([]);
  const [dateSchedules, setDateSchedules] = useState<DateSchedule[]>([]);
  
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
    { id: "pickleball1", type: COURT_TYPES.PICKLEBALL, name: "Pickleball", number: 1, occupants: [], activities: [] },
    { id: "touchtennis1", type: COURT_TYPES.TOUCH_TENNIS, name: "Touch Tennis", number: 1, occupants: [], activities: [] },
  ];
  
  const [courts, setCourts] = useState<CourtProps[]>(defaultCourts);
  const [filteredCourts, setFilteredCourts] = useState<CourtProps[]>(defaultCourts);

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
    { id: "player1", name: "Alex Smith", type: PERSON_TYPES.PLAYER, sportTypes: ["tennis"] },
    { id: "player2", name: "Emma Johnson", type: PERSON_TYPES.PLAYER, sportTypes: ["tennis"] },
    { id: "player3", name: "Michael Brown", type: PERSON_TYPES.PLAYER, sportTypes: ["tennis"] },
    { id: "player4", name: "Sophia Davis", type: PERSON_TYPES.PLAYER, sportTypes: ["padel"] },
    { id: "player5", name: "James Wilson", type: PERSON_TYPES.PLAYER, sportTypes: ["pickleball"] },
  ]);
  
  const [coachesList, setCoachesList] = useState<PersonData[]>([
    { id: "coach1", name: "Coach Anderson", type: PERSON_TYPES.COACH, sportTypes: ["tennis"] },
    { id: "coach2", name: "Coach Martinez", type: PERSON_TYPES.COACH, sportTypes: ["padel"] },
    { id: "coach3", name: "Coach Thompson", type: PERSON_TYPES.COACH, sportTypes: ["tennis"] },
  ]);

  const [programs, setPrograms] = useState<Program[]>(DEFAULT_PROGRAMS);
  
  const [filteredPlayers, setFilteredPlayers] = useState<PersonData[]>(playersList);
  const [filteredCoaches, setFilteredCoaches] = useState<PersonData[]>(coachesList);

  useEffect(() => {
    if (currentSport) {
      let filteredCourtType = '';
      
      switch (currentSport) {
        case 'tennis':
          filteredCourtType = 'Tennis';
          break;
        case 'padel':
          filteredCourtType = COURT_TYPES.PADEL;
          break;
        case 'pickleball':
          filteredCourtType = COURT_TYPES.PICKLEBALL;
          break;
        case 'touchtennis':
          filteredCourtType = COURT_TYPES.TOUCH_TENNIS;
          break;
        default:
          break;
      }
      
      const filtered = courts.filter(court => {
        if (currentSport === 'tennis') {
          return court.type === COURT_TYPES.TENNIS_CLAY || court.type === COURT_TYPES.TENNIS_HARD;
        }
        return court.type === filteredCourtType;
      });
      
      setFilteredCourts(filtered);
      
      setFilteredPlayers(playersList.filter(player => 
        !player.sportTypes || player.sportTypes.includes(currentSport)
      ));
      
      setFilteredCoaches(coachesList.filter(coach => 
        !coach.sportTypes || coach.sportTypes.includes(currentSport)
      ));
    } else {
      setFilteredCourts(courts);
      setFilteredPlayers(playersList);
      setFilteredCoaches(coachesList);
    }
  }, [currentSport, courts, playersList, coachesList]);

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
    const updatedCourts = courts.map(court => {
      if (court.id === courtId) {
        return {
          ...court,
          activities: [...court.activities, { ...activity, timeSlot }],
        };
      }
      return court;
    });
    
    setCourts(updatedCourts);
    
    toast({
      title: "Attività Assegnata",
      description: `${activity.name} è stata assegnata al campo ${courts.find(c => c.id === courtId)?.name} #${courts.find(c => c.id === courtId)?.number}${timeSlot ? ` alle ${timeSlot}` : ''}`,
    });
  };

  const handleRemovePerson = (personId: string, timeSlot?: string) => {
    const updatedCourts = courts.map(court => ({
      ...court,
      occupants: court.occupants.filter(person => person.id !== personId || person.timeSlot !== timeSlot)
    }));
    
    setCourts(updatedCourts);
    
    toast({
      title: "Persona Rimossa",
      description: "La persona è stata rimossa dal campo",
    });
  };

  const handleRemoveActivity = (activityId: string, timeSlot?: string) => {
    const updatedCourts = courts.map(court => ({
      ...court,
      activities: court.activities.filter(activity => activity.id !== activityId || activity.timeSlot !== timeSlot)
    }));
    
    setCourts(updatedCourts);
    
    toast({
      title: "Attività Rimossa",
      description: "L'attività è stata rimossa dal campo",
    });
  };

  const handleAddPerson = (personData: {name: string, type: string}) => {
    const newPerson: PersonData = {
      id: `new-person-${Date.now()}`,
      name: personData.name,
      type: personData.type as "player" | "coach",
    };
    
    setPeople([...people, newPerson]);
    toast({
      title: "Persona Aggiunta",
      description: `${newPerson.name} è stata aggiunta alla lista`,
    });
  };

  const handleAddActivity = (activityData: {name: string, type: string, duration: string}) => {
    const newActivity: ActivityData = {
      id: `new-activity-${Date.now()}`,
      name: activityData.name,
      type: activityData.type,
      duration: activityData.duration,
    };
    
    setActivities([...activities, newActivity]);
    toast({
      title: "Attività Aggiunta",
      description: `${newActivity.name} è stata aggiunta alla lista`,
    });
  };

  const saveAsTemplate = (name: string) => {
    const newTemplate: ScheduleTemplate = {
      id: `template-${Date.now()}`,
      name: name,
      date: new Date(),
      courts: courts.map(court => ({
        ...court,
        occupants: court.occupants.map(person => ({ ...person }))
      })),
    };
    
    setTemplates([...templates, newTemplate]);
    toast({
      title: "Template Salvato",
      description: `Il template "${name}" è stato salvato`,
    });
  };

  const applyTemplate = (template: ScheduleTemplate) => {
    setCourts(template.courts.map(court => ({
      ...court,
      occupants: court.occupants.map(person => ({ ...person }))
    })));
    toast({
      title: "Template Applicato",
      description: `Il template "${template.name}" è stato applicato`,
    });
  };

  const copyToNextDay = () => {
    const nextDay = addDays(selectedDate, 1);
    setSelectedDate(nextDay);
    
    const dateString = nextDay.toISOString().split('T')[0];
    const existingScheduleIndex = dateSchedules.findIndex(schedule => schedule.date === dateString);
    
    if (existingScheduleIndex >= 0) {
      const updatedSchedules = [...dateSchedules];
      updatedSchedules[existingScheduleIndex] = { date: dateString, courts };
      setDateSchedules(updatedSchedules);
    } else {
      setDateSchedules([...dateSchedules, { date: dateString, courts }]);
    }
    
    toast({
      title: "Programmazione Copiata",
      description: `La programmazione è stata copiata al giorno successivo`,
    });
  };

  const copyToWeek = () => {
    const startOfNextWeek = addWeeks(startOfWeek(selectedDate), 1);
    setSelectedDate(startOfNextWeek);
    
    const dateString = startOfNextWeek.toISOString().split('T')[0];
    const existingScheduleIndex = dateSchedules.findIndex(schedule => schedule.date === dateString);
    
    if (existingScheduleIndex >= 0) {
      const updatedSchedules = [...dateSchedules];
      updatedSchedules[existingScheduleIndex] = { date: dateString, courts };
      setDateSchedules(updatedSchedules);
    } else {
      setDateSchedules([...dateSchedules, { date: dateString, courts }]);
    }
    
    toast({
      title: "Programmazione Copiata",
      description: `La programmazione è stata copiata alla settimana successiva`,
    });
  };

  const handleAddToDragArea = (person: PersonData) => {
    setPeople([...people, person]);
    toast({
      title: "Persona Aggiunta",
      description: `${person.name} è stata aggiunta all'area di trascinamento`,
    });
  };

  const handleRenameCourt = (courtId: string, name: string) => {
    const updatedCourts = courts.map(court => {
      if (court.id === courtId) {
        return { ...court, name };
      }
      return court;
    });
    setCourts(updatedCourts);
    toast({
      title: "Campo Rinomimato",
      description: `Il campo è stato rinominato a ${name}`,
    });
  };
  
  const handleChangeCourtType = (courtId: string, type: string) => {
    const updatedCourts = courts.map(court => {
      if (court.id === courtId) {
        return { ...court, type };
      }
      return court;
    });
    setCourts(updatedCourts);
    toast({
      title: "Tipo di Campo Modificato",
      description: `Il tipo di campo è stato modificato a ${type}`,
    });
  };

  const handleChangeCourtNumber = (courtId: string, number: number) => {
    const updatedCourts = courts.map(court => {
      if (court.id === courtId) {
        return { ...court, number };
      }
      return court;
    });
    setCourts(updatedCourts);
    toast({
      title: "Numero di Campo Modificato",
      description: `Il numero di campo è stato modificato a ${number}`,
    });
  };

  const checkUnassignedPeople = (scheduleType: "day" | "week" | "month") => {
    const unassignedPeople = people.filter(person => {
      return !courts.some(court => court.occupants.some(occupant => occupant.id === person.id));
    });
    
    if (unassignedPeople.length > 0) {
      toast({
        title: "Persone Non Assegnate",
        description: `Ci sono ${unassignedPeople.length} persone non assegnate`,
      });
    } else {
      toast({
        title: "Nessuna Persona Non Assegnata",
        description: "Tutte le persone sono state assegnate",
      });
    }
    
    return unassignedPeople;
  };
  
  const toggleViewMode = () => {
    if (isLayoutView) {
      navigate('/court-vision' + (currentSport ? `?sport=${currentSport}` : ''));
    } else {
      navigate('/court-vision/layout' + (currentSport ? `?sport=${currentSport}` : ''));
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="mx-auto py-4 relative flex flex-col">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Visione Campo</h1>
          
          <div className="flex gap-2">
            <button
              className={`inline-flex items-center gap-1.5 py-1.5 px-3 rounded text-sm font-medium transition-colors ${
                !isLayoutView ? "bg-ath-blue text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={toggleViewMode}
              title="Vista Programmazione"
            >
              <Layers className="h-4 w-4" />
              <span className="hidden sm:inline">Programmazione</span>
            </button>
            
            <button
              className={`inline-flex items-center gap-1.5 py-1.5 px-3 rounded text-sm font-medium transition-colors ${
                isLayoutView ? "bg-ath-blue text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={toggleViewMode}
              title="Vista Layout"
            >
              <LayoutGrid className="h-4 w-4" />
              <span className="hidden sm:inline">Layout</span>
            </button>
          </div>
        </div>
        
        <div className="sticky top-0 z-30 bg-white pb-4">
          <CourtVisionHeader
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            courts={filteredCourts}
            people={people}
            activities={activities}
            templates={templates}
            playersList={filteredPlayers}
            coachesList={filteredCoaches}
            timeSlots={timeSlots}
            onApplyTemplate={applyTemplate}
            onSaveTemplate={saveAsTemplate}
            onCopyToNextDay={copyToNextDay}
            onCopyToWeek={copyToWeek}
            onCheckUnassigned={checkUnassignedPeople}
            onDrop={handleDrop}
            onActivityDrop={handleActivityDrop}
            onAddPerson={handleAddPerson}
            onAddActivity={handleAddActivity}
            onAddToDragArea={handleAddToDragArea}
          />
          
          <CourtTypeLegend />
        </div>
        
        <div className="flex-1 pb-20">
          {isLayoutView ? (
            <AssignmentsDashboard
              courts={filteredCourts}
              selectedDate={selectedDate}
            />
          ) : (
            <CourtGrid
              courts={filteredCourts}
              timeSlots={timeSlots}
              onDrop={handleDrop}
              onActivityDrop={handleActivityDrop}
              onRemovePerson={handleRemovePerson}
              onRemoveActivity={handleRemoveActivity}
              onRenameCourt={handleRenameCourt}
              onChangeCourtType={handleChangeCourtType}
              onChangeCourtNumber={handleChangeCourtNumber}
            />
          )}
        </div>
      </div>
    </DndProvider>
  );
}

