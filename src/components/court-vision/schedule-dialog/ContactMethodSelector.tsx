
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface ContactMethodSelectorProps {
  contactMethod: "WhatsApp" | "Email" | "Phone";
  setContactMethod: (method: "WhatsApp" | "Email" | "Phone") => void;
}

export function ContactMethodSelector({ 
  contactMethod, 
  setContactMethod 
}: ContactMethodSelectorProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Metodo di Invio</h3>
      <Select 
        value={contactMethod} 
        onValueChange={(value: any) => setContactMethod(value)}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="WhatsApp">WhatsApp</SelectItem>
          <SelectItem value="Email">Email</SelectItem>
          <SelectItem value="Phone">Chiamata Telefonica</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
