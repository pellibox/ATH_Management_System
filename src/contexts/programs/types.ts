
export interface ProgramCategory {
  id: string;
  title: string;
  description: string;
  color: string;
}

export interface ProgramFilterState {
  filter: string;
  searchQuery: string;
}
