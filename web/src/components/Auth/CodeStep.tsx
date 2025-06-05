// src/auth/components/CodeStep.tsx
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { verifyCode } from '../../services/authService';

export default function CodeStep({ onNext }: { onNext: () => void }) {
  const [code, setCode] = useState('');
  const { email, setIsVerified } = useAuth();
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    try {
      const res = await verifyCode(email, code);
      if (!res.data.is_verified) {
        setIsVerified(false);
        onNext();
      } else {
        setIsVerified(true);
				if (res.data.role === "admin") {
        	window.location.href = '/admin'; // переход в админку
				} else {
        	window.location.href = '/dashboard'; // переход на лк
				}
      }
    } catch {
      setError('Неверный код');
    }
  };

  return (
    <div>
      <h2>Введите код</h2>
      <input value={code} onChange={e => setCode(e.target.value)} placeholder="Код из письма" />
      <button onClick={handleSubmit}>Подтвердить</button>
      {error && <p>{error}</p>}
    </div>
  );
}
