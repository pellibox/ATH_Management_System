
import { useState } from "react";
import { format } from "date-fns";
import { Clock } from "lucide-react";
import { ScheduleTemplate } from "./types";

interface ScheduleTemplatesProps {
  templates: ScheduleTemplate[];
  onSaveTemplate: (name: string) => void;
  onApplyTemplate: (template: ScheduleTemplate) => void;
}

export function ScheduleTemplates({ 
  templates, 
  onSaveTemplate, 
  onApplyTemplate 
}: ScheduleTemplatesProps) {
  const [newTemplateName, setNewTemplateName] = useState("");

  const handleSaveTemplate = () => {
    onSaveTemplate(newTemplateName);
    setNewTemplateName("");
  };

  return (
    <div className="bg-white rounded-xl shadow-soft p-4">
      <h2 className="font-medium mb-3 flex items-center">
        <Clock className="h-4 w-4 mr-2" /> Schedule Templates
      </h2>
      
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-medium mb-2">Save Current Schedule</h3>
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Template Name"
            className="w-full px-3 py-2 text-sm border rounded"
            value={newTemplateName}
            onChange={(e) => setNewTemplateName(e.target.value)}
          />
          <button
            className="w-full bg-ath-blue text-white text-sm py-1.5 rounded hover:bg-ath-blue-dark transition-colors"
            onClick={handleSaveTemplate}
          >
            Save as Template
          </button>
        </div>
      </div>
      
      {templates.length > 0 ? (
        <div className="space-y-2">
          {templates.map((template) => (
            <div key={template.id} className="p-2 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{template.name}</span>
                <button
                  className="text-xs bg-ath-blue-light px-2 py-1 rounded text-ath-blue hover:bg-ath-blue-light/80"
                  onClick={() => onApplyTemplate(template)}
                >
                  Apply
                </button>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Created: {format(template.date, "MMM d, yyyy")}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-sm text-gray-500 italic p-2">
          No saved templates yet
        </div>
      )}
    </div>
  );
}
