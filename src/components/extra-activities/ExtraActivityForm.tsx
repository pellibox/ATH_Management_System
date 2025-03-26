
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { ExtraActivity, ACTIVITY_TYPES, generateId } from "@/types/extra-activities";
import { useToast } from "@/hooks/use-toast";

interface ExtraActivityFormProps {
  onAddActivity: (activity: ExtraActivity) => void;
  coachesList: Array<{ id: string; name: string }>;
}

export function ExtraActivityForm({ onAddActivity, coachesList }: ExtraActivityFormProps) {
  const { toast } = useToast();
  const [newActivity, setNewActivity] = useState<Omit<ExtraActivity, "id">>({
    name: "",
    type: "athletic",
    time: "16:00",
    duration: 1,
    days: [1], // Lunedì di default
    location: "",
    maxParticipants: 8,
    participants: [],
    coach: "",
    notes: ""
  });

  // Toggle giorno della settimana per una nuova attività
  const toggleDay = (day: number) => {
    setNewActivity(prev => {
      if (prev.days.includes(day)) {
        return { ...prev, days: prev.days.filter(d => d !== day) };
      } else {
        return { ...prev, days: [...prev.days, day] };
      }
    });
  };

  const handleAddActivity = () => {
    if (!newActivity.name || !newActivity.location || !newActivity.coach) {
      toast({
        title: "Errore",
        description: "Compila tutti i campi obbligatori",
        variant: "destructive"
      });
      return;
    }
    
    const newActivityWithId: ExtraActivity = {
      ...newActivity,
      id: generateId()
    };
    
    onAddActivity(newActivityWithId);
    
    toast({
      title: "Attività Aggiunta",
      description: `${newActivity.name} è stata aggiunta con successo`,
    });
    
    // Reset form
    setNewActivity({
      name: "",
      type: "athletic",
      time: "16:00",
      duration: 1,
      days: [1],
      location: "",
      maxParticipants: 8,
      participants: [],
      coach: "",
      notes: ""
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-ath-blue text-white hover:bg-ath-blue-dark transition-colors">
          <Plus className="h-4 w-4" />
          <span className="text-sm font-medium">Nuova Attività</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Crea Nuova Attività</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nome Attività*</label>
              <Input 
                value={newActivity.name} 
                onChange={(e) => setNewActivity({...newActivity, name: e.target.value})}
                placeholder="Es. Allenamento Atletico"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo Attività*</label>
              <Select 
                value={newActivity.type}
                onValueChange={(value) => setNewActivity({...newActivity, type: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona tipo" />
                </SelectTrigger>
                <SelectContent>
                  {ACTIVITY_TYPES.map(type => (
                    <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Orario*</label>
              <Select 
                value={newActivity.time}
                onValueChange={(value) => setNewActivity({...newActivity, time: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona orario" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 13 }, (_, i) => `${i + 8}:00`).map(time => (
                    <SelectItem key={time} value={time}>{time}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Durata (ore)*</label>
              <Select 
                value={newActivity.duration.toString()}
                onValueChange={(value) => setNewActivity({...newActivity, duration: parseFloat(value)})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona durata" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.5">30 minuti</SelectItem>
                  <SelectItem value="1">1 ora</SelectItem>
                  <SelectItem value="1.5">1 ora e 30 minuti</SelectItem>
                  <SelectItem value="2">2 ore</SelectItem>
                  <SelectItem value="2.5">2 ore e 30 minuti</SelectItem>
                  <SelectItem value="3">3 ore</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Giorni della Settimana*</label>
            <div className="flex flex-wrap gap-2">
              {[
                { day: 1, label: "Lun" },
                { day: 2, label: "Mar" },
                { day: 3, label: "Mer" },
                { day: 4, label: "Gio" },
                { day: 5, label: "Ven" },
                { day: 6, label: "Sab" },
                { day: 7, label: "Dom" }
              ].map(({ day, label }) => (
                <Button
                  key={day}
                  type="button"
                  size="sm"
                  variant={newActivity.days.includes(day) ? "default" : "outline"}
                  onClick={() => toggleDay(day)}
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Ubicazione*</label>
              <Input 
                value={newActivity.location} 
                onChange={(e) => setNewActivity({...newActivity, location: e.target.value})}
                placeholder="Es. Palestra"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Numero Max Partecipanti</label>
              <Input 
                type="number"
                min="1"
                value={newActivity.maxParticipants} 
                onChange={(e) => setNewActivity({...newActivity, maxParticipants: parseInt(e.target.value)})}
                placeholder="Es. 8"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Coach Responsabile*</label>
            <Select 
              value={newActivity.coach}
              onValueChange={(value) => setNewActivity({...newActivity, coach: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleziona coach" />
              </SelectTrigger>
              <SelectContent>
                {coachesList.map(coach => (
                  <SelectItem key={coach.id} value={coach.id}>{coach.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Note Aggiuntive</label>
            <Input 
              value={newActivity.notes || ""} 
              onChange={(e) => setNewActivity({...newActivity, notes: e.target.value})}
              placeholder="Es. Portare abbigliamento sportivo"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <DialogClose asChild>
            <Button variant="outline">Annulla</Button>
          </DialogClose>
          <Button onClick={handleAddActivity}>Aggiungi Attività</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
