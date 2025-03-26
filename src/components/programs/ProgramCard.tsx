
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ProgramDetail, ProgramCardProps } from "./types";
import { ProgramCardHeader } from "./ProgramCardHeader";
import { ProgramCardDetails } from "./ProgramCardDetails";
import { ProgramInformation } from "./ProgramInformation";
import { ProgramEditControls } from "./ProgramEditControls";

export { type ProgramDetail } from "./types";

export const ProgramCard = ({ 
  program, 
  expandedProgram, 
  toggleExpand,
  onUpdateProgram 
}: ProgramCardProps) => {
  const isExpanded = expandedProgram === program.id;
  const [isEditing, setIsEditing] = useState(false);
  const [editedProgram, setEditedProgram] = useState<ProgramDetail>({...program});

  // Handle input changes
  const handleInputChange = (field: keyof ProgramDetail, value: any) => {
    setEditedProgram(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle detail changes
  const handleDetailChange = (index: number, value: string) => {
    if (!editedProgram.details) return;
    
    const updatedDetails = [...editedProgram.details];
    updatedDetails[index] = value;
    
    setEditedProgram(prev => ({
      ...prev,
      details: updatedDetails
    }));
  };

  // Add new detail
  const addDetail = () => {
    setEditedProgram(prev => ({
      ...prev,
      details: [...(prev.details || []), "Nuovo dettaglio"]
    }));
  };

  // Remove detail
  const removeDetail = (index: number) => {
    if (!editedProgram.details) return;
    
    const updatedDetails = [...editedProgram.details];
    updatedDetails.splice(index, 1);
    
    setEditedProgram(prev => ({
      ...prev,
      details: updatedDetails
    }));
  };

  // Save changes
  const saveChanges = () => {
    if (onUpdateProgram) {
      onUpdateProgram(editedProgram);
    }
    setIsEditing(false);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditedProgram({...program});
    setIsEditing(false);
  };

  // Stop event propagation (for nested clickable elements)
  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div 
      key={program.id} 
      className={cn(
        "bg-white rounded-xl shadow-soft overflow-hidden transition-all duration-300",
        isExpanded ? `ring-2 col-span-1 md:col-span-2 lg:col-span-3` : "",
        "card-hover"
      )}
      style={{ borderLeft: `4px solid ${program.color}` }}
    >
      {/* Edit Controls */}
      {onUpdateProgram && (
        <ProgramEditControls 
          isEditing={isEditing}
          cancelEditing={cancelEditing}
          saveChanges={saveChanges}
          setIsEditing={setIsEditing}
        />
      )}

      {/* Card Header with Title and Basic Info */}
      <ProgramCardHeader 
        program={program}
        editedProgram={editedProgram}
        isEditing={isEditing}
        isExpanded={isExpanded}
        handleInputChange={handleInputChange}
        toggleExpand={toggleExpand}
        stopPropagation={stopPropagation}
      />
      
      {/* Expanded details */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-0 border-t border-gray-100 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Program Details */}
            <ProgramCardDetails 
              program={program}
              editedProgram={editedProgram}
              isEditing={isEditing}
              handleInputChange={handleInputChange}
              handleDetailChange={handleDetailChange}
              addDetail={addDetail}
              removeDetail={removeDetail}
              stopPropagation={stopPropagation}
            />
            
            {/* Right Column - Program Information */}
            <ProgramInformation 
              program={program}
              editedProgram={editedProgram}
              isEditing={isEditing}
              handleInputChange={handleInputChange}
              toggleExpand={toggleExpand}
              stopPropagation={stopPropagation}
            />
          </div>
        </div>
      )}
    </div>
  );
};
