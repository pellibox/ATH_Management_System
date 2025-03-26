
import { useState, useEffect } from "react";
import { Player } from "@/types/player";
import { 
  Card, 
  CardContent,
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { usePlayerContext } from "@/contexts/PlayerContext";
import { PlayerHeader } from "./PlayerHeader";
import { InfoTab } from "./tabs/InfoTab";
import { MedicalTab } from "./tabs/MedicalTab";
import { HoursTab } from "./tabs/HoursTab";
import { DocumentsTab } from "./tabs/DocumentsTab";

interface PlayerDetailCardProps {
  player: Player;
  onClose: () => void;
  extraActivities?: any[];
}

export function PlayerDetailCard({ player, onClose, extraActivities = [] }: PlayerDetailCardProps) {
  const [activeTab, setActiveTab] = useState("info");
  const [isEditing, setIsEditing] = useState(false);
  const [editedPlayer, setEditedPlayer] = useState<Player>({ ...player });
  
  const { players, setPlayers } = usePlayerContext();
  
  // When player prop changes, update the editedPlayer state
  useEffect(() => {
    setEditedPlayer({ ...player });
  }, [player]);
  
  // Get player's activities
  const playerActivities = extraActivities.filter(activity => 
    activity.participants?.includes(editedPlayer.id)
  );

  const handleInputChange = (field: keyof Player, value: any) => {
    setEditedPlayer(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedChange = (parent: keyof Player, field: string, value: any) => {
    const currentParentValue = editedPlayer[parent] || {};
    
    setEditedPlayer(prev => ({
      ...prev,
      [parent]: {
        ...currentParentValue,
        [field]: value
      }
    }));
  };

  const handleSave = () => {
    // Update player in the context
    setPlayers(players.map(p => 
      p.id === editedPlayer.id ? editedPlayer : p
    ));
    
    setIsEditing(false);
  };

  return (
    <Card className="w-full max-w-4xl">
      <PlayerHeader 
        player={editedPlayer}
        isEditing={isEditing}
        handleInputChange={handleInputChange}
        onClose={onClose}
        handleSave={handleSave}
        setIsEditing={setIsEditing}
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-2 mx-4">
          <TabsTrigger value="info">Info</TabsTrigger>
          <TabsTrigger value="medical">Sanitario</TabsTrigger>
          <TabsTrigger value="hours">Attività</TabsTrigger>
          <TabsTrigger value="documents">Documenti</TabsTrigger>
        </TabsList>
        
        <TabsContent value="info">
          <InfoTab 
            player={editedPlayer}
            isEditing={isEditing}
            handleInputChange={handleInputChange}
            handleNestedChange={handleNestedChange}
          />
        </TabsContent>
        
        <TabsContent value="medical">
          <MedicalTab 
            player={editedPlayer}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            handleNestedChange={handleNestedChange}
          />
        </TabsContent>
        
        <TabsContent value="hours">
          <HoursTab 
            player={editedPlayer}
            isEditing={isEditing}
            handleInputChange={handleInputChange}
            playerActivities={playerActivities}
          />
        </TabsContent>
        
        <TabsContent value="documents">
          <DocumentsTab player={editedPlayer} />
        </TabsContent>
      </Tabs>
      
      <CardFooter className="flex justify-end gap-2 pt-2">
        {isEditing ? (
          <>
            <Button variant="outline" onClick={() => {
              setEditedPlayer({...player});
              setIsEditing(false);
            }}>Annulla</Button>
            <Button onClick={handleSave}>Salva Modifiche</Button>
          </>
        ) : (
          <Button variant="outline" onClick={onClose}>Chiudi</Button>
        )}
      </CardFooter>
    </Card>
  );
}
