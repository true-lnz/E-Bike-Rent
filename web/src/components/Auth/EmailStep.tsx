// src/auth/components/EmailStep.tsx
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { logout, sendCode } from '../../services/authService';

export default function EmailStep({ onNext }: { onNext: () => void }) {
	const { user, setEmail, setUser, setIsVerified } = useAuth();
	const [input, setInput] = useState('');
	const [error, setError] = useState('');

	const handleSubmit = async () => {
		try {
			await sendCode(input);
			setEmail(input);
			onNext();
		} catch {
			setError('Ошибка при отправке кода');
		}
	};

	const handleLogout = () => {
		document.cookie = 'token=; Max-Age=0; path=/'; // удаляет cookie
		setUser(null);
		setEmail('');
		setIsVerified(false);
		logout();
		window.location.href = '/auth';
	};

	return (
		<div>
			<h2>Вход по Email</h2>

			{user && (
				<div>
					<p>Вы уже вошли как: <strong>{user.first_name}</strong></p>
					<button onClick={handleLogout}>Выйти и использовать другой email</button>
				</div>
			)}
			<div>
				<input
					value={input}
					onChange={e => setInput(e.target.value)}
					placeholder="Email"
				/>
				<button onClick={handleSubmit}>Отправить код</button>
				{error && <p>{error}</p>}
			</div>
		</div>
	);
}
