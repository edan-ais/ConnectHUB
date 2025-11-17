import type { Handler } from '@netlify/functions';

const handler: Handler = async () => {
  const now = new Date().toISOString();

  const logs = [
    {
      id: 'log_1',
      productId: 'prod_1',
      timestamp: now,
      source: 'Faire',
      action: 'Imported product from Faire',
      status: 'success',
      detail: 'Initial import of Saltwater Taffy Mix.',
    },
    {
      id: 'log_2',
      productId: 'prod_2',
      timestamp: now,
      source: 'ConnectHUB',
      action: 'User updated description',
      status: 'info',
      detail: 'Cowboy Hat description still missing.',
    },
  ];

  return {
    statusCode: 200,
    body: JSON.stringify({ logs }),
  };
};

export { handler };
