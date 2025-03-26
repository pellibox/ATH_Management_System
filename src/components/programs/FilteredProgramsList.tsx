
import { useEffect, useState } from "react";
import { ProgramCard, ProgramDetail } from "./ProgramCard";
import { getCategoryTitle } from "@/contexts/programs/constants";
import { CATEGORY_DESCRIPTIONS } from "@/contexts/programs/constants";

interface FilteredProgramsListProps {
  filter: string;
  filteredPrograms: ProgramDetail[];
  expandedProgram: string | null;
  toggleExpand: (id: string) => void;
  resetFilters: () => void;
}

export const FilteredProgramsList = ({
  filter,
  filteredPrograms,
  expandedProgram,
  toggleExpand,
  resetFilters
}: FilteredProgramsListProps) => {
  const categoryKey = Object.keys(CATEGORY_DESCRIPTIONS).find(key => 
    key.toLowerCase() === filter.toUpperCase()
  );
  
  return (
    <div className="space-y-4">
      {filter !== "all" && (
        <>
          <h2 className="text-xl font-bold">
            {getCategoryTitle(Object.keys(CATEGORY_DESCRIPTIONS).find(key => 
              key.toLowerCase() === filter.toUpperCase()
            ) || "")}
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            {CATEGORY_DESCRIPTIONS[categoryKey] || ""}
          </p>
        </>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {filteredPrograms.map(program => (
          <ProgramCard
            key={program.id}
            program={program}
            expandedProgram={expandedProgram}
            toggleExpand={toggleExpand}
          />
        ))}
      </div>
      
      {filteredPrograms.length === 0 && (
        <div className="text-center py-8">
          <p className="text-sm text-gray-500">Nessun programma corrisponde alla tua ricerca</p>
          <button 
            onClick={resetFilters}
            className="mt-2 text-xs text-ath-blue hover:text-ath-blue-dark"
          >
            Visualizza tutti i programmi
          </button>
        </div>
      )}
    </div>
  );
};
