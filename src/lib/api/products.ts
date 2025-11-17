import { Product } from '../../types/product';
import { apiClient } from './client';

export interface ProductsResponse {
  products: Product[];
}

export const productsApi = {
  async getProducts(): Promise<Product[]> {
    const res = await apiClient.get<ProductsResponse>(env.PRODUCTS_ENDPOINT);
    return res.products || [];
  },

  async updateProductField(productId: string, key: string, value: unknown): Promise<Product> {
    const res = await apiClient.patch<{ product: Product }>(
      `${env.PRODUCT_UPDATE_ENDPOINT}?id=${encodeURIComponent(productId)}`,
      { key, value }
    );
    return res.product;
  },

  async updateValidationStatus(productId: string, status: string): Promise<Product> {
    const res = await apiClient.patch<{ product: Product }>(
      `${env.PRODUCT_UPDATE_ENDPOINT}?id=${encodeURIComponent(productId)}`,
      { key: 'validationStatus', value: status }
    );
    return res.product;
  },
};
