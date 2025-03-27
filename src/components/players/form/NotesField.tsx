
import { Player } from "@/types/player";

interface NotesFieldProps {
  formData: Player;
  setFormData: (data: Player) => void;
}

export function NotesField({ formData, setFormData }: NotesFieldProps) {
  return (
    <div className="space-y-2 col-span-2">
      <label className="text-sm font-medium">Note</label>
      <textarea 
        className="w-full p-2 border rounded-md text-sm min-h-[80px]"
        value={formData.notes} 
        onChange={(e) => setFormData({...formData, notes: e.target.value})}
        placeholder="Note sul giocatore, requisiti speciali, etc."
      />
    </div>
  );
}
