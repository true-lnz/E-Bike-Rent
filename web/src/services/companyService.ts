import axios from "axios";
import { BASE_URL } from "../constants";
import type { Company } from "../types/company";

export const companyService = {
  async getAllCompanies(): Promise<Company[]> {
    const response = await axios.get(BASE_URL + "api/company");
    return response.data.companies;
  }
}