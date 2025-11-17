import { ProductLogEntry } from '../../types/product';
import { apiClient } from './client';

export interface LogsResponse {
  logs: ProductLogEntry[];
}

export const logsApi = {
  async getLogs(): Promise<ProductLogEntry[]> {
    const endpoint = import.meta.env.VITE_LOGS_ENDPOINT || '/api/logs';
    const res = await apiClient.get<LogsResponse>(endpoint);
    return res.logs || [];
  },
};
