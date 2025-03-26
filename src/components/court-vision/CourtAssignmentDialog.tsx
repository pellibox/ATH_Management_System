
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { CourtAssignmentProps } from "./court-assignment/types";
import { MobileDrawer } from "./court-assignment/MobileDrawer";
import { DesktopDialog } from "./court-assignment/DesktopDialog";

export function CourtAssignmentDialog(props: CourtAssignmentProps) {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  return isMobile ? (
    <MobileDrawer {...props} open={open} setOpen={setOpen} />
  ) : (
    <DesktopDialog {...props} open={open} setOpen={setOpen} />
  );
}
