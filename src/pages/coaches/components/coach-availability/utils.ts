
export const getEventTypeColor = (type: string) => {
  switch (type) {
    case 'vacation':
      return "bg-blue-100 text-blue-800";
    case 'sick':
      return "bg-red-100 text-red-800";
    case 'travel':
      return "bg-purple-100 text-purple-800";
    case 'tournament':
      return "bg-green-100 text-green-800";
    case 'personal':
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getEventTypeLabel = (type: string) => {
  switch (type) {
    case 'vacation':
      return "Vacanza";
    case 'sick':
      return "Malattia";
    case 'travel':
      return "Trasferta";
    case 'tournament':
      return "Torneo";
    case 'personal':
      return "Personale";
    default:
      return "Altro";
  }
};
