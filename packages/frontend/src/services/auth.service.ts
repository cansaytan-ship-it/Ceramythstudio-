import { api } from './api';
import {
  CreateUserDTO,
  LoginDTO,
  AuthResponse,
  User,
  ApiResponse,
} from '@ceramythstudio/shared';

export const authService = {
  register: async (data: CreateUserDTO): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', data);
    if (response.data.data) {
      localStorage.setItem('token', response.data.data.token);
    }
    return response.data.data!;
  },

  login: async (data: LoginDTO): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', data);
    if (response.data.data) {
      localStorage.setItem('token', response.data.data.token);
    }
    return response.data.data!;
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get<ApiResponse<User>>('/auth/profile');
    return response.data.data!;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },
};
