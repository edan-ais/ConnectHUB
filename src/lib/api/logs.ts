import { env } from '../../config/env';
import { ProductLogEntry } from '../../types/product';
import { apiClient } from './client';

export interface LogsResponse {
  logs: ProductLogEntry[];
}

export const logsApi = {
  async getLogs(): Promise<ProductLogEntry[]> {
    const res = await apiClient.get<LogsResponse>(env.LOGS_ENDPOINT);
    return res.logs || [];
  },
};
