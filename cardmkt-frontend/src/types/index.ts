export type Game = "mtg" | "yugioh";
export type Currency = "COP" | "USD";
export type Condition = "NM" | "LP" | "MP" | "HP" | "DMG";
export type Language = "EN" | "ES" | "JP";
export type ListingStatus = "active" | "sold" | "paused";
export type OrderStatus = "pending" | "paid" | "shipped" | "delivered" | "disputed";

export interface Card {
  id: number;
  game: Game;
  name: string;
  setCode: string;
  setName: string;
  rarity: string;
  imageUrl: string;
  tcgplayerId?: string;
  prices?: CardPrice;
}

export interface CardPrice {
  id: number;
  cardId: number;
  priceLow: number;
  priceMid: number;
  priceMarket: number;
  priceHigh: number;
  currency: "USD";
  updatedAt: string;
}

export interface Listing {
  id: number;
  sellerId: number;
  seller: User;
  card: Card;
  condition: Condition;
  language: Language;
  quantity: number;
  priceCop: number;
  status: ListingStatus;
  photos: string[];
  notes?: string;
  createdAt: string;
}

export interface User {
  id: number;
  name: string;
  city: string;
  rating: number;
  totalSales: number;
}

export interface Order {
  id: number;
  buyerId: number;
  sellerId: number;
  status: OrderStatus;
  totalCop: number;
  shippingMethod: string;
  createdAt: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: number;
  listing: Listing;
  quantity: number;
  priceAtPurchase: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}
