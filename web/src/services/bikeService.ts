import axios from "axios";
import { BASE_URL } from "../constants.ts";
import type { Bike } from "../types/bike";

export const getAllBikes = async (): Promise<[Bike[], number]> => {
  const response = await axios.get<{ items: Bike[]; total: number }>(BASE_URL + "api/bicycle");
  return [response.data.items, response.data.total];
};

export const getBikeById = async (id: number): Promise<Bike> => {
  const response = await axios.get<Bike>(BASE_URL + `api/bicycle/${id}`);
  return response.data;
};

export const createBike = async (bike: Omit<Bike, "id" | "available_quantity">): Promise<Bike> => {
  // На бекенде Create принимает JSON с объектом Bicycle
  const response = await axios.post<Bike>(BASE_URL + "api/bicycle/", bike);
  return response.data;
};

export const updateBike = async (id: number, bike: Omit<Bike, "id" | "available_quantity">): Promise<Bike> => {
  // Update также принимает JSON с объектом Bicycle
  const response = await axios.put<Bike>(BASE_URL + `api/bicycle/${id}`, bike);
  return response.data;
};

export const deleteBike = async (id: number): Promise<void> => {
  await axios.delete(BASE_URL + `api/bicycle/${id}`);
};
