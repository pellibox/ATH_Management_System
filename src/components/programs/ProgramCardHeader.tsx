
import { Clock, Calendar, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PROGRAM_COLORS } from "@/components/court-vision/constants";
import { cn } from "@/lib/utils";
import { ProgramDetail } from "./types";

interface ProgramCardHeaderProps {
  program: ProgramDetail;
  editedProgram: ProgramDetail;
  isEditing: boolean;
  isExpanded: boolean;
  handleInputChange: (field: keyof ProgramDetail, value: any) => void;
  toggleExpand: (id: string) => void;
  stopPropagation: (e: React.MouseEvent) => void;
}

export const ProgramCardHeader = ({
  program,
  editedProgram,
  isEditing,
  isExpanded,
  handleInputChange,
  toggleExpand,
  stopPropagation
}: ProgramCardHeaderProps) => {
  return (
    <div 
      className="p-4 cursor-pointer relative"
      onClick={() => !isEditing && toggleExpand(program.id)}
    >
      <div className="flex justify-between items-start">
        <div className="w-full pr-8">
          <div className="flex items-center gap-2">
            {isEditing ? (
              <div className="flex items-center gap-2 w-full">
                <div className="relative">
                  <div className="flex flex-wrap gap-1 absolute -left-8 top-6 bg-white shadow-md p-1 rounded z-20">
                    {Object.values(PROGRAM_COLORS).map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={`w-4 h-4 rounded-full border ${
                          editedProgram.color === color ? "border-black" : "border-transparent"
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleInputChange('color', color);
                        }}
                      />
                    ))}
                  </div>
                  <span 
                    className="w-3 h-3 rounded-full cursor-pointer" 
                    style={{ backgroundColor: editedProgram.color }}
                    onClick={stopPropagation}
                  ></span>
                </div>
                <Input
                  value={editedProgram.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="h-7 text-base font-semibold"
                  onClick={stopPropagation}
                />
              </div>
            ) : (
              <>
                <span 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: program.color }}
                ></span>
                <h3 className="text-base font-semibold truncate">{program.name}</h3>
              </>
            )}
            
            {program.vicki && !isEditing && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                <Sparkles className="h-2.5 w-2.5 mr-0.5" /> 
                {program.vicki === true ? "Vicki™" : "Vicki™ opt"}
              </span>
            )}

            {isEditing && (
              <Select
                value={editedProgram.vicki ? 
                  (editedProgram.vicki === true ? "true" : "optional") 
                  : "false"
                }
                onValueChange={(value) => {
                  let vickiValue: boolean | string | undefined;
                  if (value === "true") vickiValue = true;
                  else if (value === "optional") vickiValue = "optional";
                  else vickiValue = undefined;
                  
                  handleInputChange('vicki', vickiValue);
                }}
              >
                <SelectTrigger className="h-7 w-28" onClick={stopPropagation}>
                  <SelectValue placeholder="Vicki" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Vicki™</SelectItem>
                  <SelectItem value="optional">Vicki™ opt</SelectItem>
                  <SelectItem value="false">No Vicki</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
          
          {isEditing ? (
            <Textarea
              value={editedProgram.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="text-xs mt-1"
              placeholder="Descrizione"
              rows={2}
              onClick={stopPropagation}
            />
          ) : (
            <p className="text-xs text-gray-600 mt-1 line-clamp-2">{program.description}</p>
          )}
        </div>
        
        <div className="flex flex-col items-end">
          {isEditing ? (
            <Input
              value={editedProgram.cost || ''}
              onChange={(e) => handleInputChange('cost', e.target.value)}
              className="h-7 w-24 text-sm text-right font-semibold text-ath-blue"
              placeholder="Prezzo"
              onClick={stopPropagation}
            />
          ) : (
            <div className="text-sm font-semibold text-ath-blue">{program.cost}</div>
          )}
        </div>
      </div>
      
      <div className="mt-2 flex flex-wrap gap-3">
        {isEditing ? (
          <>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-gray-500" />
              <Input
                type="number"
                value={editedProgram.weeklyHours || 0}
                onChange={(e) => handleInputChange('weeklyHours', parseFloat(e.target.value) || 0)}
                className="h-6 w-20 text-xs"
                min={0}
                step={0.5}
                onClick={stopPropagation}
              />
              <span className="text-xs">ore/sett</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3 text-gray-500" />
              <Input
                type="number"
                value={editedProgram.totalWeeks || 0}
                onChange={(e) => handleInputChange('totalWeeks', parseInt(e.target.value, 10) || 0)}
                className="h-6 w-20 text-xs"
                min={0}
                onClick={stopPropagation}
              />
              <span className="text-xs">settimane</span>
            </div>
          </>
        ) : (
          <>
            {program.weeklyHours && program.weeklyHours > 0 && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-gray-500" />
                <span className="text-xs">
                  {program.weeklyHours} ore/sett
                </span>
              </div>
            )}
            {program.totalWeeks && program.totalWeeks > 0 && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3 text-gray-500" />
                <span className="text-xs">{program.totalWeeks} settimane</span>
              </div>
            )}
          </>
        )}
      </div>
      
      <div className={cn(
        "mt-1 flex justify-end items-center gap-1",
        "text-ath-blue transition-transform duration-300",
        isExpanded ? "rotate-180" : ""
      )}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
    </div>
  );
};
