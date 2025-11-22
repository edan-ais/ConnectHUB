import React from "react";
import { useInventoryStore } from "../../state/inventoryStore";
import { ActivityLogEntry } from "../../lib/types";

const typeLabel: Record<ActivityLogEntry["type"], string> = {
  IMPORT_FAIRE: "Imported from Faire",
  MANUAL_CREATE: "Manual product",
  EDIT: "Edit",
  VALIDATE: "Validated",
  PUSH_SQUARE: "Pushed to Square",
  PUSH_QB: "Pushed to QuickBooks",
  PUSH_BOOKER: "Pushed to Booker",
  INVENTORY_ADJUSTMENT: "Inventory adjustment"
};

export const ActivityLogView: React.FC = () => {
  const logs = useInventoryStore(s => s.activityLog);

  return (
    <div className="sheet-container">
      <div className="sheet-name">Activity Log</div>
      <div className="sheet-table-wrapper">
        <table className="sheet-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Type</th>
              <th>Message</th>
              <th>Product</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log.id}>
                <td>{new Date(log.timestamp).toLocaleString()}</td>
                <td>{typeLabel[log.type]}</td>
                <td>{log.message}</td>
                <td>{log.productId || ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
