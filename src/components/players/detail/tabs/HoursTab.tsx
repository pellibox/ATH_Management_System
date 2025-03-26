import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Clock, RotateCcw } from "lucide-react";
import { Player } from "@/types/player";
import { useEffect, useState, useCallback } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue,
  SelectGroup,
  SelectLabel
} from "@/components/ui/select";
import { PROGRAM_CATEGORIES } from "@/contexts/programs/constants";
import { calculateCustomProgramHours } from "@/types/player/programs";
import { EXCLUDED_PROGRAM_NAMES } from "@/contexts/programs/useProgramsState";
import { TENNIS_PROGRAMS } from "@/components/court-vision/constants";

interface HoursTabProps {
  player: Player;
  isEditing: boolean;
  handleInputChange: (field: keyof Player, value: any) => void;
  playerActivities: any[];
}

export function HoursTab({ player, isEditing, handleInputChange, playerActivities }: HoursTabProps) {
  const [programHours, setProgramHours] = useState(0);
  const [remainingHours, setRemainingHours] = useState(0);
  const [availablePrograms, setAvailablePrograms] = useState<{ 
    name: string; 
    category: string; 
    categoryLabel: string;
    sport: string; 
    weeklyHours: number; 
    totalWeeks: number 
  }[]>([]);
  const [filteredPrograms, setFilteredPrograms] = useState<typeof availablePrograms>([]);
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>(player.programs || []);
  const [selectedSports, setSelectedSports] = useState<string[]>(player.sports || []);
  
  const sports = ["Tennis", "Padel"];
  
  // Load available programs from TENNIS_PROGRAMS and PROGRAM_CATEGORIES
  // Using useCallback to prevent unnecessary rerenders
  const loadPrograms = useCallback(() => {
    const programs: { 
      name: string; 
      category: string;
      categoryLabel: string;
      sport: string; 
      weeklyHours: number; 
      totalWeeks: number 
    }[] = [];
    
    // Add programs from TENNIS_PROGRAMS which has the actual data shown on Programs page
    const allPerformancePrograms = TENNIS_PROGRAMS.PERFORMANCE || [];
    const allJuniorPrograms = TENNIS_PROGRAMS.JUNIOR || [];
    const allPersonalPrograms = TENNIS_PROGRAMS.PERSONAL || [];
    const allAdultPrograms = TENNIS_PROGRAMS.ADULT || [];
    const allCoachPrograms = TENNIS_PROGRAMS.COACH || [];
    const allPadelPrograms = TENNIS_PROGRAMS.PADEL || [];
    
    // Process the actual program data from the Tennis category
    [
      { data: allPerformancePrograms, category: "PERFORMANCE", label: "Performance", sport: "Tennis" },
      { data: allJuniorPrograms, category: "JUNIOR", label: "Junior Program", sport: "Tennis" },
      { data: allPersonalPrograms, category: "PERSONAL", label: "Personal Coaching", sport: "Tennis" },
      { data: allAdultPrograms, category: "ADULT", label: "Adulti", sport: "Tennis" },
      { data: allCoachPrograms, category: "COACH", label: "Coach Program", sport: "Tennis" },
      { data: allPadelPrograms, category: "PADEL", label: "Padel Program", sport: "Padel" }
    ].forEach(({data, category, label, sport}) => {
      if (data && Array.isArray(data)) {
        data.forEach(program => {
          if (!EXCLUDED_PROGRAM_NAMES.includes(program.name)) {
            const weeklyHours = program.weeklyHours || 0;
            const totalWeeks = program.totalWeeks || 30;
            
            programs.push({
              name: program.name,
              category: category.toLowerCase(),
              categoryLabel: label,
              sport: sport,
              weeklyHours: weeklyHours,
              totalWeeks: totalWeeks
            });
          }
        });
      }
    });
    
    // Add fallback programs if nothing was found
    if (programs.length === 0) {
      // Add fallback Tennis programs
      programs.push(
        {
          name: "Performance 2",
          category: "performance",
          categoryLabel: "Agonisti Performance",
          sport: "Tennis",
          weeklyHours: 6,
          totalWeeks: 40
        },
        {
          name: "Performance 3",
          category: "performance",
          categoryLabel: "Agonisti Performance",
          sport: "Tennis",
          weeklyHours: 9,
          totalWeeks: 40
        },
        {
          name: "Performance 4",
          category: "performance",
          categoryLabel: "Agonisti Performance",
          sport: "Tennis",
          weeklyHours: 12,
          totalWeeks: 40
        },
        {
          name: "Elite Performance",
          category: "performance",
          categoryLabel: "Agonisti Performance",
          sport: "Tennis",
          weeklyHours: 30,
          totalWeeks: 40
        },
        {
          name: "Tennis Junior",
          category: "junior",
          categoryLabel: "Junior Program",
          sport: "Tennis",
          weeklyHours: 3,
          totalWeeks: 30
        },
        {
          name: "Tennis Adult",
          category: "adult",
          categoryLabel: "Adulti",
          sport: "Tennis",
          weeklyHours: 4,
          totalWeeks: 20
        }
      );
      
      // Programmi Padel
      programs.push(
        {
          name: "Padel Base",
          category: "padel",
          categoryLabel: "Padel Program",
          sport: "Padel",
          weeklyHours: 4,
          totalWeeks: 20
        },
        {
          name: "Padel Avanzato",
          category: "padel",
          categoryLabel: "Padel Program",
          sport: "Padel",
          weeklyHours: 6,
          totalWeeks: 30
        }
      );
    }
    
    setAvailablePrograms(programs);
  }, []);
  
  // Run the loadPrograms function only once on component mount
  useEffect(() => {
    loadPrograms();
    
    // Clean up any potential memory leaks
    return () => {
      setAvailablePrograms([]);
      setFilteredPrograms([]);
    };
  }, [loadPrograms]);
  
  // Filter programs based on selected sports with proper dependency tracking
  useEffect(() => {
    if (selectedSports.length > 0 && availablePrograms.length > 0) {
      const filtered = availablePrograms.filter(program => 
        selectedSports.includes(program.sport)
      );
      setFilteredPrograms(filtered);
    } else {
      setFilteredPrograms(availablePrograms);
    }
  }, [selectedSports, availablePrograms]);
  
  // Update programs and sports from player data when player changes
  useEffect(() => {
    setSelectedPrograms(player.programs || []);
    setSelectedSports(player.sports || []);
  }, [player.programs, player.sports]);
  
  // Calculate total hours of selected programs with proper dependency tracking
  useEffect(() => {
    let totalProgramHours = 0;
    
    if (selectedPrograms && selectedPrograms.length > 0 && availablePrograms.length > 0) {
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
    
    // Calculate remaining hours, ensuring it doesn't go negative
    const remaining = Math.max(0, totalProgramHours - completedHours);
    setRemainingHours(remaining);
  }, [selectedPrograms, player.completedHours, availablePrograms]);

  // Calculate progress percentage, capping at 100% if completedHours exceeds programHours
  const hoursProgress = programHours > 0 
    ? Math.min(100, ((player.completedHours || 0) / programHours) * 100) 
    : 0;

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
  
  // Group programs by category for display in the select
  const programsByCategory = filteredPrograms.reduce((acc, program) => {
    if (!acc[program.category]) {
      acc[program.category] = {
        label: program.categoryLabel,
        programs: []
      };
    }
    acc[program.category].programs.push(program);
    return acc;
  }, {} as Record<string, { label: string, programs: typeof filteredPrograms }>);

  // Format display message for remaining hours and completion percentage
  const formatRemainingHours = () => {
    const completedHours = player.completedHours || 0;
    if (completedHours >= programHours) {
      // Program completed or exceeded
      const extraHours = completedHours - programHours;
      if (extraHours > 0) {
        return `+${extraHours.toFixed(1)} ore extra`;
      } else {
        return "Completato";
      }
    } else {
      // Still has hours to complete
      return `${remainingHours.toFixed(1)}`;
    }
  };

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
                      <div className="mb-2">
                        <Select
                          onValueChange={(value) => handleProgramSelect(value, true)}
                        >
                          <SelectTrigger className="bg-white text-black">
                            <SelectValue placeholder="Seleziona un programma" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            {Object.entries(programsByCategory).map(([category, { label, programs }]) => (
                              <SelectGroup key={category}>
                                <SelectLabel>{label}</SelectLabel>
                                {programs.map(program => (
                                  <SelectItem key={program.name} value={program.name}>
                                    {program.name} ({program.sport})
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
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
            <span>
              Ore rimanenti: <span className="font-medium">{formatRemainingHours()}</span>
            </span>
            <span>
              Completamento: <span className="font-medium">{Math.round(hoursProgress)}%</span>
            </span>
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

