
import { useState } from "react";
import { Calendar, Clock, Check, Sparkles, Edit2, X, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { PROGRAM_COLORS } from "@/components/court-vision/constants";

export interface ProgramDetail {
  id: string;
  name: string;
  color: string;
  description?: string;
  details?: string[];
  cost?: string;
  weeklyHours?: number;
  totalWeeks?: number;
  vicki?: boolean | string;
  nextStart?: string;
  enrollmentOpen?: boolean;
}

interface ProgramCardProps {
  program: ProgramDetail;
  expandedProgram: string | null;
  toggleExpand: (id: string) => void;
  onUpdateProgram?: (updatedProgram: ProgramDetail) => void;
}

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

  return (
    <div 
      key={program.id} 
      className={cn(
        "bg-white rounded-xl shadow-soft overflow-hidden transition-all duration-300",
        isExpanded ? `ring-2` : "",
        "card-hover"
      )}
      style={{ borderLeft: `4px solid ${program.color}` }}
    >
      <div 
        className="p-4 cursor-pointer relative"
        onClick={() => !isEditing && toggleExpand(program.id)}
      >
        {onUpdateProgram && (
          <div className="absolute top-2 right-2 z-10" onClick={(e) => e.stopPropagation()}>
            {isEditing ? (
              <div className="flex gap-1">
                <button 
                  onClick={cancelEditing}
                  className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700"
                  title="Annulla"
                >
                  <X className="h-4 w-4" />
                </button>
                <button 
                  onClick={saveChanges}
                  className="p-1 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700"
                  title="Salva"
                >
                  <Save className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
                className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700"
                title="Modifica"
              >
                <Edit2 className="h-4 w-4" />
              </button>
            )}
          </div>
        )}

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
                      onClick={(e) => e.stopPropagation()}
                    ></span>
                  </div>
                  <Input
                    value={editedProgram.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="h-7 text-base font-semibold"
                    onClick={(e) => e.stopPropagation()}
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
                  <SelectTrigger className="h-7 w-28" onClick={(e) => e.stopPropagation()}>
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
                onClick={(e) => e.stopPropagation()}
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
                onClick={(e) => e.stopPropagation()}
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
                  onClick={(e) => e.stopPropagation()}
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
                  onClick={(e) => e.stopPropagation()}
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
      
      {/* Expanded details */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-0 border-t-0 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-xs font-medium text-gray-500 mb-2">Dettagli Programma</h4>
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
                        <X className="h-3 w-3" />
                      </button>
                      <Input
                        value={detail}
                        onChange={(e) => handleDetailChange(idx, e.target.value)}
                        className="h-6 text-xs"
                        onClick={(e) => e.stopPropagation()}
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
              
              {program.weeklyHours && program.weeklyHours > 0 && (
                <div className="mt-4">
                  <h4 className="text-xs font-medium text-gray-500 mb-2">Monte Ore</h4>
                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-600">Ore settimanali:</span>
                      <span className="text-xs font-medium">{program.weeklyHours} ore</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-600">Settimane totali:</span>
                      <span className="text-xs font-medium">{program.totalWeeks}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-600">Monte ore totale:</span>
                      <span className="text-xs font-medium">{program.weeklyHours * (program.totalWeeks || 0)} ore</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div>
              <h4 className="text-xs font-medium text-gray-500 mb-2">Informazioni</h4>
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-xs text-gray-600">Costo:</span>
                  {isEditing ? (
                    <Input
                      value={editedProgram.cost || ''}
                      onChange={(e) => handleInputChange('cost', e.target.value)}
                      className="h-6 w-32 text-xs"
                      placeholder="Prezzo"
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <span className="text-xs font-medium">{program.cost}</span>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Iscrizioni:</span>
                  {isEditing ? (
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <span className="text-xs">{editedProgram.enrollmentOpen ? "Aperte" : "Chiuse"}</span>
                      <Switch 
                        checked={editedProgram.enrollmentOpen || false}
                        onCheckedChange={(checked) => handleInputChange('enrollmentOpen', checked)}
                      />
                    </div>
                  ) : (
                    <span className="text-xs">{program.enrollmentOpen !== false ? "Aperte" : "Chiuse"}</span>
                  )}
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-600">Integrazione VICKI™:</span>
                  <span className="text-xs">
                    {program.vicki === true 
                      ? "Inclusa" 
                      : program.vicki === "optional" 
                        ? "Disponibile su richiesta" 
                        : "Non disponibile"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Prossimo inizio:</span>
                  {isEditing ? (
                    <Input
                      value={editedProgram.nextStart || ''}
                      onChange={(e) => handleInputChange('nextStart', e.target.value)}
                      className="h-6 w-32 text-xs"
                      placeholder="es. Settembre 2024"
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <span className="text-xs">{program.nextStart || "Settembre 2024"}</span>
                  )}
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-600">Color code:</span>
                  <div className="flex items-center gap-1">
                    <span 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: program.color }}
                    ></span>
                    <span className="text-xs">{program.color}</span>
                  </div>
                </div>
              </div>
              
              {!isEditing && (
                <div className="mt-4 flex gap-2 justify-end">
                  <button className="px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs hover:bg-gray-200 transition-colors">
                    Dettagli
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
