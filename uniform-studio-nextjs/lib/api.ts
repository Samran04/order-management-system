// ============================================
// API CLIENT
// ============================================
// This file provides a centralized API client for making
// HTTP requests to the backend from the frontend

import type {
    User,
    RegisterData,
    LoginCredentials,
    AuthResponse,
    Order,
    CreateOrderData,
    UpdateOrderData,
    AppNotification,
} from '@/types';

// ============================================
// CONFIGURATION
// ============================================

/**
 * Base API URL
 * In development: http://localhost:3000
 * In production: Your deployed URL
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

// ============================================
// API CLIENT CLASS
// ============================================

/**
 * API Client Class
 * 
 * Provides methods for all API operations with automatic
 * token management and error handling.
 * 
 * @example
 * import { api } from '@/lib/api';
 * 
 * // Login
 * const user = await api.login('email@example.com', 'password');
 * 
 * // Get orders
 * const orders = await api.getOrders();
 */
class ApiClient {
    private token: string | null = null;

    // ==========================================
    // TOKEN MANAGEMENT
    // ==========================================

    /**
     * Set authentication token
     * Stores token in memory and localStorage
     * 
     * @param token - JWT token from login/register
     */
    setToken(token: string) {
        this.token = token;
        if (typeof window !== 'undefined') {
            localStorage.setItem('auth_token', token);
        }
    }

    /**
     * Get current authentication token
     * Retrieves from memory or localStorage
     * 
     * @returns string | null - Current token or null
     */
    getToken(): string | null {
        if (!this.token && typeof window !== 'undefined') {
            this.token = localStorage.getItem('auth_token');
        }
        return this.token;
    }

