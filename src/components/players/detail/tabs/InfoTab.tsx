
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, Calendar, CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Player } from "@/types/player";

interface InfoTabProps {
  player: Player;
  isEditing: boolean;
  handleInputChange: (field: keyof Player, value: any) => void;
  handleNestedChange: (parent: keyof Player, field: string, value: any) => void;
}

export function InfoTab({ player, isEditing, handleInputChange, handleNestedChange }: InfoTabProps) {
  return (
    <CardContent className="p-4 pt-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-500">Informazioni Personali</h3>
          
          <div className="space-y-2">
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-2 text-gray-500" />
              {isEditing ? (
                <Input 
                  value={player.email} 
                  onChange={(e) => handleInputChange('email', e.target.value)} 
                  className="h-8"
                />
              ) : (
                <span>{player.email}</span>
              )}
            </div>
            
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-2 text-gray-500" />
              {isEditing ? (
                <Input 
                  value={player.phone} 
                  onChange={(e) => handleInputChange('phone', e.target.value)} 
                  className="h-8"
                />
              ) : (
                <span>{player.phone}</span>
              )}
            </div>
            
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-gray-500" />
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <Input
                    type="date"
                    value={player.dateOfBirth || ""}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    className="h-8 w-40"
                  />
                  <Input
                    type="number"
                    value={player.age?.toString() || ""}
                    onChange={(e) => handleInputChange('age', parseInt(e.target.value) || undefined)}
                    className="h-8 w-16"
                    placeholder="Età"
                  />
                </div>
              ) : (
                <span>
                  {player.dateOfBirth ? `Nato il ${player.dateOfBirth}` : ""} 
                  {player.age ? `(${player.age} anni)` : ""}
                </span>
              )}
            </div>
            
            <div className="flex items-center">
              <CalendarDays className="h-4 w-4 mr-2 text-gray-500" />
              {isEditing ? (
                <Input
                  type="date"
                  value={player.joinDate || ""}
                  onChange={(e) => handleInputChange('joinDate', e.target.value)}
                  className="h-8"
                />
              ) : (
                <span>
                  {player.joinDate ? `Iscritto dal ${player.joinDate}` : "Data iscrizione non specificata"}
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-500">Dettagli Sportivi</h3>
          
          <div className="space-y-2">
            {isEditing ? (
              <div className="space-y-1">
                <label className="text-xs text-gray-500">Sport:</label>
                <Input
                  value={player.sports?.join(", ") || ""}
                  onChange={(e) => handleInputChange('sports', e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
                  placeholder="Inserisci sport separati da virgole"
                  className="h-8"
                />
              </div>
            ) : (
              player.sports && player.sports.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  <span className="text-gray-500 mr-2">Sport:</span>
                  {player.sports.map(sport => (
                    <Badge key={sport} variant="outline">{sport}</Badge>
                  ))}
                </div>
              )
            )}
            
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Obiettivi</h4>
              {isEditing ? (
                <div className="space-y-2">
                  <div>
                    <label className="text-xs text-gray-500">Giornalieri:</label>
                    <Textarea
                      value={player.objectives?.daily || ""}
                      onChange={(e) => handleNestedChange('objectives', 'daily', e.target.value)}
                      className="min-h-[60px]"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Settimanali:</label>
                    <Textarea
                      value={player.objectives?.weekly || ""}
                      onChange={(e) => handleNestedChange('objectives', 'weekly', e.target.value)}
                      className="min-h-[60px]"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Stagionali:</label>
                    <Textarea
                      value={player.objectives?.seasonal || ""}
                      onChange={(e) => handleNestedChange('objectives', 'seasonal', e.target.value)}
                      className="min-h-[60px]"
                    />
                  </div>
                </div>
              ) : (
                <>
                  {player.objectives?.daily && (
                    <div className="mb-1">
                      <span className="text-xs text-gray-500">Giornalieri:</span>
                      <p className="text-sm">{player.objectives.daily}</p>
                    </div>
                  )}
                  {player.objectives?.weekly && (
                    <div className="mb-1">
                      <span className="text-xs text-gray-500">Settimanali:</span>
                      <p className="text-sm">{player.objectives.weekly}</p>
                    </div>
                  )}
                  {player.objectives?.seasonal && (
                    <div className="mb-1">
                      <span className="text-xs text-gray-500">Stagionali:</span>
                      <p className="text-sm">{player.objectives.seasonal}</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-500 mb-2">Note</h3>
        {isEditing ? (
          <Textarea
            value={player.notes || ""}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            className="min-h-[100px]"
          />
        ) : (
          <div className="bg-gray-50 p-3 rounded-md text-sm">
            {player.notes || "Nessuna nota"}
          </div>
        )}
      </div>
    </CardContent>
  );
}
