export type Maintenance = {
  id: number;
  user_id: number;
  bicycle_name: string;
  status: string;
  details: string;
  created_at: string;       // ISO-строка (например: "2024-05-26T12:34:56Z")
  price: number;
  estimated_time: string;   // ISO-строка (например: "2024-06-01T00:00:00Z")
};

export interface CreateMaintenanceRequest {
  bicycle_name: string;
  // details: string;
	// todo РЕАЛИЗОВАТЬ ОТПРАВКУ ДЕТАЛЕЙ ЗАЯВКИ
}
