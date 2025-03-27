
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Player } from "@/types/player";

interface BasicInfoFieldsProps {
  formData: Player;
  setFormData: (data: Player) => void;
}

export function BasicInfoFields({ formData, setFormData }: BasicInfoFieldsProps) {
  return (
    <>
      <div className="space-y-2">
        <label className="text-sm font-medium">Nome</label>
        <Input 
          value={formData.name} 
          onChange={(e) => setFormData({...formData, name: e.target.value})}
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Età</label>
        <Input 
          type="number" 
          value={formData.age || ''} 
          onChange={(e) => setFormData({...formData, age: parseInt(e.target.value) || 0})}
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Genere</label>
        <Select 
          value={formData.gender} 
          onValueChange={(value) => setFormData({...formData, gender: value as any})}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleziona genere" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="Male">Maschio</SelectItem>
            <SelectItem value="Female">Femmina</SelectItem>
            <SelectItem value="Other">Altro</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
}
