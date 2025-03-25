import { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useToast } from "@/hooks/use-toast";
import { ChartBar, Users, User } from "lucide-react";

// Court types and their properties
const COURT_TYPES = {
  TENNIS_CLAY: "tennis-clay",
  TENNIS_HARD: "tennis-hard",
  PADEL: "padel",
  PICKLEBALL: "pickleball",
  TOUCH_TENNIS: "touch-tennis",
};

// Draggable person types
const PERSON_TYPES = {
  PLAYER: "player",
  COACH: "coach",
};

interface CourtProps {
  id: string;
  type: string;
  name: string;
  number: number;
  occupants: PersonData[];
}

interface PersonData {
  id: string;
  name: string;
  type: string;
  courtId?: string;
}

// Draggable Person component
const Person = ({ person, onRemove }: { person: PersonData; onRemove: () => void }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: person.type,
    item: { id: person.id, type: person.type, name: person.name },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`flex items-center p-2 rounded-md mb-1 ${
        isDragging ? "opacity-40" : "opacity-100"
      } ${person.type === PERSON_TYPES.PLAYER ? "bg-ath-blue-light" : "bg-orange-100"}`}
    >
      {person.type === PERSON_TYPES.PLAYER ? (
        <User className="h-4 w-4 mr-2" />
      ) : (
        <Users className="h-4 w-4 mr-2" />
      )}
      <span className="text-sm">{person.name}</span>
      <button
        onClick={onRemove}
        className="ml-auto text-gray-500 hover:text-red-500"
        aria-label="Remove person"
      >
        ×
      </button>
    </div>
  );
};

