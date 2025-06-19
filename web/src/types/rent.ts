import type { Accessory } from "./accessory";
import type { Bike } from "./bike";
import type { User } from "./user";

// types/rent.ts
export interface Rent {
  id?: number;
  start_date?: string;
  expire_date: string;
  updated_at: string;
  user_id?: number;
  user?: User;
  bicycle_id?: number;
  bicycle: Bike;
  status: string;
  rent_price: number;
  accessory_price: number;
  accessories: Accessory[];
}

export interface CreateRentRequest {
  rental_days: number;
  bicycle_id?: number;
  accessories: number[];
}

export interface UpdateRentRequest {
  start_date?: string;
  status?: string;
  accessories?: number[];
}
