// src/services/authService.ts
import axios from "axios";

export const authService = {
	
  async logout(): Promise<void> {
    try {
      await axios.post(
        "http://localhost:8080/api/auth/logout",
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Ошибка при выходе:", error);
      throw error;
    }
  }
};
