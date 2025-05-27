import axios from "axios";
import type { Bike } from "../types/bike";

export const getAllBikes = async (): Promise<Bike[]> => {
    const response = await axios.get<Bike[]>("http://127.0.0.1:8080/api/bicycle");
    return response.data.items;
};