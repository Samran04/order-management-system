import type {
    User,
    Order,
    AppNotification,
} from '../types';

const API_URL = (import.meta as any).env?.VITE_API_URL || '';

class ApiClient {
    private token: string | null = null;

    setToken(token: string) {
        this.token = token;
        localStorage.setItem('auth_token', token);
    }

    getToken(): string | null {
        if (!this.token) {
            this.token = localStorage.getItem('auth_token');
        }
        return this.token;
    }

    clearToken() {
        this.token = null;
        localStorage.removeItem('auth_token');
    }

    private async request<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const token = this.getToken();
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...(options.headers as Record<string, string>),
        };

        if (token) headers['Authorization'] = `Bearer ${token}`;

        const response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: 'Request failed', details: '' }));
            const errMessage = error.details ? `${error.error} - ${error.details}` : (error.error || 'Request failed');
            throw new Error(errMessage);
        }

        return response.json();
    }

    // Auth
    async login(email: string, password: string): Promise<User> {
        const data = await this.request<any>('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
        this.setToken(data.token);
        return data.user;
    }

    async register(userData: Partial<User>): Promise<{ user: User; message: string }> {
        return this.request<any>('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    }

    async verifyEmail(token: string): Promise<{ message: string }> {
        return this.request<any>('/api/auth/verify-email', {
            method: 'POST',
            body: JSON.stringify({ token }),
        });
    }

    async forgotPassword(email: string): Promise<{ message: string }> {
        return this.request<any>('/api/auth/forgot-password', {
            method: 'POST',
            body: JSON.stringify({ email }),
        });
    }

    async resetPassword(token: string, password: string): Promise<{ message: string }> {
        return this.request<any>('/api/auth/reset-password', {
            method: 'POST',
            body: JSON.stringify({ token, password }),
        });
    }

    logout() { this.clearToken(); }

    // Orders
    async getOrders(): Promise<Order[]> {
        return this.request<Order[]>('/api/orders');
    }

    async createOrder(order: Partial<Order>): Promise<Order> {
        return this.request<Order>('/api/orders', {
            method: 'POST',
            body: JSON.stringify(order),
        });
    }

    async updateOrder(id: string, order: Partial<Order>): Promise<Order> {
        return this.request<Order>(`/api/orders/${id}`, {
            method: 'PUT',
            body: JSON.stringify(order),
        });
    }

    async deleteOrder(id: string): Promise<void> {
        return this.request<void>(`/api/orders/${id}`, { method: 'DELETE' });
    }

    // Users
    async getCurrentUser(): Promise<User> {
        return this.request<User>('/api/users/me');
    }

    async updateUser(userId: string, updates: Partial<User>): Promise<User> {
        return this.request<User>(`/api/users/${userId}`, {
            method: 'PUT',
            body: JSON.stringify(updates),
        });
    }

    // Notifications
    async getNotifications(): Promise<AppNotification[]> {
        return this.request<AppNotification[]>('/api/notifications');
    }

    async createNotification(data: Partial<AppNotification>): Promise<AppNotification> {
        return this.request<AppNotification>('/api/notifications', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async markNotificationRead(id: string): Promise<void> {
        return this.request<void>(`/api/notifications/${id}/read`, { method: 'PUT' });
    }

    async markAllNotificationsRead(): Promise<void> {
        return this.request<void>('/api/notifications/read-all', { method: 'PUT' });
    }
}

export const api = new ApiClient();
