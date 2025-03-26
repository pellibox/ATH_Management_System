
export interface Player {
  id: string;
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  level: "Beginner" | "Intermediate" | "Advanced" | "Professional";
  coach: string;
  phone: string;
  email: string;
  joinDate: string;
  notes: string;
  objectives?: {
    daily?: string;
    weekly?: string;
    monthly?: string;
    seasonal?: string;
  };
  preferredContactMethod?: "WhatsApp" | "Email" | "Phone";
}

// Mock data for players
export const mockPlayers: Player[] = [
  {
    id: "p1",
    name: "Alex Johnson",
    age: 24,
    gender: "Male",
    level: "Advanced",
    coach: "Coach Martinez",
    phone: "+1 (555) 123-4567",
    email: "alex.johnson@example.com",
    joinDate: "2022-03-15",
    notes: "Strong forehand, working on backhand slice"
  },
  {
    id: "p2",
    name: "Emma Parker",
    age: 19,
    gender: "Female",
    level: "Intermediate",
    coach: "Coach Anderson",
    phone: "+1 (555) 234-5678",
    email: "emma.parker@example.com",
    joinDate: "2022-06-22",
    notes: "Good all-around player, needs work on serve"
  },
  {
    id: "p3",
    name: "Michael Rodriguez",
    age: 32,
    gender: "Male",
    level: "Professional",
    coach: "Coach Martinez",
    phone: "+1 (555) 345-6789",
    email: "michael.rodriguez@example.com",
    joinDate: "2020-11-08",
    notes: "Former tour player, training for seniors circuit"
  },
  {
    id: "p4",
    name: "Sophia Wang",
    age: 16,
    gender: "Female",
    level: "Advanced",
    coach: "Coach Thompson",
    phone: "+1 (555) 456-7890",
    email: "sophia.wang@example.com",
    joinDate: "2021-09-14",
    notes: "Junior champion, preparing for national tournament"
  },
  {
    id: "p5",
    name: "David Kim",
    age: 28,
    gender: "Male",
    level: "Intermediate",
    coach: "Coach Anderson",
    phone: "+1 (555) 567-8901",
    email: "david.kim@example.com",
    joinDate: "2023-01-05",
    notes: "Consistent player, working on net game"
  },
  {
    id: "p6",
    name: "Olivia Smith",
    age: 14,
    gender: "Female",
    level: "Beginner",
    coach: "Coach Thompson",
    phone: "+1 (555) 678-9012",
    email: "olivia.smith@example.com",
    joinDate: "2023-04-20",
    notes: "Raw talent, focusing on fundamentals"
  },
  {
    id: "p7",
    name: "James Wilson",
    age: 41,
    gender: "Male",
    level: "Intermediate",
    coach: "Coach Martinez",
    phone: "+1 (555) 789-0123",
    email: "james.wilson@example.com",
    joinDate: "2022-08-30",
    notes: "Recreational player, works on fitness"
  },
  {
    id: "p8",
    name: "Isabella Garcia",
    age: 22,
    gender: "Female",
    level: "Advanced",
    coach: "Coach Anderson",
    phone: "+1 (555) 890-1234",
    email: "isabella.garcia@example.com",
    joinDate: "2021-05-17",
    notes: "College player, strong serve and volley game"
  }
];
