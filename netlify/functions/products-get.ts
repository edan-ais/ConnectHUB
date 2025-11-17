// Simple mock product list for early development
import type { Handler } from '@netlify/functions';

const handler: Handler = async () => {
  const now = new Date().toISOString();

  const products = [
    {
      id: 'prod_1',
      sku: 'CANDY-001',
      faireSku: 'F-CANDY-001',
      name: 'Saltwater Taffy Mix',
      description: 'Assorted saltwater taffy flavors in a mixed bag.',
      imageUrl: 'https://via.placeholder.com/64x64.png?text=Taffy',
      vendor: 'SweetCo',
      category: 'Candy',
      tags: ['central_coast'],
      newInventory: 0,
      onHandInventory: 24,
      locations: [
        { locationId: 'central_coast', onHand: 24, onOrder: 0, reorderPoint: 5 },
      ],
      lastOrderDate: now,
      lastSaleDate: now,
      isArchived: false,
      validationStatus: 'validated',
      missingFields: [],
      canSyncToSquare: true,
      canSyncToBooker: false,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'prod_2',
      sku: 'HAT-COB-001',
      faireSku: 'F-HAT-001',
      name: 'Cowboy Hat',
      description: '',
      imageUrl: 'https://via.placeholder.com/64x64.png?text=Hat',
      vendor: 'RanchWear',
      category: 'Apparel',
      tags: ['central_valley'],
      newInventory: 12,
      onHandInventory: 0,
      locations: [
        { locationId: 'central_valley', onHand: 0, onOrder: 12, reorderPoint: 1 },
      ],
      lastOrderDate: now,
      lastSaleDate: now,
      isArchived: false,
      validationStatus: 'pending',
      missingFields: ['description'],
      canSyncToSquare: true,
      canSyncToBooker: false,
      createdAt: now,
      updatedAt: now,
    },
  ];

  return {
    statusCode: 200,
    body: JSON.stringify({ products }),
  };
};

export { handler };
