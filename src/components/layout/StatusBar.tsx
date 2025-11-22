import React from "react";
import { Info } from "lucide-react";

export const StatusBar: React.FC = () => {
  return (
    <footer className="statusbar">
      <div className="statusbar-left">
        <Info size={14} />
        <span>
          Tip: Validate products in <strong>Main</strong> to push them to Square /
          QuickBooks / Booker. Salty Tails-only products will never be sent to Square.
        </span>
      </div>
      <div className="statusbar-right">
        <span>Mode: Demo (mock data)</span>
      </div>
    </footer>
  );
};
