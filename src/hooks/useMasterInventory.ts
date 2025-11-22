import { useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/supabaseClient";
import { MasterRow } from "../components/inventory/MasterGrid";
import { useInventoryStore } from "../state/inventoryStore";

export function useMasterInventory() {
  const searchQuery = useInventoryStore(s => s.searchQuery);

  const [rows, setRows] = useState<MasterRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from("master_inventory")
      .select("*")
      .order("product_name", { ascending: true });

    if (error) {
      setError(error.message);
    } else {
      setRows(data as MasterRow[]);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    load();

    // live realtime updates
    const channel = supabase
      .channel("master-inventory-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "master_inventory"
        },
        () => load()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [load]);

  // local search filter
  const filtered = rows.filter(row => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      row.product_name?.toLowerCase().includes(q) ||
      row.sku?.toLowerCase().includes(q) ||
      (row.vendor || "").toLowerCase().includes(q) ||
      (row.category || "").toLowerCase().includes(q) ||
      (row.tags || "").toLowerCase().includes(q)
    );
  });

  return {
    rows: filtered,
    rawRows: rows,
    loading,
    error,
    reload: load
  };
}
