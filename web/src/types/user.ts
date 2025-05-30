import type { Company } from "./company";

export interface User {
	id: number;
	first_name: string;
	last_name: string;
	patronymic: string;
	email: string;
	phone_number: string;
	birthday: string; // "YYYY-MM-DD" sdsdsdsd
	is_verified: boolean;
	company_id?: number;
	role: string;
	company?: Company;
}