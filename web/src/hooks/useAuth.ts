// hooks/useAuth.ts
import axios from "axios";
import { useEffect, useState } from "react";
import type { User } from "../types/User"; // определи тип User

export function useAuth() {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const checkAuth = async () => {
			try {
				const res = await axios.get("http://localhost:8080/api/auth/me", {
					withCredentials: true,
				});
				setUser(res.data.user);
			} catch (err) {
				setUser(null);
			} finally {
				setLoading(false);
			}
		};

		checkAuth();
	}, []);

	const isAuthenticated = !!user;

	return { user, setUser, isAuthenticated, loading };
}
