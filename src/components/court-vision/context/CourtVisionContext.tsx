
import React, { createContext, useContext } from "react";
import { CourtVisionContextType } from "./CourtVisionTypes";

// Create context with default undefined value
export const CourtVisionContext = createContext<CourtVisionContextType | undefined>(undefined);

// Custom hook to use the court vision context
export const useCourtVision = () => {
  const context = useContext(CourtVisionContext);
  if (!context) {
    throw new Error("useCourtVision must be used within a CourtVisionProvider");
  }
  return context;
};

// Re-export provider from the provider module
export * from './provider';
