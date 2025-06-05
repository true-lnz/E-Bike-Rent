import type { Company } from "./company";

export interface User {
	id: number;
	email: string;
	first_name: string;
	last_name: string;
	patronymic: string;
	phone_number: string;
	birthday: string;
	company?: Company;
	company_id?: number;
	is_verified: boolean;
	role: string;
}