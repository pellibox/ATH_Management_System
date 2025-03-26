
import { SortAsc, SortDesc } from "lucide-react";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface SortIconProps {
  column: string;
  sortColumn: string;
  sortDirection: "asc" | "desc";
}

function SortIcon({ column, sortColumn, sortDirection }: SortIconProps) {
  if (sortColumn !== column) return null;
  return sortDirection === "asc" ? (
    <SortAsc className="h-4 w-4 ml-1 inline" />
  ) : (
    <SortDesc className="h-4 w-4 ml-1 inline" />
  );
}

interface PlayerTableHeaderProps {
  sortColumn: "name" | "program" | "email" | "phone";
  sortDirection: "asc" | "desc";
  handleSort: (column: "name" | "program" | "email" | "phone") => void;
}

export function PlayerTableHeader({ sortColumn, sortDirection, handleSort }: PlayerTableHeaderProps) {
  return (
    <TableHeader>
      <TableRow>
        <TableHead 
          className="cursor-pointer hover:bg-gray-50"
          onClick={() => handleSort("name")}
        >
          Nome <SortIcon column="name" sortColumn={sortColumn} sortDirection={sortDirection} />
        </TableHead>
        <TableHead 
          className="cursor-pointer hover:bg-gray-50"
          onClick={() => handleSort("program")}
        >
          Programma <SortIcon column="program" sortColumn={sortColumn} sortDirection={sortDirection} />
        </TableHead>
        <TableHead 
          className="cursor-pointer hover:bg-gray-50"
          onClick={() => handleSort("email")}
        >
          Email <SortIcon column="email" sortColumn={sortColumn} sortDirection={sortDirection} />
        </TableHead>
        <TableHead 
          className="cursor-pointer hover:bg-gray-50"
          onClick={() => handleSort("phone")}
        >
          Telefono <SortIcon column="phone" sortColumn={sortColumn} sortDirection={sortDirection} />
        </TableHead>
        <TableHead className="text-right">Azioni</TableHead>
      </TableRow>
    </TableHeader>
  );
}
