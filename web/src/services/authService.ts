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
			delete axios.defaults.headers.common['Authorization'];
      localStorage.clear();
      sessionStorage.clear();
      
    } catch (error) {
      console.error("Ошибка при выходе:", error);
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
      });
			delete axios.defaults.headers.common['Authorization'];
      localStorage.clear();
      sessionStorage.clear();
      throw error;
    }
  }
};