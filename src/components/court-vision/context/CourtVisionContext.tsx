
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { 
  PersonData, 
  ActivityData, 
  CourtProps, 
  ScheduleTemplate, 
  DateSchedule,
  Program 
} from "../types";
import { CourtVisionContextType } from "./CourtVisionTypes";
import { 
  DEFAULT_TIME_SLOTS,
  DEFAULT_COURTS,
  DEFAULT_PEOPLE,
  DEFAULT_ACTIVITIES,
  DEFAULT_PLAYERS,
  DEFAULT_COACHES,
  DEFAULT_PROGRAMS
} from "./CourtVisionDefaults";
import { useCourtVisionActions } from "./CourtVisionActions";
import { useCourtVisionFilters } from "./CourtVisionFilters";
import { ExtraHoursConfirmationDialog } from "../ExtraHoursConfirmationDialog";

export const CourtVisionContext = createContext<CourtVisionContextType | undefined>(undefined);

export const useCourtVision = () => {
  const context = useContext(CourtVisionContext);
  if (!context) {
    throw new Error("useCourtVision must be used within a CourtVisionProvider");
  }
  return context;
};

interface CourtVisionProviderProps {
  children: ReactNode;
}

export const CourtVisionProvider: React.FC<CourtVisionProviderProps> = ({ children }) => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const currentSport = params.get('sport') || '';
  const isLayoutView = location.pathname.includes('/layout');
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [templates, setTemplates] = useState<ScheduleTemplate[]>([]);
  const [dateSchedules, setDateSchedules] = useState<DateSchedule[]>([]);
  const [timeSlots, setTimeSlots] = useState<string[]>(DEFAULT_TIME_SLOTS);
  const [courts, setCourts] = useState<CourtProps[]>(DEFAULT_COURTS);
  const [filteredCourts, setFilteredCourts] = useState<CourtProps[]>(DEFAULT_COURTS);
  const [people, setPeople] = useState<PersonData[]>(DEFAULT_PEOPLE);
  const [activities, setActivities] = useState<ActivityData[]>(DEFAULT_ACTIVITIES);
  const [playersList, setPlayersList] = useState<PersonData[]>(DEFAULT_PLAYERS);
  const [coachesList, setCoachesList] = useState<PersonData[]>(DEFAULT_COACHES);
  const [programs, setPrograms] = useState<Program[]>(DEFAULT_PROGRAMS);
  const [filteredPlayers, setFilteredPlayers] = useState<PersonData[]>(DEFAULT_PLAYERS);
  const [filteredCoaches, setFilteredCoaches] = useState<PersonData[]>(DEFAULT_COACHES);

  // Use the filters hook
  useCourtVisionFilters({
    courts,
    currentSport,
    playersList,
    coachesList,
    setFilteredCourts,
    setFilteredPlayers,
    setFilteredCoaches
  });

  // Use the actions hook with additional dependencies
  const actions = useCourtVisionActions({
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
  });

  // Load courts for selected date
  useEffect(() => {
    const dateString = selectedDate.toISOString().split('T')[0];
    const existingSchedule = dateSchedules.find(schedule => schedule.date === dateString);
    
    console.log("Loading schedule for date:", dateString);
    console.log("Existing schedule found:", existingSchedule ? "Yes" : "No");
    
    if (existingSchedule) {
      console.log("Setting courts from schedule:", existingSchedule.courts);
      setCourts(existingSchedule.courts);
    } else {
      console.log("No schedule found, using default courts");
      setCourts(DEFAULT_COURTS);
    }
  }, [selectedDate, dateSchedules]);

  // Save courts for selected date
  useEffect(() => {
    const dateString = selectedDate.toISOString().split('T')[0];
    
    console.log("Saving schedule for date:", dateString);
    console.log("Current courts state:", courts);
    
    setDateSchedules(prevSchedules => {
      const existingIndex = prevSchedules.findIndex(schedule => schedule.date === dateString);
      
      if (existingIndex >= 0) {
        const updatedSchedules = [...prevSchedules];
        updatedSchedules[existingIndex] = { date: dateString, courts };
        return updatedSchedules;
      } else {
        return [...prevSchedules, { date: dateString, courts }];
      }
    });
  }, [courts, selectedDate]);

  const contextValue: CourtVisionContextType = {
    // State
    selectedDate,
    templates,
    dateSchedules,
    timeSlots,
    courts,
    filteredCourts,
    people,
    activities,
    playersList,
    coachesList,
    programs,
    filteredPlayers,
    filteredCoaches,
    currentSport,
    isLayoutView,

    // Actions
    setSelectedDate,
    ...actions
  };

  return (
    <CourtVisionContext.Provider value={contextValue}>
      {children}
      {actions.showExtraHoursDialog && (
        <ExtraHoursConfirmationDialog
          isOpen={actions.showExtraHoursDialog}
          onOpenChange={actions.setShowExtraHoursDialog}
          pendingAssignment={actions.pendingAssignment}
          currentHours={actions.getCurrentHours()}
          newHours={actions.getNewHours()}
          onConfirm={actions.handleConfirmExtraHours}
          onCancel={actions.handleCancelExtraHours}
        />
      )}
    </CourtVisionContext.Provider>
  );
};
