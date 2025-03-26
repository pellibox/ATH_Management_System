
import { DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePlayerContext } from "@/contexts/PlayerContext";

export function ScheduleMessage() {
  const { 
    messagePlayer,
    messageContent,
    setMessageContent,
    scheduleType,
    setScheduleType,
    handleSendMessage,
    setMessagePlayer
  } = usePlayerContext();

  if (!messagePlayer) return null;

  return (
    <>
      <DialogHeader className="relative">
        <DialogTitle>Send Schedule to {messagePlayer.name}</DialogTitle>
        <DialogClose className="absolute right-0 top-0">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setMessagePlayer(null)}>
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogClose>
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
            placeholder={`${scheduleType}ly schedule and objectives for ${messagePlayer.name}`}
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            className="min-h-[100px]"
          />
        </div>
        <div className="flex justify-between">
          <div>
            <span className="text-sm text-gray-500">Will be sent via: {messagePlayer.preferredContactMethod || "WhatsApp"}</span>
          </div>
          <Button onClick={handleSendMessage} className="flex gap-2">
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
