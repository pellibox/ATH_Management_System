
import { COURT_TYPES } from './constants';
import { useLocation } from 'react-router-dom';

export default function CourtTypeLegend() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const selectedSport = params.get('sport') || '';
  
  // Get the court types based on selected sport
  const getCourtTypes = () => {
    switch (selectedSport) {
      case 'tennis':
        return [
          { type: COURT_TYPES.TENNIS_CLAY, color: 'bg-red-500', label: 'Tennis (Clay)' },
          { type: COURT_TYPES.TENNIS_HARD, color: 'bg-black', label: 'Tennis (Hard)' }
        ];
      case 'padel':
        return [
          { type: COURT_TYPES.PADEL, color: 'bg-green-500', label: 'Padel' }
        ];
      case 'pickleball':
        return [
          { type: COURT_TYPES.PICKLEBALL, color: 'bg-blue-500', label: 'Pickleball' }
        ];
      case 'touchtennis':
        return [
          { type: COURT_TYPES.TOUCH_TENNIS, color: 'bg-purple-500', label: 'Touch Tennis' }
        ];
      default:
        return [
          { type: COURT_TYPES.TENNIS_CLAY, color: 'bg-red-500', label: 'Tennis (Clay)' },
          { type: COURT_TYPES.TENNIS_HARD, color: 'bg-black', label: 'Tennis (Hard)' },
          { type: COURT_TYPES.PADEL, color: 'bg-green-500', label: 'Padel' },
          { type: COURT_TYPES.PICKLEBALL, color: 'bg-blue-500', label: 'Pickleball' },
          { type: COURT_TYPES.TOUCH_TENNIS, color: 'bg-purple-500', label: 'Touch Tennis' }
        ];
    }
  };
  
  const courtTypes = getCourtTypes();
  
  return (
    <div className="flex items-center gap-4 text-sm py-2 px-4 bg-white shadow-sm rounded-lg mb-6 overflow-x-auto">
      <p className="text-gray-700 font-medium whitespace-nowrap">Tipi di Campo:</p>
      {courtTypes.map((courtType) => (
        <div key={courtType.type} className="flex items-center gap-2 whitespace-nowrap">
          <div className={`h-4 w-4 rounded-full ${courtType.color}`}></div>
          <span className="text-gray-600">{courtType.label}</span>
        </div>
      ))}
    </div>
  );
}
