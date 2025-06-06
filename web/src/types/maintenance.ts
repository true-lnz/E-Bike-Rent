import type { User } from "./user";

export type Maintenance = {
  id: number;
  user_id: number;
	user: User;
  bicycle_name: string;
  status: string;
  details: string;
	admin_message: string;
  created_at: string;
  price: number;
  start_date: string;
  finish_date: string;
};

export interface CreateMaintenanceRequest {
  bicycle_name: string;
  details: string;
}

export interface UpdateMaintenanceRequest {
  bicycle_name: string;
  status: string;
  finish_date: string; // ISO формат: "2025-06-10"
  admin_message: string;
  price: number;
}