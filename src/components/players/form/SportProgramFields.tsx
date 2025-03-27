
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Player } from "@/types/player";
import { PROGRAM_CATEGORIES } from "@/contexts/programs/constants";
import { EXCLUDED_PROGRAM_NAMES } from "@/contexts/programs/useProgramsState";

interface SportProgramFieldsProps {
  formData: Player;
  selectedSport: string | null;
  setFormData: (data: Player) => void;
  handleSportChange: (sport: string, checked: boolean) => void;
}

export function SportProgramFields({ 
  formData, 
  selectedSport,
  setFormData, 
  handleSportChange 
}: SportProgramFieldsProps) {
  const [availablePrograms, setAvailablePrograms] = useState<{name: string, category: string}[]>([]);
  
  // Sports options
  const sports = ["Tennis", "Padel"];

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

  return (
    <>
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
            value={formData.program || "no-program"} 
            onValueChange={(value) => setFormData({...formData, program: value === "no-program" ? "" : value})}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleziona programma" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="no-program">Nessun programma</SelectItem>
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
    </>
  );
}
