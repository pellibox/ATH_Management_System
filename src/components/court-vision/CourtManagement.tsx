
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { COURT_TYPES } from "./constants";
import { CourtProps } from "./types";
import { Plus, Trash2, Edit, Save, ArrowUp, ArrowDown } from "lucide-react";

interface CourtManagementProps {
  courts: CourtProps[];
  onAddCourt: (courtData: { name: string; type: string; number: number }) => void;
  onRemoveCourt: (courtId: string) => void;
  onRenameCourt: (courtId: string, name: string) => void;
  onChangeCourtType: (courtId: string, type: string) => void;
  onChangeCourtNumber: (courtId: string, number: number) => void;
}

export function CourtManagement({
  courts,
  onAddCourt,
  onRemoveCourt,
  onRenameCourt,
  onChangeCourtType,
  onChangeCourtNumber
}: CourtManagementProps) {
  const { toast } = useToast();
  const [newCourtName, setNewCourtName] = useState("Tennis");
  const [newCourtType, setNewCourtType] = useState(COURT_TYPES.TENNIS_CLAY);
  const [newCourtNumber, setNewCourtNumber] = useState(1);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCourt, setEditingCourt] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editingNumber, setEditingNumber] = useState<string | null>(null);
  const [editNumber, setEditNumber] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newCourtName.trim() === "") {
      toast({
        title: "Errore",
        description: "Inserisci un nome per il campo",
        variant: "destructive",
      });
      return;
    }

    onAddCourt({
      name: newCourtName,
      type: newCourtType,
      number: newCourtNumber,
    });

    // Reset form
    setNewCourtName("Tennis");
    setNewCourtType(COURT_TYPES.TENNIS_CLAY);
    setNewCourtNumber(courts.length + 1);
    setShowAddForm(false);
    
    toast({
      title: "Campo Aggiunto",
      description: `${newCourtName} #${newCourtNumber} è stato aggiunto`,
    });
  };

  const getCourtTypeLabel = (type: string) => {
    switch (type) {
      case COURT_TYPES.TENNIS_CLAY:
        return "Terra Rossa";
      case COURT_TYPES.TENNIS_HARD:
        return "Cemento";
      case COURT_TYPES.PADEL:
        return "Padel";
      case COURT_TYPES.PICKLEBALL:
        return "Pickleball";
      case COURT_TYPES.TOUCH_TENNIS:
        return "Touch Tennis";
      default:
        return type;
    }
  };

  const handleSaveEdit = (courtId: string) => {
    if (editName.trim() !== "") {
      onRenameCourt(courtId, editName);
      setEditingCourt(null);
      setEditName("");
      
      toast({
        title: "Campo Rinominato",
        description: `Il campo è stato rinominato in ${editName}`,
      });
    }
  };

  const handleSaveNumberEdit = (courtId: string) => {
    if (editNumber > 0) {
      onChangeCourtNumber(courtId, editNumber);
      setEditingNumber(null);
      setEditNumber(0);
      
      toast({
        title: "Numero Campo Aggiornato",
        description: `Il numero del campo è stato cambiato in ${editNumber}`,
      });
    }
  };

  const increaseCourtNumber = (courtId: string, currentNumber: number) => {
    const newNumber = currentNumber + 1;
    onChangeCourtNumber(courtId, newNumber);
    toast({
      title: "Numero Campo Aumentato",
      description: `Il numero del campo è stato aumentato a ${newNumber}`,
    });
  };

  const decreaseCourtNumber = (courtId: string, currentNumber: number) => {
    if (currentNumber > 1) {
      const newNumber = currentNumber - 1;
      onChangeCourtNumber(courtId, newNumber);
      toast({
        title: "Numero Campo Diminuito",
        description: `Il numero del campo è stato diminuito a ${newNumber}`,
      });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Gestione Campi</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1 bg-ath-black text-white px-3 py-1.5 rounded text-sm hover:bg-ath-black-light transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Aggiungi Campo</span>
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
              <input
                type="text"
                value={newCourtName}
                onChange={(e) => setNewCourtName(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm"
                placeholder="Nome del campo"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
              <select
                value={newCourtType}
                onChange={(e) => setNewCourtType(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm"
              >
                <option value={COURT_TYPES.TENNIS_CLAY}>Terra Rossa</option>
                <option value={COURT_TYPES.TENNIS_HARD}>Cemento</option>
                <option value={COURT_TYPES.PADEL}>Padel</option>
                <option value={COURT_TYPES.PICKLEBALL}>Pickleball</option>
                <option value={COURT_TYPES.TOUCH_TENNIS}>Touch Tennis</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Numero</label>
              <input
                type="number"
                min="1"
                value={newCourtNumber}
                onChange={(e) => setNewCourtNumber(parseInt(e.target.value) || 1)}
                className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="mr-2 px-3 py-1.5 border border-gray-300 rounded text-sm hover:bg-gray-100 transition-colors"
            >
              Annulla
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 bg-ath-black text-white rounded text-sm hover:bg-ath-black-light transition-colors"
            >
              Aggiungi
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nome
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Numero
              </th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Azioni
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {courts.map((court) => (
              <tr key={court.id} className="hover:bg-gray-50">
                <td className="px-3 py-2 whitespace-nowrap">
                  {editingCourt === court.id ? (
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 text-sm w-full"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveEdit(court.id)}
                        className="ml-2 text-ath-black"
                      >
                        <Save className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <span className="text-sm font-medium">{court.name}</span>
                      <button
                        onClick={() => {
                          setEditingCourt(court.id);
                          setEditName(court.name);
                        }}
                        className="ml-2 text-gray-400 hover:text-gray-600"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <select
                    value={court.type}
                    onChange={(e) => onChangeCourtType(court.id, e.target.value)}
                    className="text-sm border border-gray-200 rounded px-2 py-1"
                  >
                    <option value={COURT_TYPES.TENNIS_CLAY}>Terra Rossa</option>
                    <option value={COURT_TYPES.TENNIS_HARD}>Cemento</option>
                    <option value={COURT_TYPES.PADEL}>Padel</option>
                    <option value={COURT_TYPES.PICKLEBALL}>Pickleball</option>
                    <option value={COURT_TYPES.TOUCH_TENNIS}>Touch Tennis</option>
                  </select>
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {editingNumber === court.id ? (
                    <div className="flex items-center">
                      <input
                        type="number"
                        min="1"
                        value={editNumber}
                        onChange={(e) => setEditNumber(parseInt(e.target.value) || 1)}
                        className="border border-gray-300 rounded px-2 py-1 text-sm w-20"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveNumberEdit(court.id)}
                        className="ml-2 text-ath-black"
                      >
                        <Save className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <span className="text-sm mr-2">{court.number}</span>
                      <div className="flex flex-col">
                        <button 
                          onClick={() => increaseCourtNumber(court.id, court.number)}
                          className="text-gray-500 hover:text-gray-700 mb-1"
                        >
                          <ArrowUp className="h-3 w-3" />
                        </button>
                        <button 
                          onClick={() => decreaseCourtNumber(court.id, court.number)}
                          className="text-gray-500 hover:text-gray-700"
                          disabled={court.number <= 1}
                        >
                          <ArrowDown className="h-3 w-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => {
                          setEditingNumber(court.id);
                          setEditNumber(court.number);
                        }}
                        className="ml-2 text-gray-400 hover:text-gray-600"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-right text-sm">
                  <button
                    onClick={() => {
                      if (window.confirm(`Sei sicuro di voler rimuovere ${court.name} #${court.number}?`)) {
                        onRemoveCourt(court.id);
                      }
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
