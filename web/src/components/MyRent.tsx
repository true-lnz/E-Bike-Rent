// src/components/MyRent.jsx
import { useEffect, useState } from "react";
import { getUserRents } from "../services/rentService";
import type { Rent } from "../types/rent";

export default function MyRent() {
	const [rents, setRents] = useState<Rent[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		getUserRents()
			.then(setRents)
			.finally(() => setLoading(false));
	}, []);

	if (loading) return <div>Загрузка...</div>;

	return (
		<div>
			<h1>Мои аренды</h1>
			{rents.map(rent => (
				<div key={rent.id}>
					Велосипед #{rent.bicycle_id}, Статус: {rent.status}
				</div>
			))}
		</div>
	);
}
