import axios from "axios";
import type { CreateMaintenanceRequest, Maintenance } from "../types/maintenance";

export const maintenanceService = {
  async getUserMaintenances(): Promise<Maintenance[]> {
    const response = await axios.get("http://localhost:8080/api/maintenance", {
      withCredentials: true,
    });

    return response.data.maintenances;
  },
	async createMaintenance(data: CreateMaintenanceRequest): Promise<Maintenance> {
    const response = await axios.post(
      "http://localhost:8080/api/maintenance/",
      data,
      {
        withCredentials: true,
      }
    );

    return response.data.maintenance;
  },
};