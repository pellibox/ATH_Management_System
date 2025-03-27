
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export function useTimeSlots() {
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

  return {
    timeSlots,
    isEditing,
    newTimeSlot,
    isAdding,
    setIsAdding,
    setNewTimeSlot,
    setIsEditing,
    handleAddTimeSlot,
    handleEditTimeSlot,
    handleDeleteTimeSlot,
    startEdit,
    cancelEdit
  };
}
