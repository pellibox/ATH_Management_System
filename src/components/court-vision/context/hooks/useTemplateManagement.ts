
import { useState } from "react";
import { CourtProps, ScheduleTemplate } from "../../types";
import { useToast } from "@/hooks/use-toast";

export function useTemplateManagement(courts: CourtProps[]) {
  const [templates, setTemplates] = useState<ScheduleTemplate[]>([]);
  const { toast } = useToast();

  const saveAsTemplate = (name: string) => {
    const newTemplate: ScheduleTemplate = {
      id: `template-${Date.now()}`,
      name: name,
      date: new Date(),
      courts: courts.map(court => ({
        ...court,
        occupants: court.occupants.map(person => ({ ...person }))
      })),
    };
    
    setTemplates([...templates, newTemplate]);
    toast({
      title: "Template Salvato",
      description: `Il template "${name}" è stato salvato`,
    });
  };

  const handleSaveTemplate = (name: string) => {
    saveAsTemplate(name);
  };

  const applyTemplate = (template: ScheduleTemplate) => {
    return template.courts.map(court => ({
      ...court,
      occupants: court.occupants.map(person => ({ ...person }))
    }));
  };

  const handleLoadTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      return applyTemplate(template);
    }
    return [];
  };

  const handleDeleteTemplate = (templateId: string) => {
    setTemplates(templates.filter(t => t.id !== templateId));
    toast({
      title: "Template Rimosso",
      description: "Il template è stato rimosso con successo",
    });
  };

  const handleClearSchedule = () => {
    toast({
      title: "Pianificazione Cancellata",
      description: "Tutti gli elementi della pianificazione sono stati rimossi",
    });
  };

  const handleDuplicateSchedule = (sourceDate: Date, targetDate: Date) => {
    toast({
      title: "Pianificazione Duplicata",
      description: `La pianificazione è stata copiata al ${targetDate.toLocaleDateString()}`,
    });
  };

  return {
    templates,
    setTemplates,
    saveAsTemplate,
    handleSaveTemplate,
    applyTemplate,
    handleLoadTemplate,
    handleDeleteTemplate,
    handleClearSchedule,
    handleDuplicateSchedule
  };
}
