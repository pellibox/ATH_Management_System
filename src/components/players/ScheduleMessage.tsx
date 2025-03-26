
import { useState } from "react";
import { Player } from "@/types/player";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Send } from "lucide-react";

interface ScheduleMessageProps {
  player: Player;
  onSend: () => void;
  setMessageContent: (content: string) => void;
  messageContent: string;
  scheduleType: "day" | "week" | "month";
  setScheduleType: (type: "day" | "week" | "month") => void;
}

export function ScheduleMessage({ 
  player, 
  onSend, 
  setMessageContent, 
  messageContent, 
  scheduleType, 
  setScheduleType 
}: ScheduleMessageProps) {
  return (
    <>
      <DialogHeader>
        <DialogTitle>Send Schedule to {player.name}</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="space-y-2">
          <Label>Schedule Type</Label>
          <div className="flex gap-2">
            <Button 
              variant={scheduleType === "day" ? "default" : "outline"} 
              onClick={() => setScheduleType("day")}
              size="sm"
            >
              Daily
            </Button>
            <Button 
              variant={scheduleType === "week" ? "default" : "outline"} 
              onClick={() => setScheduleType("week")}
              size="sm"
            >
              Weekly
            </Button>
            <Button 
              variant={scheduleType === "month" ? "default" : "outline"} 
              onClick={() => setScheduleType("month")}
              size="sm"
            >
              Monthly
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Message</Label>
          <Textarea 
            placeholder={`${scheduleType}ly schedule and objectives for ${player.name}`}
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            className="min-h-[100px]"
          />
        </div>
        <div className="flex justify-between">
          <div>
            <span className="text-sm text-gray-500">Will be sent via: {player.preferredContactMethod || "WhatsApp"}</span>
          </div>
          <Button onClick={onSend} className="flex gap-2">
            <Send className="h-4 w-4" />
            Send Schedule
          </Button>
        </div>
      </div>
    </>
  );
}

export function ScheduleButton({ onClick }: { onClick: () => void }) {
  return (
    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onClick}>
      <Calendar className="h-4 w-4" />
    </Button>
  );
}
