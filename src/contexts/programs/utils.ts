
import { TENNIS_PROGRAMS } from "@/components/court-vision/constants";
import { PROGRAM_CATEGORIES } from "./constants";
import { ProgramDetail } from "@/components/programs/ProgramCard";

// Get programs for a specific category
export function getProgramsByCategory(category: string): ProgramDetail[] {
  switch(category) {
    case PROGRAM_CATEGORIES.PERFORMANCE:
      return TENNIS_PROGRAMS.PERFORMANCE;
    case PROGRAM_CATEGORIES.JUNIOR:
      return TENNIS_PROGRAMS.JUNIOR;
    case PROGRAM_CATEGORIES.PERSONAL:
      return TENNIS_PROGRAMS.PERSONAL;
    case PROGRAM_CATEGORIES.ADULT:
      return TENNIS_PROGRAMS.ADULT;
    case PROGRAM_CATEGORIES.COACH:
      return TENNIS_PROGRAMS.COACH;
    case PROGRAM_CATEGORIES.PADEL:
      return TENNIS_PROGRAMS.PADEL;
    default:
      return [];
  }
}

// Get category from program ID
export function getCategoryFromId(programId: string): string | null {
  if (programId.includes("perf") || programId.includes("elite")) {
    return PROGRAM_CATEGORIES.PERFORMANCE;
  } else if (programId.includes("junior") || programId.includes("sat") || programId.includes("sit")) {
    return PROGRAM_CATEGORIES.JUNIOR;
  } else if (programId.includes("personal") || programId.includes("lezioni")) {
    return PROGRAM_CATEGORIES.PERSONAL;
  } else if (programId.includes("adult") || programId.includes("university")) {
    return PROGRAM_CATEGORIES.ADULT;
  } else if (programId.includes("coach") || programId.includes("club")) {
    return PROGRAM_CATEGORIES.COACH;
  } else if (programId.includes("padel")) {
    return PROGRAM_CATEGORIES.PADEL;
  }
  return null;
}
