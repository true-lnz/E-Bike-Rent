// src/services/authService.ts
import axios from "axios";
import { BASE_URL } from "../constants";

export const authService = {
	
  async logout(): Promise<void> {
    try {
      await axios.post(
        BASE_URL + "api/auth/logout",
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Ошибка при выходе:", error);
      throw error;
    }
  }
};
