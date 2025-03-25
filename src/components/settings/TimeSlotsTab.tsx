
import { useState } from "react";
import { Clock, Plus, Trash, Edit, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function TimeSlotsTab() {
  const { toast } = useToast();
  const [timeSlots, setTimeSlots] = useState<string[]>([
    "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", 
    "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"
  ]);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [newTimeSlot, setNewTimeSlot] = useState<string>("");
  const [isAdding, setIsAdding] = useState<boolean>(false);
  
  const handleAddTimeSlot = () => {
    if (!newTimeSlot) {
      toast({
        title: "Error",
        description: "Please select a time",
        variant: "destructive",
      });
      return;
    }
    
    if (timeSlots.includes(newTimeSlot)) {
      toast({
        title: "Error",
        description: "This time slot already exists",
        variant: "destructive",
      });
      return;
    }
    
    setTimeSlots([...timeSlots, newTimeSlot].sort());
    setNewTimeSlot("");
    setIsAdding(false);
    
    toast({
      title: "Time Slot Added",
      description: `Time slot ${newTimeSlot} has been added`,
    });
  };
  
  const handleEditTimeSlot = (index: number) => {
    if (!newTimeSlot) {
      toast({
        title: "Error",
        description: "Please select a time",
        variant: "destructive",
      });
      return;
    }
    
    if (timeSlots.includes(newTimeSlot) && timeSlots[index] !== newTimeSlot) {
      toast({
        title: "Error",
        description: "This time slot already exists",
        variant: "destructive",
      });
      return;
    }
    
    const updatedTimeSlots = [...timeSlots];
    updatedTimeSlots[index] = newTimeSlot;
    setTimeSlots(updatedTimeSlots.sort());
    setNewTimeSlot("");
    setIsEditing(null);
    
    toast({
      title: "Time Slot Updated",
      description: `Time slot has been updated to ${newTimeSlot}`,
    });
  };
  
  const handleDeleteTimeSlot = (timeSlot: string) => {
    setTimeSlots(timeSlots.filter(t => t !== timeSlot));
    
    toast({
      title: "Time Slot Removed",
      description: `Time slot ${timeSlot} has been removed`,
    });
  };
  
  const startEdit = (index: number) => {
    setIsEditing(index);
    setNewTimeSlot(timeSlots[index]);
  };
  
  const cancelEdit = () => {
    setIsEditing(null);
    setNewTimeSlot("");
  };
  
  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Time Slots Management</h2>
        
        {isAdding ? (
          <div className="flex gap-2">
            <button
              onClick={handleAddTimeSlot}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-ath-blue text-white hover:bg-ath-blue-dark transition-colors text-sm"
            >
              <Check className="h-4 w-4" />
              <span>Save</span>
            </button>
            <button
              onClick={() => {
                setIsAdding(false);
                setNewTimeSlot("");
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors text-sm"
            >
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              setIsAdding(true);
              setIsEditing(null);
            }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-ath-blue text-white hover:bg-ath-blue-dark transition-colors text-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Add Time Slot</span>
          </button>
        )}
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {isAdding && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex flex-col">
              <div className="flex items-center mb-3">
                <Clock className="h-5 w-5 text-blue-500 mr-2" />
                <h3 className="font-medium">New Time Slot</h3>
              </div>
              <input
                type="time"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ath-blue/20 mb-3"
                value={newTimeSlot}
                onChange={(e) => setNewTimeSlot(e.target.value)}
              />
              <div className="flex justify-end mt-auto gap-2">
                <button
                  onClick={handleAddTimeSlot}
                  className="p-1.5 rounded-full hover:bg-blue-200"
                >
                  <Check className="w-4 h-4 text-blue-600" />
                </button>
                <button
                  onClick={() => {
                    setIsAdding(false);
                    setNewTimeSlot("");
                  }}
                  className="p-1.5 rounded-full hover:bg-gray-200"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          )}
          
          {timeSlots.map((timeSlot, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col hover:border-gray-300 transition-colors">
              {isEditing === index ? (
                <>
                  <div className="flex items-center mb-3">
                    <Clock className="h-5 w-5 text-blue-500 mr-2" />
                    <h3 className="font-medium">Edit Time Slot</h3>
                  </div>
                  <input
                    type="time"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ath-blue/20 mb-3"
                    value={newTimeSlot}
                    onChange={(e) => setNewTimeSlot(e.target.value)}
                  />
                  <div className="flex justify-end mt-auto gap-2">
                    <button
                      onClick={() => handleEditTimeSlot(index)}
                      className="p-1.5 rounded-full hover:bg-blue-200"
                    >
                      <Check className="w-4 h-4 text-blue-600" />
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="p-1.5 rounded-full hover:bg-gray-200"
                    >
                      <X className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center mb-2">
                    <Clock className="h-5 w-5 text-gray-500 mr-2" />
                    <h3 className="font-medium text-lg">{timeSlot}</h3>
                  </div>
                  <div className="flex justify-end mt-auto gap-2">
                    <button
                      onClick={() => startEdit(index)}
                      className="p-1.5 rounded-full hover:bg-gray-100"
                    >
                      <Edit className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => handleDeleteTimeSlot(timeSlot)}
                      className="p-1.5 rounded-full hover:bg-red-100"
                    >
                      <Trash className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
        
        {timeSlots.length === 0 && !isAdding && (
          <div className="text-center py-8">
            <p className="text-gray-500">No time slots defined</p>
            <button
              onClick={() => setIsAdding(true)}
              className="mt-2 text-ath-blue hover:text-ath-blue-dark"
            >
              Add your first time slot
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
