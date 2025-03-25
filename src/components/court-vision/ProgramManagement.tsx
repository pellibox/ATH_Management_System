
import { useState } from "react";
import { Plus, Trash2, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Program } from "./types";
import { PROGRAM_COLORS, DEFAULT_PROGRAMS } from "./constants";

interface ProgramManagementProps {
  programs: Program[];
  onAddProgram: (program: Program) => void;
  onRemoveProgram: (programId: string) => void;
}

export function ProgramManagement({
  programs,
  onAddProgram,
  onRemoveProgram
}: ProgramManagementProps) {
  const { toast } = useToast();
  const [newProgramName, setNewProgramName] = useState("");
  const [newProgramColor, setNewProgramColor] = useState(PROGRAM_COLORS.RED);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newProgramName.trim() === "") {
      toast({
        title: "Errore",
        description: "Inserisci un nome per il programma",
        variant: "destructive",
      });
      return;
    }

    const newProgram: Program = {
      id: `program-${Date.now()}`,
      name: newProgramName,
      color: newProgramColor,
    };

    onAddProgram(newProgram);
    setNewProgramName("");
    setShowAddForm(false);
    
    toast({
      title: "Programma Aggiunto",
      description: `${newProgramName} è stato aggiunto`,
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-soft p-4 mb-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-base font-medium">Programmi</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1 bg-ath-black text-white px-2 py-1 rounded text-xs hover:bg-ath-black-light transition-colors"
        >
          <Plus className="h-3 w-3" />
          <span>Nuovo</span>
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Nome</label>
              <input
                type="text"
                value={newProgramName}
                onChange={(e) => setNewProgramName(e.target.value)}
                className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                placeholder="Nome del programma"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Colore</label>
              <div className="flex flex-wrap gap-1">
                {Object.values(PROGRAM_COLORS).map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`w-6 h-6 rounded-full border-2 ${
                      newProgramColor === color ? "border-black" : "border-transparent"
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setNewProgramColor(color)}
                  >
                    {newProgramColor === color && (
                      <Check className="h-3 w-3 text-white" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="mr-2 px-2 py-1 border border-gray-300 rounded text-xs hover:bg-gray-100 transition-colors"
            >
              Annulla
            </button>
            <button
              type="submit"
              className="px-2 py-1 bg-ath-black text-white rounded text-xs hover:bg-ath-black-light transition-colors"
            >
              Aggiungi
            </button>
          </div>
        </form>
      )}

      <div className="space-y-2 max-h-[150px] overflow-y-auto">
        {programs.map((program) => (
          <div 
            key={program.id}
            className="flex items-center justify-between p-2 rounded-md bg-gray-50 hover:bg-gray-100"
          >
            <div className="flex items-center">
              <div
                className="w-4 h-4 rounded-full mr-2"
                style={{ backgroundColor: program.color }}
              ></div>
              <span className="text-sm">{program.name}</span>
            </div>
            <button
              onClick={() => onRemoveProgram(program.id)}
              className="text-gray-400 hover:text-red-500"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
