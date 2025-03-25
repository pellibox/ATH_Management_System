
import { useState } from "react";
import { Users } from "lucide-react";
import { Person } from "./Person";
import { PersonData, Program } from "./types";
import { PERSON_TYPES } from "./constants";

export interface AvailablePeopleProps {
  people: PersonData[];
  programs?: Program[];
  onAddPerson: (person: {name: string, type: string}) => void;
  onRemovePerson: (id: string) => void;
}

export function AvailablePeople({ people, programs = [], onAddPerson, onRemovePerson }: AvailablePeopleProps) {
  const [newPerson, setNewPerson] = useState({ name: "", type: PERSON_TYPES.PLAYER });

  const handleAddPerson = () => {
    onAddPerson(newPerson);
    setNewPerson({ name: "", type: PERSON_TYPES.PLAYER });
  };

  return (
    <div className="bg-white rounded-xl shadow-soft p-4">
      <h2 className="font-medium mb-3 flex items-center">
        <Users className="h-4 w-4 mr-2" /> Available People
      </h2>
      
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-medium mb-2">Add New Person</h3>
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Name"
            className="w-full px-3 py-2 text-sm border rounded"
            value={newPerson.name}
            onChange={(e) => setNewPerson({ ...newPerson, name: e.target.value })}
          />
          <div className="flex space-x-2">
            <button
              className={`flex-1 text-xs py-1.5 rounded ${
                newPerson.type === PERSON_TYPES.PLAYER
                  ? "bg-ath-blue text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setNewPerson({ ...newPerson, type: PERSON_TYPES.PLAYER })}
            >
              Player
            </button>
            <button
              className={`flex-1 text-xs py-1.5 rounded ${
                newPerson.type === PERSON_TYPES.COACH
                  ? "bg-ath-orange text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setNewPerson({ ...newPerson, type: PERSON_TYPES.COACH })}
            >
              Coach
            </button>
          </div>
          <button
            className="w-full bg-green-500 text-white text-sm py-1.5 rounded hover:bg-green-600 transition-colors"
            onClick={handleAddPerson}
          >
            Add Person
          </button>
        </div>
      </div>

      <div className="max-h-[180px] overflow-y-auto">
        {people.length > 0 ? (
          people.map((person) => (
            <Person
              key={person.id}
              person={person}
              onRemove={() => onRemovePerson(person.id)}
            />
          ))
        ) : (
          <div className="text-sm text-gray-500 italic p-2">
            All people assigned to courts
          </div>
        )}
      </div>
    </div>
  );
}
