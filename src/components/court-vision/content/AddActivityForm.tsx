
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AddActivityFormProps {
  onAddActivity: (activityData: {name: string, type: string, duration: string}) => void;
  onCancel: () => void;
}

export function AddActivityForm({ onAddActivity, onCancel }: AddActivityFormProps) {
  const [activityName, setActivityName] = useState("");
  const [activityType, setActivityType] = useState("gruppo");
  const [activityDuration, setActivityDuration] = useState("1h");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activityName.trim()) {
      onAddActivity({
        name: activityName,
        type: activityType,
        duration: activityDuration
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome Attività</Label>
        <Input
          id="name"
          value={activityName}
          onChange={(e) => setActivityName(e.target.value)}
          placeholder="Es. Lezione Tennis"
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type">Tipo</Label>
          <Select value={activityType} onValueChange={setActivityType}>
            <SelectTrigger id="type">
              <SelectValue placeholder="Seleziona tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="individuale">Individuale</SelectItem>
              <SelectItem value="gruppo">Gruppo</SelectItem>
              <SelectItem value="torneo">Torneo</SelectItem>
              <SelectItem value="evento">Evento</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="duration">Durata</Label>
          <Select value={activityDuration} onValueChange={setActivityDuration}>
            <SelectTrigger id="duration">
              <SelectValue placeholder="Seleziona durata" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30m">30 minuti</SelectItem>
              <SelectItem value="1h">1 ora</SelectItem>
              <SelectItem value="1h30m">1.5 ore</SelectItem>
              <SelectItem value="2h">2 ore</SelectItem>
              <SelectItem value="3h">3 ore</SelectItem>
              <SelectItem value="4h">4 ore</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annulla
        </Button>
        <Button type="submit" className="bg-ath-blue hover:bg-ath-blue/90">
          Aggiungi
        </Button>
      </div>
    </form>
  );
}
