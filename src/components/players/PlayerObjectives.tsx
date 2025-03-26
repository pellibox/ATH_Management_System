import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { Phone } from "lucide-react";
import { usePlayerContext } from "@/contexts/PlayerContext";

export function PlayerObjectives() {
  const { 
    editingPlayer, 
    handleSetObjectives, 
    setMessagePlayer, 
    setMessageContent 
  } = usePlayerContext();

  const [objectives, setObjectives] = useState(
    editingPlayer?.objectives || {
      daily: "",
      weekly: "",
      monthly: "",
      seasonal: ""
    }
  );

  // Update objectives when editing player changes
  useEffect(() => {
    if (editingPlayer) {
      setObjectives(editingPlayer.objectives || {
        daily: "",
        weekly: "",
        monthly: "",
        seasonal: ""
      });
    }
  }, [editingPlayer]);

  const handleSendToPlayer = () => {
    if (!editingPlayer) return;
    
    const messageContent = `Training objectives for ${editingPlayer.name}:\n\nDaily: ${objectives.daily}\n\nWeekly: ${objectives.weekly}\n\nMonthly: ${objectives.monthly}\n\nSeasonal: ${objectives.seasonal}`;
    
    setMessagePlayer(editingPlayer);
    setMessageContent(messageContent);
  };

  const handleSaveObjectives = () => {
    if (!editingPlayer) return;
    // Use the correct signature: handleSetObjectives(playerID, objectives)
    handleSetObjectives(editingPlayer.id, objectives);
  };

  if (!editingPlayer) return null;

  return (
    <div className="grid gap-4 py-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Daily Objectives</label>
        <textarea 
          className="w-full p-2 border rounded-md text-sm min-h-[60px]"
          value={objectives?.daily || ""} 
          onChange={(e) => setObjectives({...objectives, daily: e.target.value})}
          placeholder="Daily training focus and goals"
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Weekly Objectives</label>
        <textarea 
          className="w-full p-2 border rounded-md text-sm min-h-[60px]"
          value={objectives?.weekly || ""} 
          onChange={(e) => setObjectives({...objectives, weekly: e.target.value})}
          placeholder="Weekly training schedule and goals"
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Monthly Objectives</label>
        <textarea 
          className="w-full p-2 border rounded-md text-sm min-h-[60px]"
          value={objectives?.monthly || ""} 
          onChange={(e) => setObjectives({...objectives, monthly: e.target.value})}
          placeholder="Monthly improvement goals"
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Seasonal Objectives</label>
        <textarea 
          className="w-full p-2 border rounded-md text-sm min-h-[60px]"
          value={objectives?.seasonal || ""} 
          onChange={(e) => setObjectives({...objectives, seasonal: e.target.value})}
          placeholder="Season-long development goals"
        />
      </div>
      
      <div className="flex justify-between gap-2">
        <div>
          <Button variant="outline" onClick={handleSendToPlayer}>
            <Phone className="h-4 w-4 mr-2" />
            Send to Player
          </Button>
        </div>
        <div className="flex gap-2">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSaveObjectives}>Save Objectives</Button>
        </div>
      </div>
    </div>
  );
}
