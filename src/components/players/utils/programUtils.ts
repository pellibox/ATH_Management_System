/**
 * Get a color based on program name
 * This generates a consistent color for each program
 */
export function getProgramColor(programName: string): string {
  // Simple hash function to generate consistent colors
  const hash = programName.split('').reduce((acc, char) => {
    return acc + char.charCodeAt(0);
  }, 0);
  
  // Use a set of predefined colors for common programs
  const programColors: Record<string, string> = {
    "Performance 1": "#3b82f6", // blue
    "Performance 2": "#2563eb", // darker blue
    "Performance 3": "#1d4ed8", // even darker blue
    "Performance 4": "#1e40af", // very dark blue
    "Elite Performance": "#312e81", // indigo
    "Tennis Junior": "#22c55e", // green
    "Tennis Adult": "#15803d", // darker green
    "Padel Base": "#f97316", // orange
    "Padel Avanzato": "#ea580c", // darker orange
    "Personal Training": "#8b5cf6", // purple
  };
  
  // If we have a predefined color, use it
  if (programColors[programName]) {
    return programColors[programName];
  }
  
  // Otherwise generate a color based on the hash
  const colors = [
    "#3b82f6", // blue
    "#22c55e", // green
    "#ef4444", // red
    "#f97316", // orange
    "#8b5cf6", // purple
    "#ec4899", // pink
    "#14b8a6", // teal
    "#f59e0b", // amber
    "#64748b", // slate
    "#84cc16", // lime
  ];
  
  return colors[hash % colors.length];
}

/**
 * Get a background color based on the sport type
 */
export function getSportColor(sport: string): string {
  const sportColors: Record<string, string> = {
    "Tennis": "#3b82f6", // blue
    "Padel": "#f97316", // orange
    "Squash": "#22c55e", // green
    "Badminton": "#8b5cf6", // purple
  };
  
  return sportColors[sport] || "#64748b"; // slate as default
}
