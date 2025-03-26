
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
        isExpanded ? `ring-2` : "",
        "card-hover"
      )}
      style={{ borderLeft: `4px solid ${program.color}` }}
    >
      <div 
        className="p-4 cursor-pointer"
        onClick={() => toggleExpand(program.id)}
      >
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <span 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: program.color }}
              ></span>
              <h3 className="text-base font-semibold truncate">{program.name}</h3>
              
              {program.vicki && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  <Sparkles className="h-2.5 w-2.5 mr-0.5" /> 
                  {program.vicki === true ? "Vicki™" : "Vicki™ opt"}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-600 mt-1 line-clamp-2">{program.description}</p>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-sm font-semibold text-ath-blue">{program.cost}</div>
          </div>
        </div>
        
        <div className="mt-2 flex flex-wrap gap-3">
          {program.weeklyHours && program.weeklyHours > 0 && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-gray-500" />
              <span className="text-xs">
                {program.weeklyHours} ore/sett
              </span>
            </div>
          )}
          {program.totalWeeks && program.totalWeeks > 0 && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3 text-gray-500" />
              <span className="text-xs">{program.totalWeeks} settimane</span>
            </div>
          )}
        </div>
        
        <div className={cn(
          "mt-1 flex justify-end items-center gap-1",
          "text-ath-blue transition-transform duration-300",
          isExpanded ? "rotate-180" : ""
        )}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
      </div>
      
      {/* Expanded details */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-0 border-t-0 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-xs font-medium text-gray-500 mb-2">Dettagli Programma</h4>
              <ul className="space-y-1.5">
                {program.details && program.details.map((detail, idx) => (
                  <li key={idx} className="flex items-start">
                    <Check className="h-3 w-3 text-ath-blue mr-1 mt-0.5 flex-shrink-0" />
                    <span className="text-xs">{detail}</span>
                  </li>
                ))}
              </ul>
              
              {program.weeklyHours && program.weeklyHours > 0 && (
                <div className="mt-4">
                  <h4 className="text-xs font-medium text-gray-500 mb-2">Monte Ore</h4>
                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-600">Ore settimanali:</span>
                      <span className="text-xs font-medium">{program.weeklyHours} ore</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-600">Settimane totali:</span>
                      <span className="text-xs font-medium">{program.totalWeeks}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-600">Monte ore totale:</span>
                      <span className="text-xs font-medium">{program.weeklyHours * (program.totalWeeks || 0)} ore</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div>
              <h4 className="text-xs font-medium text-gray-500 mb-2">Informazioni</h4>
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-xs text-gray-600">Costo:</span>
                  <span className="text-xs font-medium">{program.cost}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-600">Iscrizioni:</span>
                  <span className="text-xs">Aperte</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-600">Integrazione VICKI™:</span>
                  <span className="text-xs">
                    {program.vicki === true 
                      ? "Inclusa" 
                      : program.vicki === "optional" 
                        ? "Disponibile su richiesta" 
                        : "Non disponibile"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-600">Prossimo inizio:</span>
                  <span className="text-xs">Settembre 2024</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-600">Color code:</span>
                  <div className="flex items-center gap-1">
                    <span 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: program.color }}
                    ></span>
                    <span className="text-xs">{program.color}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex gap-2 justify-end">
                <button className="px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs hover:bg-gray-200 transition-colors">
                  Dettagli
                </button>
                <button className="px-2 py-1 rounded bg-ath-blue text-white text-xs hover:bg-ath-blue-dark transition-colors">
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
