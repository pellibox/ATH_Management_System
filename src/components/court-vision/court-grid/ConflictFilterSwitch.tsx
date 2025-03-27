
import React from "react";
import { AlertTriangle } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface ConflictFilterSwitchProps {
  showOnlyConflicts: boolean;
  setShowOnlyConflicts: (value: boolean) => void;
  conflictsCount: number;
}

export function ConflictFilterSwitch({
  showOnlyConflicts,
  setShowOnlyConflicts,
  conflictsCount
}: ConflictFilterSwitchProps) {
  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="conflict-mode"
        checked={showOnlyConflicts}
        onCheckedChange={setShowOnlyConflicts}
      />
      <Label
        htmlFor="conflict-mode"
        className="flex items-center text-sm cursor-pointer"
      >
        <AlertTriangle className="h-4 w-4 mr-1 text-orange-500" />
        Mostra solo conflitti
        {conflictsCount > 0 && (
          <span className="ml-1 text-xs bg-orange-100 text-orange-700 rounded-full px-2 py-0.5">
            {conflictsCount}
          </span>
        )}
      </Label>
    </div>
  );
}
