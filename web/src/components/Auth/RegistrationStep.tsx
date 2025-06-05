import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { completeRegistration } from '../../services/authService';

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
      window.location.href = '/';
    } catch (e) {
      alert('Ошибка при регистрации');
    }
  };

  return (
    <div>
      <h2>Регистрация</h2>
      <input name="last_name" value={form.last_name} placeholder="Фамилия" onChange={handleChange} />
      <input name="first_name" value={form.first_name} placeholder="Имя" onChange={handleChange} />
      <input name="patronymic" value={form.patronymic} placeholder="Отчество" onChange={handleChange} />
      <input name="phone_number" value={form.phone_number} placeholder="Телефон" onChange={handleChange} />
      <input type="date" name="birthday" value={form.birthday} onChange={handleChange} />
      <select name="company_id" value={form.company_id} onChange={handleChange}>
        <option value="">Без компании</option>
        <option value="1">Компания 1</option>
        <option value="2">Компания 2</option>
      </select>
      <button onClick={handleSubmit}>Завершить регистрацию</button>
    </div>
  );
}