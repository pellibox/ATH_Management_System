
import React from "react";
import { Button } from "@/components/ui/button";

interface ToggleViewButtonProps {
  showAssigned: boolean;
  setShowAssigned: (show: boolean) => void;
}

export function ToggleViewButton({ 
  showAssigned, 
  setShowAssigned 
}: ToggleViewButtonProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setShowAssigned(!showAssigned)}
    >
      {showAssigned ? "Show Available" : "Show Assigned"}
    </Button>
  );
}
