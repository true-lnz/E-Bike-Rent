import axios from "axios";
import { BASE_URL } from "../constants";
import type { CreateMaintenanceRequest, Maintenance, UpdateMaintenanceRequest } from "../types/maintenance";

export const maintenanceService = {
	async getUserMaintenances(): Promise<Maintenance[]> {
		const response = await axios.get(BASE_URL + "api/maintenance", {
			withCredentials: true,
		});

		return response.data.maintenances;
	},
	async createMaintenance(data: CreateMaintenanceRequest): Promise<Maintenance> {
		const response = await axios.post(
			BASE_URL + "api/maintenance/",
			data,
			{
				withCredentials: true,
			}
		);

		return response.data.maintenance;
	},
	async getMaintenanceById(id: number): Promise<Maintenance> {
		const response = await axios.get(
			BASE_URL + `api/maintenance/${id}`,
			{
				withCredentials: true,
			}
		);

		return response.data.maintenance;
	},

	async getAllMaintenances(): Promise<Maintenance[]> {
		const response = await axios.get(BASE_URL + "api/admin/maintenance", {
			withCredentials: true,
		});
		return response.data.maintenances;
	},

	async updateMaintenance(id: number, data: UpdateMaintenanceRequest): Promise<Maintenance> {
		const response = await axios.put(BASE_URL + `api/admin/maintenance/${id}`, data, {
			withCredentials: true,
		});
		return response.data.maintenance;
	},
};