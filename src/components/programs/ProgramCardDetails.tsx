
import { Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ProgramDetail } from "./types";

interface ProgramCardDetailsProps {
  program: ProgramDetail;
  editedProgram: ProgramDetail;
  isEditing: boolean;
  handleInputChange: (field: keyof ProgramDetail, value: any) => void;
  handleDetailChange: (index: number, value: string) => void;
  addDetail: () => void;
  removeDetail: (index: number) => void;
  stopPropagation: (e: React.MouseEvent) => void;
}

export const ProgramCardDetails = ({
  program,
  editedProgram,
  isEditing,
  handleInputChange,
  handleDetailChange,
  addDetail,
  removeDetail,
  stopPropagation
}: ProgramCardDetailsProps) => {
  return (
    <div className="space-y-4">
      <div className="bg-gray-50 p-3 rounded-lg">
        <h4 className="text-xs font-medium text-gray-700 mb-2">Dettagli Programma</h4>
        {isEditing ? (
          <div className="space-y-1.5">
            {editedProgram.details && editedProgram.details.map((detail, idx) => (
              <div key={idx} className="flex items-start gap-1">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    removeDetail(idx);
                  }}
                  className="p-0.5 rounded bg-red-100 text-red-600 mt-0.5"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 6 18"></path>
                    <path d="m6 6 12 12"></path>
                  </svg>
                </button>
                <Input
                  value={detail}
                  onChange={(e) => handleDetailChange(idx, e.target.value)}
                  className="h-6 text-xs"
                  onClick={stopPropagation}
                />
              </div>
            ))}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                addDetail();
              }}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              + Aggiungi dettaglio
            </button>
          </div>
        ) : (
          <ul className="space-y-1.5">
            {program.details && program.details.map((detail, idx) => (
              <li key={idx} className="flex items-start">
                <Check className="h-3 w-3 text-ath-blue mr-1 mt-0.5 flex-shrink-0" />
                <span className="text-xs">{detail}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      {/* Hours Section */}
      {(program.weeklyHours || isEditing) && (
        <ProgramHoursSection 
          program={program} 
          editedProgram={editedProgram}
          isEditing={isEditing}
          handleInputChange={handleInputChange}
          stopPropagation={stopPropagation}
        />
      )}
    </div>
  );
};

interface ProgramHoursSectionProps {
  program: ProgramDetail;
  editedProgram: ProgramDetail;
  isEditing: boolean;
  handleInputChange: (field: keyof ProgramDetail, value: any) => void;
  stopPropagation: (e: React.MouseEvent) => void;
}

const ProgramHoursSection = ({ 
  program, 
  editedProgram, 
  isEditing, 
  handleInputChange,
  stopPropagation
}: ProgramHoursSectionProps) => {
  return (
    <div className="bg-gray-50 p-3 rounded-lg">
      <h4 className="text-xs font-medium text-gray-700 mb-2">Monte Ore</h4>
      <div className="space-y-1.5">
        <div className="flex justify-between">
          <span className="text-xs text-gray-600">Ore settimanali:</span>
          {isEditing ? (
            <Input
              type="number"
              value={editedProgram.weeklyHours || 0}
              onChange={(e) => handleInputChange('weeklyHours', parseFloat(e.target.value) || 0)}
              className="h-6 w-20 text-xs text-right"
              min={0}
              step={0.5}
              onClick={stopPropagation}
            />
          ) : (
            <span className="text-xs font-medium">{program.weeklyHours} ore</span>
          )}
        </div>
        <div className="flex justify-between">
          <span className="text-xs text-gray-600">Settimane totali:</span>
          {isEditing ? (
            <Input
              type="number"
              value={editedProgram.totalWeeks || 0}
              onChange={(e) => handleInputChange('totalWeeks', parseInt(e.target.value, 10) || 0)}
              className="h-6 w-20 text-xs text-right"
              min={0}
              onClick={stopPropagation}
            />
          ) : (
            <span className="text-xs font-medium">{program.totalWeeks}</span>
          )}
        </div>
        <div className="flex justify-between">
          <span className="text-xs text-gray-600">Monte ore totale:</span>
          <span className="text-xs font-medium">
            {isEditing 
              ? (editedProgram.weeklyHours || 0) * (editedProgram.totalWeeks || 0)
              : (program.weeklyHours || 0) * (program.totalWeeks || 0)
            } ore
          </span>
        </div>
      </div>
    </div>
  );
};
