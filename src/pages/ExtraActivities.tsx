
import { useState } from "react";
import { ActivitiesList } from "@/components/extra-activities/ActivitiesList";
import { ExtraActivitiesHeader } from "@/components/extra-activities/ExtraActivitiesHeader";
import { ExtraActivitiesCalendarSection } from "@/components/extra-activities/ExtraActivitiesCalendarSection";
import { useExtraActivities } from "@/hooks/useExtraActivities";
import { useNameResolver } from "@/hooks/useNameResolver";
import { ExtraActivity } from "@/types/extra-activities";

// Initial activities data
const initialActivities: ExtraActivity[] = [
  {
    id: "athletic-1",
    title: "Preparazione Atletica Settimanale",
    name: "Preparazione Atletica Settimanale",
    type: "athletic",
    time: "17:00",
    duration: 1.5,
    days: [1, 3, 5], // Lunedì, Mercoledì, Venerdì
    location: "Palestra",
    maxParticipants: 8,
    participants: ["player-1", "player-2", "player-3"],
    coach: "coach-1",
    notes: "Portare abbigliamento sportivo e scarpe da ginnastica",
    date: new Date().toISOString().split('T')[0],
    startTime: "17:00",
    endTime: "18:30"
  },
  {
    id: "mental-1",
    title: "Sessione di Mindfulness",
    name: "Sessione di Mindfulness",
    type: "mental",
    time: "16:00",
    duration: 1,
    days: [2, 4], // Martedì, Giovedì
    location: "Sala Conferenze",
    maxParticipants: 10,
    participants: ["player-2", "player-4"],
    coach: "coach-2",
    notes: "Portare tappetino yoga",
    date: new Date().toISOString().split('T')[0],
    startTime: "16:00",
    endTime: "17:00"
  }
];

export default function ExtraActivities() {
  // State for view mode and selected date
  const [currentView, setCurrentView] = useState<"week" | "day" | "month">("week");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  // Custom hooks
  const { 
    activities, 
    handleAddActivity, 
    handleEditActivity, 
    handleDeleteActivity,
    handleAddParticipant,
    handleRemoveParticipant,
    getActivitiesForDate
  } = useExtraActivities(initialActivities);
  
  const { getCoachName, getPlayerName, playersList, coachesList } = useNameResolver();
  
  // Get activities for the selected date
  const activitiesForSelectedDate = getActivitiesForDate(selectedDate);

  return (
    <div className="max-w-7xl mx-auto p-6 animate-fade-in">
      <ExtraActivitiesHeader 
        onAddActivity={handleAddActivity}
        coachesList={coachesList}
        onEditActivity={handleEditActivity}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <ExtraActivitiesCalendarSection 
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          currentView={currentView}
          setCurrentView={setCurrentView}
          activitiesForSelectedDate={activitiesForSelectedDate}
          getCoachName={getCoachName}
          getPlayerName={getPlayerName}
          onDeleteActivity={handleDeleteActivity}
          onEditActivity={handleEditActivity}
          onAddParticipant={handleAddParticipant}
          onRemoveParticipant={handleRemoveParticipant}
          playersList={playersList}
          coachesList={coachesList}
          onAddActivity={handleAddActivity}
        />
        
        <div className="lg:col-span-4">
          <ActivitiesList 
            activities={activities} 
            getCoachName={getCoachName} 
          />
        </div>
      </div>
    </div>
  );
}
