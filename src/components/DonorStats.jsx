import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import donorStats from "../data/donorStats";

const columns = [
  { field: 'state', headerName: 'State/UT', width: 180, sortable: true },
  { field: 'count', headerName: 'Donors', width: 120, sortable: true },
];

export default function DonorStats() {
  return (
    <div style={{ height: 370, width: 320 }}>
      <h2>Donor Registered</h2>
      <DataGrid rows={donorStats} columns={columns} pageSize={8} />
    </div>
  );
}
