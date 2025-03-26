
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface RecipientSelectorProps {
  recipientType: "players" | "coaches" | "both";
  setRecipientType: (value: "players" | "coaches" | "both") => void;
}

export function RecipientSelector({ recipientType, setRecipientType }: RecipientSelectorProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Destinatari</h3>
      <Tabs value={recipientType} onValueChange={(v: any) => setRecipientType(v)}>
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="players">Solo Giocatori</TabsTrigger>
          <TabsTrigger value="coaches">Solo Allenatori</TabsTrigger>
          <TabsTrigger value="both">Entrambi</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
