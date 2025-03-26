import { useState } from 'react';
import { Calendar, Users, Layers, Clock, FileText, Filter, X } from 'lucide-react';
import { format } from 'date-fns';
import { DateSelector } from './DateSelector';
import { SendScheduleDialog } from './schedule-dialog';
import { CourtProps, PersonData, ActivityData, ScheduleTemplate } from './types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AvailablePeople } from './AvailablePeople';
import { AvailableActivities } from './AvailableActivities';
import { ScheduleTemplates } from './ScheduleTemplates';
import { Button } from '@/components/ui/button';
import { DialogClose } from '@/components/ui/dialog';

interface CourtVisionHeaderProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  courts: CourtProps[];
  people: PersonData[];
  activities: ActivityData[];
  templates: ScheduleTemplate[];
  playersList: PersonData[];
  coachesList: PersonData[];
  timeSlots: string[];
  onApplyTemplate: (template: ScheduleTemplate) => void;
  onSaveTemplate: (name: string) => void;
  onCopyToNextDay: () => void;
  onCopyToWeek: () => void;
  onCheckUnassigned: (scheduleType: "day" | "week" | "month") => PersonData[];
  onDrop: (courtId: string, person: PersonData, position?: { x: number, y: number }, timeSlot?: string) => void;
  onActivityDrop: (courtId: string, activity: ActivityData, timeSlot?: string) => void;
  onAddPerson: (person: {name: string, type: string}) => void;
  onAddActivity: (activity: {name: string, type: string, duration: string}) => void;
  onAddToDragArea: (person: PersonData) => void;
}

export default function CourtVisionHeader({
  selectedDate,
  onDateChange,
  courts,
  people,
  activities,
  templates,
  playersList,
  coachesList,
  timeSlots,
  onApplyTemplate,
  onSaveTemplate,
  onCopyToNextDay,
  onCopyToWeek,
  onCheckUnassigned,
  onDrop,
  onActivityDrop,
  onAddPerson,
  onAddActivity,
  onAddToDragArea
}: CourtVisionHeaderProps) {
  const [activeTab, setActiveTab] = useState<"assignments" | "people" | "activities" | "templates">("assignments");
  
  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div className="flex-1 max-w-md w-full">
          <DateSelector 
            selectedDate={selectedDate} 
            onDateChange={onDateChange} 
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button 
            className="inline-flex items-center gap-1 bg-gray-800 hover:bg-gray-700 text-white py-1.5 px-3 rounded text-sm font-medium transition-colors"
            onClick={onCopyToNextDay}
          >
            <Calendar className="h-3.5 w-3.5" />
            <span>Copia Giorno</span>
          </button>
          <button 
            className="inline-flex items-center gap-1 bg-gray-800 hover:bg-gray-700 text-white py-1.5 px-3 rounded text-sm font-medium transition-colors"
            onClick={onCopyToWeek}
          >
            <Calendar className="h-3.5 w-3.5" />
            <span>Copia Settimana</span>
          </button>
          <SendScheduleDialog 
            courts={courts}
            selectedDate={selectedDate}
            playersList={playersList}
            coachesList={coachesList}
            onCheckUnassigned={onCheckUnassigned}
          />
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
        <TabsList className="mb-4 w-full justify-start bg-gray-100 p-0.5">
          <TabsTrigger value="assignments" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Layers className="h-4 w-4 mr-2" />
            <span>Assegnazioni di Oggi</span>
          </TabsTrigger>
          <TabsTrigger value="people" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Users className="h-4 w-4 mr-2" />
            <span>Persone Disponibili</span>
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
              <Filter className="h-4 w-4 text-gray-500" />
              <span>Assegnazioni per {format(selectedDate, 'EEEE d MMMM yyyy')}</span>
            </p>
            <p className="text-gray-600 mt-1">
              Visualizza e gestisci le assegnazioni di campi, persone e attività per la data selezionata.
              Trascina le persone e le attività sui campi per assegnarle.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="people" className="mt-0">
          <AvailablePeople 
            people={people}
            onAddPerson={onAddPerson}
            onDrop={onDrop}
            onAddToDragArea={onAddToDragArea}
            playersList={playersList}
            coachesList={coachesList}
          />
        </TabsContent>
        
        <TabsContent value="activities" className="mt-0">
          <AvailableActivities 
            activities={activities}
            onAddActivity={onAddActivity}
            onActivityDrop={onActivityDrop}
          />
        </TabsContent>
        
        <TabsContent value="templates" className="mt-0">
          <ScheduleTemplates 
            templates={templates} 
            onApplyTemplate={onApplyTemplate}
            onSaveTemplate={onSaveTemplate}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
