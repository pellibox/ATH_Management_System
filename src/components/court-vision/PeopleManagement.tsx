
import { useState } from "react";
import { Users, User } from "lucide-react";
import { PERSON_TYPES } from "./constants";
import { PersonData } from "./types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Card,
} from "@/components/ui/card";

interface PeopleManagementProps {
  playersList: PersonData[];
  coachesList: PersonData[];
  onAddPerson: (person: PersonData) => void;
  onRemovePerson: (person: PersonData) => void;
  onAddToDragArea: (person: PersonData) => void;
}

export function PeopleManagement({ 
  playersList, 
  coachesList, 
  onAddPerson, 
  onRemovePerson, 
  onAddToDragArea 
}: PeopleManagementProps) {
  const [showAddPersonDialog, setShowAddPersonDialog] = useState(false);
  const [showManagePeopleDialog, setShowManagePeopleDialog] = useState(false);
  const [newPerson, setNewPerson] = useState({ name: "", type: PERSON_TYPES.PLAYER });

  const handleAddPerson = () => {
    const id = `${newPerson.type === PERSON_TYPES.PLAYER ? 'player' : 'coach'}-${Date.now()}`;
    onAddPerson({
      id,
      name: newPerson.name,
      type: newPerson.type
    });
    setNewPerson({ name: "", type: PERSON_TYPES.PLAYER });
    setShowAddPersonDialog(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-soft p-4">
      <h2 className="font-medium mb-3 flex items-center">
        <Users className="h-4 w-4 mr-2" /> People Management
      </h2>
      
      <div className="flex flex-col space-y-2">
        <Dialog open={showAddPersonDialog} onOpenChange={setShowAddPersonDialog}>
          <DialogTrigger asChild>
            <Button variant="default" className="w-full">
              Add New Person
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Person</DialogTitle>
              <DialogDescription>
                Add a new player or coach to the system
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Enter name"
                  value={newPerson.name}
                  onChange={(e) => setNewPerson({ ...newPerson, name: e.target.value })}
                />
              </div>
              
              <div className="grid gap-2">
                <Label>Type</Label>
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant={newPerson.type === PERSON_TYPES.PLAYER ? "default" : "outline"}
                    onClick={() => setNewPerson({ ...newPerson, type: PERSON_TYPES.PLAYER })}
                    className="flex-1"
                  >
                    <User className="mr-1.5 h-4 w-4" />
                    Player
                  </Button>
                  <Button
                    type="button"
                    variant={newPerson.type === PERSON_TYPES.COACH ? "default" : "outline"}
                    onClick={() => setNewPerson({ ...newPerson, type: PERSON_TYPES.COACH })}
                    className="flex-1"
                  >
                    <Users className="mr-1.5 h-4 w-4" />
                    Coach
                  </Button>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" onClick={handleAddPerson}>Add Person</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <Dialog open={showManagePeopleDialog} onOpenChange={setShowManagePeopleDialog}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              Manage People
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Manage Players & Coaches</DialogTitle>
              <DialogDescription>
                View and manage all people in the system
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4 max-h-[400px] overflow-y-auto">
              <h3 className="font-medium mb-2 flex items-center">
                <User className="h-4 w-4 mr-1.5" /> Players
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
                {playersList.map((player) => (
                  <Card key={player.id} className="overflow-hidden">
                    <div className="flex justify-between items-center p-3">
                      <div>
                        <p className="font-medium text-sm truncate">{player.name}</p>
                      </div>
                      <div className="flex space-x-1">
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => onAddToDragArea(player)}
                        >
                          Assign
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => onRemovePerson(player)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              
              <h3 className="font-medium mb-2 flex items-center">
                <Users className="h-4 w-4 mr-1.5" /> Coaches
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {coachesList.map((coach) => (
                  <Card key={coach.id} className="overflow-hidden">
                    <div className="flex justify-between items-center p-3">
                      <div>
                        <p className="font-medium text-sm truncate">{coach.name}</p>
                      </div>
                      <div className="flex space-x-1">
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => onAddToDragArea(coach)}
                        >
                          Assign
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => onRemovePerson(coach)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
