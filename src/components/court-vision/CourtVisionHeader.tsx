
import { useState } from 'react';
import { Calendar, Layers, Clock, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { DateSelector } from './DateSelector';
import { SendScheduleDialog } from './schedule-dialog';
import { ScheduleTemplate } from './types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AvailableActivities } from './AvailableActivities';
import { ScheduleTemplates } from './ScheduleTemplates';
import { useCourtVision } from './context/CourtVisionContext';

export default function CourtVisionHeader() {
  const { 
    selectedDate,
    setSelectedDate,
    courts,
    people,
    activities,
    templates,
    playersList,
    coachesList,
    timeSlots,
    programs,
    applyTemplate,
    saveAsTemplate,
    copyToNextDay,
    copyToWeek,
    checkUnassignedPeople,
    handleActivityDrop,
    handleAddActivity
  } = useCourtVision();
  
  const [activeTab, setActiveTab] = useState<"assignments" | "activities" | "templates">("assignments");
  
  // Get today's assignments from courts
  const getTodaysAssignments = () => {
    let playerCount = 0;
    let coachCount = 0;
    let activityCount = 0;
    
    courts.forEach(court => {
      playerCount += court.occupants.filter(p => p.type === "player").length;
      coachCount += court.occupants.filter(p => p.type === "coach").length;
      activityCount += court.activities.length;
    });
    
    return { playerCount, coachCount, activityCount };
  };
  
  const { playerCount, coachCount, activityCount } = getTodaysAssignments();
  const totalAssignments = playerCount + coachCount + activityCount;
  
  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div className="flex-1 max-w-md w-full">
          <DateSelector 
            selectedDate={selectedDate} 
            onDateChange={setSelectedDate} 
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button 
            className="inline-flex items-center gap-1 bg-gray-800 hover:bg-gray-700 text-white py-1.5 px-3 rounded text-sm font-medium transition-colors"
            onClick={copyToNextDay}
          >
            <Calendar className="h-3.5 w-3.5" />
            <span>Copia Giorno</span>
          </button>
          <button 
            className="inline-flex items-center gap-1 bg-gray-800 hover:bg-gray-700 text-white py-1.5 px-3 rounded text-sm font-medium transition-colors"
            onClick={copyToWeek}
          >
            <Calendar className="h-3.5 w-3.5" />
            <span>Copia Settimana</span>
          </button>
          <SendScheduleDialog 
            courts={courts}
            selectedDate={selectedDate}
            playersList={playersList}
            coachesList={coachesList}
            onCheckUnassigned={checkUnassignedPeople}
          />
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
        <TabsList className="mb-4 w-full justify-start bg-gray-100 p-0.5">
          <TabsTrigger value="assignments" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Layers className="h-4 w-4 mr-2" />
            <span>Assegnazioni di Oggi{totalAssignments > 0 ? ` (${totalAssignments})` : ''}</span>
          </TabsTrigger>
          <TabsTrigger value="activities" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Clock className="h-4 w-4 mr-2" />
            <span>Attività</span>
          </TabsTrigger>
          <TabsTrigger value="templates" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <FileText className="h-4 w-4 mr-2" />
            <span>Templates</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="assignments" className="mt-0">
          <div className="px-4 py-3 bg-gray-50 rounded-lg text-sm">
            <p className="font-medium flex items-center gap-1">
              <span>Assegnazioni per {format(selectedDate, 'EEEE d MMMM yyyy')}</span>
            </p>
            <p className="text-gray-600 mt-1">
              Visualizza e gestisci le assegnazioni di campi, persone e attività per la data selezionata.
              Trascina le persone e le attività sui campi per assegnarle.
            </p>
            
            {totalAssignments > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {playerCount > 0 && (
                  <span className="text-xs bg-ath-blue-light text-ath-blue px-2 py-1 rounded-full">
                    {playerCount} Giocatori
                  </span>
                )}
                {coachCount > 0 && (
                  <span className="text-xs bg-ath-red-clay-light text-ath-red-clay px-2 py-1 rounded-full">
                    {coachCount} Allenatori
                  </span>
                )}
                {activityCount > 0 && (
                  <span className="text-xs bg-ath-gray-light text-ath-gray px-2 py-1 rounded-full">
                    {activityCount} Attività
                  </span>
                )}
              </div>
            )}
          </div>
        </TabsContent>
                
        <TabsContent value="activities" className="mt-0">
          <AvailableActivities 
            activities={activities}
            onAddActivity={handleAddActivity}
            onActivityDrop={handleActivityDrop}
          />
        </TabsContent>
        
        <TabsContent value="templates" className="mt-0">
          <ScheduleTemplates 
            templates={templates} 
            onApplyTemplate={applyTemplate}
            onSaveTemplate={saveAsTemplate}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
