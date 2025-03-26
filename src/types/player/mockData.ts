
import { Player } from './interfaces';

// Add mock players data with enhanced properties
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
    sports: ["Tennis", "Swimming"],
    medicalExam: {
      date: "2023-04-15",
      expiryDate: "2024-04-15",
      type: "Non-Agonistic"
    },
    completedHours: 32,
    trainingHours: 28,
    extraHours: 4,
    missedHours: 2,
    documents: [
      {
        id: "doc1",
        name: "Modulo di iscrizione",
        type: "application/pdf",
        uploadDate: "2023-01-10",
        fileUrl: "/documents/modulo-iscrizione-p1.pdf"
      },
      {
        id: "doc2",
        name: "Documento d'identità",
        type: "image/jpeg",
        uploadDate: "2023-01-10",
        fileUrl: "/documents/id-p1.jpg"
      }
    ]
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
    sports: ["Tennis"],
    medicalExam: {
      date: "2023-08-10",
      expiryDate: "2024-08-10",
      type: "Agonistic",
      doctor: "Dr. Ferrari"
    },
    completedHours: 45,
    trainingHours: 40,
    extraHours: 5,
    missedHours: 0,
    documents: [
      {
        id: "doc3",
        name: "Certificato medico",
        type: "application/pdf",
        uploadDate: "2023-08-12",
        fileUrl: "/documents/cert-med-p2.pdf"
      }
    ]
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
    sports: ["Tennis", "Football"],
    medicalExam: {
      date: "2023-06-15",
      expiryDate: "2024-06-15",
      type: "Non-Agonistic"
    },
    completedHours: 18,
    trainingHours: 15,
    extraHours: 3,
    missedHours: 1
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
    sports: ["Tennis"],
    medicalExam: {
      date: "2023-01-20",
      expiryDate: "2024-01-20",
      type: "Agonistic",
      doctor: "Dr. Romano"
    },
    completedHours: 120,
    trainingHours: 100,
    extraHours: 20,
    missedHours: 5,
    documents: [
      {
        id: "doc4",
        name: "Contratto",
        type: "application/pdf",
        uploadDate: "2023-01-05",
        fileUrl: "/documents/contract-p4.pdf"
      },
      {
        id: "doc5",
        name: "Passaporto",
        type: "image/jpeg",
        uploadDate: "2023-01-05",
        fileUrl: "/documents/passport-p4.jpg"
      },
      {
        id: "doc6",
        name: "Scheda tecnica",
        type: "application/pdf",
        uploadDate: "2023-05-15",
        fileUrl: "/documents/tech-p4.pdf"
      }
    ]
  }
];
