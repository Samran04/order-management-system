
export type UserRole = 'Admin' | 'Sales' | 'Production';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password?: string;
  organization?: string;
}

export type OrderType = 'Pre Production Sample' | 'Final Production';

export type ProductionStatus = 
  | 'Order Received'
  | 'Inspection'
  | 'Cutting'
  | 'Stitching'
  | 'Embroidery/Printing'
  | 'Quality Check'
  | 'Packing'
  | 'Delivered';

export interface SizeQuantity {
  size: string;
  quantity: number;
}

export interface PostDeliveryIssue {
  status: 'Successful' | 'Alteration Required';
  reason?: string;
  solution?: string;
  loggedAt?: string;
  salesComments?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  type: OrderType;
  date: string; // created date
  startDate: string; // production start
  deliveryDate: string; // target delivery
  clientName: string;
  brand: string;
  productName: string;
  itemDescription: string;
  fabric: string[];
  color: string;
  sleeve: string;
  fabricSupplier: string[];
  accessories: string[];
  patternFollowed: string;
  cmPrice: number[];
  cmUnit: string[];
  cmPartner: string;
  embroideryPrint: string[];
  sizes: SizeQuantity[];
  totalQuantity: number;
  images: string[]; // support multiple product visuals
  logoImage?: string; // brand logo
  status: ProductionStatus;
  postDelivery?: PostDeliveryIssue;
  salesPerson: string;
  notes?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'alert' | 'message';
  timestamp: string;
  read: boolean;
  sender?: string;
}

export type ViewType = 'Dashboard' | 'Sales' | 'Production' | 'Delivery';
