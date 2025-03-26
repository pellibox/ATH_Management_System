
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { Player } from "@/types/player";

interface DocumentsTabProps {
  player: Player;
}

export function DocumentsTab({ player }: DocumentsTabProps) {
  return (
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
  );
}
