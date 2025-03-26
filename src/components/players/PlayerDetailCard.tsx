
import { useState, useEffect } from "react";
import { Player } from "@/types/player";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Calendar, 
  FileText, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  AlertTriangle,
  FileCheck,
  CalendarDays,
  Tag,
  Save,
  Pencil
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePlayerContext } from "@/contexts/PlayerContext";

interface PlayerDetailCardProps {
  player: Player;
  onClose: () => void;
  extraActivities?: any[];
}

export function PlayerDetailCard({ player, onClose, extraActivities = [] }: PlayerDetailCardProps) {
  const [activeTab, setActiveTab] = useState("info");
  const [isEditing, setIsEditing] = useState(false);
  const [editedPlayer, setEditedPlayer] = useState<Player>({ ...player });
  
  const { players, setPlayers } = usePlayerContext();
  
  // Get all program names from existing players
  const programs = Array.from(
    new Set(players.filter(p => p.program).map(p => p.program))
  );
  
  // When player prop changes, update the editedPlayer state
  useEffect(() => {
    setEditedPlayer({ ...player });
  }, [player]);
  
  // Calculate medical information status
  const hasMedicalInfo = editedPlayer.medicalExam?.date && editedPlayer.medicalExam?.expiryDate;
  const isMedicalValid = hasMedicalInfo && new Date(editedPlayer.medicalExam?.expiryDate!) > new Date();
  const daysUntilExpiry = hasMedicalInfo 
    ? Math.ceil((new Date(editedPlayer.medicalExam?.expiryDate!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : 0;
  
  // Calculate program hours
  const programHours = editedPlayer.program ? 40 : 0; // Default to 40 hours if in a program
  const completedHours = editedPlayer.completedHours || 0;
  const hoursProgress = programHours > 0 ? (completedHours / programHours) * 100 : 0;
  
  // Get player's activities
  const playerActivities = extraActivities.filter(activity => 
    activity.participants?.includes(editedPlayer.id)
  );

  // Get background color for the player avatar based on the program
  const getAvatarBgColor = () => {
    if (!editedPlayer.program) return "bg-gray-500";
    
    // Create a simple hash of the program name to get a deterministic color
    const hash = editedPlayer.program.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colors = ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-orange-500", "bg-pink-500", "bg-teal-500"];
    return colors[hash % colors.length];
  };

  const handleInputChange = (field: keyof Player, value: any) => {
    setEditedPlayer(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedChange = (parent: keyof Player, field: string, value: any) => {
    const currentParentValue = editedPlayer[parent] || {};
    
    setEditedPlayer(prev => ({
      ...prev,
      [parent]: {
        ...currentParentValue,
        [field]: value
      }
    }));
  };

  const handleSave = () => {
    // Update player in the context
    setPlayers(players.map(p => 
      p.id === editedPlayer.id ? editedPlayer : p
    ));
    
    setIsEditing(false);
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl flex items-center">
              <span 
                className={`h-10 w-10 rounded-full flex items-center justify-center text-white mr-3 text-lg ${getAvatarBgColor()}`}
              >
                {editedPlayer.name.substring(0, 1)}
              </span>
              {isEditing ? (
                <Input 
                  value={editedPlayer.name} 
                  onChange={(e) => handleInputChange('name', e.target.value)} 
                  className="max-w-[250px]"
                />
              ) : (
                editedPlayer.name
              )}
              <Badge className="ml-3" variant={editedPlayer.status === 'active' ? "default" : "destructive"}>
                {isEditing ? (
                  <Select 
                    value={editedPlayer.status} 
                    onValueChange={(value) => handleInputChange('status', value)}
                  >
                    <SelectTrigger className="h-6 w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Attivo</SelectItem>
                      <SelectItem value="inactive">Inattivo</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  editedPlayer.status === 'active' ? 'Attivo' : 'Inattivo'
                )}
              </Badge>
            </CardTitle>
            <CardDescription className="mt-1 flex items-center gap-2">
              {isEditing ? (
                <div className="flex items-center">
                  <Tag className="h-4 w-4 mr-1" />
                  <Select 
                    value={editedPlayer.program || ""}
                    onValueChange={(value) => handleInputChange('program', value)}
                  >
                    <SelectTrigger className="w-44">
                      <SelectValue placeholder="Seleziona programma" />
                    </SelectTrigger>
                    <SelectContent>
                      {programs.map(program => (
                        <SelectItem key={program} value={program}>{program}</SelectItem>
                      ))}
                      <SelectItem value="">Nessun programma</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                editedPlayer.program ? (
                  <span className="flex items-center">
                    <Tag className="h-4 w-4 mr-1" />
                    Programma: {editedPlayer.program}
                  </span>
                ) : (
                  <span className="text-gray-500">Nessun programma assegnato</span>
                )
              )}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button 
              variant={isEditing ? "default" : "outline"} 
              size="sm" 
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            >
              {isEditing ? (
                <>
                  <Save className="h-4 w-4 mr-1" />
                  Salva
                </>
              ) : (
                <>
                  <Pencil className="h-4 w-4 mr-1" />
                  Modifica
                </>
              )}
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>×</Button>
          </div>
        </div>
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-2 mx-4">
          <TabsTrigger value="info">Info</TabsTrigger>
          <TabsTrigger value="medical">Sanitario</TabsTrigger>
          <TabsTrigger value="hours">Ore</TabsTrigger>
          <TabsTrigger value="documents">Documenti</TabsTrigger>
        </TabsList>
        
        <TabsContent value="info" className="space-y-4">
          <CardContent className="p-4 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-500">Informazioni Personali</h3>
                
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-gray-500" />
                    {isEditing ? (
                      <Input 
                        value={editedPlayer.email} 
                        onChange={(e) => handleInputChange('email', e.target.value)} 
                        className="h-8"
                      />
                    ) : (
                      <span>{editedPlayer.email}</span>
                    )}
                  </div>
                  
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-gray-500" />
                    {isEditing ? (
                      <Input 
                        value={editedPlayer.phone} 
                        onChange={(e) => handleInputChange('phone', e.target.value)} 
                        className="h-8"
                      />
                    ) : (
                      <span>{editedPlayer.phone}</span>
                    )}
                  </div>
                  
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                    {isEditing ? (
                      <div className="flex items-center gap-2">
                        <Input
                          type="date"
                          value={editedPlayer.dateOfBirth || ""}
                          onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                          className="h-8 w-40"
                        />
                        <Input
                          type="number"
                          value={editedPlayer.age || ""}
                          onChange={(e) => handleInputChange('age', parseInt(e.target.value) || undefined)}
                          className="h-8 w-16"
                          placeholder="Età"
                        />
                      </div>
                    ) : (
                      <span>
                        {editedPlayer.dateOfBirth ? `Nato il ${editedPlayer.dateOfBirth}` : ""} 
                        {editedPlayer.age ? `(${editedPlayer.age} anni)` : ""}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center">
                    <CalendarDays className="h-4 w-4 mr-2 text-gray-500" />
                    {isEditing ? (
                      <Input
                        type="date"
                        value={editedPlayer.joinDate || ""}
                        onChange={(e) => handleInputChange('joinDate', e.target.value)}
                        className="h-8"
                      />
                    ) : (
                      <span>
                        {editedPlayer.joinDate ? `Iscritto dal ${editedPlayer.joinDate}` : "Data iscrizione non specificata"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-500">Dettagli Sportivi</h3>
                
                <div className="space-y-2">
                  {isEditing ? (
                    <div className="space-y-1">
                      <label className="text-xs text-gray-500">Sport:</label>
                      <Input
                        value={editedPlayer.sports?.join(", ") || ""}
                        onChange={(e) => handleInputChange('sports', e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
                        placeholder="Inserisci sport separati da virgole"
                        className="h-8"
                      />
                    </div>
                  ) : (
                    editedPlayer.sports && editedPlayer.sports.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        <span className="text-gray-500 mr-2">Sport:</span>
                        {editedPlayer.sports.map(sport => (
                          <Badge key={sport} variant="outline">{sport}</Badge>
                        ))}
                      </div>
                    )
                  )}
                  
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Obiettivi</h4>
                    {isEditing ? (
                      <div className="space-y-2">
                        <div>
                          <label className="text-xs text-gray-500">Giornalieri:</label>
                          <Textarea
                            value={editedPlayer.objectives?.daily || ""}
                            onChange={(e) => handleNestedChange('objectives', 'daily', e.target.value)}
                            className="min-h-[60px]"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500">Settimanali:</label>
                          <Textarea
                            value={editedPlayer.objectives?.weekly || ""}
                            onChange={(e) => handleNestedChange('objectives', 'weekly', e.target.value)}
                            className="min-h-[60px]"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500">Stagionali:</label>
                          <Textarea
                            value={editedPlayer.objectives?.seasonal || ""}
                            onChange={(e) => handleNestedChange('objectives', 'seasonal', e.target.value)}
                            className="min-h-[60px]"
                          />
                        </div>
                      </div>
                    ) : (
                      <>
                        {editedPlayer.objectives?.daily && (
                          <div className="mb-1">
                            <span className="text-xs text-gray-500">Giornalieri:</span>
                            <p className="text-sm">{editedPlayer.objectives.daily}</p>
                          </div>
                        )}
                        {editedPlayer.objectives?.weekly && (
                          <div className="mb-1">
                            <span className="text-xs text-gray-500">Settimanali:</span>
                            <p className="text-sm">{editedPlayer.objectives.weekly}</p>
                          </div>
                        )}
                        {editedPlayer.objectives?.seasonal && (
                          <div className="mb-1">
                            <span className="text-xs text-gray-500">Stagionali:</span>
                            <p className="text-sm">{editedPlayer.objectives.seasonal}</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Note</h3>
              {isEditing ? (
                <Textarea
                  value={editedPlayer.notes || ""}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  className="min-h-[100px]"
                />
              ) : (
                <div className="bg-gray-50 p-3 rounded-md text-sm">
                  {editedPlayer.notes || "Nessuna nota"}
                </div>
              )}
            </div>
          </CardContent>
        </TabsContent>
        
        <TabsContent value="medical">
          <CardContent className="p-4 pt-2">
            <div className="space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-medium">Stato Sanitario</h3>
                  <p className="text-sm text-gray-500">Gestione della certificazione medico-sportiva</p>
                </div>
                
                <Badge 
                  variant={isMedicalValid ? "default" : "destructive"}
                  className="text-xs"
                >
                  {isMedicalValid ? "Valido" : "Scaduto o Mancante"}
                </Badge>
              </div>
              
              {isEditing || hasMedicalInfo ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className={isEditing ? "" : "bg-gray-50 p-3 rounded-md"}>
                      <p className="text-xs text-gray-500">Data Visita</p>
                      {isEditing ? (
                        <Input
                          type="date"
                          value={editedPlayer.medicalExam?.date || ""}
                          onChange={(e) => handleNestedChange('medicalExam', 'date', e.target.value)}
                          className="h-8 mt-1"
                        />
                      ) : (
                        <p className="font-medium">
                          {editedPlayer.medicalExam?.date ? 
                            format(new Date(editedPlayer.medicalExam.date), "dd/MM/yyyy") : 
                            "Non specificato"}
                        </p>
                      )}
                    </div>
                    
                    <div className={isEditing ? "" : "bg-gray-50 p-3 rounded-md"}>
                      <p className="text-xs text-gray-500">Data Scadenza</p>
                      {isEditing ? (
                        <Input
                          type="date"
                          value={editedPlayer.medicalExam?.expiryDate || ""}
                          onChange={(e) => handleNestedChange('medicalExam', 'expiryDate', e.target.value)}
                          className="h-8 mt-1"
                        />
                      ) : (
                        <p className="font-medium">
                          {editedPlayer.medicalExam?.expiryDate ? 
                            format(new Date(editedPlayer.medicalExam.expiryDate), "dd/MM/yyyy") : 
                            "Non specificato"}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {!isEditing && (
                    <>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Tempo rimasto alla scadenza</span>
                          <span className={`text-sm font-medium ${
                            daysUntilExpiry > 30 ? "text-green-600" : 
                            daysUntilExpiry > 14 ? "text-yellow-600" : 
                            "text-red-600"
                          }`}>
                            {daysUntilExpiry} giorni
                          </span>
                        </div>
                        
                        <Progress 
                          value={Math.min(100, (daysUntilExpiry / 365) * 100)} 
                          className={`h-2 ${
                            daysUntilExpiry > 30 ? "bg-green-100" : 
                            daysUntilExpiry > 14 ? "bg-yellow-100" : 
                            "bg-red-100"
                          }`}
                        />
                      </div>
                      
                      {daysUntilExpiry <= 30 && (
                        <div className={`p-3 rounded-md flex items-start gap-2 ${
                          daysUntilExpiry <= 14 ? "bg-red-50 text-red-700" : "bg-yellow-50 text-yellow-700"
                        }`}>
                          <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium">
                              {daysUntilExpiry <= 0 
                                ? "Certificato medico scaduto!" 
                                : `Il certificato medico scadrà tra ${daysUntilExpiry} giorni`}
                            </p>
                            <p className="text-sm mt-1">
                              {daysUntilExpiry <= 0 
                                ? "È necessario rinnovare il certificato prima di riprendere l'attività sportiva." 
                                : "Si consiglia di pianificare una nuova visita medica al più presto."}
                            </p>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  
                  <div className="space-y-2">
                    <p className="text-xs text-gray-500">Tipo di Certificato</p>
                    {isEditing ? (
                      <Select 
                        value={editedPlayer.medicalExam?.type || "Non-Agonistic"}
                        onValueChange={(value) => handleNestedChange('medicalExam', 'type', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Agonistic">Agonistico</SelectItem>
                          <SelectItem value="Non-Agonistic">Non Agonistico</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p>{editedPlayer.medicalExam?.type === "Agonistic" ? "Agonistico" : "Non Agonistico"}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-xs text-gray-500">Medico</p>
                    {isEditing ? (
                      <Input
                        value={editedPlayer.medicalExam?.doctor || ""}
                        onChange={(e) => handleNestedChange('medicalExam', 'doctor', e.target.value)}
                        placeholder="Nome del medico"
                      />
                    ) : (
                      <p>{editedPlayer.medicalExam?.doctor || "Non specificato"}</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-md bg-red-50 text-red-700 flex items-center gap-3">
                  <AlertTriangle className="h-6 w-6" />
                  <div>
                    <p className="font-medium">Certificato medico non presente</p>
                    <p className="text-sm mt-1">Nessun certificato medico registrato per questo tesserato.</p>
                  </div>
                </div>
              )}
              
              {!isEditing && (
                <div className="pt-4">
                  <Button 
                    className="w-full"
                    onClick={() => setIsEditing(true)}
                  >
                    <FileCheck className="mr-2 h-4 w-4" />
                    {hasMedicalInfo ? "Aggiorna Certificato Medico" : "Carica Certificato Medico"}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </TabsContent>
        
        <TabsContent value="hours">
          <CardContent className="p-4 pt-2">
            <div className="space-y-5">
              <div>
                <h3 className="text-base font-medium">Ore Programma</h3>
                <p className="text-sm text-gray-500">Monitoraggio delle ore completate rispetto al programma</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Ore completate</span>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={editedPlayer.completedHours || 0}
                      onChange={(e) => handleInputChange('completedHours', parseInt(e.target.value) || 0)}
                      className="h-7 w-24"
                    />
                  ) : (
                    <span className="text-sm font-medium">{completedHours} / {programHours} ore</span>
                  )}
                </div>
                <Progress value={hoursProgress} className="h-2" />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-xs text-gray-500">Ore Allenamento</p>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={editedPlayer.trainingHours || 0}
                      onChange={(e) => handleInputChange('trainingHours', parseInt(e.target.value) || 0)}
                      className="h-7 w-full mt-1"
                    />
                  ) : (
                    <p className="font-medium text-lg">{editedPlayer.trainingHours || 0}</p>
                  )}
                </div>
                
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-xs text-gray-500">Ore Extra</p>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={editedPlayer.extraHours || 0}
                      onChange={(e) => handleInputChange('extraHours', parseInt(e.target.value) || 0)}
                      className="h-7 w-full mt-1"
                    />
                  ) : (
                    <p className="font-medium text-lg">{editedPlayer.extraHours || 0}</p>
                  )}
                </div>
                
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-xs text-gray-500">Ore Assenze</p>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={editedPlayer.missedHours || 0}
                      onChange={(e) => handleInputChange('missedHours', parseInt(e.target.value) || 0)}
                      className="h-7 w-full mt-1"
                    />
                  ) : (
                    <p className="font-medium text-lg">{editedPlayer.missedHours || 0}</p>
                  )}
                </div>
              </div>
              
              {playerActivities.length > 0 && (
                <div>
                  <h3 className="text-base font-medium mb-2">Ultime Attività</h3>
                  <div className="space-y-2">
                    {playerActivities.slice(0, 5).map(activity => (
                      <div key={activity.id} className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-gray-500" />
                          <span>{activity.name}</span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {activity.date} • {activity.duration} ore
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {playerActivities.length > 5 && (
                    <Button variant="link" className="mt-2 h-auto p-0">
                      Vedi tutte ({playerActivities.length})
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </TabsContent>
        
        <TabsContent value="documents">
          <CardContent className="p-4 pt-2">
            <div className="space-y-5">
              <div>
                <h3 className="text-base font-medium">Documenti</h3>
                <p className="text-sm text-gray-500">Gestione dei documenti associati al tesserato</p>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                <div className="border border-gray-200 rounded-md overflow-hidden">
                  <div className="bg-gray-50 p-3 flex justify-between items-center">
                    <h4 className="font-medium">Documenti Personali</h4>
                    <Button size="sm" variant="outline">Carica</Button>
                  </div>
                  
                  <div className="divide-y">
                    {editedPlayer.documents?.length ? (
                      editedPlayer.documents.map((doc, i) => (
                        <div key={i} className="p-3 flex justify-between items-center">
                          <div className="flex items-center">
                            <FileText className="h-5 w-5 mr-2 text-gray-500" />
                            <div>
                              <p className="font-medium text-sm">{doc.name}</p>
                              <p className="text-xs text-gray-500">Caricato il {doc.uploadDate}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="ghost">Visualizza</Button>
                            <Button size="sm" variant="ghost" className="text-red-500">Elimina</Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        <FileText className="h-6 w-6 mx-auto mb-2 opacity-50" />
                        <p>Nessun documento caricato</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-md overflow-hidden">
                  <div className="bg-gray-50 p-3 flex justify-between items-center">
                    <h4 className="font-medium">Tessera Associativa</h4>
                    <Button size="sm" variant="outline">Genera</Button>
                  </div>
                  
                  <div className="p-4 text-center text-gray-500">
                    <FileText className="h-6 w-6 mx-auto mb-2 opacity-50" />
                    <p>Nessuna tessera generata</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </TabsContent>
      </Tabs>
      
      <CardFooter className="flex justify-end gap-2 pt-2">
        {isEditing ? (
          <>
            <Button variant="outline" onClick={() => {
              setEditedPlayer({...player});
              setIsEditing(false);
            }}>Annulla</Button>
            <Button onClick={handleSave}>Salva Modifiche</Button>
          </>
        ) : (
          <Button variant="outline" onClick={onClose}>Chiudi</Button>
        )}
      </CardFooter>
    </Card>
  );
}
