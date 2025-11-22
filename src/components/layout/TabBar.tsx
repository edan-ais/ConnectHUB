import React from "react";
import { Sheet, CheckSquare, PlusCircle, BarChart2, ListChecks } from "lucide-react";
import { useInventoryStore } from "../../state/inventoryStore";
import { TabId } from "../../lib/types";

const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: "MASTER", label: "Master (SOT)", icon: Sheet },
  { id: "MAIN", label: "Main (Validation)", icon: CheckSquare },
  { id: "INTAKE", label: "Intake (Manual)", icon: PlusCircle },
  { id: "REPORTS", label: "Reporting", icon: BarChart2 },
  { id: "LOGS", label: "Activity Log", icon: ListChecks }
];

export const TabBar: React.FC = () => {
  const activeTab = useInventoryStore(s => s.activeTab);
  const setActiveTab = useInventoryStore(s => s.setActiveTab);

  return (
    <nav className="tabbar">
      {TABS.map(tab => {
        const Icon = tab.icon;
        const active = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            className={`tabbar-item ${active ? "tabbar-item-active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <Icon size={16} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
