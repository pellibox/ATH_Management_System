
import { useState } from "react";
import { ActionsProps } from "./types";
import { useCourtActions } from "./courtActions";
import { useAssignmentActions } from "./assignment";
import { usePeopleActivityActions } from "./people-activity";
import { useScheduleActions } from "./scheduleActions";

export const useCourtVisionActions = (props: ActionsProps) => {
  const {
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
  } = props;

  // Court actions
  const courtActions = useCourtActions(courts, setCourts);
  
  // Assignment actions
  const assignmentActions = useAssignmentActions({
    courts,
    setCourts,
    people,
    setPeople,
    programs,
    selectedDate,
    timeSlots
  });
  
  // People and activity actions
  const peopleActivityActions = usePeopleActivityActions(
    people,
    setPeople,
    activities,
    setActivities,
    playersList,
    setPlayersList,
    coachesList,
    setCoachesList,
    programs,
    courts
  );
  
  // Schedule actions
  const scheduleActions = useScheduleActions(
    courts,
    templates,
    setTemplates,
    dateSchedules,
    setDateSchedules,
    selectedDate,
    setSelectedDate
  );

  // Handle program assignment with court updates
  const handleAssignProgram = (personId: string, programId: string) => {
    const updatedCourts = peopleActivityActions.handleAssignProgram(personId, programId);
    setCourts(updatedCourts);
  };
  
  return {
    ...courtActions,
    ...assignmentActions,
    ...peopleActivityActions,
    ...scheduleActions,
    handleAssignProgram, // Override to handle court updates
  };
};

export * from './types';
