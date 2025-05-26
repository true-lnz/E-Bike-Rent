import type { Company } from "../types/Company";

// 🔧 Шаблонные данные
const mockCompanies: Company[] = [
  {
    id: 1,
    name: "ООО Ромашка",
    image_url: "https://via.placeholder.com/150?text=Ромашка",
  },
  {
    id: 2,
    name: "ИП Иванов",
    image_url: "https://via.placeholder.com/150?text=ИП+Иванов",
  },
  {
    id: 3,
    name: "ЗАО Прогресс",
    image_url: "https://via.placeholder.com/150?text=Прогресс",
  },
  {
    id: 4,
    name: "TechNova",
    image_url: "https://via.placeholder.com/150?text=TechNova",
  },
];

export const companyService = {
  /**
   * Получение списка компаний
   */
  async getAll(): Promise<Company[]> {
    // Здесь в будущем можно сделать fetch/axios
    // return fetch("/api/companies").then((res) => res.json());
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockCompanies), 500); // Эмуляция задержки
    });
  },
};
