import axios from "axios";
import { BASE_URL } from "../constants.ts";
import type { Bike } from "../types/bike";

export const getAllBikes = async (): Promise<[Bike[], number]> => {
  const response = await axios.get<{ items: Bike[]; total: number }>(BASE_URL + "api/bicycle");
  return [response.data.items, response.data.total];
};
// Получение одного велосипеда по ID
export const getBikeById = async (id: number): Promise<Bike> => {
    const response = await axios.get<Bike>(BASE_URL + `api/bicycle/${id}`);
    return response.data;
};
