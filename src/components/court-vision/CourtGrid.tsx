
import React, { forwardRef } from "react";
import { CourtGridProps } from "./court-grid/types";
import CourtGridComponent from "./court-grid/CourtGrid";

const CourtGrid = forwardRef<HTMLDivElement, CourtGridProps>((props, ref) => {
  return <CourtGridComponent {...props} ref={ref} />;
});

CourtGrid.displayName = "CourtGrid";

export default CourtGrid;
