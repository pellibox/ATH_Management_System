
import { Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

interface AddCoachDialogProps {
  newCoach: {
    name: string;
    email: string;
    phone: string;
    sportTypes: string[];
  };
  setNewCoach: (coach: {
    name: string;
    email: string;
    phone: string;
    sportTypes: string[];
  }) => void;
  handleAddCoach: () => void;
  toggleSportType: (sport: string) => void;
  allSportTypes: string[];
}

export function AddCoachDialog({
  newCoach,
  setNewCoach,
  handleAddCoach,
  toggleSportType,
  allSportTypes
}: AddCoachDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-ath-blue text-white hover:bg-ath-blue-dark transition-colors">
          <Plus className="h-4 w-4" />
          <span className="text-sm font-medium">Aggiungi Allenatore</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Aggiungi Nuovo Allenatore</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nome</label>
            <Input 
              value={newCoach.name} 
              onChange={(e) => setNewCoach({...newCoach, name: e.target.value})}
              placeholder="Nome Cognome"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input 
              type="email" 
              value={newCoach.email} 
              onChange={(e) => setNewCoach({...newCoach, email: e.target.value})}
              placeholder="allenatore@esempio.com"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Telefono</label>
            <Input 
              value={newCoach.phone} 
              onChange={(e) => setNewCoach({...newCoach, phone: e.target.value})}
              placeholder="+39 123 456 7890"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Sport</label>
            <div className="flex flex-wrap gap-2">
              {allSportTypes.map(sport => (
                <Button
                  key={sport}
                  type="button"
                  size="sm"
                  variant={newCoach.sportTypes.includes(sport) ? "default" : "outline"}
                  onClick={() => toggleSportType(sport)}
                  className="capitalize"
                >
                  {newCoach.sportTypes.includes(sport) && <Check className="mr-1 h-3 w-3" />}
                  {sport}
                </Button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <DialogClose asChild>
            <Button variant="outline">Annulla</Button>
          </DialogClose>
          <Button onClick={handleAddCoach} disabled={!newCoach.name}>Aggiungi</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
