
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
  programs?: string[];  // New field for multiple programs
  sports?: string[];    // New field for sports selection
  avatar?: string;
  
  // Add missing properties
  gender?: 'Male' | 'Female' | 'Other';
  coach?: string;
  joinDate?: string;
  preferredContactMethod?: 'WhatsApp' | 'Email' | 'Phone';
  
  // Enhanced properties for medical info
  medicalExam?: {
    date: string;
    expiryDate: string;
    type: 'Agonistic' | 'Non-Agonistic';
    doctor?: string;
    notes?: string;
  };
  
  // Hours tracking
  completedHours?: number;
  trainingHours?: number;
  extraHours?: number;
  missedHours?: number;
  
  // Documents
  documents?: {
    id: string;
    name: string;
    type: string;
    uploadDate: string;
    fileUrl: string;
  }[];
  
  // Subscription info
  membershipId?: string;
  membershipExpiry?: string;
  paymentStatus?: 'Paid' | 'Pending' | 'Overdue';
}

export interface ProgramDetails {
  weeks: number;
  sessionsPerWeek: number;
  hoursPerSession: number;
}

export interface PlayerDocument {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  fileUrl: string;
}
