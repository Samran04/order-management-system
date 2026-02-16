// ============================================
// TYPESCRIPT TYPE DEFINITIONS
// ============================================
// This file contains all TypeScript types and interfaces
// used throughout the application for type safety

// ============================================
// USER TYPES
// ============================================

/**
 * User role enumeration
 * Defines the different access levels in the system
 */
export type UserRole = 'Admin' | 'Sales' | 'Production';

/**
 * User interface
 * Represents a user account in the system
 */
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organization?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * User registration data
 * Data required to create a new user account
 */
export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  organization?: string;
}

/**
 * Login credentials
 * Data required for user authentication
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Authentication response
 * Data returned after successful login/registration
 */
export interface AuthResponse {
  user: User;
  token: string;
}

// ============================================
// ORDER TYPES
// ============================================

/**
 * Order type enumeration
 * Defines whether order is a sample or final production
 */
export type OrderType = 'Pre Production Sample' | 'Final Production';

/**
 * Production status enumeration
 * Tracks the current stage of order production
 */
export type ProductionStatus = 
  | 'Order Received'
  | 'Inspection'
  | 'Cutting'
  | 'Stitching'
  | 'Embroidery/Printing'
  | 'Quality Check'
  | 'Packing'
  | 'Delivered';

/**
 * Size and quantity interface
 * Represents quantity for each size in an order
 */
export interface SizeQuantity {
  size: string;        // e.g., "S", "M", "L", "XL"
  quantity: number;    // Number of items for this size
}

/**
 * Post-delivery issue interface
 * Records any issues found after delivery
 */
export interface PostDeliveryIssue {
  status: 'Successful' | 'Alteration Required';
  reason?: string;           // Reason for alteration
  solution?: string;         // Proposed solution
  loggedAt?: string;         // When issue was logged
  salesComments?: string;    // Additional comments
}

/**
 * Order interface
 * Main order/batch information
 */
export interface Order {
  id: string;
  orderNumber: string;           // Unique order number (e.g., "OS-2025290")
  type: OrderType;
  date: string;                  // Order creation date
  startDate: string;             // Production start date
  deliveryDate: string;          // Target delivery date
  
  // Client information
  clientName: string;
  brand: string;
  
  // Product details
  productName: string;
  itemDescription: string;
  fabric: string[];              // Array of fabric types
  color: string;
  sleeve: string;
  fabricSupplier: string[];
  accessories: string[];
  patternFollowed: string;
  
  // Pricing and manufacturing
  cmPrice: number[];             // Contract manufacturing prices
  cmUnit: string[];              // Units (e.g., "CRT")
  cmPartner: string;             // Manufacturing partner
  embroideryPrint: string[];
  
  // Quantities
  sizes: SizeQuantity[];
  totalQuantity: number;
  
  // Media
  images: string[];              // Array of image URLs
  logoImage?: string;            // Optional brand logo
  
  // Status and notes
  status: ProductionStatus;
  notes?: string;
  postDelivery?: PostDeliveryIssue;
  
  // Metadata
  salesPerson: string;           // Name of sales person
  salesPersonId?: string;        // ID of sales person
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Order creation data
 * Data required to create a new order
 */
export interface CreateOrderData extends Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'salesPersonId'> {}

/**
 * Order update data
 * Data that can be updated in an existing order
 */
export interface UpdateOrderData extends Partial<CreateOrderData> {}

// ============================================
// NOTIFICATION TYPES
// ============================================

/**
 * Notification type enumeration
 * Defines the type/severity of notification
 */
export type NotificationType = 'info' | 'success' | 'alert' | 'message';

/**
 * Notification interface
 * System notifications for users
 */
export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: string;
  read: boolean;
  sender?: string;
}

// ============================================
// VIEW TYPES
// ============================================

/**
 * View type enumeration
 * Defines the different views/pages in the application
 */
export type ViewType = 'Dashboard' | 'Sales' | 'Production' | 'Delivery';

// ============================================
// API RESPONSE TYPES
// ============================================

/**
 * Generic API error response
 */
export interface ApiError {
  error: string;
  details?: any;
}

/**
 * Generic API success response
 */
export interface ApiSuccess<T = any> {
  data: T;
  message?: string;
}

/**
 * Paginated response
 * For endpoints that return paginated data
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ============================================
// FORM TYPES
// ============================================

/**
 * Form field error
 */
export interface FieldError {
  field: string;
  message: string;
}

/**
 * Form validation result
 */
export interface ValidationResult {
  valid: boolean;
  errors: FieldError[];
}
