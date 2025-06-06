import axios from "axios";
import { BASE_URL } from "../constants.ts";
import type { Bike } from "../types/bike.ts";

// Получение всех велосипедов
export const getAllBikes = async (): Promise<[Bike[], number]> => {
	const response = await axios.get<{ items: Bike[]; total: number }>(
		BASE_URL + "api/bicycle"
	);
	return [response.data.items, response.data.total];
};

// Получение велосипеда по ID
export const getBikeById = async (id: number): Promise<Bike> => {
	const response = await axios.get<Bike>(BASE_URL + `api/bicycle/${id}`);
	return response.data;
};

// Создание велосипеда
export const createBike = async (data: {
	name?: string;
	weight?: number;
	max_speed?: number;
	max_range?: number;
	max_load?: number;
	power?: number;
	charge_time_hours?: string;
	battery?: string;
	suspension?: boolean;
	brakes?: string;
	frame?: string;
	wheel_size?: number;
	wheel_type?: string;
	drive?: string;
	brake_system?: string;
	day_price?: number;
	quantity?: number;
	image?: File;
}): Promise<Bike> => {
	const formData = new FormData();
	if (data.name) formData.append("name", data.name);
	if (data.weight !== undefined) formData.append("weight", data.weight.toString());
	if (data.max_speed !== undefined) formData.append("max_speed", data.max_speed.toString());
	if (data.max_range !== undefined) formData.append("max_range", data.max_range.toString());
	if (data.max_load !== undefined) formData.append("max_load", data.max_load.toString());
	if (data.power !== undefined) formData.append("power", data.power.toString());
	if (data.charge_time_hours) formData.append("charge_time_hours", data.charge_time_hours);
	if (data.battery) formData.append("battery", data.battery);
	if (data.suspension !== undefined) formData.append("suspension", String(data.suspension));
	if (data.brakes) formData.append("brakes", data.brakes);
	if (data.frame) formData.append("frame", data.frame);
	if (data.wheel_size !== undefined) formData.append("wheel_size", data.wheel_size.toString());
	if (data.wheel_type) formData.append("wheel_type", data.wheel_type);
	if (data.drive) formData.append("drive", data.drive);
	if (data.brake_system) formData.append("brake_system", data.brake_system);
	if (data.day_price !== undefined) formData.append("day_price", data.day_price.toString());
	if (data.quantity !== undefined) formData.append("quantity", data.quantity.toString());
	if (data.image) formData.append("image", data.image);

	const response = await axios.post<Bike>(BASE_URL + "api/admin/bicycle", formData, {
		headers: { "Content-Type": "multipart/form-data" },
	});
	return response.data;
};

// Обновление велосипеда
export const updateBike = async (
	id: number,
	data: Partial<Omit<Bike, "id">> & { image?: File }
): Promise<Bike> => {
	const formData = new FormData();
	if (data.name) formData.append("name", data.name);
	if (data.weight !== undefined) formData.append("weight", data.weight.toString());
	if (data.max_speed !== undefined) formData.append("max_speed", data.max_speed.toString());
	if (data.max_range !== undefined) formData.append("max_range", data.max_range.toString());
	if (data.max_load !== undefined) formData.append("max_load", data.max_load.toString());
	if (data.power !== undefined) formData.append("power", data.power.toString());
	if (data.charge_time_hours) formData.append("charge_time_hours", data.charge_time_hours);
	if (data.battery) formData.append("battery", data.battery);
	if (data.suspension !== undefined) formData.append("suspension", String(data.suspension));
	if (data.brakes) formData.append("brakes", data.brakes);
	if (data.frame) formData.append("frame", data.frame);
	if (data.wheel_size !== undefined) formData.append("wheel_size", data.wheel_size.toString());
	if (data.wheel_type) formData.append("wheel_type", data.wheel_type);
	if (data.drive) formData.append("drive", data.drive);
	if (data.brake_system) formData.append("brake_system", data.brake_system);
	if (data.day_price !== undefined) formData.append("day_price", data.day_price.toString());
	if (data.quantity !== undefined) formData.append("quantity", data.quantity.toString());
	if (data.image) formData.append("image", data.image);

	const response = await axios.put<Bike>(BASE_URL + `api/admin/bicycle/${id}`, formData, {
		headers: { "Content-Type": "multipart/form-data" },
	});
	return response.data;
};

// Удаление велосипеда
export const deleteBike = async (id: number): Promise<void> => {
	await axios.delete(BASE_URL + `api/admin/bicycle/${id}`);
};
