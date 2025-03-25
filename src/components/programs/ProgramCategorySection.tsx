
import { ProgramCard, ProgramDetail } from "./ProgramCard";

interface ProgramCategorySectionProps {
  title: string;
  description: string;
  borderColor: string;
  programs: ProgramDetail[];
  expandedProgram: string | null;
  toggleExpand: (id: string) => void;
}

export const ProgramCategorySection = ({
  title,
  description,
  borderColor,
  programs,
  expandedProgram,
  toggleExpand
}: ProgramCategorySectionProps) => {
  if (programs.length === 0) {
    return null;
  }

  return (
    <div>
      <h2 className={`text-2xl font-bold border-l-4 pl-3 mb-4`} style={{ borderColor }}>
        {title}
      </h2>
      <p className="text-gray-600 mb-6">
        {description}
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {programs.map(program => (
          <ProgramCard 
            key={program.id}
            program={program}
            expandedProgram={expandedProgram}
            toggleExpand={toggleExpand}
          />
        ))}
      </div>
    </div>
  );
};
