import axios from "axios";
import { BASE_URL } from "../constants";
import type { CreateMaintenanceRequest, Maintenance } from "../types/maintenance";

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
};