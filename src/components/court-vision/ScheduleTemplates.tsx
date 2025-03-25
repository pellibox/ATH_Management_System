
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Copy, CopyCheck } from "lucide-react";
import { ScheduleTemplate } from "./types";
import { format } from "date-fns";

export interface ScheduleTemplatesProps {
  templates: ScheduleTemplate[];
  onApplyTemplate: (template: ScheduleTemplate) => void;
  onSaveTemplate: (name: string) => void;
  onCopyToNextDay?: () => void;
  onCopyToWeek?: () => void;
}

export function ScheduleTemplates({ 
  templates, 
  onApplyTemplate, 
  onSaveTemplate,
  onCopyToNextDay,
  onCopyToWeek 
}: ScheduleTemplatesProps) {
  const [newTemplateName, setNewTemplateName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    if (newTemplateName.trim() !== "") {
      onSaveTemplate(newTemplateName);
      setNewTemplateName("");
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-soft p-4">
      <h2 className="font-medium mb-3 flex items-center">
        <Calendar className="h-4 w-4 mr-2" /> Schedule Templates
      </h2>

      <div className="space-y-2">
        {isSaving ? (
          <div className="space-y-2">
            <Input
              placeholder="Template name"
              value={newTemplateName}
              onChange={(e) => setNewTemplateName(e.target.value)}
            />
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => setIsSaving(false)}
              >
                Cancel
              </Button>
              <Button size="sm" className="flex-1" onClick={handleSave}>
                Save
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="outline"
            className="w-full text-sm"
            onClick={() => setIsSaving(true)}
          >
            Save Current Layout as Template
          </Button>
        )}

        {templates.length > 0 && (
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full text-sm mt-2"
              >
                Apply Template
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Select Template</DialogTitle>
              </DialogHeader>
              <div className="space-y-2 mt-4 max-h-60 overflow-y-auto">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className="flex justify-between items-center p-2 hover:bg-gray-50 rounded cursor-pointer"
                    onClick={() => onApplyTemplate(template)}
                  >
                    <div>
                      <div className="font-medium">{template.name}</div>
                      <div className="text-xs text-gray-500">
                        Created: {format(new Date(template.date), "MMM d, yyyy")}
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Apply
                    </Button>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        )}

        {onCopyToNextDay && (
          <Button
            variant="outline"
            className="w-full text-sm"
            onClick={onCopyToNextDay}
          >
            <Copy className="h-4 w-4 mr-2" /> Copy to Next Day
          </Button>
        )}

        {onCopyToWeek && (
          <Button
            variant="outline"
            className="w-full text-sm"
            onClick={onCopyToWeek}
          >
            <CopyCheck className="h-4 w-4 mr-2" /> Copy to Next Week
          </Button>
        )}
      </div>
    </div>
  );
}
