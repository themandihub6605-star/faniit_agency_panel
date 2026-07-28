import { apiClient } from './apiClient';
import type { ApiEnvelope, AuthUser } from '@/types/api';

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
}

/** Agency Panel auth — email + password, provided by Admin. No self-signup:
 * an Admin creates the account (via the Super Admin Panel's "Create Agency"
 * page) and shares the credentials directly with the agency. */
export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post<ApiEnvelope<AuthResponse>>('/auth/login', { email, password }).then((r) => r.data.data),

  getMe: () => apiClient.get<ApiEnvelope<AuthUser>>('/auth/me').then((r) => r.data.data),

  logout: () => apiClient.post('/auth/logout'),

  changePassword: (currentPassword: string, newPassword: string) =>
    apiClient.patch('/users/me/password', { currentPassword, newPassword }),
};