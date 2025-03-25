
import { useState } from 'react';
import { Calendar, Plus, Check } from 'lucide-react';
import { ScheduleTemplate } from './types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

export interface ScheduleTemplatesProps {
  templates: ScheduleTemplate[];
  onSaveTemplate: (name: string) => void;
  onApplyTemplate: (template: ScheduleTemplate) => void;
}

export function ScheduleTemplates({ templates, onSaveTemplate, onApplyTemplate }: ScheduleTemplatesProps) {
  const [open, setOpen] = useState(false);
  const [templateName, setTemplateName] = useState('');

  const handleSaveTemplate = () => {
    if (templateName.trim() !== '') {
      onSaveTemplate(templateName);
      setOpen(false);
      setTemplateName('');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-soft p-4">
      <h2 className="font-medium mb-3 flex items-center">
        <Calendar className="h-4 w-4 mr-2" /> Schedule Templates
      </h2>
      
      <div className="max-h-[180px] overflow-y-auto">
        {templates.length > 0 ? (
          <div className="space-y-2">
            {templates.map((template) => (
              <div 
                key={template.id} 
                className="flex items-center justify-between p-2 rounded bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <span className="text-sm">{template.name}</span>
                <Button variant="ghost" size="sm" onClick={() => onApplyTemplate(template)}>
                  <Check className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-gray-500 italic p-2">
            No templates saved yet
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="w-full mt-4">
            <Plus className="h-4 w-4 mr-2" />
            Save as Template
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Save Schedule as Template</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right text-sm font-medium text-gray-700">
                Template Name
              </label>
              <Input 
                id="name" 
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                className="col-span-3" 
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSaveTemplate}>
              Save Template
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
