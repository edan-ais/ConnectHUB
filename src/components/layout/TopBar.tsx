import React from "react";
import { Database, CloudUpload, FileSpreadsheet } from "lucide-react";
import { useInventoryStore } from "../../state/inventoryStore";

export const TopBar: React.FC = () => {
  const validated = useInventoryStore(s => s.validatedCount);
  const needsReview = useInventoryStore(s => s.needsReviewCount);

  return (
    <header className="topbar">
      <div className="topbar-left">
        <FileSpreadsheet className="topbar-icon" />
        <div>
          <div className="topbar-title">ConnectHUB Inventory</div>
          <div className="topbar-subtitle">
            Faire ➝ ConnectHUB ➝ Square / QuickBooks / Booker
          </div>
        </div>
      </div>
      <div className="topbar-center">
        <div className="pill pill-green">
          Approved: <strong>{validated}</strong>
        </div>
        <div className="pill pill-yellow">
          Needs approval: <strong>{needsReview}</strong>
        </div>
      </div>
      <div className="topbar-right">
        <button className="btn-ghost">
          <CloudUpload size={16} />
          Sync now
        </button>
        <div className="topbar-saving">
          <Database size={14} />
          <span>Last saved: just now</span>
        </div>
      </div>
    </header>
  );
};
