
import { useState, useEffect, useCallback, memo } from "react";
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
import { usePlayerContext } from "@/contexts/player/PlayerContext";
import { PlayerHeader } from "./PlayerHeader";
import { InfoTab } from "./tabs/InfoTab";
import { MedicalTab } from "./tabs/MedicalTab";
import { HoursTab } from "./tabs/HoursTab";
import { DocumentsTab } from "./tabs/DocumentsTab";
import { useToast } from "@/hooks/use-toast";

interface PlayerDetailCardProps {
  player: Player;
  onClose: () => void;
  extraActivities?: any[];
}

// Memorizziamo il componente di scheda per evitare re-render non necessari
export const PlayerDetailCard = memo(({ player, onClose, extraActivities = [] }: PlayerDetailCardProps) => {
  const [activeTab, setActiveTab] = useState("info");
  const [isEditing, setIsEditing] = useState(false);
  const [editedPlayer, setEditedPlayer] = useState<Player>({ ...player });
  
  const { players, setPlayers, handleUpdatePlayer } = usePlayerContext();
  const { toast } = useToast();
  
  // When player prop changes, update the editedPlayer state
  useEffect(() => {
    // Crea una copia profonda del player per evitare modifiche indesiderate
    setEditedPlayer(JSON.parse(JSON.stringify(player)));
  }, [player]);

  // Clean up state when component unmounts
  useEffect(() => {
    return () => {
      setIsEditing(false);
    };
  }, []);
  
  // Utilizziamo useCallback per ottimizzare le funzioni
  const handleInputChange = useCallback((field: keyof Player, value: any) => {
    setEditedPlayer(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleNestedChange = useCallback((parent: keyof Player, field: string, value: any) => {
    setEditedPlayer(prev => {
      const currentParentValue = prev[parent] || {};
      
      return {
        ...prev,
        [parent]: {
          ...currentParentValue,
          [field]: value
        }
      };
    });
  }, []);

  const handleSave = useCallback(() => {
    try {
      // Implementiamo una verifica di cambio effettivo per evitare update inutili
      const hasChanged = JSON.stringify(player) !== JSON.stringify(editedPlayer);
      
      if (!hasChanged) {
        setIsEditing(false);
        return;
      }
      
      // Use the context's update function if available, otherwise update directly
      if (handleUpdatePlayer) {
        // Utilizziamo setTimeout per evitare blocchi dell'interfaccia
        setTimeout(() => {
          handleUpdatePlayer(editedPlayer);
        }, 50);
      } else {
        // Update player in the context with batch update
        setPlayers(prevPlayers => 
          prevPlayers.map(p => p.id === editedPlayer.id ? editedPlayer : p)
        );
      }
      
      toast({
        title: "Giocatore aggiornato",
        description: `${editedPlayer.name} è stato aggiornato con successo`,
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving player:", error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante il salvataggio",
        variant: "destructive"
      });
    }
  }, [player, editedPlayer, handleUpdatePlayer, setPlayers, toast]);

  // Get player's activities - memorizziamo il calcolo per evitare elaborazioni ripetute
  const playerActivities = extraActivities.filter(activity => 
    activity.participants?.includes(editedPlayer.id)
  );

  return (
    <Card className="w-full max-w-4xl bg-white">
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
});

PlayerDetailCard.displayName = 'PlayerDetailCard';
