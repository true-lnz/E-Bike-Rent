// services/rentService.ts
import axios from "axios";
import { BASE_URL } from "../constants";
import type {
	CreateRentRequest,
	Rent,
	UpdateRentRequest,
} from "./../types/rent";

// Создание аренды велосипеда
export async function createRent(data: CreateRentRequest): Promise<Rent> {
  const res = await axios.post<{ rent: Rent }>(
    `${BASE_URL}api/rent/`,
    data,
    { withCredentials: true }
  );
  return res.data.rent;
}

// Получение аренд текущего пользователя
export async function getUserRents(): Promise<Rent[]> {
  const res = await axios.get<{ rents: Rent[] }>(
    `${BASE_URL}api/rent/`,
    { withCredentials: true }
  );
  return res.data.rents;
}

// Получение всех аренд (для администратора)
export async function getAllRents(): Promise<Rent[]> {
  const res = await axios.get<{ rents: Rent[] }>(
    `${BASE_URL}api/rent/all`, // путь должен быть прописан на сервере
    { withCredentials: true }
  );
  return res.data.rents;
}

// Обновление аренды по ID
export async function updateRent(id: number, data: UpdateRentRequest): Promise<Rent> {
  const res = await axios.put<{ rent: Rent }>(
    `${BASE_URL}/api/rent/${id}`,
    data,
    { withCredentials: true }
  );
  return res.data.rent;
}
