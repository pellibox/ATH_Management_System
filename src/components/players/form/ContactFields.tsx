
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Player } from "@/types/player";

interface ContactFieldsProps {
  formData: Player;
  setFormData: (data: Player) => void;
}

export function ContactFields({ formData, setFormData }: ContactFieldsProps) {
  return (
    <>
      <div className="space-y-2">
        <label className="text-sm font-medium">Telefono</label>
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
        <label className="text-sm font-medium">Data iscrizione</label>
        <Input 
          type="date" 
          value={formData.joinDate} 
          onChange={(e) => setFormData({...formData, joinDate: e.target.value})}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Metodo di contatto preferito</label>
        <Select
          value={formData.preferredContactMethod || "Email"}
          onValueChange={(value) => setFormData({
            ...formData, 
            preferredContactMethod: value as any
          })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Metodo di contatto" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="WhatsApp">WhatsApp</SelectItem>
            <SelectItem value="Email">Email</SelectItem>
            <SelectItem value="Phone">Telefono</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
}
