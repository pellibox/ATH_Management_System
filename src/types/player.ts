
export interface Player {
  id: string;
  name: string;
  email: string;
  phone: string;
  level: string;
  age?: number;
  dateOfBirth?: string;
  notes?: string;
  status: 'active' | 'inactive';
  objectives?: {
    daily: string;
    weekly: string;
    monthly: string;
    seasonal: string;
  };
  program?: string;
  sports?: string[];
  avatar?: string;
}
