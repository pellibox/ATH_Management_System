
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
import { Checkbox } from "@/components/ui/checkbox";
import { PROGRAM_CATEGORIES } from "@/contexts/programs/constants";
import { EXCLUDED_PROGRAM_NAMES } from "@/contexts/programs/useProgramsState";

interface PlayerFormProps {
  buttonText: string;
  handleSave: (playerData?: Omit<Player, "id">) => void;
}

export function PlayerForm({ buttonText, handleSave }: PlayerFormProps) {
  const { editingPlayer, newPlayer, setNewPlayer, players } = usePlayerContext();
  const [formData, setFormData] = useState(editingPlayer || newPlayer);
  const [selectedSport, setSelectedSport] = useState<string | null>(null);
  const [availablePrograms, setAvailablePrograms] = useState<{name: string, category: string}[]>([]);

  // Sports options
  const sports = ["Tennis", "Padel"];

  // Update form data when editing player changes
  useEffect(() => {
    setFormData(editingPlayer || newPlayer);
    
    // Set selected sport based on player's sports
    if ((editingPlayer || newPlayer).sports && (editingPlayer || newPlayer).sports.length > 0) {
      setSelectedSport((editingPlayer || newPlayer).sports[0]);
    }
  }, [editingPlayer, newPlayer]);

  // Get programs based on selected sport
  useEffect(() => {
    if (selectedSport) {
      const sportPrograms: {name: string, category: string}[] = [];
      
      // Combine all program categories into a structured array for the selected sport
      Object.keys(PROGRAM_CATEGORIES).forEach(categoryKey => {
        const category = PROGRAM_CATEGORIES[categoryKey];
        
        // Check if category.programs exists before iterating
        if (category && category.programs && Array.isArray(category.programs)) {
          category.programs.forEach(program => {
            // Only include programs for the selected sport that aren't excluded
            if (
              (!program.sport || program.sport === selectedSport) && 
              !EXCLUDED_PROGRAM_NAMES.includes(program.name)
            ) {
              sportPrograms.push({
                name: program.name,
                category: categoryKey
              });
            }
          });
        }
      });
      
      setAvailablePrograms(sportPrograms);
    } else {
      setAvailablePrograms([]);
    }
  }, [selectedSport]);

  const handleSubmit = () => {
    if (editingPlayer) {
      // For editing existing player
      handleSave();
    } else {
      // For adding new player
      handleSave(formData);
    }
  };

  const handleSportChange = (sport: string, checked: boolean) => {
    let newSports;
    const currentSports = formData.sports || [];
    
    if (checked) {
      newSports = [...currentSports, sport];
      // Set as selected sport if first sport or no sport is selected
      if (!selectedSport) {
        setSelectedSport(sport);
      }
    } else {
      newSports = currentSports.filter(s => s !== sport);
      // If removing the selected sport, clear or update selectedSport
      if (selectedSport === sport) {
        setSelectedSport(newSports.length > 0 ? newSports[0] : null);
      }
    }
    
    setFormData({...formData, sports: newSports});
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
          <SelectContent className="bg-white">
            <SelectItem value="Male">Maschio</SelectItem>
            <SelectItem value="Female">Femmina</SelectItem>
            <SelectItem value="Other">Altro</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2 col-span-2">
        <label className="text-sm font-medium">Sport</label>
        <div className="grid grid-cols-2 gap-2">
          {sports.map(sport => (
            <div key={sport} className="flex items-center space-x-2">
              <Checkbox 
                id={`sport-${sport}`}
                checked={formData.sports?.includes(sport)}
                onCheckedChange={(checked) => handleSportChange(sport, !!checked)}
              />
              <label 
                htmlFor={`sport-${sport}`}
                className="text-sm cursor-pointer"
              >
                {sport}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      <div className="space-y-2 col-span-2">
        <label className="text-sm font-medium">Programma</label>
        {selectedSport ? (
          <Select 
            value={formData.program || ""} 
            onValueChange={(value) => setFormData({...formData, program: value})}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleziona programma" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="">Nessun programma</SelectItem>
              {availablePrograms.map(program => (
                <SelectItem key={program.name} value={program.name}>
                  {program.name} ({program.category})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <div className="text-sm text-gray-500 p-3 border rounded-md">
            Nessun programma disponibile. Seleziona uno sport prima.
          </div>
        )}
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
          <SelectContent className="bg-white">
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
