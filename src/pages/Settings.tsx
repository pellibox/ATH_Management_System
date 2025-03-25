import { useState, useRef } from "react";
import { Save, User, Building, LinkIcon, Bell, Shield, Server, Upload, Download, FileText, AlertCircle, CalendarIcon } from "lucide-react";
import { read, utils, writeFile } from 'xlsx';
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SettingsTabProps {
  icon: React.ElementType;
  title: string;
  id: string;
  isActive: boolean;
  onClick: () => void;
}

const SettingsTab = ({ icon: Icon, title, id, isActive, onClick }: SettingsTabProps) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 w-full text-left px-4 py-3 transition-colors ${
      isActive
        ? "bg-ath-blue-light text-ath-blue font-medium rounded-lg"
        : "text-gray-700 hover:bg-gray-100 rounded-lg"
    }`}
  >
    <Icon className="h-5 w-5" />
    <span>{title}</span>
  </button>
);

interface ImportedPerson {
  name: string;
  type: string;
  programId?: string;
  email?: string;
  phone?: string;
  notes?: string;
  valid: boolean;
  error?: string;
}

export default function Settings() {
  const [activeTab, setActiveTab] = useState("general");
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importedData, setImportedData] = useState<ImportedPerson[]>([]);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [importStep, setImportStep] = useState<'upload' | 'preview' | 'complete'>('upload');
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = read(data, { type: 'array' });
        
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        const jsonData = utils.sheet_to_json(worksheet);
        
        const processedData: ImportedPerson[] = jsonData.map((row: any, index) => {
          const person: ImportedPerson = {
            name: row.name || row.Name || row.Nome || '',
            type: (row.type || row.Type || row.Tipo || '').toLowerCase() === 'coach' ? 'coach' : 'player',
            email: row.email || row.Email || '',
            phone: row.phone || row.Phone || row.Telefono || '',
            programId: row.programId || row.ProgramId || row.program || row.Program || '',
            notes: row.notes || row.Notes || row.Note || '',
            valid: true
          };
          
          if (!person.name) {
            person.valid = false;
            person.error = 'Nome mancante';
          }
          
          return person;
        });
        
        setImportedData(processedData);
        setImportStep('preview');
        
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error('Error processing file:', error);
        toast({
          title: "Errore di Importazione",
          description: "Si è verificato un errore durante l'elaborazione del file. Assicurati che sia un file Excel valido.",
          variant: "destructive",
        });
      }
    };
    
    reader.readAsArrayBuffer(file);
  };
  
  const handleImport = () => {
    const validPeople = importedData.filter(person => person.valid);
    
    toast({
      title: "Importazione Completata",
      description: `${validPeople.length} persone importate con successo.`,
    });
    
    setImportStep('complete');
  };
  
  const resetImport = () => {
    setImportedData([]);
    setImportStep('upload');
    setIsImportDialogOpen(false);
  };
  
  const downloadSampleTemplate = () => {
    const sampleData = [
      { name: "Mario Rossi", type: "player", email: "mario@example.com", phone: "+39 123456789", programId: "perf3", notes: "Note di esempio" },
      { name: "Luigi Bianchi", type: "coach", email: "luigi@example.com", phone: "+39 987654321", programId: "", notes: "Allenatore senior" }
    ];
    
    const worksheet = utils.json_to_sheet(sampleData);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Persone");
    
    writeFile(workbook, 'template_importazione_persone.xlsx');
  };
  
  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Impostazioni</h1>
        <p className="text-gray-600 mt-1">Gestisci preferenze e integrazioni dell'applicazione</p>
      </div>
      
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 md:col-span-3">
          <div className="bg-white rounded-xl shadow-soft p-3 space-y-1">
            <SettingsTab
              icon={Building}
              title="Generale"
              id="general"
              isActive={activeTab === "general"}
              onClick={() => setActiveTab("general")}
            />
            <SettingsTab
              icon={User}
              title="Account"
              id="account"
              isActive={activeTab === "account"}
              onClick={() => setActiveTab("account")}
            />
            <SettingsTab
              icon={FileText}
              title="Importazioni"
              id="imports"
              isActive={activeTab === "imports"}
              onClick={() => setActiveTab("imports")}
            />
            <SettingsTab
              icon={LinkIcon}
              title="Integrazioni"
              id="integrations"
              isActive={activeTab === "integrations"}
              onClick={() => setActiveTab("integrations")}
            />
            <SettingsTab
              icon={Bell}
              title="Notifiche"
              id="notifications"
              isActive={activeTab === "notifications"}
              onClick={() => setActiveTab("notifications")}
            />
            <SettingsTab
              icon={Shield}
              title="Sicurezza"
              id="security"
              isActive={activeTab === "security"}
              onClick={() => setActiveTab("security")}
            />
            <SettingsTab
              icon={Server}
              title="Sistema"
              id="system"
              isActive={activeTab === "system"}
              onClick={() => setActiveTab("system")}
            />
          </div>
        </div>
        
        <div className="col-span-12 md:col-span-9">
          <div className="bg-white rounded-xl shadow-soft p-6">
            {activeTab === "general" && (
              <div className="animate-fade-in">
                <h2 className="text-xl font-semibold mb-6">Informazioni Academy</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome Academy
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ath-blue/20"
                      defaultValue="ATH Tennis Academy"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Indirizzo Email
                      </label>
                      <input
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ath-blue/20"
                        defaultValue="contact@ath-tennis.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Numero di Telefono
                      </label>
                      <input
                        type="tel"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ath-blue/20"
                        defaultValue="+39 123 456 7890"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Indirizzo
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ath-blue/20 mb-2"
                      defaultValue="Via dei Campi Sportivi, 123"
                    />
                    <div className="grid grid-cols-3 gap-4">
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ath-blue/20"
                        placeholder="Città"
                        defaultValue="Roma"
                      />
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ath-blue/20"
                        placeholder="Provincia"
                        defaultValue="RM"
                      />
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ath-blue/20"
                        placeholder="CAP"
                        defaultValue="00123"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Orari di Apertura
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Orario Apertura</label>
                        <input
                          type="time"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ath-blue/20"
                          defaultValue="08:00"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Orario Chiusura</label>
                        <input
                          type="time"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ath-blue/20"
                          defaultValue="20:00"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-4 flex flex-wrap gap-3">
                      {["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato", "Domenica"].map((day) => (
                        <label
                          key={day}
                          className="inline-flex items-center"
                        >
                          <input
                            type="checkbox"
                            className="form-checkbox h-4 w-4 text-ath-blue rounded focus:ring-2 focus:ring-ath-blue/20"
                            defaultChecked={day !== "Domenica"}
                          />
                          <span className="ml-2 text-sm text-gray-700">{day}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t flex justify-end">
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-ath-blue text-white hover:bg-ath-blue-dark transition-colors">
                    <Save className="h-4 w-4" />
                    <span>Salva Modifiche</span>
                  </button>
                </div>
              </div>
            )}
            
            {activeTab === "imports" && (
              <div className="animate-fade-in">
                <h2 className="text-xl font-semibold mb-6">Importazione Dati</h2>
                
                <div className="space-y-6">
                  <div className="bg-white p-6 border rounded-lg">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-medium flex items-center">
                          <User className="h-5 w-5 mr-2" />
                          Importa Persone
                        </h3>
                        <p className="text-gray-600 text-sm mt-1">
                          Importa allievi e coach da un file Excel
                        </p>
                      </div>
                      
                      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
                        <DialogTrigger asChild>
                          <Button className="bg-ath-blue hover:bg-ath-blue-dark">
                            <Upload className="h-4 w-4 mr-2" />
                            Importa Excel
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[750px]">
                          <DialogHeader>
                            <DialogTitle>Importa Allievi e Coach</DialogTitle>
                          </DialogHeader>
                          
                          {importStep === 'upload' && (
                            <div className="py-6">
                              <div className="bg-blue-50 text-blue-700 p-4 rounded-lg mb-6 flex items-start">
                                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                                <div>
                                  <p className="text-sm font-medium">Per una corretta importazione:</p>
                                  <ul className="text-sm mt-1 list-disc pl-5">
                                    <li>Il file deve essere in formato Excel (.xlsx)</li>
                                    <li>Deve contenere almeno le colonne: name/nome e type/tipo</li>
                                    <li>I tipi validi sono "player" o "coach"</li>
                                    <li>Colonne opzionali: email, phone/telefono, programId, notes/note</li>
                                  </ul>
                                </div>
                              </div>
                              
                              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6">
                                <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                                <p className="text-sm text-gray-600 mb-4">
                                  Trascina un file Excel o fai clic per selezionarne uno
                                </p>
                                <input 
                                  type="file" 
                                  className="hidden" 
                                  ref={fileInputRef}
                                  accept=".xlsx, .xls" 
                                  onChange={handleFileUpload}
                                />
                                <Button 
                                  onClick={() => fileInputRef.current?.click()}
                                  variant="outline" 
                                  className="mx-auto"
                                >
                                  Seleziona File
                                </Button>
                              </div>
                              
                              <div className="flex justify-between">
                                <Button 
                                  variant="outline" 
                                  onClick={downloadSampleTemplate}
                                  className="flex items-center"
                                >
                                  <Download className="h-4 w-4 mr-2" />
                                  Scarica Template
                                </Button>
                                <Button 
                                  onClick={() => setIsImportDialogOpen(false)}
                                  variant="ghost"
                                >
                                  Annulla
                                </Button>
                              </div>
                            </div>
                          )}
                          
                          {importStep === 'preview' && (
                            <div className="py-4">
                              <div className="max-h-[400px] overflow-y-auto mb-6">
                                <table className="w-full border-collapse">
                                  <thead className="bg-gray-50 sticky top-0">
                                    <tr>
                                      <th className="p-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                                      <th className="p-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                                      <th className="p-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                      <th className="p-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Programma</th>
                                      <th className="p-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stato</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-200">
                                    {importedData.map((person, index) => (
                                      <tr key={index} className={person.valid ? "" : "bg-red-50"}>
                                        <td className="p-2 text-sm">{person.name || '-'}</td>
                                        <td className="p-2 text-sm">{person.type || '-'}</td>
                                        <td className="p-2 text-sm">{person.email || '-'}</td>
                                        <td className="p-2 text-sm">{person.programId || '-'}</td>
                                        <td className="p-2 text-sm">
                                          {person.valid ? (
                                            <span className="text-green-600 font-medium flex items-center">
                                              <Check className="h-4 w-4 mr-1" /> Valido
                                            </span>
                                          ) : (
                                            <span className="text-red-600 font-medium flex items-center">
                                              <X className="h-4 w-4 mr-1" /> {person.error || 'Errore'}
                                            </span>
                                          )}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                              
                              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <p className="text-sm font-medium">Riepilogo</p>
                                    <p className="text-sm text-gray-600">
                                      Persone trovate: {importedData.length} | 
                                      Valide: {importedData.filter(p => p.valid).length} | 
                                      Con errori: {importedData.filter(p => !p.valid).length}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex justify-end gap-3">
                                <Button 
                                  variant="outline" 
                                  onClick={() => setImportStep('upload')}
                                >
                                  Indietro
                                </Button>
                                <Button 
                                  onClick={handleImport}
                                  disabled={importedData.filter(p => p.valid).length === 0}
                                >
                                  Importa {importedData.filter(p => p.valid).length} Persone
                                </Button>
                              </div>
                            </div>
                          )}
                          
                          {importStep === 'complete' && (
                            <div className="py-6 text-center">
                              <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Check className="h-8 w-8 text-green-600" />
                              </div>
                              <h3 className="text-lg font-medium mb-2">Importazione Completata</h3>
                              <p className="text-gray-600 mb-6">
                                {importedData.filter(p => p.valid).length} persone sono state importate con successo.
                              </p>
                              <Button onClick={resetImport}>Chiudi</Button>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                    
                    <Tabs defaultValue="info">
                      <TabsList>
                        <TabsTrigger value="info">Informazioni</TabsTrigger>
                        <TabsTrigger value="history">Storico Importazioni</TabsTrigger>
                      </TabsList>
                      <TabsContent value="info" className="pt-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-medium mb-2">Come funziona l'importazione?</h4>
                          <p className="text-sm text-gray-600 mb-2">
                            Puoi importare allievi e coach da un file Excel seguendo questi passaggi:
                          </p>
                          <ol className="text-sm text-gray-600 space-y-1 list-decimal pl-4">
                            <li>Scarica il nostro template Excel o prepara un file con le colonne necessarie</li>
                            <li>Compila il file con i dati delle persone da importare</li>
                            <li>Carica il file dal pulsante "Importa Excel"</li>
                            <li>Verifica i dati nella fase di anteprima</li>
                            <li>Conferma l'importazione</li>
                          </ol>
                          <div className="mt-4 flex justify-start">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={downloadSampleTemplate}
                              className="flex items-center"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Scarica Template
                            </Button>
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="history" className="pt-4">
                        <div className="text-sm text-gray-500 italic">
                          Nessuna importazione recente.
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                  
                  <div className="bg-white p-6 border rounded-lg opacity-60">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-medium flex items-center">
                          <CalendarIcon className="h-5 w-5 mr-2" />
                          Importa Programmazione
                        </h3>
                        <p className="text-gray-600 text-sm mt-1">
                          Importa orari e programmazione campi da un file Excel
                        </p>
                      </div>
                      
                      <Button className="bg-gray-300" disabled>
                        <Upload className="h-4 w-4 mr-2" />
                        Prossimamente
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === "integrations" && (
              <div className="animate-fade-in">
                <h2 className="text-xl font-semibold mb-6">Integrazioni API</h2>
                
                <div className="space-y-8">
                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium">Vicki Coach Analytics</h3>
                        <p className="text-gray-600 text-sm mt-1">
                          Connettiti a Vicki per dati di coaching e preferenze degli atleti
                        </p>
                      </div>
                      <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                        Connesso
                      </div>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          API Key
                        </label>
                        <div className="flex">
                          <input
                            type="password"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-ath-blue/20"
                            value="••••••••••••••••••••••"
                            readOnly
                          />
                          <button className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg text-gray-700 hover:bg-gray-200 transition-colors">
                            Mostra
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          URL Endpoint
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ath-blue/20"
                          defaultValue="https://api.vicki.ai/v2/"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Frequenza Sincronizzazione Dati
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ath-blue/20 bg-white">
                        <option>Tempo reale</option>
                        <option>Ogni 15 minuti</option>
                        <option>Ogni ora</option>
                        <option>Ogni giorno</option>
                      </select>
                    </div>
                    
                    <div className="mt-4 flex justify-end">
                      <button className="px-3 py-1.5 bg-ath-blue text-white rounded hover:bg-ath-blue-dark transition-colors text-sm">
                        Aggiorna Impostazioni
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium">Playtomic</h3>
                        <p className="text-gray-600 text-sm mt-1">
                          Sincronizza prenotazioni esterne con la piattaforma Playtomic
                        </p>
                      </div>
                      <div className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-medium">
                        Configurazione Richiesta
                      </div>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          API Key
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ath-blue/20"
                          placeholder="Inserisci la tua API key di Playtomic"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          ID Account
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ath-blue/20"
                          placeholder="Inserisci il tuo ID Account"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-end">
                      <button className="px-3 py-1.5 bg-ath-blue text-white rounded hover:bg-ath-blue-dark transition-colors text-sm">
                        Connetti
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium">KNX Home Automation</h3>
                        <p className="text-gray-600 text-sm mt-1">
                          Controlla automaticamente l'illuminazione e i sistemi climatici dei campi
                        </p>
                      </div>
                      <div className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                        Non Connesso
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-sm">
                        Configura Connessione
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {(activeTab !== "general" && activeTab !== "integrations" && activeTab !== "imports") && (
              <div className="py-16 text-center">
                <h2 className="text-xl font-semibold text-gray-400 mb-2">
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                </h2>
                <p className="text-gray-500">
                  Questa sezione è in fase di sviluppo
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Check(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function X(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" x2="6" y1="6" y2="18" />
      <line x1="6" x2="18" y1="6" y2="18" />
    </svg>
  )
}
