import axios from "axios";
import type { Bike } from "../types/bike";

// Получение всех велосипедов
export const getAllBikes = async (): Promise<Bike[]> => {
  const response = await axios.get<{ items: Bike[] }>("http://127.0.0.1:8080/api/bicycle");
  return response.data.items;
};

// Получение одного велосипеда по ID
export const getBikeById = async (id: number): Promise<Bike> => {
  const response = await axios.get<Bike>(`http://127.0.0.1:8080/api/bicycle/${id}`);
  return response.data;
};
