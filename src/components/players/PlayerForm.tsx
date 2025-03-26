
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { usePlayerContext } from "@/contexts/PlayerContext";
import { Player } from "@/types/player";

interface PlayerFormProps {
  buttonText: string;
  handleSave: (playerData?: Omit<Player, "id">) => void;
}

export function PlayerForm({ buttonText, handleSave }: PlayerFormProps) {
  const { editingPlayer, newPlayer, setNewPlayer, players } = usePlayerContext();
  const [formData, setFormData] = useState(editingPlayer || newPlayer);

  // Get all unique programs
  const programs = Array.from(
    new Set(players.filter(p => p.program).map(p => p.program))
  );

  // Update form data when editing player changes
  useEffect(() => {
    setFormData(editingPlayer || newPlayer);
  }, [editingPlayer, newPlayer]);

  const handleSubmit = () => {
    if (editingPlayer) {
      // For editing existing player
      handleSave();
    } else {
      // For adding new player
      handleSave(formData);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4 py-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Nome</label>
        <Input 
          value={formData.name} 
          onChange={(e) => setFormData({...formData, name: e.target.value})}
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Età</label>
        <Input 
          type="number" 
          value={formData.age || ''} 
          onChange={(e) => setFormData({...formData, age: parseInt(e.target.value) || 0})}
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Genere</label>
        <Select 
          value={formData.gender} 
          onValueChange={(value) => setFormData({...formData, gender: value as any})}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleziona genere" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Male">Maschio</SelectItem>
            <SelectItem value="Female">Femmina</SelectItem>
            <SelectItem value="Other">Altro</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Programma</label>
        <Select 
          value={formData.program || ""} 
          onValueChange={(value) => setFormData({...formData, program: value})}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleziona programma" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Nessun programma</SelectItem>
            {programs.map(program => (
              <SelectItem key={program} value={program}>{program}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Telefono</label>
        <Input 
          value={formData.phone} 
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
          placeholder="+1 (555) 123-4567"
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Email</label>
        <Input 
          type="email" 
          value={formData.email} 
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          placeholder="player@example.com"
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Data iscrizione</label>
        <Input 
          type="date" 
          value={formData.joinDate} 
          onChange={(e) => setFormData({...formData, joinDate: e.target.value})}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Metodo di contatto preferito</label>
        <Select
          value={formData.preferredContactMethod}
          onValueChange={(value) => setFormData({
            ...formData, 
            preferredContactMethod: value as any
          })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Metodo di contatto" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="WhatsApp">WhatsApp</SelectItem>
            <SelectItem value="Email">Email</SelectItem>
            <SelectItem value="Phone">Telefono</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2 col-span-2">
        <label className="text-sm font-medium">Note</label>
        <textarea 
          className="w-full p-2 border rounded-md text-sm min-h-[80px]"
          value={formData.notes} 
          onChange={(e) => setFormData({...formData, notes: e.target.value})}
          placeholder="Note sul giocatore, requisiti speciali, etc."
        />
      </div>
      
      <div className="flex justify-end gap-2 col-span-2">
        <DialogClose asChild>
          <Button variant="outline">Annulla</Button>
        </DialogClose>
        <Button onClick={handleSubmit} disabled={!formData.name}>{buttonText}</Button>
      </div>
    </div>
  );
}
