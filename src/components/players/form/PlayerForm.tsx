
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { usePlayerContext } from "@/contexts/PlayerContext";
import { Player } from "@/types/player";
import { BasicInfoFields } from "./BasicInfoFields";
import { SportProgramFields } from "./SportProgramFields";
import { ContactFields } from "./ContactFields";
import { NotesField } from "./NotesField";

interface PlayerFormProps {
  buttonText: string;
  handleSave: (playerData?: Player) => void;
}

export function PlayerForm({ buttonText, handleSave }: PlayerFormProps) {
  const { editingPlayer, newPlayer } = usePlayerContext();
  const [formData, setFormData] = useState<Player>(editingPlayer || newPlayer);
  const [selectedSport, setSelectedSport] = useState<string | null>(null);

  // Update form data when editing player changes
  useEffect(() => {
    setFormData(editingPlayer || newPlayer);
    
    // Set selected sport based on player's sports
    if ((editingPlayer || newPlayer).sports && (editingPlayer || newPlayer).sports.length > 0) {
      setSelectedSport((editingPlayer || newPlayer).sports[0]);
    }
  }, [editingPlayer, newPlayer]);

  const handleSubmit = () => {
    if (editingPlayer) {
      // For editing existing player
      handleSave(formData);
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
      <BasicInfoFields 
        formData={formData} 
        setFormData={setFormData} 
      />
      
      <SportProgramFields 
        formData={formData}
        selectedSport={selectedSport}
        setFormData={setFormData}
        handleSportChange={handleSportChange}
      />
      
      <ContactFields 
        formData={formData} 
        setFormData={setFormData} 
      />
      
      <NotesField 
        formData={formData} 
        setFormData={setFormData} 
      />
      
      <div className="flex justify-end gap-2 col-span-2">
        <DialogClose asChild>
          <Button variant="outline">Annulla</Button>
        </DialogClose>
        <Button onClick={handleSubmit} disabled={!formData.name}>{buttonText}</Button>
      </div>
    </div>
  );
}
