import { api } from './api';
import { Cart, AddToCartDTO, ApiResponse } from '@ceramythstudio/shared';

export const cartService = {
  getCart: async (): Promise<Cart> => {
    const response = await api.get<ApiResponse<Cart>>('/cart');
    return response.data.data!;
  },

  addToCart: async (data: AddToCartDTO): Promise<void> => {
    await api.post('/cart', data);
  },

  updateQuantity: async (id: string, quantity: number): Promise<void> => {
    await api.put(`/cart/${id}`, { quantity });
  },

  removeItem: async (id: string): Promise<void> => {
    await api.delete(`/cart/${id}`);
  },

  clearCart: async (): Promise<void> => {
    await api.delete('/cart');
  },
};
