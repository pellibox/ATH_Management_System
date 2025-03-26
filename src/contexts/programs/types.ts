
export interface ProgramCategory {
  id: string;
  title: string;
  description: string;
  color: string;
  programs: any[];
}

export interface ProgramCategoriesMap {
  [key: string]: ProgramCategory;
}

export interface ProgramFilterState {
  filter: string;
  searchQuery: string;
}
