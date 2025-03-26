
import { TableCell, TableRow } from "@/components/ui/table";

export function NoPlayersFound() {
  return (
    <TableRow>
      <TableCell colSpan={5} className="text-center py-8 text-gray-500">
        Nessun giocatore trovato con i criteri di ricerca specificati
      </TableCell>
    </TableRow>
  );
}