    /**
     * Clear authentication token
     * Removes token from memory and localStorage
     * Call this on logout
     */
    clearToken() {
        this.token = null;
        if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token');
        }
    }

    // ==========================================
    // HTTP REQUEST METHOD
    // ==========================================

    /**
     * Make an HTTP request
     * 
     * Internal method that handles all HTTP requests with
     * automatic token injection and error handling.
     * 
     * @param endpoint - API endpoint (e.g., '/api/orders')
     * @param options - Fetch options
     * @returns Promise<T> - Response data
     * @throws Error if request fails
     */
    private async request<T = any>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const token = this.getToken();
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        // Add authorization header if token exists
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers,
        });

        // Handle non-OK responses
        if (!response.ok) {
            const error = await response.json().catch(() => ({
                error: 'Request failed',
            }));
            throw new Error(error.error || 'Request failed');
        }

        return response.json();
    }

    // ==========================================
    // AUTHENTICATION METHODS
    // ==========================================

    /**
     * Login user
     * 
     * Authenticates user and stores token
     * 
     * @param email - User email
     * @param password - User password
     * @returns Promise<User> - Authenticated user
     * 
     * @example
     * const user = await api.login('user@example.com', 'password123');
     */
    async login(email: string, password: string): Promise<User> {
        const data = await this.request<AuthResponse>('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
        this.setToken(data.token);
        return data.user;
    }

    /**
     * Register new user
     * 
     * Creates new user account and stores token
     * 
     * @param userData - User registration data
     * @returns Promise<User> - Created user
     * 
     * @example
     * const user = await api.register({
     *   email: 'user@example.com',
     *   password: 'password123',
     *   name: 'John Doe',
     *   role: 'Sales'
     * });
     */
    async register(userData: RegisterData): Promise<User> {
        const data = await this.request<AuthResponse>('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
        this.setToken(data.token);
        return data.user;
    }

    /**
     * Logout user
     * 
     * Clears authentication token
     * 
     * @example
     * api.logout();
     */
    logout() {
        this.clearToken();
    }

    // ==========================================
    // ORDER METHODS
    // ==========================================

    /**
     * Get all orders
     * 
     * Fetches all orders from the database
     * 
     * @returns Promise<Order[]> - Array of orders
     * 
     * @example
     * const orders = await api.getOrders();
     */
    async getOrders(): Promise<Order[]> {
        return this.request<Order[]>('/api/orders');
    }

    /**
     * Get single order by ID
     * 
     * @param id - Order ID
     * @returns Promise<Order> - Order data
     * 
     * @example
     * const order = await api.getOrder('order-id-123');
     */
    async getOrder(id: string): Promise<Order> {
        return this.request<Order>(`/api/orders/${id}`);
    }

    /**
     * Create new order
     * 
     * @param order - Order data
     * @returns Promise<Order> - Created order
     * 
     * @example
     * const newOrder = await api.createOrder({
     *   orderNumber: 'OS-2025290',
     *   clientName: 'ABC Company',
     *   // ... other fields
     * });
     */
    async createOrder(order: CreateOrderData): Promise<Order> {
        return this.request<Order>('/api/orders', {
            method: 'POST',
            body: JSON.stringify(order),
        });
    }

    /**
     * Update existing order
     * 
     * @param id - Order ID
     * @param order - Updated order data
     * @returns Promise<Order> - Updated order
     * 
     * @example
     * const updated = await api.updateOrder('order-id-123', {
     *   status: 'Stitching'
     * });
     */
    async updateOrder(id: string, order: UpdateOrderData): Promise<Order> {
        return this.request<Order>(`/api/orders/${id}`, {
            method: 'PUT',
            body: JSON.stringify(order),
        });
    }

    /**
     * Delete order
     * 
     * @param id - Order ID
     * @returns Promise<void>
     * 
     * @example
     * await api.deleteOrder('order-id-123');
     */
    async deleteOrder(id: string): Promise<void> {
        return this.request<void>(`/api/orders/${id}`, {
            method: 'DELETE',
        });
    }

    // ==========================================
    // USER METHODS
    // ==========================================

    /**
     * Get current user profile
     * 
     * @returns Promise<User> - Current user
     * 
     * @example
     * const user = await api.getCurrentUser();
     */
    async getCurrentUser(): Promise<User> {
        return this.request<User>('/api/users/me');
    }

    /**
     * Update user profile
     * 
     * @param userId - User ID
     * @param updates - Profile updates
     * @returns Promise<User> - Updated user
     * 
     * @example
     * const updated = await api.updateUser('user-id', {
     *   name: 'New Name',
     *   organization: 'New Company'
     * });
     */
    async updateUser(userId: string, updates: Partial<User>): Promise<User> {
        return this.request<User>(`/api/users/${userId}`, {
            method: 'PUT',
            body: JSON.stringify(updates),
        });
    }

    // ==========================================
    // NOTIFICATION METHODS
    // ==========================================

    /**
     * Get user notifications
     * 
     * @returns Promise<AppNotification[]> - Array of notifications
     * 
     * @example
     * const notifications = await api.getNotifications();
     */
    async getNotifications(): Promise<AppNotification[]> {
        return this.request<AppNotification[]>('/api/notifications');
    }

    /**
     * Mark notification as read
     * 
     * @param id - Notification ID
     * @returns Promise<void>
     * 
     * @example
     * await api.markNotificationRead('notif-id-123');
     */
    async markNotificationRead(id: string): Promise<void> {
        return this.request<void>(`/api/notifications/${id}/read`, {
            method: 'PUT',
        });
    }

    /**
     * Mark all notifications as read
     * 
     * @returns Promise<void>
     * 
     * @example
     * await api.markAllNotificationsRead();
     */
    async markAllNotificationsRead(): Promise<void> {
        return this.request<void>('/api/notifications/read-all', {
            method: 'PUT',
        });
    }
}

// ============================================
// EXPORT SINGLETON INSTANCE
// ============================================

/**
 * Singleton API client instance
 * Use this throughout your application
 * 
 * @example
 * import { api } from '@/lib/api';
 * 
 * const orders = await api.getOrders();
 */
export const api = new ApiClient();
