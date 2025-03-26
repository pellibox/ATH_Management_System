import { useState } from "react";
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
  Tag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface PlayerDetailCardProps {
  player: Player;
  onClose: () => void;
  extraActivities?: any[];
}

export function PlayerDetailCard({ player, onClose, extraActivities = [] }: PlayerDetailCardProps) {
  const [activeTab, setActiveTab] = useState("info");
  
  // Calculate medical information status
  const hasMedicalInfo = player.medicalExam?.date && player.medicalExam?.expiryDate;
  const isMedicalValid = hasMedicalInfo && new Date(player.medicalExam?.expiryDate!) > new Date();
  const daysUntilExpiry = hasMedicalInfo 
    ? Math.ceil((new Date(player.medicalExam?.expiryDate!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : 0;
  
  // Calculate program hours
  const programHours = player.program ? 40 : 0; // Default to 40 hours if in a program
  const completedHours = player.completedHours || 0;
  const hoursProgress = programHours > 0 ? (completedHours / programHours) * 100 : 0;
  
  // Get player's activities
  const playerActivities = extraActivities.filter(activity => 
    activity.participants?.includes(player.id)
  );

  // Get background color for the player avatar based on the program instead of level
  const getAvatarBgColor = () => {
    if (!player.program) return "bg-gray-500";
    
    // Create a simple hash of the program name to get a deterministic color
    const hash = player.program.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colors = ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-orange-500", "bg-pink-500", "bg-teal-500"];
    return colors[hash % colors.length];
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
                {player.name.substring(0, 1)}
              </span>
              {player.name}
              <Badge className="ml-3" variant={player.status === 'active' ? "default" : "destructive"}>
                {player.status === 'active' ? 'Attivo' : 'Inattivo'}
              </Badge>
            </CardTitle>
            <CardDescription className="mt-1 flex items-center gap-2">
              {player.program ? (
                <span className="flex items-center">
                  <Tag className="h-4 w-4 mr-1" />
                  Programma: {player.program}
                </span>
              ) : (
                <span className="text-gray-500">Nessun programma assegnato</span>
              )}
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>×</Button>
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
                  {player.email && (
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{player.email}</span>
                    </div>
                  )}
                  
                  {player.phone && (
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{player.phone}</span>
                    </div>
                  )}
                  
                  {player.dateOfBirth && (
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      <span>Nato il {player.dateOfBirth} ({player.age} anni)</span>
                    </div>
                  )}
                  
                  {player.joinDate && (
                    <div className="flex items-center">
                      <CalendarDays className="h-4 w-4 mr-2 text-gray-500" />
                      <span>Iscritto dal {player.joinDate}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-500">Dettagli Sportivi</h3>
                
                <div className="space-y-2">
                  {player.sports && player.sports.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      <span className="text-gray-500 mr-2">Sport:</span>
                      {player.sports.map(sport => (
                        <Badge key={sport} variant="outline">{sport}</Badge>
                      ))}
                    </div>
                  )}
                  
                  {player.objectives && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Obiettivi</h4>
                      {player.objectives.daily && (
                        <div className="mb-1">
                          <span className="text-xs text-gray-500">Giornalieri:</span>
                          <p className="text-sm">{player.objectives.daily}</p>
                        </div>
                      )}
                      {player.objectives.weekly && (
                        <div className="mb-1">
                          <span className="text-xs text-gray-500">Settimanali:</span>
                          <p className="text-sm">{player.objectives.weekly}</p>
                        </div>
                      )}
                      {player.objectives.seasonal && (
                        <div className="mb-1">
                          <span className="text-xs text-gray-500">Stagionali:</span>
                          <p className="text-sm">{player.objectives.seasonal}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {player.notes && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Note</h3>
                <div className="bg-gray-50 p-3 rounded-md text-sm">{player.notes}</div>
              </div>
            )}
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
              
              {hasMedicalInfo ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-md">
                      <p className="text-xs text-gray-500">Data Visita</p>
                      <p className="font-medium">
                        {format(new Date(player.medicalExam!.date), "dd/MM/yyyy")}
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded-md">
                      <p className="text-xs text-gray-500">Data Scadenza</p>
                      <p className="font-medium">
                        {format(new Date(player.medicalExam!.expiryDate), "dd/MM/yyyy")}
                      </p>
                    </div>
                  </div>
                  
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
              
              <div className="pt-4">
                <Button className="w-full">
                  <FileCheck className="mr-2 h-4 w-4" />
                  {hasMedicalInfo ? "Aggiorna Certificato Medico" : "Carica Certificato Medico"}
                </Button>
              </div>
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
                  <span className="text-sm font-medium">{completedHours} / {programHours} ore</span>
                </div>
                <Progress value={hoursProgress} className="h-2" />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-xs text-gray-500">Ore Allenamento</p>
                  <p className="font-medium text-lg">{player.trainingHours || 0}</p>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-xs text-gray-500">Ore Extra</p>
                  <p className="font-medium text-lg">{player.extraHours || 0}</p>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-xs text-gray-500">Ore Assenze</p>
                  <p className="font-medium text-lg">{player.missedHours || 0}</p>
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
                    {player.documents?.length ? (
                      player.documents.map((doc, i) => (
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
        <Button variant="outline" onClick={onClose}>Chiudi</Button>
        <Button>Salva Modifiche</Button>
      </CardFooter>
    </Card>
  );
}
