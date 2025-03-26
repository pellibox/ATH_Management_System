import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Clock, RotateCcw } from "lucide-react";
import { Player } from "@/types/player";
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectLabel } from "@/components/ui/select";
import { PROGRAM_CATEGORIES } from "@/contexts/programs/constants";
import { calculateCustomProgramHours } from "@/types/player/programs";
import { EXCLUDED_PROGRAM_NAMES } from "@/contexts/programs/useProgramsState";

interface HoursTabProps {
  player: Player;
  isEditing: boolean;
  handleInputChange: (field: keyof Player, value: any) => void;
  playerActivities: any[];
}

export function HoursTab({ player, isEditing, handleInputChange, playerActivities }: HoursTabProps) {
  const [programHours, setProgramHours] = useState(0);
  const [remainingHours, setRemainingHours] = useState(0);
  const [availablePrograms, setAvailablePrograms] = useState<{ name: string; category: string; sport: string; weeklyHours: number; totalWeeks: number }[]>([]);
  const [filteredPrograms, setFilteredPrograms] = useState<{ name: string; category: string; sport: string; weeklyHours: number; totalWeeks: number }[]>([]);
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>(player.programs || []);
  const [selectedSports, setSelectedSports] = useState<string[]>(player.sports || []);
  
  const sports = ["Tennis", "Padel"];
  
  useEffect(() => {
    const programs: { 
      name: string; 
      category: string; 
      sport: string; 
      weeklyHours: number; 
      totalWeeks: number 
    }[] = [];
    
    Object.keys(PROGRAM_CATEGORIES).forEach(categoryKey => {
      const category = PROGRAM_CATEGORIES[categoryKey];
      
      if (category && category.programs && Array.isArray(category.programs)) {
        category.programs.forEach(program => {
          if (!EXCLUDED_PROGRAM_NAMES.includes(program.name)) {
            programs.push({
              name: program.name,
              category: categoryKey,
              sport: program.sport || "Tennis",
              weeklyHours: program.weeklyHours || 0,
              totalWeeks: program.totalWeeks || 0
            });
          }
        });
      }
    });
    
    setAvailablePrograms(programs);
    setFilteredPrograms(programs);
  }, []);
  
  useEffect(() => {
    if (selectedSports.length > 0) {
      const filtered = availablePrograms.filter(program => 
        selectedSports.includes(program.sport)
      );
      setFilteredPrograms(filtered);
    } else {
      setFilteredPrograms(availablePrograms);
    }
  }, [selectedSports, availablePrograms]);
  
  useEffect(() => {
    setSelectedPrograms(player.programs || []);
    setSelectedSports(player.sports || []);
  }, [player.programs, player.sports]);
  
  useEffect(() => {
    let totalProgramHours = 0;
    
    if (selectedPrograms && selectedPrograms.length > 0) {
      selectedPrograms.forEach(programName => {
        const foundProgram = availablePrograms.find(p => p.name === programName);
        
        if (foundProgram) {
          const hours = calculateCustomProgramHours(
            foundProgram.totalWeeks,
            foundProgram.weeklyHours / foundProgram.totalWeeks,
            1
          );
          totalProgramHours += hours;
        }
      });
    }
    
    const completedHours = player.completedHours || 0;
    setProgramHours(totalProgramHours);
    setRemainingHours(totalProgramHours - completedHours);
  }, [selectedPrograms, player.completedHours, availablePrograms]);

  const hoursProgress = programHours > 0 ? ((programHours - remainingHours) / programHours) * 100 : 0;

  const getProgramDetails = (programName: string) => {
    const program = availablePrograms.find(p => p.name === programName);
    if (program) {
      return {
        weeklyHours: program.weeklyHours,
        totalWeeks: program.totalWeeks,
        totalHours: calculateCustomProgramHours(
          program.totalWeeks,
          program.weeklyHours / program.totalWeeks,
          1
        )
      };
    }
    return null;
  };
  
  const handleSportSelect = (sport: string, isSelected: boolean) => {
    let updatedSports: string[] = [...selectedSports];
    
    if (isSelected) {
      if (!updatedSports.includes(sport)) {
        updatedSports.push(sport);
      }
    } else {
      updatedSports = updatedSports.filter(name => name !== sport);
    }
    
    setSelectedSports(updatedSports);
    handleInputChange('sports', updatedSports);
  };
  
  const handleProgramSelect = (programName: string, isSelected: boolean) => {
    let updatedPrograms: string[] = [...selectedPrograms];
    
    if (isSelected) {
      if (!updatedPrograms.includes(programName)) {
        updatedPrograms.push(programName);
      }
    } else {
      updatedPrograms = updatedPrograms.filter(name => name !== programName);
    }
    
    setSelectedPrograms(updatedPrograms);
    handleInputChange('programs', updatedPrograms);
  };
  
  const programsByCategory = filteredPrograms.reduce((acc, program) => {
    if (!acc[program.category]) {
      acc[program.category] = [];
    }
    acc[program.category].push(program);
    return acc;
  }, {} as Record<string, typeof filteredPrograms>);

  return (
    <CardContent className="p-4 pt-2">
      <div className="space-y-5">
        <div>
          <h3 className="text-base font-medium">Programma e Attività</h3>
          <p className="text-sm text-gray-500">Gestione del programma e monitoraggio delle ore di attività</p>
          
          <div className="mt-3 mb-5">
            <label className="text-sm font-medium block mb-1">Programmi</label>
            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  {sports.map(sport => (
                    <div key={sport} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`sport-${sport}`}
                        checked={selectedSports.includes(sport)}
                        onCheckedChange={(checked) => handleSportSelect(sport, !!checked)}
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
                
                {selectedSports.length > 0 ? (
                  <div className="space-y-3 border rounded-lg p-3">
                    <label className="text-sm font-medium">Programmi disponibili</label>
                    {Object.keys(programsByCategory).length > 0 ? (
                      <Select
                        value=""
                        onValueChange={(value) => handleProgramSelect(value, true)}
                      >
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Seleziona un programma" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          {Object.entries(programsByCategory).map(([category, programs]) => (
                            <SelectLabel key={category} className="font-bold">
                              {category.charAt(0).toUpperCase() + category.slice(1)}
                            </SelectLabel>
                          ))}
                          {Object.entries(programsByCategory).flatMap(([category, programs]) =>
                            programs.map(program => (
                              <SelectItem key={program.name} value={program.name} className="pl-6">
                                {program.name} ({program.sport})
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="text-sm text-gray-500 p-3 border rounded-md">
                        Nessun programma disponibile per gli sport selezionati.
                      </div>
                    )}
                    
                    {selectedPrograms.length > 0 && (
                      <div className="mt-3">
                        <label className="text-sm font-medium block mb-2">Programmi selezionati</label>
                        <div className="space-y-2">
                          {selectedPrograms.map(programName => {
                            const programDetails = getProgramDetails(programName);
                            const program = availablePrograms.find(p => p.name === programName);
                            return (
                              <div key={programName} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                                <div className="flex items-center">
                                  <span className="text-sm font-medium">{programName}</span>
                                  {program && <span className="ml-2 text-xs text-gray-500">({program.sport})</span>}
                                </div>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-7 w-7 p-0" 
                                  onClick={() => handleProgramSelect(programName, false)}
                                >
                                  ×
                                </Button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 p-3 border rounded-md">
                    Seleziona almeno uno sport per visualizzare i programmi disponibili.
                  </div>
                )}
                
                {selectedPrograms.length > 0 && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setSelectedPrograms([]);
                      handleInputChange('programs', []);
                    }}
                    title="Rimuovi tutti i programmi"
                  >
                    <RotateCcw className="h-3 w-3 mr-1" />
                    Rimuovi Tutti
                  </Button>
                )}
              </div>
            ) : (
              <div className="text-sm">
                {player.programs && player.programs.length > 0 ? (
                  <div className="space-y-1">
                    {player.programs.map(programName => {
                      const details = getProgramDetails(programName);
                      return (
                        <div key={programName} className="flex items-center">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                            {programName}
                          </span>
                          {details && (
                            <span className="ml-2 text-gray-600">
                              ({details.totalWeeks} settimane, {details.weeklyHours} ore totali, {details.totalHours.toFixed(1)} ore)
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <span className="text-gray-500">Nessun programma assegnato</span>
                )}
                
                {player.sports && player.sports.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    <span className="text-xs text-gray-500 mr-1">Sport:</span>
                    {player.sports.map(sport => (
                      <Badge key={sport} variant="outline" className="text-xs">
                        {sport}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm">Ore di attività completate</span>
            {isEditing ? (
              <Input
                type="number"
                value={player.completedHours || 0}
                onChange={(e) => handleInputChange('completedHours', parseFloat(e.target.value) || 0)}
                className="h-7 w-24"
              />
            ) : (
              <span className="text-sm font-medium">{(player.completedHours || 0).toFixed(1)} / {programHours.toFixed(1)} ore</span>
            )}
          </div>
          <Progress value={hoursProgress} className="h-2" />
          <div className="flex justify-between text-sm">
            <span>Ore rimanenti: <span className="font-medium">{remainingHours.toFixed(1)}</span></span>
            <span>Completamento: <span className="font-medium">{Math.round(hoursProgress)}%</span></span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-xs text-gray-500">Ore Allenamento</p>
            {isEditing ? (
              <Input
                type="number"
                value={player.trainingHours || 0}
                onChange={(e) => handleInputChange('trainingHours', parseFloat(e.target.value) || 0)}
                className="h-7 w-full mt-1"
              />
            ) : (
              <p className="font-medium text-lg">{(player.trainingHours || 0).toFixed(1)}</p>
            )}
          </div>
          
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-xs text-gray-500">Ore Extra</p>
            {isEditing ? (
              <Input
                type="number"
                value={player.extraHours || 0}
                onChange={(e) => handleInputChange('extraHours', parseFloat(e.target.value) || 0)}
                className="h-7 w-full mt-1"
              />
            ) : (
              <p className="font-medium text-lg">{(player.extraHours || 0).toFixed(1)}</p>
            )}
          </div>
          
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-xs text-gray-500">Ore Assenze</p>
            {isEditing ? (
              <Input
                type="number"
                value={player.missedHours || 0}
                onChange={(e) => handleInputChange('missedHours', parseFloat(e.target.value) || 0)}
                className="h-7 w-full mt-1"
              />
            ) : (
              <p className="font-medium text-lg">{(player.missedHours || 0).toFixed(1)}</p>
            )}
          </div>
        </div>
        
        {playerActivities.length > 0 && (
          <div>
            <h3 className="text-base font-medium mb-2">Ultime Attività</h3>
            <div className="space-y-2">
              {playerActivities.slice(0, 5).map(activity => (
                <div key={activity.id} className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{activity.name}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {activity.date} • {activity.duration} ore
                  </div>
                </div>
              ))}
            </div>
            
            {playerActivities.length > 5 && (
              <Button variant="link" className="mt-2 h-auto p-0">
                Vedi tutte ({playerActivities.length})
              </Button>
            )}
          </div>
        )}
      </div>
    </CardContent>
  );
}
