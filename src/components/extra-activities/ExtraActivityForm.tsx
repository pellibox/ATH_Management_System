
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExtraActivity, generateId } from "@/types/extra-activities";
import { useToast } from "@/hooks/use-toast";
import { ActivityFormFields } from "./form/ActivityFormFields";
import { ActivityFormActions } from "./form/ActivityFormActions";
import { getDefaultActivity, validateActivityForm } from "./form/activity-form-utils";

interface ExtraActivityFormProps {
  onAddActivity: (activity: ExtraActivity) => void;
  activityToEdit?: ExtraActivity | null;
  onEditActivity?: (id: string, activity: Partial<ExtraActivity>) => void;
  coachesList: Array<{ id: string; name: string }>;
  buttonLabel?: string;
  buttonIcon?: React.ReactNode;
  buttonVariant?: "default" | "outline" | "secondary" | "ghost";
}

export function ExtraActivityForm({ 
  onAddActivity, 
  activityToEdit = null,
  onEditActivity,
  coachesList,
  buttonLabel = "Nuova Attività",
  buttonIcon = <Plus className="h-4 w-4" />,
  buttonVariant = "default"
}: ExtraActivityFormProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [newActivity, setNewActivity] = useState<Omit<ExtraActivity, "id">>(getDefaultActivity());

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      if (activityToEdit) {
        // If we're editing, populate the form with activity data
        setNewActivity({
          name: activityToEdit.name || "",
          type: activityToEdit.type || "athletic",
          time: activityToEdit.time || "16:00",
          duration: activityToEdit.duration || 1,
          days: [...(activityToEdit.days || [1])],
          location: activityToEdit.location || "",
          maxParticipants: activityToEdit.maxParticipants || 8,
          participants: [...(activityToEdit.participants || [])],
          coach: activityToEdit.coach || "",
          notes: activityToEdit.notes || "",
          title: activityToEdit.title || "",
          date: activityToEdit.date || new Date().toISOString().split('T')[0],
          startTime: activityToEdit.startTime || "16:00",
          endTime: activityToEdit.endTime || "17:00"
        });
      } else {
        // Reset form for new activity
        setNewActivity(getDefaultActivity());
      }
    }
  }, [activityToEdit, open]);

  const handleSaveActivity = () => {
    const validation = validateActivityForm(newActivity);
    
    if (!validation.isValid) {
      toast({
        title: "Errore",
        description: validation.errors.join(", "),
        variant: "destructive"
      });
      return;
    }
    
    if (activityToEdit && onEditActivity) {
      // Edit existing activity
      onEditActivity(activityToEdit.id, newActivity);
    } else {
      // Add new activity
      const newActivityWithId: ExtraActivity = {
        ...newActivity,
        id: generateId()
      };
      
      onAddActivity(newActivityWithId);
    }
    
    // Close dialog and reset form
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={buttonVariant} className="flex items-center gap-2 px-3 py-2 rounded-lg text-white hover:bg-opacity-90 transition-colors">
          {buttonIcon}
          <span className="text-sm font-medium">{buttonLabel}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{activityToEdit ? "Modifica Attività" : "Crea Nuova Attività"}</DialogTitle>
        </DialogHeader>
        
        <ActivityFormFields 
          newActivity={newActivity} 
          setNewActivity={setNewActivity} 
          coachesList={coachesList} 
        />
        
        <ActivityFormActions 
          onCancel={() => setOpen(false)} 
          onSave={handleSaveActivity} 
          isEditing={!!activityToEdit} 
        />
      </DialogContent>
    </Dialog>
  );
}
