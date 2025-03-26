
import React from "react";
import { Button } from "@/components/ui/button";
import { Users, CalendarIcon } from "lucide-react";

interface TabSelectorProps {
  selectedTab: "people" | "activities";
  setSelectedTab: (tab: "people" | "activities") => void;
}

export function TabSelector({ selectedTab, setSelectedTab }: TabSelectorProps) {
  return (
    <div className="flex space-x-2 mb-4">
      <Button
        variant={selectedTab === "people" ? "default" : "outline"}
        onClick={() => setSelectedTab("people")}
        size="sm"
        className={selectedTab === "people" ? "bg-ath-red-clay hover:bg-ath-red-clay-dark" : ""}
      >
        <Users className="h-4 w-4 mr-1 sm:mr-2" /> 
        <span className="truncate">Persone</span>
      </Button>
      <Button
        variant={selectedTab === "activities" ? "default" : "outline"}
        onClick={() => setSelectedTab("activities")}
        size="sm"
        className={selectedTab === "activities" ? "bg-ath-red-clay hover:bg-ath-red-clay-dark" : ""}
      >
        <CalendarIcon className="h-4 w-4 mr-1 sm:mr-2" /> 
        <span className="truncate">Attività</span>
      </Button>
    </div>
  );
}