// Court component
const Court = ({ court, onDrop }: { court: CourtProps; onDrop: (courtId: string, person: PersonData) => void }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: [PERSON_TYPES.PLAYER, PERSON_TYPES.COACH],
    drop: (item: PersonData) => onDrop(court.id, item),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const getCourtStyles = () => {
    switch (court.type) {
      case COURT_TYPES.TENNIS_CLAY:
        return "bg-ath-clay/20 border-ath-clay";
      case COURT_TYPES.TENNIS_HARD:
        return "bg-ath-hard/20 border-ath-hard";
      case COURT_TYPES.PADEL:
        return "bg-ath-grass/20 border-ath-grass";
      case COURT_TYPES.PICKLEBALL:
        return "bg-yellow-100 border-yellow-400";
      case COURT_TYPES.TOUCH_TENNIS:
        return "bg-purple-100 border-purple-400";
      default:
        return "bg-gray-100 border-gray-300";
    }
  };

  const getCourtLabel = () => {
    const type = court.type.split("-");
    const surface = type.length > 1 ? ` (${type[1]})` : "";
    return `${type[0].charAt(0).toUpperCase() + type[0].slice(1)}${surface}`;
  };

  return (
    <div
      ref={drop}
      className={`relative rounded-lg border-2 ${getCourtStyles()} ${
        isOver ? "ring-2 ring-ath-blue" : ""
      } transition-all h-44 sm:h-56 flex flex-col`}
    >
      <div className="absolute top-2 left-2 right-2 flex justify-between items-center">
        <span className="text-xs font-medium bg-white/80 px-2 py-1 rounded">
          {court.name} #{court.number}
        </span>
        <span className="text-xs bg-white/80 px-2 py-1 rounded">{getCourtLabel()}</span>
      </div>

      {/* Court markings */}
      <div className="flex-1 flex items-center justify-center relative">
        {(court.type === COURT_TYPES.TENNIS_CLAY || court.type === COURT_TYPES.TENNIS_HARD) && (
          <div className="w-3/4 h-3/4 border border-white/70 relative flex items-center justify-center">
            <div className="absolute left-0 right-0 h-[1px] bg-white/70"></div>
            <div className="absolute top-0 bottom-0 w-[1px] bg-white/70"></div>
          </div>
        )}
        
        {court.type === COURT_TYPES.PADEL && (
          <div className="w-3/4 h-3/4 border border-white/70 relative">
            <div className="absolute left-0 right-0 top-1/3 h-[1px] bg-white/70"></div>
            <div className="absolute inset-0 border-4 border-transparent border-b-white/70 -mb-4"></div>
          </div>
        )}
        
        {court.type === COURT_TYPES.PICKLEBALL && (
          <div className="w-2/3 h-3/4 border border-white/70 relative">
            <div className="absolute left-0 right-0 top-1/3 bottom-1/3 border-t border-b border-white/70"></div>
          </div>
        )}
        
        {court.type === COURT_TYPES.TOUCH_TENNIS && (
          <div className="w-2/3 h-2/3 border border-white/70 relative">
            <div className="absolute left-0 right-0 h-[1px] top-1/2 bg-white/70"></div>
          </div>
        )}
      </div>

      {/* Court occupants */}
      <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/5 max-h-20 overflow-y-auto">
        {court.occupants.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {court.occupants.map((person) => (
              <div
                key={person.id}
                className={`text-xs px-2 py-1 rounded-full ${
                  person.type === PERSON_TYPES.PLAYER
                    ? "bg-blue-100 text-blue-800"
                    : "bg-orange-100 text-orange-800"
                }`}
              >
                {person.name}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-xs text-gray-500 italic">Empty court</div>
        )}
      </div>
    </div>
  );
};

export default function CourtVision() {
  const { toast } = useToast();
  const [courts, setCourts] = useState<CourtProps[]>([
    // Tennis courts (6) - alternating clay and hard
    { id: "court1", type: COURT_TYPES.TENNIS_CLAY, name: "Tennis", number: 1, occupants: [] },
    { id: "court2", type: COURT_TYPES.TENNIS_HARD, name: "Tennis", number: 2, occupants: [] },
    { id: "court3", type: COURT_TYPES.TENNIS_CLAY, name: "Tennis", number: 3, occupants: [] },
    { id: "court4", type: COURT_TYPES.TENNIS_HARD, name: "Tennis", number: 4, occupants: [] },
    { id: "court5", type: COURT_TYPES.TENNIS_CLAY, name: "Tennis", number: 5, occupants: [] },
    { id: "court6", type: COURT_TYPES.TENNIS_HARD, name: "Tennis", number: 6, occupants: [] },
    // Padel courts (2)
    { id: "padel1", type: COURT_TYPES.PADEL, name: "Padel", number: 1, occupants: [] },
    { id: "padel2", type: COURT_TYPES.PADEL, name: "Padel", number: 2, occupants: [] },
    // Pickleball court
    { id: "pickleball", type: COURT_TYPES.PICKLEBALL, name: "Pickleball", number: 1, occupants: [] },
    // Touch tennis court
    { id: "touch", type: COURT_TYPES.TOUCH_TENNIS, name: "Touch Tennis", number: 1, occupants: [] },
  ]);

  const [people, setPeople] = useState<PersonData[]>([
    { id: "player1", name: "Alex Smith", type: PERSON_TYPES.PLAYER },
    { id: "player2", name: "Emma Johnson", type: PERSON_TYPES.PLAYER },
    { id: "player3", name: "Michael Brown", type: PERSON_TYPES.PLAYER },
    { id: "player4", name: "Sophia Davis", type: PERSON_TYPES.PLAYER },
    { id: "player5", name: "James Wilson", type: PERSON_TYPES.PLAYER },
    { id: "player6", name: "Olivia Moore", type: PERSON_TYPES.PLAYER },
    { id: "coach1", name: "Coach Anderson", type: PERSON_TYPES.COACH },
    { id: "coach2", name: "Coach Martinez", type: PERSON_TYPES.COACH },
    { id: "coach3", name: "Coach Thompson", type: PERSON_TYPES.COACH },
  ]);

  const [newPerson, setNewPerson] = useState({ name: "", type: PERSON_TYPES.PLAYER });

  const handleDrop = (courtId: string, person: PersonData) => {
    // Find the person in our list (could be from another court)
    const draggablePerson = people.find((p) => p.id === person.id) || 
                            courts.flatMap(c => c.occupants).find(p => p.id === person.id);
    
    if (!draggablePerson) return;

    // If moving from another court, remove from old court
    const updatedCourts = courts.map((court) => {
      if (court.id !== courtId && court.occupants.some((p) => p.id === person.id)) {
        return {
          ...court,
          occupants: court.occupants.filter((p) => p.id !== person.id),
        };
      }
      return court;
    });

    // Move to new court
    const targetCourtIndex = updatedCourts.findIndex((court) => court.id === courtId);
    
    if (targetCourtIndex !== -1) {
      // Check if person is already on this court
      if (!updatedCourts[targetCourtIndex].occupants.some(p => p.id === person.id)) {
        updatedCourts[targetCourtIndex] = {
          ...updatedCourts[targetCourtIndex],
          occupants: [
            ...updatedCourts[targetCourtIndex].occupants,
            { ...draggablePerson, courtId },
          ],
        };
      }
    }

    // Remove from available people list if it's coming from there
    setPeople(people.filter((p) => p.id !== person.id));
    setCourts(updatedCourts);

    toast({
      title: "Person Assigned",
      description: `${draggablePerson.name} has been assigned to ${courts.find(c => c.id === courtId)?.name} #${courts.find(c => c.id === courtId)?.number}`,
    });
  };

  const handleRemovePerson = (personId: string) => {
    // Add back to available list
    const personToRemove = courts.flatMap(c => c.occupants).find(p => p.id === personId);
    
    if (personToRemove) {
      setPeople([...people, { ...personToRemove, courtId: undefined }]);
      
      // Remove from court
      setCourts(
        courts.map((court) => ({
          ...court,
          occupants: court.occupants.filter((p) => p.id !== personId),
        }))
      );

      toast({
        title: "Person Removed",
        description: `${personToRemove.name} has been removed from the court`,
      });
    }
  };

  const handleAddPerson = () => {
    if (newPerson.name.trim() === "") {
      toast({
        title: "Error",
        description: "Please enter a name",
        variant: "destructive",
      });
      return;
    }

    const newId = `${newPerson.type}-${Date.now()}`;
    const personToAdd = {
      id: newId,
      name: newPerson.name,
      type: newPerson.type,
    };

    setPeople([...people, personToAdd]);
    setNewPerson({ name: "", type: PERSON_TYPES.PLAYER });

    toast({
      title: "Person Added",
      description: `${personToAdd.name} has been added to the available list`,
    });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="max-w-7xl mx-auto animate-fade-in p-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Court Vision</h1>
          <p className="text-gray-600 mt-1">Drag and drop players and coaches to assign them to courts</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left sidebar - Available people */}
          <div className="md:col-span-3 lg:col-span-2 bg-white rounded-xl shadow-soft p-4">
            <h2 className="font-medium mb-3 flex items-center">
              <Users className="h-4 w-4 mr-2" /> Available People
            </h2>
            
            {/* Add new person form */}
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

            <div className="max-h-[calc(100vh-320px)] overflow-y-auto">
              {people.length > 0 ? (
                people.map((person) => (
                  <Person
                    key={person.id}
                    person={person}
                    onRemove={() => handleRemovePerson(person.id)}
                  />
                ))
              ) : (
                <div className="text-sm text-gray-500 italic p-2">
                  All people assigned to courts
                </div>
              )}
            </div>
          </div>

          {/* Courts grid */}
          <div className="md:col-span-9 lg:col-span-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {courts.map((court) => (
                <Court key={court.id} court={court} onDrop={handleDrop} />
              ))}
            </div>
            
            {/* Color legend */}
            <div className="mt-6 p-3 bg-white rounded-lg shadow-sm">
              <h3 className="text-sm font-medium mb-2">Court Types</h3>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-ath-clay mr-1.5"></span>
                  <span className="text-xs text-gray-600">Tennis (Clay)</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-ath-hard mr-1.5"></span>
                  <span className="text-xs text-gray-600">Tennis (Hard)</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-ath-grass mr-1.5"></span>
                  <span className="text-xs text-gray-600">Padel</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-yellow-400 mr-1.5"></span>
                  <span className="text-xs text-gray-600">Pickleball</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-purple-400 mr-1.5"></span>
                  <span className="text-xs text-gray-600">Touch Tennis</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}
