
import { useState } from "react";
import { format, addDays, startOfWeek, addWeeks } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { PersonData, ActivityData, CourtProps, ScheduleTemplate, DateSchedule, Program } from "../types";

export interface ActionsProps {
  courts: CourtProps[];
  setCourts: React.Dispatch<React.SetStateAction<CourtProps[]>>;
  people: PersonData[];
  setPeople: React.Dispatch<React.SetStateAction<PersonData[]>>;
  activities: ActivityData[];
  setActivities: React.Dispatch<React.SetStateAction<ActivityData[]>>;
  playersList: PersonData[];
  setPlayersList: React.Dispatch<React.SetStateAction<PersonData[]>>;
  coachesList: PersonData[];
  setCoachesList: React.Dispatch<React.SetStateAction<PersonData[]>>;
  programs: Program[];
  setPrograms: React.Dispatch<React.SetStateAction<Program[]>>;
  templates: ScheduleTemplate[];
  setTemplates: React.Dispatch<React.SetStateAction<ScheduleTemplate[]>>;
  dateSchedules: DateSchedule[];
  setDateSchedules: React.Dispatch<React.SetStateAction<DateSchedule[]>>;
  selectedDate: Date;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date>>;
  timeSlots: string[];
}

export const useCourtVisionActions = ({
  courts,
  setCourts,
  people,
  setPeople,
  activities,
  setActivities,
  playersList,
  setPlayersList,
  coachesList,
  setCoachesList,
  programs,
  setPrograms,
  templates,
  setTemplates,
  dateSchedules,
  setDateSchedules,
  selectedDate,
  setSelectedDate,
  timeSlots
}: ActionsProps) => {
  const { toast } = useToast();

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

  const handleAddPerson = (personData: {name: string, type: string, email?: string, phone?: string, sportTypes?: string[]}) => {
    const newPerson: PersonData = {
      id: `new-person-${Date.now()}`,
      name: personData.name,
      type: personData.type as "player" | "coach",
      email: personData.email,
      phone: personData.phone,
      sportTypes: personData.sportTypes
    };
    
    setPeople([...people, newPerson]);
    
    // Also add to the appropriate list
    if (personData.type === "player") {
      setPlayersList([...playersList, newPerson]);
    } else if (personData.type === "coach") {
      setCoachesList([...coachesList, newPerson]);
    }
    
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

  const handleAssignProgram = (personId: string, programId: string) => {
    // Update in playersList
    const updatedPlayersList = playersList.map(player => {
      if (player.id === personId) {
        const program = programs.find(p => p.id === programId);
        return { 
          ...player, 
          programId, 
          programColor: program?.color 
        };
      }
      return player;
    });
    
    // Update in coachesList
    const updatedCoachesList = coachesList.map(coach => {
      if (coach.id === personId) {
        const program = programs.find(p => p.id === programId);
        return { 
          ...coach, 
          programId, 
          programColor: program?.color 
        };
      }
      return coach;
    });
    
    // Also update if person is assigned to a court
    const updatedCourts = courts.map(court => ({
      ...court,
      occupants: court.occupants.map(occupant => {
        if (occupant.id === personId) {
          const program = programs.find(p => p.id === programId);
          return { 
            ...occupant, 
            programId, 
            programColor: program?.color 
          };
        }
        return occupant;
      })
    }));
    
    setPlayersList(updatedPlayersList);
    setCoachesList(updatedCoachesList);
    setCourts(updatedCourts);
    
    const program = programs.find(p => p.id === programId);
    const person = [...playersList, ...coachesList].find(p => p.id === personId);
    
    toast({
      title: "Programma Assegnato",
      description: `${program?.name} è stato assegnato a ${person?.name}`,
    });
  };

  return {
    handleDrop,
    handleActivityDrop,
    handleRemovePerson,
    handleRemoveActivity,
    handleAddPerson,
    handleAddActivity,
    saveAsTemplate,
    applyTemplate,
    copyToNextDay,
    copyToWeek,
    checkUnassignedPeople,
    handleAddToDragArea,
    handleRenameCourt,
    handleChangeCourtType,
    handleChangeCourtNumber,
    handleAssignProgram
  };
};
