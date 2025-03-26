
import { format, addDays, startOfWeek, addWeeks } from "date-fns";
import { CourtProps, ScheduleTemplate, DateSchedule } from "../../types";
import { useToast } from "@/hooks/use-toast";

export const useScheduleActions = (
  courts: CourtProps[],
  templates: ScheduleTemplate[],
  setTemplates: React.Dispatch<React.SetStateAction<ScheduleTemplate[]>>,
  dateSchedules: DateSchedule[],
  setDateSchedules: React.Dispatch<React.SetStateAction<DateSchedule[]>>,
  selectedDate: Date,
  setSelectedDate: React.Dispatch<React.SetStateAction<Date>>
) => {
  const { toast } = useToast();

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
    return template.courts.map(court => ({
      ...court,
      occupants: court.occupants.map(person => ({ ...person }))
    }));
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

  return {
    saveAsTemplate,
    applyTemplate,
    copyToNextDay,
    copyToWeek
  };
};
