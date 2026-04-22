export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  categorySlug: string;
  brand: string;
  description: string;
  price: number;
  basePrice: number;
  discount: number;
  rating: number;
  reviews: number;
  image: string;
  images: string[];
  ar: boolean;
  badge: string;
  stock: number;
  sku: string;
  colors: { name: string; hex: string }[];
  sizes: string[];
  tags: string[];
  specifications: Record<string, string>;
  careInstructions: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  color?: string;
  size?: string;
  engraving?: string;
  giftWrap: boolean;
  giftMessage?: string;
}

export interface Order {
  id: string;
  items: (CartItem & { product: Product })[];
  subtotal: number;
  discount: number;
  gst: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  paymentId?: string;
  paymentMethod: string;
  address: Address;
  timeline: OrderEvent[];
  createdAt: string;
  estimatedDelivery: string;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export interface OrderEvent {
  status: OrderStatus;
  label: string;
  description: string;
  timestamp: string;
  location?: string;
  completed: boolean;
}

export interface Address {
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  addresses: Address[];
}
