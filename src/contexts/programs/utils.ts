
import { TENNIS_PROGRAMS } from "@/components/court-vision/constants";
import { PROGRAM_CATEGORIES } from "./constants";
import { ProgramDetail } from "@/components/programs/types";

// Get category from program ID
export function getCategoryFromId(programId: string): string | null {
  if (TENNIS_PROGRAMS.PERFORMANCE.some(p => p.id === programId)) {
    return "performance";
  }
  if (TENNIS_PROGRAMS.JUNIOR.some(p => p.id === programId)) {
    return "junior";
  }
  if (TENNIS_PROGRAMS.PERSONAL.some(p => p.id === programId)) {
    return "personal";
  }
  if (TENNIS_PROGRAMS.ADULT.some(p => p.id === programId)) {
    return "adult";
  }
  if (TENNIS_PROGRAMS.COACH.some(p => p.id === programId)) {
    return "coach";
  }
  if (TENNIS_PROGRAMS.PADEL.some(p => p.id === programId)) {
    return "padel";
  }
  return null;
}

// Get programs by category
export function getProgramsByCategory(categoryId: string): ProgramDetail[] {
  switch (categoryId) {
    case "performance":
      return PROGRAM_CATEGORIES.PERFORMANCE.programs;
    case "junior":
      return PROGRAM_CATEGORIES.JUNIOR.programs;
    case "personal":
      return PROGRAM_CATEGORIES.PERSONAL.programs;
    case "adult":
      return PROGRAM_CATEGORIES.ADULT.programs;
    case "coach":
      return PROGRAM_CATEGORIES.COACH.programs;
    case "padel":
      return PROGRAM_CATEGORIES.PADEL.programs;
    default:
      return [];
  }
}
