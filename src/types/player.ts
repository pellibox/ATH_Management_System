
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
  
  // Add missing properties
  gender?: 'Male' | 'Female' | 'Other';
  coach?: string;
  joinDate?: string;
  preferredContactMethod?: 'WhatsApp' | 'Email' | 'Phone';
}

// Add mock players data since it's referenced in multiple places
export const mockPlayers: Player[] = [
  {
    id: "p1",
    name: "Marco Rossi",
    email: "marco.rossi@example.com",
    phone: "+39 123 456 7890",
    level: "Intermediate",
    age: 15,
    notes: "Left-handed player, strong backhand",
    status: "active",
    coach: "Coach Martinez",
    gender: "Male",
    joinDate: "2023-01-15",
    preferredContactMethod: "WhatsApp",
    program: "Junior Excellence",
    sports: ["Tennis", "Swimming"]
  },
  {
    id: "p2",
    name: "Giulia Bianchi",
    email: "giulia.bianchi@example.com",
    phone: "+39 234 567 8901",
    level: "Advanced",
    age: 17,
    notes: "National junior champion 2022",
    status: "active",
    coach: "Coach Anderson",
    gender: "Female",
    joinDate: "2022-09-05",
    preferredContactMethod: "Email",
    program: "Elite Performance",
    sports: ["Tennis"]
  },
  {
    id: "p3",
    name: "Luca Verdi",
    email: "luca.verdi@example.com",
    phone: "+39 345 678 9012",
    level: "Beginner",
    age: 12,
    notes: "Just started training, shows potential",
    status: "active",
    coach: "Coach Martinez",
    gender: "Male",
    joinDate: "2023-06-20",
    preferredContactMethod: "Phone",
    program: "Foundation",
    sports: ["Tennis", "Football"]
  },
  {
    id: "p4",
    name: "Sofia Marino",
    email: "sofia.marino@example.com",
    phone: "+39 456 789 0123",
    level: "Professional",
    age: 21,
    notes: "Preparing for international tournament",
    status: "active",
    coach: "Coach Anderson",
    gender: "Female",
    joinDate: "2020-03-10",
    preferredContactMethod: "WhatsApp",
    program: "Pro Circuit",
    sports: ["Tennis"]
  }
];
