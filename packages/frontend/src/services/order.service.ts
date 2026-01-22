import { api } from './api';
import { Order, CreateOrderDTO, PaginatedResponse, ApiResponse } from '@ceramythstudio/shared';

export const orderService = {
  create: async (data: CreateOrderDTO): Promise<Order> => {
    const response = await api.post<ApiResponse<Order>>('/orders', data);
    return response.data.data!;
  },

  getAll: async (params?: { page?: number; limit?: number }): Promise<PaginatedResponse<Order>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<Order>>>('/orders', { params });
    return response.data.data!;
  },

  getById: async (id: string): Promise<Order> => {
    const response = await api.get<ApiResponse<Order>>(`/orders/${id}`);
    return response.data.data!;
  },
};
