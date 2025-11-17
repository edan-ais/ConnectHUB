import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Callout } from '../ui/Callout';
import { PlusCircle } from 'lucide-react';

interface IntakeFormProps {
  // later you can pass a callback like onSubmit(newProduct)
}

export const IntakeForm: React.FC<IntakeFormProps> = () => {
  const [sku, setSku] = useState('');
  const [name, setName] = useState('');
  const [vendor, setVendor] = useState('');
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState('0');
  const [location, setLocation] = useState<'central_coast' | 'central_valley' | 'salty_tails'>(
    'central_coast'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: wire to backend; for now just log.
    console.log('Manual intake submit', {
      sku,
      name,
      vendor,
      category,
      quantity,
      location,
    });
    setSku('');
    setName('');
    setVendor('');
    setCategory('');
    setQuantity('0');
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <Callout tone="info" icon={<PlusCircle size={14} />}>
        Use this form for any products or adjustments that don’t come from Faire.
        On submit, entries will be written into the Master sheet as new or updated rows.
      </Callout>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="flex flex-col gap-1">
          <label className="font-medium text-slate-700">SKU</label>
          <input
            className="border border-slate-300 rounded px-2 py-1 text-xs bg-white"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="font-medium text-slate-700">Name</label>
          <input
            className="border border-slate-300 rounded px-2 py-1 text-xs bg-white"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="font-medium text-slate-700">Vendor</label>
          <input
            className="border border-slate-300 rounded px-2 py-1 text-xs bg-white"
            value={vendor}
            onChange={(e) => setVendor(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="font-medium text-slate-700">Category</label>
          <input
            className="border border-slate-300 rounded px-2 py-1 text-xs bg-white"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="font-medium text-slate-700">Initial Quantity</label>
          <input
            type="number"
            className="border border-slate-300 rounded px-2 py-1 text-xs bg-white"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="font-medium text-slate-700">Location</label>
          <select
            className="border border-slate-300 rounded px-2 py-1 text-xs bg-white"
            value={location}
            onChange={(e) =>
              setLocation(e.target.value as 'central_coast' | 'central_valley' | 'salty_tails')
            }
          >
            <option value="central_coast">Central Coast</option>
            <option value="central_valley">Central Valley</option>
            <option value="salty_tails">Salty Tails</option>
          </select>
        </div>
      </div>

      <Button type="submit" variant="primary" size="md">
        <PlusCircle size={14} className="mr-1" />
        Submit manual entry
      </Button>
    </form>
  );
};
