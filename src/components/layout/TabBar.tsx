import React from "react";
import {
  Sheet,
  CheckSquare,
  PlusCircle,
  BarChart2,
  ListChecks
} from "lucide-react";
import { useInventoryStore } from "../../state/inventoryStore";
import { TabId } from "../../lib/types";

const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: "MASTER", label: "Master", icon: Sheet },
  { id: "MAIN", label: "Main", icon: CheckSquare },
  { id: "INTAKE", label: "Intake", icon: PlusCircle },
  { id: "REPORTS", label: "Reports", icon: BarChart2 },
  { id: "LOGS", label: "Log", icon: ListChecks }
];

export const TabBar: React.FC = () => {
  const activeTab = useInventoryStore(s => s.activeTab);
  const setActiveTab = useInventoryStore(s => s.setActiveTab);

  return (
    <nav className="tabbar tabbar-bottom">
      {TABS.map(tab => {
        const Icon = tab.icon;
        const active = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            className={`tabbar-item ${active ? "tabbar-item-active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <Icon size={18} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
