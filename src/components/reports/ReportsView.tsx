import React from "react";
import { useInventoryStore } from "../../state/inventoryStore";

export const ReportsView: React.FC = () => {
  const products = useInventoryStore(s => s.products);
  const totalOnHand = products.reduce((sum, p) => sum + p.onHandTotal, 0);
  const totalOnOrder = products.reduce((sum, p) => sum + p.onOrderTotal, 0);

  return (
    <div className="sheet-container">
      <div className="sheet-name">Reporting</div>
      <div className="report-grid">
        <div className="report-card">
          <div className="report-label">Total SKUs</div>
          <div className="report-value">{products.length}</div>
        </div>
        <div className="report-card">
          <div className="report-label">Units on hand</div>
          <div className="report-value">{totalOnHand}</div>
        </div>
        <div className="report-card">
          <div className="report-label">Units on order</div>
          <div className="report-value">{totalOnOrder}</div>
        </div>
      </div>
      <p className="report-note">
        v0.1: simple totals. Later we can add: per-location inventory, approval
        funnel, historical sales to drive reorder points, etc.
      </p>
    </div>
  );
};
