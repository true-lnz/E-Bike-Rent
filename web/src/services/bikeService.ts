import type { Bike } from "../types/Bike";

// const API_URL = "https://your-api-url.com"; // Заменишь на своё

/* export const getAllBikes = async (): Promise<Bike[]> => {
  const response = await axios.get(`${API_URL}/bicycle`);
  return response.data;
};
 */

export const getAllBikes = async (): Promise<Bike[]> => {
  // Задержка — имитация загрузки
  await new Promise((r) => setTimeout(r, 500));

  return [
    {
      id: 1,
      name: "ElectroSpeed 3000",
			image_url: "src/assets/images/kugoo-v3-max-1.png",
      weight_kg: 20,
      max_speed_kmh: 45,
      max_range_km: 100,
      max_load_kg: 120,
      power_w: 500,
      charge_time_hours: 3,
      battery: "Li-ion 36V",
      suspension: true,
      brakes: "дисковые",
      frame: "алюминий",
      wheel_size_inch: 26,
      wheel_type: "надувные",
      drive: "задний",
      brake_system: "гидравлическая",
      day_price: 950,
      quantity: 5,
    },
    {
      id: 2,
      name: "UrbanGlide X",
			image_url: "src/assets/images/kolyan-1.png",
      weight_kg: 18,
      max_speed_kmh: 40,
      max_range_km: 90,
      max_load_kg: 110,
      power_w: 400,
      charge_time_hours: 2.5,
      battery: "Li-ion 48V",
      suspension: false,
      brakes: "ободные",
      frame: "карбон",
      wheel_size_inch: 27,
      wheel_type: "надувные",
      drive: "передний",
      brake_system: "механическая",
      day_price: 870,
      quantity: 2,
    },
  ];
};