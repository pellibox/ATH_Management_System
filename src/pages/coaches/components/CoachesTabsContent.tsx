
import { useState } from "react";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Filter } from "lucide-react";
import { CoachFilters } from "./CoachFilters";
import { CoachesList } from "./CoachesList";
import { CoachAvailabilityCalendar } from "./CoachAvailabilityCalendar";
import { PersonData, Program } from "@/components/court-vision/types";
import { CoachAvailabilityEvent } from "@/contexts/programs/types";

interface CoachesTabsContentProps {
  sportTypeFilter: string;
  setSportTypeFilter: (value: string) => void;
  programFilter: string;
  setProgramFilter: (value: string) => void;
  setSearchQuery: (value: string) => void;
  filteredCoaches: PersonData[];
  allSportTypes: string[];
  programs: Program[];
  handleAssignProgram: (coachId: string, programId: string) => void;
  handleSendSchedule: (coachId: string, type: "day" | "week" | "month") => void;
  availabilityEvents: CoachAvailabilityEvent[];
  handleAddAvailabilityEvent: (event: CoachAvailabilityEvent) => void;
  handleRemoveAvailabilityEvent: (eventId: string) => void;
  handleUpdateAvailabilityEvent: (eventId: string, updatedEvent: Partial<CoachAvailabilityEvent>) => void;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  currentView: "week" | "day" | "month";
  setCurrentView: (view: "week" | "day" | "month") => void;
}

export function CoachesTabsContent({
  sportTypeFilter,
  setSportTypeFilter,
  programFilter,
  setProgramFilter,
  setSearchQuery,
  filteredCoaches,
  allSportTypes,
  programs,
  handleAssignProgram,
  handleSendSchedule,
  availabilityEvents,
  handleAddAvailabilityEvent,
  handleRemoveAvailabilityEvent,
  handleUpdateAvailabilityEvent,
  selectedDate,
  setSelectedDate,
  currentView,
  setCurrentView
}: CoachesTabsContentProps) {
  const [activeTab, setActiveTab] = useState<"list" | "calendar">("list");
  const [selectedCoach, setSelectedCoach] = useState<PersonData | null>(null);

  return (
    <Tabs value={activeTab} onValueChange={(value: string) => setActiveTab(value as "list" | "calendar")} className="mb-6">
      <TabsList>
        <TabsTrigger value="list" className="flex items-center gap-1">
          <Filter className="h-4 w-4" />
          Lista Allenatori
        </TabsTrigger>
        <TabsTrigger value="calendar" className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          Calendario Disponibilità
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="list">
        <CoachFilters 
          sportTypeFilter={sportTypeFilter}
          setSportTypeFilter={setSportTypeFilter}
          programFilter={programFilter}
          setProgramFilter={setProgramFilter}
          setSearchQuery={setSearchQuery}
          allSportTypes={allSportTypes}
          programs={programs}
        />
        
        <CoachesList 
          filteredCoaches={filteredCoaches}
          programs={programs}
          handleAssignProgram={handleAssignProgram}
          handleSendSchedule={handleSendSchedule}
          onSelectCoach={(coach) => {
            setSelectedCoach(coach);
            setActiveTab("calendar");
          }}
        />
      </TabsContent>
      
      <TabsContent value="calendar">
        {selectedCoach ? (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Calendar className="h-5 w-5 text-ath-blue" />
                Disponibilità: {selectedCoach.name}
              </h2>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setSelectedCoach(null)}
              >
                Cambia Allenatore
              </Button>
            </div>
            
            <CoachAvailabilityCalendar
              coachId={selectedCoach.id}
              coachName={selectedCoach.name}
              availabilityEvents={availabilityEvents}
              onAddEvent={handleAddAvailabilityEvent}
              onRemoveEvent={handleRemoveAvailabilityEvent}
              onUpdateEvent={handleUpdateAvailabilityEvent}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              currentView={currentView}
              setCurrentView={setCurrentView}
            />
          </div>
        ) : (
          <div className="bg-gray-50 rounded-xl p-8 text-center">
            <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">Seleziona un Allenatore</h3>
            <p className="text-gray-500 mb-6">
              Seleziona un allenatore dalla lista per visualizzare e modificare la sua disponibilità
            </p>
            <Button onClick={() => setActiveTab("list")}>
              Vai alla Lista Allenatori
            </Button>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
