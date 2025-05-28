export type Maintenance = {
  id: number;
  user_id: number;
  bicycle_name: string;
  status: string;
  details: string;
	admin_message: string;
  created_at: string;
  price: number;
  start_date: string;
  finish_date: string; //sdsdsd
};

export interface CreateMaintenanceRequest {
  bicycle_name: string;
  details: string;
}
