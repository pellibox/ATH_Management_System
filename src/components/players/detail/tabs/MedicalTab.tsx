
import { CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { AlertTriangle, FileCheck } from "lucide-react";
import { Player } from "@/types/player";

interface MedicalTabProps {
  player: Player;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  handleNestedChange: (parent: keyof Player, field: string, value: any) => void;
}

export function MedicalTab({ player, isEditing, setIsEditing, handleNestedChange }: MedicalTabProps) {
  // Calculate medical information status
  const hasMedicalInfo = player.medicalExam?.date && player.medicalExam?.expiryDate;
  const isMedicalValid = hasMedicalInfo && new Date(player.medicalExam?.expiryDate!) > new Date();
  const daysUntilExpiry = hasMedicalInfo 
    ? Math.ceil((new Date(player.medicalExam?.expiryDate!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <CardContent className="p-4 pt-2">
      <div className="space-y-5">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-base font-medium">Stato Sanitario</h3>
            <p className="text-sm text-gray-500">Gestione della certificazione medico-sportiva</p>
          </div>
          
          <Badge 
            variant={isMedicalValid ? "default" : "destructive"}
            className="text-xs"
          >
            {isMedicalValid ? "Valido" : "Scaduto o Mancante"}
          </Badge>
        </div>
        
        {isEditing || hasMedicalInfo ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={isEditing ? "" : "bg-gray-50 p-3 rounded-md"}>
                <p className="text-xs text-gray-500">Data Visita</p>
                {isEditing ? (
                  <Input
                    type="date"
                    value={player.medicalExam?.date || ""}
                    onChange={(e) => handleNestedChange('medicalExam', 'date', e.target.value)}
                    className="h-8 mt-1"
                  />
                ) : (
                  <p className="font-medium">
                    {player.medicalExam?.date ? 
                      format(new Date(player.medicalExam.date), "dd/MM/yyyy") : 
                      "Non specificato"}
                  </p>
                )}
              </div>
              
              <div className={isEditing ? "" : "bg-gray-50 p-3 rounded-md"}>
                <p className="text-xs text-gray-500">Data Scadenza</p>
                {isEditing ? (
                  <Input
                    type="date"
                    value={player.medicalExam?.expiryDate || ""}
                    onChange={(e) => handleNestedChange('medicalExam', 'expiryDate', e.target.value)}
                    className="h-8 mt-1"
                  />
                ) : (
                  <p className="font-medium">
                    {player.medicalExam?.expiryDate ? 
                      format(new Date(player.medicalExam.expiryDate), "dd/MM/yyyy") : 
                      "Non specificato"}
                  </p>
                )}
              </div>
            </div>
            
            {!isEditing && (
              <>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Tempo rimasto alla scadenza</span>
                    <span className={`text-sm font-medium ${
                      daysUntilExpiry > 30 ? "text-green-600" : 
                      daysUntilExpiry > 14 ? "text-yellow-600" : 
                      "text-red-600"
                    }`}>
                      {daysUntilExpiry} giorni
                    </span>
                  </div>
                  
                  <Progress 
                    value={Math.min(100, (daysUntilExpiry / 365) * 100)} 
                    className={`h-2 ${
                      daysUntilExpiry > 30 ? "bg-green-100" : 
                      daysUntilExpiry > 14 ? "bg-yellow-100" : 
                      "bg-red-100"
                    }`}
                  />
                </div>
                
                {daysUntilExpiry <= 30 && (
                  <div className={`p-3 rounded-md flex items-start gap-2 ${
                    daysUntilExpiry <= 14 ? "bg-red-50 text-red-700" : "bg-yellow-50 text-yellow-700"
                  }`}>
                    <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">
                        {daysUntilExpiry <= 0 
                          ? "Certificato medico scaduto!" 
                          : `Il certificato medico scadrà tra ${daysUntilExpiry} giorni`}
                      </p>
                      <p className="text-sm mt-1">
                        {daysUntilExpiry <= 0 
                          ? "È necessario rinnovare il certificato prima di riprendere l'attività sportiva." 
                          : "Si consiglia di pianificare una nuova visita medica al più presto."}
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}
            
            <div className="space-y-2">
              <p className="text-xs text-gray-500">Tipo di Certificato</p>
              {isEditing ? (
                <Select 
                  value={player.medicalExam?.type || "Non-Agonistic"}
                  onValueChange={(value) => handleNestedChange('medicalExam', 'type', value as 'Agonistic' | 'Non-Agonistic')}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Agonistic">Agonistico</SelectItem>
                    <SelectItem value="Non-Agonistic">Non Agonistico</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <p>{player.medicalExam?.type === "Agonistic" ? "Agonistico" : "Non Agonistico"}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <p className="text-xs text-gray-500">Medico</p>
              {isEditing ? (
                <Input
                  value={player.medicalExam?.doctor || ""}
                  onChange={(e) => handleNestedChange('medicalExam', 'doctor', e.target.value)}
                  placeholder="Nome del medico"
                />
              ) : (
                <p>{player.medicalExam?.doctor || "Non specificato"}</p>
              )}
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-md bg-red-50 text-red-700 flex items-center gap-3">
            <AlertTriangle className="h-6 w-6" />
            <div>
              <p className="font-medium">Certificato medico non presente</p>
              <p className="text-sm mt-1">Nessun certificato medico registrato per questo tesserato.</p>
            </div>
          </div>
        )}
        
        {!isEditing && (
          <div className="pt-4">
            <Button 
              className="w-full"
              onClick={() => setIsEditing(true)}
            >
              <FileCheck className="mr-2 h-4 w-4" />
              {hasMedicalInfo ? "Aggiorna Certificato Medico" : "Carica Certificato Medico"}
            </Button>
          </div>
        )}
      </div>
    </CardContent>
  );
}
