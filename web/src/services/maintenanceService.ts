import axios from "axios";
import type { Maintenance } from "../types/Maintenance";

export const maintenanceService = {
  async getUserMaintenances(): Promise<Maintenance[]> {
    const response = await axios.get("http://localhost:8080/api/maintenance", {
      withCredentials: true,
    });

    return response.data.maintenances; // ⬅️ вот так правильно
  },
};