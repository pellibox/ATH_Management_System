
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";
import { PlayerProvider } from "@/contexts/PlayerContext";
import { usePlayerContext } from "@/contexts/PlayerContext";
import { PlayerFilters } from "@/components/players/PlayerFilters";
import { PlayerList } from "@/components/players/PlayerList";
import { ScheduleMessage } from "@/components/players/ScheduleMessage";
import { PlayerForm } from "@/components/players/PlayerForm";
import { PlayerObjectives } from "@/components/players/PlayerObjectives";

function PlayersContent() {
  const { editingPlayer, messagePlayer, handleAddPlayer, handleUpdatePlayer } = usePlayerContext();
  
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Users className="mr-3 h-8 w-8" />
            Gestione Giocatori
          </h1>
          <p className="text-gray-600 mt-1">
            Gestisci e monitora tutti i giocatori registrati nell'accademia
          </p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              Nuovo Giocatore
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <PlayerForm
              buttonText="Aggiungi Giocatore"
              handleSave={handleAddPlayer}
            />
          </DialogContent>
        </Dialog>
      </div>
      
      <PlayerFilters />
      <PlayerList />
      
      {editingPlayer && (
        <Dialog open={!!editingPlayer} onOpenChange={(open) => !open && null}>
          <DialogContent className="sm:max-w-[600px]">
            <PlayerForm buttonText="Aggiorna Giocatore" handleSave={handleUpdatePlayer} />
          </DialogContent>
        </Dialog>
      )}
      
      {messagePlayer && (
        <Dialog open={!!messagePlayer} onOpenChange={(open) => !open && null}>
          <DialogContent className="sm:max-w-[600px]">
            <ScheduleMessage />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default function Players() {
  return (
    <PlayerProvider>
      <PlayersContent />
    </PlayerProvider>
  );
}
