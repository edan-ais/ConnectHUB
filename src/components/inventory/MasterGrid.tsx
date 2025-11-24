import React from "react";
import { useInventoryStore } from "../../state/inventoryStore";
import { Product } from "../../lib/types";
import { ProductPreviewCell } from "../common/ProductPreviewCell";
import { Pill } from "../common/Pill";

const statusColor = (status: Product["status"]) => {
  switch (status) {
    case "VALIDATED":
      return "green";
    case "NEW":
    case "NEEDS_REVIEW":
      return "yellow";
    case "ARCHIVED":
      return "gray";
    default:
      return "gray";
  }
};

export const MasterGrid: React.FC = () => {
  const products = useInventoryStore(s => s.products);
  const updateField = useInventoryStore(s => s.updateProductField);

  const handleChange =
    (id: string, field: keyof Product) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value: any = e.target.value;
      updateField(id, field, value);
    };

  return (
    <div className="sheet-container">
      <div className="sheet-name">Master</div>
      <div className="sheet-table-wrapper">
        <table className="sheet-table">
          <thead>
            <tr>
              <th className="col-sticky">Status</th>
              <th className="col-sticky">Product</th>
              <th>SKU</th>
              <th>Vendor</th>
              <th>Description</th>
              <th>Category</th>
              <th>On Hand</th>
              <th>On Order</th>
              <th>Salty Tails only?</th>
              <th>Push ➝ Square</th>
              <th>Push ➝ QB</th>
              <th>Push ➝ Booker</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr
                key={p.id}
                className={`row-status-${p.status.toLowerCase()} ${
                  p.missingFields.length > 0 ? "row-missing" : ""
                }`}
              >
                <td className="col-sticky">
                  <Pill color={statusColor(p.status)}>
                    {p.status.replace("_", " ")}
                  </Pill>
                  {p.missingFields.length > 0 && (
                    <div className="missing-chip">
                      Missing: {p.missingFields.join(", ")}
                    </div>
                  )}
                </td>
                <td className="col-sticky">
                  <ProductPreviewCell imageUrl={p.imageUrl} name={p.name} />
                </td>
                <td>
                  <input
                    className="cell-input"
                    value={p.sku}
                    onChange={handleChange(p.id, "sku")}
                  />
                </td>
                <td>
                  <input
                    className="cell-input"
                    value={p.vendorName || ""}
                    onChange={handleChange(p.id, "vendorName")}
                  />
                </td>
                <td>
                  <textarea
                    className="cell-input cell-input-multiline"
                    value={p.description}
                    onChange={handleChange(p.id, "description")}
                  />
                </td>
                <td>
                  <input
                    className="cell-input"
                    value={p.category || ""}
                    onChange={handleChange(p.id, "category")}
                  />
                </td>
                <td className="cell-number">{p.onHandTotal}</td>
                <td className="cell-number">{p.onOrderTotal}</td>
                <td className="cell-center">
                  <input
                    type="checkbox"
                    checked={p.isSaltyTailsOnly}
                    onChange={e =>
                      updateField(p.id, "isSaltyTailsOnly", e.target.checked)
                    }
                  />
                </td>
                <td className="cell-center">
                  <input
                    type="checkbox"
                    checked={p.pushToSquare}
                    onChange={e =>
                      updateField(p.id, "pushToSquare", e.target.checked)
                    }
                  />
                </td>
                <td className="cell-center">
                  <input
                    type="checkbox"
                    checked={p.pushToQuickBooks}
                    onChange={e =>
                      updateField(p.id, "pushToQuickBooks", e.target.checked)
                    }
                  />
                </td>
                <td className="cell-center">
                  <input
                    type="checkbox"
                    checked={p.pushToBooker}
                    onChange={e =>
                      updateField(p.id, "pushToBooker", e.target.checked)
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
