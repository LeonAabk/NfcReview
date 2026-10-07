export interface Product {
  id: string;
  name: string;
  shortDescription: string;
  price: number;
  originalPrice?: number;
  badge?: string;
  rating?: number;
  reviewsCount?: number;
  features: string[];
  type: 'stand' | 'menu' | 'bundle';
  chipType: string;
  material: string;
  dimensions: string;
  compatibility: string;
  isPopular?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  targetUrl?: string; // Review link or Menu link
}

export interface CustomerOrderData {
  companyName: string;
  orgNumber?: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  postalCode: string;
  city: string;
  googleReviewUrl?: string; // Link for Google Review Bordskilt
  menuUrl?: string; // Link for Meny-kort
  notes?: string;
}

export type OrderStatus = 'ny' | 'behandles' | 'sendt' | 'fullfort';

export interface OrderRecord {
  orderId: string;
  createdAt: string;
  status: OrderStatus;
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  total: number;
  customer: CustomerOrderData;
  trackingNumber?: string;
  adminNotes?: string;
}


