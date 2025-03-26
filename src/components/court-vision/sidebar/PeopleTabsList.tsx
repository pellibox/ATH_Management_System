
import { User, UserCog } from "lucide-react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PeopleTabsListProps {
  activeTab: string;
}

export function PeopleTabsList({ activeTab }: PeopleTabsListProps) {
  return (
    <TabsList className="grid w-full grid-cols-2 mb-3">
      <TabsTrigger value="players" className="text-xs">
        <User className="h-3 w-3 mr-1" /> <span>Giocatori</span>
      </TabsTrigger>
      <TabsTrigger value="coaches" className="text-xs">
        <UserCog className="h-3 w-3 mr-1" /> <span>Allenatori</span>
      </TabsTrigger>
    </TabsList>
  );
}
