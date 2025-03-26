
import { useState } from "react";
import { ExtraActivity } from "@/types/extra-activities";
import { ExtraActivitiesCalendar } from "./ExtraActivitiesCalendar";
import { DailyActivitiesList } from "./DailyActivitiesList";
import { ExtraActivityForm } from "./ExtraActivityForm";
import { useIsMobile } from "@/hooks/use-mobile";

interface ExtraActivitiesCalendarSectionProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  currentView: "week" | "day" | "month";
  setCurrentView: (view: "week" | "day" | "month") => void;
  activitiesForSelectedDate: ExtraActivity[];
  getCoachName: (coachId: string) => string;
  getPlayerName: (playerId: string) => string;
  onDeleteActivity: (id: string) => void;
  onEditActivity: (id: string, updatedActivity: Partial<ExtraActivity>) => void;
  onAddParticipant: (activityId: string, participantId: string) => void;
  onRemoveParticipant: (activityId: string, participantId: string) => void;
  playersList: Array<{ id: string; name: string }>;
  coachesList: Array<{ id: string; name: string }>;
  onAddActivity: (activity: ExtraActivity) => void;
}

export function ExtraActivitiesCalendarSection({
  selectedDate,
  setSelectedDate,
  currentView,
  setCurrentView,
  activitiesForSelectedDate,
  getCoachName,
  getPlayerName,
  onDeleteActivity,
  onEditActivity,
  onAddParticipant,
  onRemoveParticipant,
  playersList,
  coachesList,
  onAddActivity
}: ExtraActivitiesCalendarSectionProps) {
  const isMobile = useIsMobile();
  
  return (
    <div className={`${isMobile ? 'w-full' : 'lg:col-span-8'}`}>
      <ExtraActivitiesCalendar
        currentView={currentView}
        setCurrentView={setCurrentView}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
      
      <div className="mt-4 md:mt-6">
        <DailyActivitiesList
          activities={activitiesForSelectedDate}
          selectedDate={selectedDate}
          getCoachName={getCoachName}
          getPlayerName={getPlayerName}
          onDeleteActivity={onDeleteActivity}
          onEditActivity={onEditActivity}
          onAddParticipant={onAddParticipant}
          onRemoveParticipant={onRemoveParticipant}
          playersList={playersList}
          coachesList={coachesList}
        />
        
        {activitiesForSelectedDate.length === 0 && (
          <div className="bg-gray-50 rounded-lg p-4 md:p-8 text-center">
            <p className="text-gray-500 mb-2 md:mb-4 text-sm md:text-base">
              Nessuna attività programmata per questa data
            </p>
            <ExtraActivityForm 
              onAddActivity={onAddActivity} 
              coachesList={coachesList}
              buttonLabel="Aggiungi Attività"
              buttonVariant="outline"
              onEditActivity={onEditActivity}
            />
          </div>
        )}
      </div>
    </div>
  );
}
