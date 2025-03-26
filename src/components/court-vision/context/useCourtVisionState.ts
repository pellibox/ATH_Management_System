
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { 
  PersonData, 
  CourtProps, 
  DateSchedule,
} from "../types";
import { CourtVisionState } from "./types";
import { 
  DEFAULT_TIME_SLOTS,
  DEFAULT_COURTS,
  DEFAULT_PEOPLE,
  DEFAULT_ACTIVITIES,
  DEFAULT_PLAYERS,
  DEFAULT_COACHES,
  DEFAULT_PROGRAMS
} from "./CourtVisionDefaults";

export function useCourtVisionState(): CourtVisionState {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const currentSport = params.get('sport') || '';
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [templates, setTemplates] = useState([]);
  const [dateSchedules, setDateSchedules] = useState<DateSchedule[]>([]);
  const [timeSlots, setTimeSlots] = useState<string[]>(DEFAULT_TIME_SLOTS);
  const [courts, setCourts] = useState<CourtProps[]>(DEFAULT_COURTS);
  const [filteredCourts, setFilteredCourts] = useState<CourtProps[]>(DEFAULT_COURTS);
  const [people, setPeople] = useState<PersonData[]>(DEFAULT_PEOPLE);
  const [activities, setActivities] = useState(DEFAULT_ACTIVITIES);
  const [playersList, setPlayersList] = useState<PersonData[]>(DEFAULT_PLAYERS);
  const [coachesList, setCoachesList] = useState<PersonData[]>(DEFAULT_COACHES);
  const [programs, setPrograms] = useState(DEFAULT_PROGRAMS);
  const [filteredPlayers, setFilteredPlayers] = useState<PersonData[]>(DEFAULT_PLAYERS);
  const [filteredCoaches, setFilteredCoaches] = useState<PersonData[]>(DEFAULT_COACHES);
  const [showExtraHoursDialog, setShowExtraHoursDialog] = useState(false);
  const [pendingAssignment, setPendingAssignment] = useState(null);

  // Load schedule on date change
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

  // Save schedule when courts change
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

  return {
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
    isLayoutView: false,
    showExtraHoursDialog,
    pendingAssignment
  };
}
