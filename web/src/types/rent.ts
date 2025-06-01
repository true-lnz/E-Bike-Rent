import type { Accessory } from "./accessory";
import type { Bike } from "./bike";
import type { User } from "./user";

// types/rent.ts
export interface Rent {
  id?: number;
  start_date?: string | null;
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
  rentalDays: number;
  bicycleID?: number;
  accessories: number[];
}

export interface UpdateRentRequest {
  startDate?: string;
  expireDate?: string;
  status?: string;
  rentPrice?: number;
  accessoryPrice?: number;
  accessories?: number[];
}
