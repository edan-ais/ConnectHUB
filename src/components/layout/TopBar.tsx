import React from "react";
import {
  CloudUpload,
  FileSpreadsheet,
  Search as SearchIcon
} from "lucide-react";
import { useInventoryStore } from "../../state/inventoryStore";

export const TopBar: React.FC = () => {
  const validated = useInventoryStore(s => s.validatedCount);
  const needsReview = useInventoryStore(s => s.needsReviewCount);
  const searchQuery = useInventoryStore(s => s.searchQuery);
  const setSearchQuery = useInventoryStore(s => s.setSearchQuery);

  return (
    <header className="topbar">
      <div className="topbar-left">
        <FileSpreadsheet className="topbar-icon" />
        <div>
          <div className="topbar-title">ConnectHUB Inventory</div>
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
        <div className="topbar-search">
          <span className="topbar-search-icon">
            <SearchIcon size={14} />
          </span>
          <input
            className="topbar-search-input"
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="btn-ghost">
          <CloudUpload size={16} />
          Sync now
        </button>
      </div>
    </header>
  );
};
