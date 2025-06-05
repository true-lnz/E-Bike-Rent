import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { completeRegistration } from '../../services/authService';
import { companyService } from '../../services/companyService';
import type { Company } from '../../types/company';

export default function RegistrationStep() {
	const { email } = useAuth();
	const [form, setForm] = useState({
		first_name: '',
		last_name: '',
		patronymic: '',
		phone_number: '',
		birthday: '',
		company_id: '',
	});
	const [companies, setCompanies] = useState<Company[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState('');

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async () => {
		if (!form.birthday) {
			return alert('Введите дату рождения');
		}

		const payload = {
			...form,
			email,
			company_id: form.company_id ? Number(form.company_id) : null,
		};

		try {
			await completeRegistration(payload);
			window.location.href = '/dashboard';
		} catch (e) {
			alert('Ошибка при регистрации');
		}
	};

	useEffect(() => {
		const fetchCompanies = async () => {
			try {
				const data = await companyService.getAllCompanies();
				setCompanies(data);
			} catch (err) {
				console.error("Ошибка загрузки компаний:", err);
			} finally {
				setLoading(false);
			}
		};

		fetchCompanies();
	}, []);


	const filteredCompanies = companies.filter((company) =>
		company.name.toLowerCase().includes(searchQuery.toLowerCase())
	);


	return (
		<div>
			<h2>Регистрация</h2>
			<input name="last_name" value={form.last_name} placeholder="Фамилия" onChange={handleChange} />
			<input name="first_name" value={form.first_name} placeholder="Имя" onChange={handleChange} />
			<input name="patronymic" value={form.patronymic} placeholder="Отчество" onChange={handleChange} />
			<input name="phone_number" value={form.phone_number} placeholder="Телефон" onChange={handleChange} />
			<input type="date" name="birthday" value={form.birthday} onChange={handleChange} />

			<input
				placeholder="Поиск компании"
				value={searchQuery}
				onChange={(e) => setSearchQuery(e.target.value)}
			/>

			<select name="company_id" value={form.company_id} onChange={handleChange}>
				<option value="">Без компании</option>
				{filteredCompanies.map(company => (
					<option key={company.id} value={company.id}>
						{company.name}
					</option>
				))}
			</select>

			<button onClick={handleSubmit} disabled={loading}>
				{loading ? 'Загрузка...' : 'Завершить регистрацию'}
			</button>
		</div>
	);

}