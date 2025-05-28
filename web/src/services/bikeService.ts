import axios from "axios";
import type {Bike} from "../types/bike";
import {BASE_URL} from "../constants.ts";

// Получение всех велосипедов
export const getAllBikes = async (): Promise<Bike[]> => {
    const response = await axios.get<{ items: Bike[] }>(BASE_URL + "api/bicycle");
    return response.data.items;
};

// Получение одного велосипеда по ID
export const getBikeById = async (id: number): Promise<Bike> => {
    const response = await axios.get<Bike>(BASE_URL + `api/bicycle/${id}`);
    return response.data;
};
