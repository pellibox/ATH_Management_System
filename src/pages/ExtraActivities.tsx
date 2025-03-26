
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useCourtVision } from "@/components/court-vision/CourtVisionContext";
import { ExtraActivity } from "@/types/extra-activities";
import { ExtraActivityForm } from "@/components/extra-activities/ExtraActivityForm";
import { ActivitiesList } from "@/components/extra-activities/ActivitiesList";
import { ExtraActivitiesCalendar } from "@/components/extra-activities/ExtraActivitiesCalendar";
import { DailyActivitiesList } from "@/components/extra-activities/DailyActivitiesList";

export default function ExtraActivities() {
  const { toast } = useToast();
  const { playersList, coachesList } = useCourtVision();
  const [currentView, setCurrentView] = useState<"week" | "day" | "month">("week");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activities, setActivities] = useState<ExtraActivity[]>([
    {
      id: "athletic-1",
      name: "Preparazione Atletica Settimanale",
      type: "athletic",
      time: "17:00",
      duration: 1.5,
      days: [1, 3, 5], // Lunedì, Mercoledì, Venerdì
      location: "Palestra",
      maxParticipants: 8,
      participants: ["player-1", "player-2", "player-3"],
      coach: "coach-1",
      notes: "Portare abbigliamento sportivo e scarpe da ginnastica"
    },
    {
      id: "mental-1",
      name: "Sessione di Mindfulness",
      type: "mental",
      time: "16:00",
      duration: 1,
      days: [2, 4], // Martedì, Giovedì
      location: "Sala Conferenze",
      maxParticipants: 10,
      participants: ["player-2", "player-4"],
      coach: "coach-2",
      notes: "Portare tappetino yoga"
    }
  ]);

  // Attività programmate per la data selezionata
  const activitiesForSelectedDate = activities.filter(activity => 
    activity.days.includes(selectedDate.getDay() === 0 ? 7 : selectedDate.getDay())
  );
  
  // Gestione aggiunta nuova attività
  const handleAddActivity = (newActivity: ExtraActivity) => {
    setActivities([...activities, newActivity]);
  };
  
  // Gestione modifica attività
  const handleEditActivity = (id: string, updatedActivity: Partial<ExtraActivity>) => {
    setActivities(activities.map(activity => 
      activity.id === id ? { ...activity, ...updatedActivity } : activity
    ));
    
    toast({
      title: "Attività Aggiornata",
      description: "Le modifiche sono state salvate con successo",
    });
  };
  
  // Gestione eliminazione attività
  const handleDeleteActivity = (id: string) => {
    setActivities(activities.filter(activity => activity.id !== id));
    
    toast({
      title: "Attività Eliminata",
      description: "L'attività è stata eliminata con successo",
    });
  };
  
  // Gestione aggiunta partecipante
  const handleAddParticipant = (activityId: string, participantId: string) => {
    setActivities(activities.map(activity => {
      if (activity.id === activityId && !activity.participants.includes(participantId)) {
        return {
          ...activity,
          participants: [...activity.participants, participantId]
        };
      }
      return activity;
    }));
    
    toast({
      title: "Partecipante Aggiunto",
      description: "Il partecipante è stato aggiunto all'attività",
    });
  };
  
  // Gestione rimozione partecipante
  const handleRemoveParticipant = (activityId: string, participantId: string) => {
    setActivities(activities.map(activity => {
      if (activity.id === activityId) {
        return {
          ...activity,
          participants: activity.participants.filter(id => id !== participantId)
        };
      }
      return activity;
    }));
    
    toast({
      title: "Partecipante Rimosso",
      description: "Il partecipante è stato rimosso dall'attività",
    });
  };

  // Ottieni il nome di un coach dal suo ID
  const getCoachName = (coachId: string) => {
    const coach = coachesList.find(c => c.id === coachId);
    return coach ? coach.name : "Coach non trovato";
  };
  
  // Ottieni il nome di un giocatore dal suo ID
  const getPlayerName = (playerId: string) => {
    const player = playersList.find(p => p.id === playerId);
    return player ? player.name : "Giocatore non trovato";
  };

  return (
    <div className="max-w-7xl mx-auto p-6 animate-fade-in">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Attività Aggiuntive</h1>
          <p className="text-gray-600 mt-1">Gestisci atletica e altre attività di supporto</p>
        </div>
        
        <div className="flex items-center gap-3">
          <ExtraActivityForm 
            onAddActivity={handleAddActivity} 
            coachesList={coachesList} 
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <ExtraActivitiesCalendar
            currentView={currentView}
            setCurrentView={setCurrentView}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
        
          <DailyActivitiesList
            activities={activitiesForSelectedDate}
            selectedDate={selectedDate}
            getCoachName={getCoachName}
            getPlayerName={getPlayerName}
            onDeleteActivity={handleDeleteActivity}
            onAddParticipant={handleAddParticipant}
            onRemoveParticipant={handleRemoveParticipant}
            playersList={playersList}
          />
        </div>
        
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
