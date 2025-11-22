import React, { useState } from "react";
import { useInventoryStore } from "../../state/inventoryStore";
import { LocationStock, Product } from "../../lib/types";

const emptyLocations = (): LocationStock[] => [
  { locationId: "SALTY_TAILS", onHand: 0, onOrder: 0 },
  { locationId: "CENTRAL_COAST", onHand: 0, onOrder: 0 },
  { locationId: "CENTRAL_VALLEY", onHand: 0, onOrder: 0 }
];

export const IntakeForm: React.FC = () => {
  const createManualProduct = useInventoryStore(s => s.createManualProduct);

  const [sku, setSku] = useState("");
  const [name, setName] = useState("");
  const [vendorName, setVendorName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [onHand, setOnHand] = useState<number>(0);
  const [onOrder, setOnOrder] = useState<number>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sku || !name) return;

    const product: Omit<Product, "id" | "createdAt" | "updatedAt"> = {
      sku,
      name,
      vendorName,
      description,
      category,
      faireId: undefined,
      imageUrl: "",
      tags: [],
      onHandTotal: onHand,
      onOrderTotal: onOrder,
      archived: false,
      locations: emptyLocations(),
      status: "NEW",
      missingFields: [],
      notes: "",
      pushToSquare: false,
      pushToQuickBooks: false,
      pushToBooker: false,
      isSaltyTailsOnly: false
    };

    createManualProduct(product);

    setSku("");
    setName("");
    setVendorName("");
    setDescription("");
    setCategory("");
    setOnHand(0);
    setOnOrder(0);
  };

  return (
    <div className="sheet-container">
      <div className="sheet-name">Intake (Manual entries)</div>
      <form className="intake-form" onSubmit={handleSubmit}>
        <div className="intake-grid">
          <label>
            <span>SKU*</span>
            <input
              className="cell-input"
              value={sku}
              onChange={e => setSku(e.target.value)}
              required
            />
          </label>
          <label>
            <span>Name*</span>
            <input
              className="cell-input"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </label>
          <label>
            <span>Vendor</span>
            <input
              className="cell-input"
              value={vendorName}
              onChange={e => setVendorName(e.target.value)}
            />
          </label>
          <label>
            <span>Category</span>
            <input
              className="cell-input"
              value={category}
              onChange={e => setCategory(e.target.value)}
            />
          </label>
          <label className="intake-span-2">
            <span>Description</span>
            <textarea
              className="cell-input cell-input-multiline"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </label>
          <label>
            <span>On hand</span>
            <input
              type="number"
              className="cell-input"
              value={onHand}
              onChange={e => setOnHand(Number(e.target.value || 0))}
            />
          </label>
          <label>
            <span>On order</span>
            <input
              type="number"
              className="cell-input"
              value={onOrder}
              onChange={e => setOnOrder(Number(e.target.value || 0))}
            />
          </label>
        </div>
        <div className="intake-footer">
          <button type="submit" className="btn-primary">
            Add to Master sheet
          </button>
          <span className="intake-hint">
            When submitted, this product appears instantly on the Master sheet
            and can be validated in Main.
          </span>
        </div>
      </form>
    </div>
  );
};
