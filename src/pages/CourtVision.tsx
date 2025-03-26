
import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { CourtVisionProvider } from "@/components/court-vision/CourtVisionContext";
import { ViewModeToggle } from "@/components/court-vision/ViewModeToggle";
import CourtVisionHeader from "@/components/court-vision/CourtVisionHeader";
import CourtTypeLegend from "@/components/court-vision/CourtTypeLegend";
import CourtGrid from "@/components/court-vision/CourtGrid";
import { AssignmentsDashboard } from "@/components/court-vision/AssignmentsDashboard";
import { useCourtVision } from "@/components/court-vision/CourtVisionContext";
import { AvailablePeople } from "@/components/court-vision/AvailablePeople";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, UserCog } from "lucide-react";

// Main content component that renders based on view type
function CourtVisionContent() {
  const { 
    filteredCourts, 
    timeSlots, 
    selectedDate,
    isLayoutView,
    handleDrop,
    handleActivityDrop,
    handleRemovePerson,
    handleRemoveActivity,
    handleRenameCourt,
    handleChangeCourtType,
    handleChangeCourtNumber
  } = useCourtVision();

  return (
    <div className="flex-1 pb-20">
      {isLayoutView ? (
        <AssignmentsDashboard
          courts={filteredCourts}
          selectedDate={selectedDate}
        />
      ) : (
        <CourtGrid
          courts={filteredCourts}
          timeSlots={timeSlots}
          onDrop={handleDrop}
          onActivityDrop={handleActivityDrop}
          onRemovePerson={handleRemovePerson}
          onRemoveActivity={handleRemoveActivity}
          onRenameCourt={handleRenameCourt}
          onChangeCourtType={handleChangeCourtType}
          onChangeCourtNumber={handleChangeCourtNumber}
        />
      )}
    </div>
  );
}

// Main Court Vision component
export default function CourtVision() {
  const [activeTab, setActiveTab] = useState("players");
  
  return (
    <DndProvider backend={HTML5Backend}>
      <CourtVisionProvider>
        <div className="mx-auto py-4 relative flex flex-col h-screen">
          <div className="mb-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold">Visione Campo</h1>
            <ViewModeToggle />
          </div>
          
          <div className="sticky top-0 z-30 bg-white pb-4">
            <CourtVisionHeader />
            <CourtTypeLegend />
          </div>
          
          <div className="flex flex-1 gap-4 overflow-hidden">
            {/* Left sidebar for people management */}
            <div className="w-80 flex flex-col space-y-4 overflow-y-auto pb-20 shrink-0 border-r pr-4">
              <PeopleList />
            </div>
            
            {/* Main content area that scrolls */}
            <div className="flex-1 overflow-y-auto pb-20">
              <CourtVisionContent />
            </div>
          </div>
        </div>
      </CourtVisionProvider>
    </DndProvider>
  );
}

// Simplified people component that just shows players and coaches tabs
function PeopleList() {
  const { 
    people, 
    programs, 
    handleAddPerson, 
    handleAddToDragArea,
    playersList,
    coachesList,
    handleAssignProgram
  } = useCourtVision();
  
  const [activeTab, setActiveTab] = useState("players");
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <Tabs defaultValue="players" onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="grid w-full grid-cols-2 mb-3">
          <TabsTrigger value="players" className="text-xs">
            <User className="h-3 w-3 mr-1" /> <span>Giocatori</span>
          </TabsTrigger>
          <TabsTrigger value="coaches" className="text-xs">
            <UserCog className="h-3 w-3 mr-1" /> <span>Allenatori</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="players" className="mt-0">
          <AvailablePeople
            people={people}
            programs={programs}
            onAddPerson={handleAddPerson}
            onAddToDragArea={handleAddToDragArea}
            playersList={playersList}
            coachesList={coachesList}
          />
        </TabsContent>
        
        <TabsContent value="coaches" className="mt-0">
          <AvailablePeople
            people={[]}
            programs={programs}
            onAddPerson={handleAddPerson}
            onAddToDragArea={handleAddToDragArea}
            playersList={[]}
            coachesList={coachesList}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
