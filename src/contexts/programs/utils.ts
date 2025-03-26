
import { TENNIS_PROGRAMS } from "@/components/court-vision/constants";
import { PROGRAM_CATEGORIES } from "./constants";
import { ProgramDetail } from "@/components/programs/types";

// Get programs for a specific category ID
export function getProgramsByCategory(categoryId: string): ProgramDetail[] {
  switch(categoryId) {
    case "performance":
      return TENNIS_PROGRAMS.PERFORMANCE;
    case "junior":
      return TENNIS_PROGRAMS.JUNIOR;
    case "personal":
      return TENNIS_PROGRAMS.PERSONAL;
    case "adult":
      return TENNIS_PROGRAMS.ADULT;
    case "coach":
      return TENNIS_PROGRAMS.COACH;
    case "padel":
      return TENNIS_PROGRAMS.PADEL;
    default:
      return [];
  }
}

// Get category ID from program ID
export function getCategoryFromId(programId: string): string | null {
  if (programId.includes("perf") || programId.includes("elite")) {
    return "performance";
  } else if (programId.includes("junior") || programId.includes("sat") || programId.includes("sit")) {
    return "junior";
  } else if (programId.includes("personal") || programId.includes("lezioni")) {
    return "personal";
  } else if (programId.includes("adult") || programId.includes("university")) {
    return "adult";
  } else if (programId.includes("coach") || programId.includes("club")) {
    return "coach";
  } else if (programId.includes("padel")) {
    return "padel";
  }
  return null;
}
