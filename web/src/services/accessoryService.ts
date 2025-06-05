import axios from "axios";
import { BASE_URL } from "../constants.ts";
import type { Accessory } from "../types/accessory.ts";

export const getAllAccessories = async (): Promise<[Accessory[], number]> => {
	const response = await axios.get<{ items: Accessory[]; total: number }>(BASE_URL + "api/accessory");
	return [response.data.items, response.data.total];
};

// Удаление по ID
export const deleteAccessory = async (id: number): Promise<void> => {
  await axios.delete(`${BASE_URL}api/accessory/${id}`);
};

// Создание аксессуара с картинкой
export const createAccessory = async (data: {
  name?: string;
  quantity?: number;
  price?: number;
  image?: File;
}): Promise<Accessory> => {
  const formData = new FormData();
  if (data.name) formData.append("name", data.name);
  if (data.quantity !== undefined) formData.append("quantity", data.quantity.toString());
  if (data.price !== undefined) formData.append("price", data.price.toString());
  if (data.image) formData.append("image", data.image);

  const response = await axios.post<Accessory>(BASE_URL + "api/accessory/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Обновление аксессуара по ID
export const updateAccessory = async (id: number, data: {
  name?: string;
  quantity?: number;
  price?: number;
  image?: File;
}): Promise<Accessory> => {
  const formData = new FormData();
  if (data.name) formData.append("name", data.name);
  if (data.quantity !== undefined) formData.append("quantity", data.quantity.toString());
  if (data.price !== undefined) formData.append("price", data.price.toString());
  if (data.image) formData.append("image", data.image);

  const response = await axios.put<Accessory>(`${BASE_URL}api/accessory/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};