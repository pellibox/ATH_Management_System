
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
import { ProgramFilters } from "@/components/programs/ProgramFilters";
import { ProgramManagement } from "@/components/court-vision/ProgramManagement";

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
    handleChangeCourtNumber,
    programs,
    handleAddProgram,
    handleRemoveProgram
  } = useCourtVision();

  return (
    <div className="flex-1 pb-20">
      {isLayoutView ? (
        <AssignmentsDashboard
          courts={filteredCourts}
          selectedDate={selectedDate}
        />
      ) : (
        <>
          <div className="mb-6">
            <ProgramManagement 
              programs={programs}
              onAddProgram={handleAddProgram}
              onRemoveProgram={handleRemoveProgram}
            />
          </div>
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
        </>
      )}
    </div>
  );
}

// Court Vision Header wrapper that connects to context
function HeaderWithContext() {
  const { 
    selectedDate,
    setSelectedDate,
    filteredCourts,
    people,
    activities,
    templates,
    filteredPlayers,
    filteredCoaches,
    timeSlots,
    programs,
    applyTemplate,
    saveAsTemplate,
    copyToNextDay,
    copyToWeek,
    checkUnassignedPeople,
    handleDrop,
    handleActivityDrop,
    handleAddPerson,
    handleAddActivity,
    handleAddToDragArea,
    handleAssignProgram
  } = useCourtVision();
  
  return (
    <CourtVisionHeader
      selectedDate={selectedDate}
      onDateChange={setSelectedDate}
      courts={filteredCourts}
      people={people}
      activities={activities}
      templates={templates}
      playersList={filteredPlayers}
      coachesList={filteredCoaches}
      timeSlots={timeSlots}
      programs={programs}
      onApplyTemplate={applyTemplate}
      onSaveTemplate={saveAsTemplate}
      onCopyToNextDay={copyToNextDay}
      onCopyToWeek={copyToWeek}
      onCheckUnassigned={checkUnassignedPeople}
      onDrop={handleDrop}
      onActivityDrop={handleActivityDrop}
      onAddPerson={handleAddPerson}
      onAddActivity={handleAddActivity}
      onAddToDragArea={handleAddToDragArea}
      onAssignProgram={handleAssignProgram}
    />
  );
}

// Main Court Vision component
export default function CourtVision() {
  const [activeFilter, setActiveFilter] = useState("all");
  
  return (
    <DndProvider backend={HTML5Backend}>
      <CourtVisionProvider>
        <div className="mx-auto py-4 relative flex flex-col">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold">Visione Campo</h1>
            <ViewModeToggle />
          </div>
          
          <div className="sticky top-0 z-30 bg-white pb-4">
            <HeaderWithContext />
            <ProgramFilters activeFilter={activeFilter} setFilter={setActiveFilter} />
            <CourtTypeLegend />
          </div>
          
          <CourtVisionContent />
        </div>
      </CourtVisionProvider>
    </DndProvider>
  );
}
