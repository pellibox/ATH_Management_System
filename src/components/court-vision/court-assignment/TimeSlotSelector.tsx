
import React from "react";

interface TimeSlotSelectorProps {
  timeSlots: string[];
  selectedTimeSlot: string | undefined;
  setSelectedTimeSlot: (timeSlot: string | undefined) => void;
}

export function TimeSlotSelector({
  timeSlots,
  selectedTimeSlot,
  setSelectedTimeSlot,
}: TimeSlotSelectorProps) {
  if (!timeSlots || timeSlots.length === 0) {
    return null;
  }

  return (
    <div className="mb-4">
      <label className="text-sm font-medium mb-2 block">Select Time Slot (Optional)</label>
      <select
        className="w-full px-3 py-2 text-sm border rounded"
        value={selectedTimeSlot || ""}
        onChange={(e) => setSelectedTimeSlot(e.target.value || undefined)}
      >
        <option value="">No specific time</option>
        {timeSlots.map((time) => (
          <option key={time} value={time}>
            {time}
          </option>
        ))}
      </select>
    </div>
  );
}
