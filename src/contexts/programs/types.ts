
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

export interface CoachAvailabilityEvent {
  id: string;
  title: string;
  date: Date;
  endDate?: Date;
  type: 'vacation' | 'sick' | 'travel' | 'tournament' | 'personal' | 'other';
  notes?: string;
  allDay?: boolean;
}
