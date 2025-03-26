
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PROGRAM_COLORS } from "@/components/court-vision/constants";
import { ProgramDetail } from "./types";

interface ProgramInformationProps {
  program: ProgramDetail;
  editedProgram: ProgramDetail;
  isEditing: boolean;
  handleInputChange: (field: keyof ProgramDetail, value: any) => void;
  toggleExpand: (id: string) => void;
  stopPropagation: (e: React.MouseEvent) => void;
}

export const ProgramInformation = ({
  program,
  editedProgram,
  isEditing,
  handleInputChange,
  toggleExpand,
  stopPropagation
}: ProgramInformationProps) => {
  return (
    <div className="space-y-4">
      <div className="bg-gray-50 p-3 rounded-lg">
        <h4 className="text-xs font-medium text-gray-700 mb-2">Informazioni</h4>
        <div className="space-y-2">
          {/* Cost */}
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Costo:</span>
            {isEditing ? (
              <Input
                value={editedProgram.cost || ''}
                onChange={(e) => handleInputChange('cost', e.target.value)}
                className="h-6 w-32 text-xs text-right"
                placeholder="Prezzo"
                onClick={stopPropagation}
              />
            ) : (
              <span className="text-xs font-medium">{program.cost}</span>
            )}
          </div>
          
          {/* Enrollment Status */}
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Iscrizioni:</span>
            {isEditing ? (
              <div className="flex items-center gap-2" onClick={stopPropagation}>
                <span className="text-xs">{editedProgram.enrollmentOpen ? "Aperte" : "Chiuse"}</span>
                <Switch 
                  checked={editedProgram.enrollmentOpen || false}
                  onCheckedChange={(checked) => handleInputChange('enrollmentOpen', checked)}
                />
              </div>
            ) : (
              <span className="text-xs font-medium">
                {program.enrollmentOpen !== false ? "Aperte" : "Chiuse"}
              </span>
            )}
          </div>
          
          {/* Vicki Integration */}
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Integrazione VICKI™:</span>
            {isEditing ? (
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
                <SelectTrigger className="h-6 w-32 text-xs" onClick={stopPropagation}>
                  <SelectValue placeholder="Vicki" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Inclusa</SelectItem>
                  <SelectItem value="optional">Su richiesta</SelectItem>
                  <SelectItem value="false">Non disponibile</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <span className="text-xs font-medium">
                {program.vicki === true 
                  ? "Inclusa" 
                  : program.vicki === "optional" 
                    ? "Disponibile su richiesta" 
                    : "Non disponibile"}
              </span>
            )}
          </div>
          
          {/* Next Start */}
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Prossimo inizio:</span>
            {isEditing ? (
              <Input
                value={editedProgram.nextStart || ''}
                onChange={(e) => handleInputChange('nextStart', e.target.value)}
                className="h-6 w-32 text-xs text-right"
                placeholder="es. Settembre 2024"
                onClick={stopPropagation}
              />
            ) : (
              <span className="text-xs font-medium">{program.nextStart || "Settembre 2024"}</span>
            )}
          </div>
          
          {/* Color Code */}
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Color code:</span>
            {isEditing ? (
              <div className="flex flex-wrap gap-1 text-right">
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
            ) : (
              <div className="flex items-center gap-1">
                <span 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: program.color }}
                ></span>
                <span className="text-xs">{program.color}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Actions Section */}
      {!isEditing && (
        <div className="flex gap-2 justify-end">
          <button 
            className="px-3 py-1.5 rounded text-xs font-medium bg-ath-blue text-white hover:bg-ath-blue-dark transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              toggleExpand(program.id);
            }}
          >
            Chiudi
          </button>
        </div>
      )}
    </div>
  );
};
