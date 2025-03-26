
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, Users } from "lucide-react";
import { PERSON_TYPES } from "./constants";

interface AddPersonFormProps {
  onAddPerson: (person: {name: string, type: string}) => void;
}

export function AddPersonForm({ onAddPerson }: AddPersonFormProps) {
  const [newPersonName, setNewPersonName] = useState("");
  
  const handleAddPerson = (type: string) => {
    if (newPersonName.trim() === "") return;
    
    onAddPerson({ 
      name: newPersonName, 
      type 
    });
    
    setNewPersonName("");
  };

  return (
    <div className="mb-4">
      <div className="flex space-x-2 mb-3">
        <Input 
          placeholder="Add new person..." 
          value={newPersonName}
          onChange={(e) => setNewPersonName(e.target.value)}
          className="text-sm"
        />
        <Button variant="outline" size="sm" onClick={() => handleAddPerson(PERSON_TYPES.PLAYER)}>
          <User className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Player</span>
        </Button>
        <Button variant="outline" size="sm" onClick={() => handleAddPerson(PERSON_TYPES.COACH)}>
          <Users className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Coach</span>
        </Button>
      </div>
    </div>
  );
}
