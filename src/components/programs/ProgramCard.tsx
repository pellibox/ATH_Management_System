
import { useState } from "react";
import { Calendar, Clock, Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ProgramDetail {
  id: string;
  name: string;
  color: string;
  description?: string;
  details?: string[];
  cost?: string;
  weeklyHours?: number;
  totalWeeks?: number;
  vicki?: boolean | string;
}

interface ProgramCardProps {
  program: ProgramDetail;
  expandedProgram: string | null;
  toggleExpand: (id: string) => void;
}

export const ProgramCard = ({ program, expandedProgram, toggleExpand }: ProgramCardProps) => {
  const isExpanded = expandedProgram === program.id;

  return (
    <div 
      key={program.id} 
      className={cn(
        "bg-white rounded-xl shadow-soft overflow-hidden transition-all duration-300",
        isExpanded ? "ring-2 ring-ath-blue/20" : "",
        "card-hover"
      )}
    >
      <div 
        className="p-6 cursor-pointer"
        onClick={() => toggleExpand(program.id)}
      >
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-semibold">{program.name}</h3>
              <span 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: program.color }}
              ></span>
              
              {program.vicki && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  <Sparkles className="h-3 w-3 mr-1" /> 
                  {program.vicki === true ? "Vicki™" : "Vicki™ optional"}
                </span>
              )}
            </div>
            <p className="text-gray-600 mt-1">{program.description}</p>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-lg font-semibold text-ath-blue">{program.cost}</div>
          </div>
        </div>
        
        <div className="mt-4 flex flex-wrap gap-6">
          {program.weeklyHours && program.weeklyHours > 0 && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-sm">
                {program.weeklyHours} ore/settimana
              </span>
            </div>
          )}
          {program.totalWeeks && program.totalWeeks > 0 && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm">{program.totalWeeks} settimane</span>
            </div>
          )}
        </div>
        
        <div className={cn(
          "mt-2 flex justify-end items-center gap-1",
          "text-ath-blue transition-transform duration-300",
          isExpanded ? "rotate-180" : ""
        )}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
      </div>
      
      {/* Expanded details */}
      {isExpanded && (
        <div className="px-6 pb-6 pt-0 border-t-0 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Dettagli Programma</h4>
              <ul className="space-y-2">
                {program.details && program.details.map((detail, idx) => (
                  <li key={idx} className="flex items-start">
                    <Check className="h-4 w-4 text-ath-blue mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{detail}</span>
                  </li>
                ))}
              </ul>
              
              {program.weeklyHours && program.weeklyHours > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Monte Ore</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Ore settimanali:</span>
                      <span className="text-sm font-medium">{program.weeklyHours} ore</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Settimane totali:</span>
                      <span className="text-sm font-medium">{program.totalWeeks}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Monte ore totale:</span>
                      <span className="text-sm font-medium">{program.weeklyHours * (program.totalWeeks || 0)} ore</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Informazioni</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Costo:</span>
                  <span className="text-sm font-medium">{program.cost}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Iscrizioni:</span>
                  <span className="text-sm">Aperte</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Integrazione VICKI™:</span>
                  <span className="text-sm">
                    {program.vicki === true 
                      ? "Inclusa" 
                      : program.vicki === "optional" 
                        ? "Disponibile su richiesta" 
                        : "Non disponibile"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Prossimo inizio:</span>
                  <span className="text-sm">Settembre 2024</span>
                </div>
              </div>
              
              <div className="mt-6 flex gap-3 justify-end">
                <button className="px-3 py-1.5 rounded bg-gray-100 text-gray-700 text-sm hover:bg-gray-200 transition-colors">
                  Dettagli
                </button>
                <button className="px-3 py-1.5 rounded bg-ath-blue text-white text-sm hover:bg-ath-blue-dark transition-colors">
                  Iscriviti
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
