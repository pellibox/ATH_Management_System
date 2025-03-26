
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import CourtGrid from "@/components/court-vision/CourtGrid";
import { useCourtVision } from "../context/CourtVisionContext";
import { AddActivityForm } from "./AddActivityForm";

export function CourtVisionContent() {
  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false);
  
  const { 
    filteredCourts, 
    timeSlots, 
    selectedDate,
    handleDrop,
    handleActivityDrop,
    handleRemovePerson,
    handleRemoveActivity,
    handleRenameCourt,
    handleChangeCourtType,
    handleChangeCourtNumber,
    handleAddActivity
  } = useCourtVision();

  console.log("CourtVisionContent rendering", { 
    filteredCourtsCount: filteredCourts.length
  });

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <div className="flex justify-end mb-2 px-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs flex items-center gap-1 border-ath-blue text-ath-blue"
          onClick={() => setIsAddActivityOpen(true)}
        >
          <Plus className="h-3.5 w-3.5" />
          Aggiungi Attività
        </Button>
      </div>
      
      <div className="flex-1 overflow-auto">
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
      </div>
      
      <Dialog open={isAddActivityOpen} onOpenChange={setIsAddActivityOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Aggiungi Nuova Attività</DialogTitle>
          </DialogHeader>
          <AddActivityForm 
            onAddActivity={(activityData) => {
              handleAddActivity(activityData);
              setIsAddActivityOpen(false);
            }}
            onCancel={() => setIsAddActivityOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
