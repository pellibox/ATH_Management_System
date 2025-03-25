import { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useToast } from "@/hooks/use-toast";
import { format, addDays, startOfWeek, addWeeks } from "date-fns";
import { CalendarIcon } from "lucide-react";

// Import court vision components
import { Court } from "@/components/court-vision/Court";
import { AvailablePeople } from "@/components/court-vision/AvailablePeople";
import { AvailableActivities } from "@/components/court-vision/AvailableActivities";
import { ScheduleTemplates } from "@/components/court-vision/ScheduleTemplates";
import { DateSelector } from "@/components/court-vision/DateSelector";
import { PeopleManagement } from "@/components/court-vision/PeopleManagement";
import { CourtLegend } from "@/components/court-vision/CourtLegend";
import { CourtAssignmentDialog } from "@/components/court-vision/CourtAssignmentDialog";
import { COURT_TYPES, PERSON_TYPES, ACTIVITY_TYPES } from "@/components/court-vision/constants";
import { PersonData, ActivityData, CourtProps, ScheduleTemplate } from "@/components/court-vision/types";
import { useIsMobile } from "@/hooks/use-mobile";

export default function CourtVision() {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [templates, setTemplates] = useState<ScheduleTemplate[]>([]);
  const [courts, setCourts] = useState<CourtProps[]>([
    { id: "court1", type: COURT_TYPES.TENNIS_CLAY, name: "Center Court", number: 1, occupants: [], activities: [] },
    { id: "court2", type: COURT_TYPES.TENNIS_CLAY, name: "Tennis", number: 2, occupants: [], activities: [] },
    { id: "court3", type: COURT_TYPES.TENNIS_CLAY, name: "Tennis", number: 3, occupants: [], activities: [] },
    { id: "court5", type: COURT_TYPES.TENNIS_HARD, name: "Tennis", number: 5, occupants: [], activities: [] },
    { id: "court6", type: COURT_TYPES.TENNIS_HARD, name: "Tennis", number: 6, occupants: [], activities: [] },
    { id: "padel1", type: COURT_TYPES.PADEL, name: "Padel", number: 1, occupants: [], activities: [] },
    { id: "padel2", type: COURT_TYPES.PADEL, name: "Padel", number: 2, occupants: [], activities: [] },
  ]);

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

  const handleDrop = (courtId: string, person: PersonData, position?: { x: number, y: number }) => {
    const personWithCourtInfo = { 
      ...person, 
      courtId,
      position: position || { x: Math.random() * 0.8 + 0.1, y: Math.random() * 0.8 + 0.1 }
    };

    const updatedCourts = courts.map((court) => {
      if (court.id !== courtId && court.occupants.some((p) => p.id === person.id)) {
        return {
          ...court,
          occupants: court.occupants.filter((p) => p.id !== person.id),
        };
      }
      
      if (court.id === courtId) {
        const personExists = court.occupants.some(p => p.id === person.id);
        
        if (personExists) {
          return {
            ...court,
            occupants: court.occupants.map(p => 
              p.id === person.id ? { ...p, position: personWithCourtInfo.position } : p
            ),
          };
        } else {
          return {
            ...court,
            occupants: [...court.occupants, personWithCourtInfo],
          };
        }
      }
      
      return court;
    });

    const isFromAvailableList = people.some(p => p.id === person.id);
    
    if (isFromAvailableList) {
      setPeople(people.filter(p => p.id !== person.id));
    }
    
    setCourts(updatedCourts);

    toast({
      title: "Persona Assegnata",
      description: `${person.name} è stata assegnata al campo ${courts.find(c => c.id === courtId)?.name} #${courts.find(c => c.id === courtId)?.number}`,
    });
  };

  const handleActivityDrop = (courtId: string, activity: ActivityData) => {
    const draggableActivity = activities.find((a) => a.id === activity.id) || 
                              courts.flatMap(c => c.activities).find(a => a.id === activity.id);
    
    if (!draggableActivity) return;

    const activityCopy = { ...draggableActivity, courtId };

    const updatedCourts = courts.map((court) => {
      if (court.id !== courtId && court.activities.some((a) => a.id === activity.id)) {
        return {
          ...court,
          activities: court.activities.filter((a) => a.id !== activity.id),
        };
      }
      return court;
    });

    const targetCourtIndex = updatedCourts.findIndex((court) => court.id === courtId);
    
    if (targetCourtIndex !== -1) {
      if (!updatedCourts[targetCourtIndex].activities.some(a => a.id === activity.id)) {
        updatedCourts[targetCourtIndex] = {
          ...updatedCourts[targetCourtIndex],
          activities: [
            ...updatedCourts[targetCourtIndex].activities,
            activityCopy,
          ],
        };
      }
    }

    const wasOnCourt = courts.some(court => 
      court.activities.some(a => a.id === activity.id)
    );
    
    if (!wasOnCourt) {
      setActivities(activities.filter((a) => a.id !== activity.id));
    }
    
    setCourts(updatedCourts);

    toast({
      title: "Attività Assegnata",
      description: `${draggableActivity.name} è stata assegnata al campo ${courts.find(c => c.id === courtId)?.name} #${courts.find(c => c.id === courtId)?.number}`,
    });
  };

  const handleAssignPerson = (courtId: string, person: PersonData) => {
    handleDrop(courtId, person, { x: 0.5, y: 0.5 });
  };

  const handleAssignActivity = (courtId: string, activity: ActivityData) => {
    handleActivityDrop(courtId, activity);
  };

  const handleRemovePerson = (personId: string) => {
    const personToRemove = courts.flatMap(c => c.occupants).find(p => p.id === personId);
    
    if (personToRemove) {
      const { courtId, position, ...personWithoutCourtInfo } = personToRemove;
      
      setPeople([...people, personWithoutCourtInfo]);
      
      setCourts(
        courts.map((court) => ({
          ...court,
          occupants: court.occupants.filter((p) => p.id !== personId),
        }))
      );

      toast({
        title: "Persona Rimossa",
        description: `${personToRemove.name} è stata rimossa dal campo`,
      });
    }
  };

  const handleRemoveActivity = (activityId: string) => {
    const activityToRemove = courts.flatMap(c => c.activities).find(a => a.id === activityId);
    
    if (activityToRemove) {
      setActivities([...activities, { ...activityToRemove, courtId: undefined }]);
      
      setCourts(
        courts.map((court) => ({
          ...court,
          activities: court.activities.filter((a) => a.id !== activityId),
        }))
      );

      toast({
        title: "Attività Rimossa",
        description: `${activityToRemove.name} è stata rimossa dal campo`,
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

    setPeople([...people, personToAdd]);

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

    toast({
      title: "Template Applicato",
      description: `Template "${template.name}" è stato applicato al giorno ${format(selectedDate, "MMMM d, yyyy")}`,
    });
  };

  const copyToNextDay = () => {
    const nextDay = addDays(selectedDate, 1);
    setSelectedDate(nextDay);

    toast({
      title: "Piano Copiato",
      description: `Le assegnazioni del campo sono state copiate al giorno ${format(nextDay, "MMMM d, yyyy")}`,
    });
  };

  const copyToWeek = () => {
    const startOfCurrentWeek = startOfWeek(selectedDate);
    const nextWeekStart = addWeeks(startOfCurrentWeek, 1);
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
        setPeople([...people, person]);
        
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

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container mx-auto py-4">
        <h1 className="text-2xl font-bold mb-4">Court Vision</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="md:col-span-2">
            <DateSelector 
              selectedDate={selectedDate} 
              onDateChange={setSelectedDate} 
            />
          </div>
          <div>
            <CourtLegend />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {courts.map((court) => (
                <Court
                  key={court.id}
                  court={court}
                  onDrop={handleDrop}
                  onActivityDrop={handleActivityDrop}
                  onRemovePerson={handleRemovePerson}
                  onRemoveActivity={handleRemoveActivity}
                />
              ))}
            </div>
          </div>
          
          <div className="space-y-4">
            <CourtAssignmentDialog 
              courts={courts}
              availablePeople={people}
              availableActivities={activities}
              onAssignPerson={handleAssignPerson}
              onAssignActivity={handleAssignActivity}
              onRemovePerson={handleRemovePerson}
              onRemoveActivity={handleRemoveActivity}
            />
            
            <AvailablePeople 
              people={people} 
              onAddPerson={handleAddPerson}
              onRemovePerson={handleRemovePerson}
            />
            
            <AvailableActivities 
              activities={activities}
              onAddActivity={handleAddActivity}
              onRemoveActivity={handleRemoveActivity}
            />
            
            <PeopleManagement 
              playersList={playersList} 
              coachesList={coachesList} 
              onAddPerson={handleAddPerson}
              onRemovePerson={handleRemovePerson}
              onAddToDragArea={handleAddToDragArea}
            />
            
            <ScheduleTemplates 
              templates={templates} 
              onApplyTemplate={applyTemplate} 
              onSaveTemplate={saveAsTemplate}
            />
          </div>
        </div>
      </div>
    </DndProvider>
  );
}
