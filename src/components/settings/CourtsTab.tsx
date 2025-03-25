
import { useState } from "react";
import { Layers, Edit, Trash, Plus, Check, X } from "lucide-react";
import { COURT_TYPES } from "@/components/court-vision/constants";
import { useToast } from "@/hooks/use-toast";

interface CourtData {
  id: string;
  name: string;
  type: string;
  number: number;
}

export default function CourtsTab() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [newCourtName, setNewCourtName] = useState("");
  const [newCourtType, setNewCourtType] = useState("");
  const [newCourtNumber, setNewCourtNumber] = useState("");
  
  const [courts, setCourts] = useState<CourtData[]>([
    { id: "court1", type: COURT_TYPES.TENNIS_CLAY, name: "Center Court", number: 1 },
    { id: "court2", type: COURT_TYPES.TENNIS_CLAY, name: "Tennis", number: 2 },
    { id: "court3", type: COURT_TYPES.TENNIS_CLAY, name: "Tennis", number: 3 },
    { id: "court5", type: COURT_TYPES.TENNIS_HARD, name: "Tennis", number: 5 },
    { id: "court6", type: COURT_TYPES.TENNIS_HARD, name: "Tennis", number: 6 },
    { id: "padel1", type: COURT_TYPES.PADEL, name: "Padel", number: 1 },
    { id: "padel2", type: COURT_TYPES.PADEL, name: "Padel", number: 2 },
  ]);
  
  const startEdit = (court: CourtData) => {
    setIsEditing(court.id);
    setNewCourtName(court.name);
    setNewCourtType(court.type);
    setNewCourtNumber(court.number.toString());
  };
  
  const cancelEdit = () => {
    setIsEditing(null);
    setNewCourtName("");
    setNewCourtType("");
    setNewCourtNumber("");
  };
  
  const saveCourt = (id: string) => {
    if (!newCourtName || !newCourtType || !newCourtNumber) {
      toast({
        title: "Error",
        description: "All fields are required",
        variant: "destructive",
      });
      return;
    }
    
    const number = parseInt(newCourtNumber);
    if (isNaN(number) || number < 1) {
      toast({
        title: "Error",
        description: "Court number must be a positive integer",
        variant: "destructive",
      });
      return;
    }
    
    setCourts(courts.map(court => 
      court.id === id 
        ? { ...court, name: newCourtName, type: newCourtType, number }
        : court
    ));
    
    setIsEditing(null);
    toast({
      title: "Court Updated",
      description: `Court ${newCourtName} #${number} has been updated`,
    });
  };
  
  const handleAddCourt = () => {
    if (!newCourtName || !newCourtType || !newCourtNumber) {
      toast({
        title: "Error",
        description: "All fields are required",
        variant: "destructive",
      });
      return;
    }
    
    const number = parseInt(newCourtNumber);
    if (isNaN(number) || number < 1) {
      toast({
        title: "Error",
        description: "Court number must be a positive integer",
        variant: "destructive",
      });
      return;
    }
    
    const newId = `court-${Date.now()}`;
    setCourts([...courts, {
      id: newId,
      name: newCourtName,
      type: newCourtType,
      number: number
    }]);
    
    setIsEditing(null);
    setNewCourtName("");
    setNewCourtType("");
    setNewCourtNumber("");
    
    toast({
      title: "Court Added",
      description: `Court ${newCourtName} #${number} has been added`,
    });
  };
  
  const handleDeleteCourt = (id: string) => {
    setCourts(courts.filter(court => court.id !== id));
    toast({
      title: "Court Deleted",
      description: "The court has been deleted",
    });
  };
  
  const getCourtTypeColor = (type: string) => {
    switch (type) {
      case COURT_TYPES.TENNIS_CLAY:
        return "bg-red-500";
      case COURT_TYPES.TENNIS_HARD:
        return "bg-black";
      case COURT_TYPES.PADEL:
        return "bg-green-500";
      case COURT_TYPES.PICKLEBALL:
        return "bg-blue-500";
      case COURT_TYPES.TOUCH_TENNIS:
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };
  
  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Court Management</h2>
        
        {isEditing === "new" ? (
          <div className="flex gap-2">
            <button
              onClick={handleAddCourt}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-ath-blue text-white hover:bg-ath-blue-dark transition-colors text-sm"
            >
              <Check className="h-4 w-4" />
              <span>Save</span>
            </button>
            <button
              onClick={cancelEdit}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors text-sm"
            >
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              setIsEditing("new");
              setNewCourtName("");
              setNewCourtType(COURT_TYPES.TENNIS_CLAY);
              setNewCourtNumber("");
            }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-ath-blue text-white hover:bg-ath-blue-dark transition-colors text-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Add Court</span>
          </button>
        )}
      </div>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Type</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Name</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Number</th>
              <th className="text-right py-3 px-4 font-medium text-gray-600 text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isEditing === "new" && (
              <tr className="border-b bg-blue-50">
                <td className="py-3 px-4">
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ath-blue/20 bg-white"
                    value={newCourtType}
                    onChange={(e) => setNewCourtType(e.target.value)}
                  >
                    <option value="">Select Type</option>
                    <option value={COURT_TYPES.TENNIS_CLAY}>Tennis (Clay)</option>
                    <option value={COURT_TYPES.TENNIS_HARD}>Tennis (Hard)</option>
                    <option value={COURT_TYPES.PADEL}>Padel</option>
                    <option value={COURT_TYPES.PICKLEBALL}>Pickleball</option>
                    <option value={COURT_TYPES.TOUCH_TENNIS}>Touch Tennis</option>
                  </select>
                </td>
                <td className="py-3 px-4">
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ath-blue/20"
                    placeholder="Court Name"
                    value={newCourtName}
                    onChange={(e) => setNewCourtName(e.target.value)}
                  />
                </td>
                <td className="py-3 px-4">
                  <input
                    type="number"
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ath-blue/20"
                    placeholder="Court Number"
                    value={newCourtNumber}
                    onChange={(e) => setNewCourtNumber(e.target.value)}
                  />
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex justify-end space-x-2">
                    <button
                      className="p-1.5 rounded-full hover:bg-blue-200"
                      onClick={handleAddCourt}
                    >
                      <Check className="w-4 h-4 text-blue-600" />
                    </button>
                    <button
                      className="p-1.5 rounded-full hover:bg-gray-200"
                      onClick={cancelEdit}
                    >
                      <X className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </td>
              </tr>
            )}
            
            {courts.map((court) => (
              <tr key={court.id} className="border-b hover:bg-gray-50">
                {isEditing === court.id ? (
                  <>
                    <td className="py-3 px-4">
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ath-blue/20 bg-white"
                        value={newCourtType}
                        onChange={(e) => setNewCourtType(e.target.value)}
                      >
                        <option value={COURT_TYPES.TENNIS_CLAY}>Tennis (Clay)</option>
                        <option value={COURT_TYPES.TENNIS_HARD}>Tennis (Hard)</option>
                        <option value={COURT_TYPES.PADEL}>Padel</option>
                        <option value={COURT_TYPES.PICKLEBALL}>Pickleball</option>
                        <option value={COURT_TYPES.TOUCH_TENNIS}>Touch Tennis</option>
                      </select>
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ath-blue/20"
                        value={newCourtName}
                        onChange={(e) => setNewCourtName(e.target.value)}
                      />
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="number"
                        min="1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ath-blue/20"
                        value={newCourtNumber}
                        onChange={(e) => setNewCourtNumber(e.target.value)}
                      />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <button
                          className="p-1.5 rounded-full hover:bg-blue-200"
                          onClick={() => saveCourt(court.id)}
                        >
                          <Check className="w-4 h-4 text-blue-600" />
                        </button>
                        <button
                          className="p-1.5 rounded-full hover:bg-gray-200"
                          onClick={cancelEdit}
                        >
                          <X className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <div className={`h-4 w-4 rounded-full ${getCourtTypeColor(court.type)}`}></div>
                        <span>{court.type}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">{court.name}</td>
                    <td className="py-3 px-4">{court.number}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <button
                          className="p-1.5 rounded-full hover:bg-gray-200"
                          onClick={() => startEdit(court)}
                        >
                          <Edit className="w-4 h-4 text-gray-600" />
                        </button>
                        <button
                          className="p-1.5 rounded-full hover:bg-red-100"
                          onClick={() => handleDeleteCourt(court.id)}
                        >
                          <Trash className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
