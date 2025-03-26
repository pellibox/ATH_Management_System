
import { Badge } from "@/components/ui/badge";
import { CardTitle, CardDescription, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Player } from "@/types/player";
import { Pencil, Save, Tag } from "lucide-react";
import { usePlayerContext } from "@/contexts/PlayerContext";

interface PlayerHeaderProps {
  player: Player;
  isEditing: boolean;
  handleInputChange: (field: keyof Player, value: any) => void;
  onClose: () => void;
  handleSave: () => void;
  setIsEditing: (value: boolean) => void;
}

export function PlayerHeader({ 
  player, 
  isEditing, 
  handleInputChange, 
  onClose, 
  handleSave, 
  setIsEditing 
}: PlayerHeaderProps) {
  const { players } = usePlayerContext();
  
  // Get all program names from existing players
  const programs = Array.from(
    new Set(players.filter(p => p.program).map(p => p.program))
  );
  
  // Get background color for the player avatar based on the program
  const getAvatarBgColor = () => {
    if ((!player.program && (!player.programs || player.programs.length === 0))) return "bg-gray-500";
    
    // Create a simple hash of the program name to get a deterministic color
    const programName = player.program || player.programs?.[0] || "";
    const hash = programName.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colors = ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-orange-500", "bg-pink-500", "bg-teal-500"];
    return colors[hash % colors.length];
  };

  return (
    <CardHeader className="pb-2">
      <div className="flex justify-between items-start">
        <div>
          <CardTitle className="text-2xl flex items-center">
            <span 
              className={`h-10 w-10 rounded-full flex items-center justify-center text-white mr-3 text-lg ${getAvatarBgColor()}`}
            >
              {player.name.substring(0, 1)}
            </span>
            {isEditing ? (
              <Input 
                value={player.name} 
                onChange={(e) => handleInputChange('name', e.target.value)} 
                className="max-w-[250px]"
              />
            ) : (
              player.name
            )}
            <Badge className="ml-3" variant={player.status === 'active' ? "default" : "destructive"}>
              {isEditing ? (
                <Select 
                  value={player.status} 
                  onValueChange={(value) => handleInputChange('status', value as 'active' | 'inactive')}
                >
                  <SelectTrigger className="h-6 w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Attivo</SelectItem>
                    <SelectItem value="inactive">Inattivo</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                player.status === 'active' ? 'Attivo' : 'Inattivo'
              )}
            </Badge>
          </CardTitle>
          <CardDescription className="mt-1 flex items-center gap-2">
            {player.programs && player.programs.length > 0 ? (
              <span className="flex items-center">
                <Tag className="h-4 w-4 mr-1" />
                Programmi: {player.programs.length}
              </span>
            ) : player.program ? (
              <span className="flex items-center">
                <Tag className="h-4 w-4 mr-1" />
                Programma: {player.program}
              </span>
            ) : (
              <span className="text-gray-500">Nessun programma assegnato</span>
            )}
          </CardDescription>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={isEditing ? "default" : "outline"} 
            size="sm" 
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          >
            {isEditing ? (
              <>
                <Save className="h-4 w-4 mr-1" />
                Salva
              </>
            ) : (
              <>
                <Pencil className="h-4 w-4 mr-1" />
                Modifica
              </>
            )}
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose}>×</Button>
        </div>
      </div>
    </CardHeader>
  );
}
