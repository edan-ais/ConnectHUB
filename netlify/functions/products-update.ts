import type { Handler } from '@netlify/functions';

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'PATCH') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const id = event.queryStringParameters?.id;
  if (!id) {
    return { statusCode: 400, body: 'Missing id' };
  }

  const body = event.body ? JSON.parse(event.body) : {};
  const { key, value } = body;

  console.log('Mock update product', { id, key, value });

  // Echo back a simple mock product
  const now = new Date().toISOString();

  const product = {
    id,
    sku: 'MOCK-SKU',
    faireSku: 'F-MOCK',
    name: 'Mock Product',
    description: key === 'description' ? value : 'Mock description',
    imageUrl: 'https://via.placeholder.com/64x64.png?text=Mock',
    vendor: 'MockVendor',
    category: 'MockCategory',
    tags: [],
    newInventory: key === 'newInventory' ? Number(value) || 0 : 0,
    onHandInventory: key === 'onHandInventory' ? Number(value) || 0 : 0,
    locations: [],
    lastOrderDate: now,
    lastSaleDate: now,
    isArchived: false,
    validationStatus: key === 'validationStatus' ? value : 'pending',
    missingFields: [],
    canSyncToSquare: true,
    canSyncToBooker: false,
    createdAt: now,
    updatedAt: now,
  };

  return {
    statusCode: 200,
    body: JSON.stringify({ product }),
  };
};

export { handler };
