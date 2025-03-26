
import { useState, useEffect } from "react";
import { ProgramDetail } from "./types";
import { ProgramCategorySection } from "./ProgramCategorySection";
import { PROGRAM_CATEGORIES } from "@/contexts/programs/constants";
import { getProgramsByCategory } from "@/contexts/programs/utils";
import { CATEGORY_DESCRIPTIONS, CATEGORY_COLORS } from "@/contexts/programs/constants";

interface ProgramListProps {
  expandedProgram: string | null;
  toggleExpand: (id: string) => void;
  onUpdateProgram?: (updatedProgram: ProgramDetail) => void;
}

export function ProgramList({ expandedProgram, toggleExpand, onUpdateProgram }: ProgramListProps) {
  return (
    <div className="space-y-6">
      {/* Dynamic Category Sections */}
      {Object.entries(PROGRAM_CATEGORIES).map(([category, categoryData]) => (
        <ProgramCategorySection
          key={category}
          title={categoryData.title}
          description={categoryData.description || ""}
          borderColor={categoryData.color || "#000"}
          programs={categoryData.programs}
          expandedProgram={expandedProgram}
          toggleExpand={toggleExpand}
          onUpdateProgram={onUpdateProgram}
        />
      ))}
    </div>
  );
}
