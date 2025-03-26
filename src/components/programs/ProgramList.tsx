
import { useState, useEffect } from "react";
import { ProgramDetail } from "./types";
import { ProgramCategorySection } from "./ProgramCategorySection";
import { PROGRAM_CATEGORIES, getCategoryTitle } from "@/contexts/programs/constants";
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
      {Object.entries(PROGRAM_CATEGORIES).map(([category, value]) => (
        <ProgramCategorySection
          key={category}
          title={getCategoryTitle(category)}
          description={CATEGORY_DESCRIPTIONS[category] || ""}
          borderColor={CATEGORY_COLORS[category] || "#000"}
          programs={getProgramsByCategory(value.id)}
          expandedProgram={expandedProgram}
          toggleExpand={toggleExpand}
          onUpdateProgram={onUpdateProgram}
        />
      ))}
    </div>
  );
}
