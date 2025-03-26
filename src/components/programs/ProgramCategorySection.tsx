
import { ProgramCard, ProgramDetail } from "./ProgramCard";

interface ProgramCategorySectionProps {
  title: string;
  description: string;
  borderColor: string;
  programs: ProgramDetail[];
  expandedProgram: string | null;
  toggleExpand: (id: string) => void;
  onUpdateProgram?: (updatedProgram: ProgramDetail) => void;
}

export const ProgramCategorySection = ({
  title,
  description,
  borderColor,
  programs,
  expandedProgram,
  toggleExpand,
  onUpdateProgram
}: ProgramCategorySectionProps) => {
  if (programs.length === 0) {
    return null;
  }

  return (
    <div>
      {title && (
        <h2 className={`text-xl font-bold border-l-4 pl-3 mb-3`} style={{ borderColor }}>
          {title}
        </h2>
      )}
      
      {description && (
        <p className="text-sm text-gray-600 mb-4">
          {description}
        </p>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mb-6">
        {programs.map(program => (
          <ProgramCard 
            key={program.id}
            program={program}
            expandedProgram={expandedProgram}
            toggleExpand={toggleExpand}
            onUpdateProgram={onUpdateProgram}
          />
        ))}
      </div>
    </div>
  );
};
