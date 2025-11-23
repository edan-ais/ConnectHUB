import React from "react";
import { TopBar } from "./TopBar";
import { TabBar } from "./TabBar";
import { useInventoryStore } from "../../state/inventoryStore";
import InventoryWorkspace from "../inventory/MasterGrid";
import { MainValidationView } from "../inventory/MainValidationView";
import { IntakeForm } from "../inventory/IntakeForm";
import { ReportsView } from "../reports/ReportsView";
import { ActivityLogView } from "../logs/ActivityLogView";

export const Shell: React.FC = () => {
  const activeTab = useInventoryStore(s => s.activeTab);

  const renderTab = () => {
    switch (activeTab) {
      case "MASTER":
        return <InventoryWorkspace />;
      case "MAIN":
        return <MainValidationView />;
      case "INTAKE":
        return <IntakeForm />;
      case "REPORTS":
        return <ReportsView />;
      case "LOGS":
        return <ActivityLogView />;
      default:
        return null;
    }
  };

  return (
    <div className="app-root">
      <TopBar />
      <div className="app-content">{renderTab()}</div>
      {/* Bottom mobile-style navigation */}
      <TabBar />
    </div>
  );
};
