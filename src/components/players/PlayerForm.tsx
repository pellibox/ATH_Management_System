
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { usePlayerContext } from "@/contexts/PlayerContext";

interface PlayerFormProps {
  buttonText: string;
  handleSave: () => void;
}

export function PlayerForm({ buttonText, handleSave }: PlayerFormProps) {
  const { editingPlayer, newPlayer, setNewPlayer, handleAddPlayer } = usePlayerContext();
  const [formData, setFormData] = useState(editingPlayer || newPlayer);

  // Update form data when editing player changes
  useEffect(() => {
    setFormData(editingPlayer || newPlayer);
  }, [editingPlayer, newPlayer]);

  const handleSubmit = () => {
    if (editingPlayer) {
      // For editing existing player
      handleSave();
    } else {
      // For adding new player
      handleAddPlayer(formData);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4 py-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Name</label>
        <Input 
          value={formData.name} 
          onChange={(e) => setFormData({...formData, name: e.target.value})}
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Age</label>
        <Input 
          type="number" 
          value={formData.age || ''} 
          onChange={(e) => setFormData({...formData, age: parseInt(e.target.value) || 0})}
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Gender</label>
        <Select 
          value={formData.gender} 
          onValueChange={(value) => setFormData({...formData, gender: value as any})}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Male">Male</SelectItem>
            <SelectItem value="Female">Female</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Level</label>
        <Select 
          value={formData.level} 
          onValueChange={(value) => setFormData({...formData, level: value as any})}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Beginner">Beginner</SelectItem>
            <SelectItem value="Intermediate">Intermediate</SelectItem>
            <SelectItem value="Advanced">Advanced</SelectItem>
            <SelectItem value="Professional">Professional</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Coach</label>
        <Input 
          value={formData.coach} 
          onChange={(e) => setFormData({...formData, coach: e.target.value})}
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Phone</label>
        <Input 
          value={formData.phone} 
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
          placeholder="+1 (555) 123-4567"
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Email</label>
        <Input 
          type="email" 
          value={formData.email} 
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          placeholder="player@example.com"
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Join Date</label>
        <Input 
          type="date" 
          value={formData.joinDate} 
          onChange={(e) => setFormData({...formData, joinDate: e.target.value})}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Preferred Contact Method</label>
        <Select
          value={formData.preferredContactMethod}
          onValueChange={(value) => setFormData({
            ...formData, 
            preferredContactMethod: value as any
          })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Contact Method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="WhatsApp">WhatsApp</SelectItem>
            <SelectItem value="Email">Email</SelectItem>
            <SelectItem value="Phone">Phone</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2 col-span-2">
        <label className="text-sm font-medium">Notes</label>
        <textarea 
          className="w-full p-2 border rounded-md text-sm min-h-[80px]"
          value={formData.notes} 
          onChange={(e) => setFormData({...formData, notes: e.target.value})}
          placeholder="Player notes, special requirements, etc."
        />
      </div>
      
      <div className="flex justify-end gap-2 col-span-2">
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
        <Button onClick={handleSubmit} disabled={!formData.name}>{buttonText}</Button>
      </div>
    </div>
  );
}
