import React from "react";
import { useInventoryStore } from "../../state/inventoryStore";
import { Product, LocationId } from "../../lib/types";
import { CheckCircle2 } from "lucide-react";

const locationLabel: Record<LocationId, string> = {
  SALTY_TAILS: "Salty Tails",
  CENTRAL_COAST: "Central Coast",
  CENTRAL_VALLEY: "Central Valley"
};

export const MainValidationView: React.FC = () => {
  const products = useInventoryStore(s => s.products);
  const validateProduct = useInventoryStore(s => s.validateProduct);
  const updateField = useInventoryStore(s => s.updateProductField);

  const candidates = products.filter(
    p => p.status === "NEW" || p.status === "NEEDS_REVIEW"
  );

  const handleLocationToggle = (product: Product, location: LocationId) => {
    const updatedLocations = product.locations.map(loc =>
      loc.locationId === location
        ? { ...loc, onHand: loc.onHand || product.onHandTotal }
        : loc
    );
    updateField(product.id, "locations", updatedLocations as any);
  };

  return (
    <div className="sheet-container">
      <div className="sheet-name">Main (Validation workflow)</div>
      {candidates.length === 0 ? (
        <div className="empty-state">
          <CheckCircle2 />
          <p>All products are validated. Nice work!</p>
        </div>
      ) : (
        <div className="card-grid">
          {candidates.map(p => (
            <div key={p.id} className="card">
              <div className="card-header">
                <div className="card-title">{p.name}</div>
                <div className="card-subtitle">{p.sku}</div>
              </div>
              <div className="card-body">
                <label className="field-label">Description</label>
                <textarea
                  className="cell-input cell-input-multiline"
                  value={p.description}
                  onChange={e =>
                    updateField(p.id, "description", e.target.value)
                  }
                />
                <label className="field-label">Category</label>
                <input
                  className="cell-input"
                  value={p.category || ""}
                  onChange={e =>
                    updateField(p.id, "category", e.target.value)
                  }
                />
                <label className="field-label">
                  Locations & stock split (simple v0.1)
                </label>
                <div className="locations-row">
                  {p.locations.map(loc => (
                    <label key={loc.locationId} className="location-chip">
                      <input
                        type="checkbox"
                        checked={loc.onHand > 0 || loc.onOrder > 0}
                        onChange={() =>
                          handleLocationToggle(p, loc.locationId)
                        }
                      />
                      <span>{locationLabel[loc.locationId]}</span>
                      <span className="location-chip-count">
                        {loc.onHand} on hand / {loc.onOrder} on order
                      </span>
                    </label>
                  ))}
                </div>
                <label className="field-label">Notes</label>
                <textarea
                  className="cell-input cell-input-multiline"
                  value={p.notes || ""}
                  onChange={e =>
                    updateField(p.id, "notes", e.target.value)
                  }
                />
              </div>
              <div className="card-footer">
                <button
                  className="btn-primary"
                  onClick={() => validateProduct(p.id)}
                >
                  Mark as validated
                </button>
                {p.missingFields.length > 0 && (
                  <div className="missing-chip">
                    Missing: {p.missingFields.join(", ")}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
