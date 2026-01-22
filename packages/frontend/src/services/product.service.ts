import { api } from './api';
import { Product, CreateProductDTO, PaginatedResponse, ApiResponse } from '@ceramythstudio/shared';

export const productService = {
  getAll: async (params?: {
    category?: string;
    featured?: boolean;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Product>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<Product>>>('/products', {
      params,
    });
    return response.data.data!;
  },

  getById: async (id: string): Promise<Product> => {
    const response = await api.get<ApiResponse<Product>>(`/products/${id}`);
    return response.data.data!;
  },

  create: async (data: CreateProductDTO): Promise<Product> => {
    const response = await api.post<ApiResponse<Product>>('/products', data);
    return response.data.data!;
  },

  update: async (id: string, data: Partial<CreateProductDTO>): Promise<Product> => {
    const response = await api.put<ApiResponse<Product>>(`/products/${id}`, data);
    return response.data.data!;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
  },
};
