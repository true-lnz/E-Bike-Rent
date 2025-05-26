export interface User {
	id: number;
	firstName: string;
	lastName: string;
	patronymic: string;
	email: string;
	phoneNumber: string;
	birthday: string; // "YYYY-MM-DD"
	isVerified: boolean;
	companyId?: number;
}