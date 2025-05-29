import axios from "axios";
import { BASE_URL } from "../constants.ts";
import type { Accessory } from "../types/accessory.ts";

export const getAllAccessories = async (): Promise<[Accessory[], number]> => {
	const response = await axios.get<{ items: Accessory[]; total: number }>(BASE_URL + "api/accessory");
	return [response.data.items, response.data.total];
};