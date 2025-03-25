
import { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useToast } from "@/hooks/use-toast";
import { format, addDays, startOfWeek, addWeeks } from "date-fns";

// Import court vision components
import { Court } from "@/components/court-vision/Court";
import { AvailablePeople } from "@/components/court-vision/AvailablePeople";
import { AvailableActivities } from "@/components/court-vision/AvailableActivities";
import { ScheduleTemplates } from "@/components/court-vision/ScheduleTemplates";
import { DateSelector } from "@/components/court-vision/DateSelector";
import { PeopleManagement } from "@/components/court-vision/PeopleManagement";
import { CourtLegend } from "@/components/court-vision/CourtLegend";
import { COURT_TYPES, PERSON_TYPES, ACTIVITY_TYPES } from "@/components/court-vision/constants";
import { PersonData, ActivityData, CourtProps, ScheduleTemplate } from "@/components/court-vision/types";

export default function CourtVision() {
  const { toast } = useToast();
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
    const draggablePerson = people.find((p) => p.id === person.id) || 
                            courts.flatMap(c => c.occupants).find(p => p.id === person.id);
    
    if (!draggablePerson) return;

    const updatedCourts = courts.map((court) => {
      if (court.id !== courtId && court.occupants.some((p) => p.id === person.id)) {
        return {
          ...court,
          occupants: court.occupants.filter((p) => p.id !== person.id),
        };
      }
      return court;
    });

    const targetCourtIndex = updatedCourts.findIndex((court) => court.id === courtId);
    
    if (targetCourtIndex !== -1) {
      if (!updatedCourts[targetCourtIndex].occupants.some(p => p.id === person.id)) {
        updatedCourts[targetCourtIndex] = {
          ...updatedCourts[targetCourtIndex],
          occupants: [
            ...updatedCourts[targetCourtIndex].occupants,
            { ...draggablePerson, courtId, position },
          ],
        };
      } else {
        updatedCourts[targetCourtIndex] = {
          ...updatedCourts[targetCourtIndex],
          occupants: updatedCourts[targetCourtIndex].occupants.map(p => 
            p.id === person.id ? { ...p, position } : p
          ),
        };
      }
    }

    setPeople(people.filter((p) => p.id !== person.id));
    setCourts(updatedCourts);

    toast({
      title: "Person Assigned",
      description: `${draggablePerson.name} has been assigned to ${courts.find(c => c.id === courtId)?.name} #${courts.find(c => c.id === courtId)?.number}`,
    });
  };

  const handleActivityDrop = (courtId: string, activity: ActivityData) => {
    const draggableActivity = activities.find((a) => a.id === activity.id) || 
                              courts.flatMap(c => c.activities).find(a => a.id === activity.id);
    
    if (!draggableActivity) return;

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
            { ...draggableActivity, courtId },
          ],
        };
      }
    }

    setActivities(activities.filter((a) => a.id !== activity.id));
    setCourts(updatedCourts);

    toast({
      title: "Activity Assigned",
      description: `${draggableActivity.name} has been assigned to ${courts.find(c => c.id === courtId)?.name} #${courts.find(c => c.id === courtId)?.number}`,
    });
  };

  const handleRemovePerson = (personId: string) => {
    const personToRemove = courts.flatMap(c => c.occupants).find(p => p.id === personId);
    
    if (personToRemove) {
      setPeople([...people, { ...personToRemove, courtId: undefined, position: undefined }]);
      
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
        title: "Activity Removed",
        description: `${activityToRemove.name} has been removed from the court`,
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
      title: "Person Added",
      description: `${personToAdd.name} has been added to the available list`,
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
      title: "Activity Added",
      description: `${activityToAdd.name} has been added to the available list`,
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
      title: "Template Saved",
      description: `Template "${name}" has been saved and can be applied to other days`,
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

  const handleAddPersonToSystem = (newPerson: PersonData) => {
    if (!newPerson.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name",
        variant: "destructive",
      });
      return;
    }

    if (newPerson.type === PERSON_TYPES.PLAYER) {
      setPlayersList([...playersList, newPerson]);
    } else {
      setCoachesList([...coachesList, newPerson]);
    }

    setPeople([...people, newPerson]);

    toast({
      title: `${newPerson.type === PERSON_TYPES.PLAYER ? 'Player' : 'Coach'} Added`,
      description: `${newPerson.name} has been added to the system`,
    });
  };

  const handleRemovePersonFromSystem = (personToRemove: PersonData) => {
    if (personToRemove.type === PERSON_TYPES.PLAYER) {
      setPlayersList(playersList.filter(p => p.id !== personToRemove.id));
    } else {
      setCoachesList(coachesList.filter(c => c.id !== personToRemove.id));
    }

    setPeople(people.filter(p => p.id !== personToRemove.id));

    setCourts(courts.map(court => ({
      ...court,
      occupants: court.occupants.filter(p => p.id !== personToRemove.id)
    })));

    toast({
      title: `${personToRemove.type === PERSON_TYPES.PLAYER ? 'Player' : 'Coach'} Removed`,
      description: `${personToRemove.name} has been removed from the system`,
    });
  };

  const addPersonToDragArea = (personToAdd: PersonData) => {
    if (!people.some(p => p.id === personToAdd.id)) {
      setPeople([...people, personToAdd]);
      
      toast({
        title: "Added to Available",
        description: `${personToAdd.name} is now available for court assignment`,
      });
    } else {
      toast({
        title: "Already Available",
        description: `${personToAdd.name} is already in the available list`,
      });
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="max-w-7xl mx-auto animate-fade-in p-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Court Vision</h1>
          <p className="text-gray-600 mt-1">Drag and drop players, coaches, and activities to assign them to courts</p>
        </div>

        <DateSelector 
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          onCopyToNextDay={copyToNextDay}
          onCopyToWeek={copyToWeek}
        />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-3 lg:col-span-2 space-y-4">
            <PeopleManagement 
              playersList={playersList}
              coachesList={coachesList}
              onAddPerson={handleAddPersonToSystem}
              onRemovePerson={handleRemovePersonFromSystem}
              onAddToDragArea={addPersonToDragArea}
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
            
            <ScheduleTemplates 
              templates={templates}
              onSaveTemplate={saveAsTemplate}
              onApplyTemplate={applyTemplate}
            />
          </div>

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
            
            <CourtLegend />
          </div>
        </div>
      </div>
    </DndProvider>
  );
}
