// hooks/useAuth.ts
import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "../constants";
import type { User } from "../types/user";

export function useAuth() {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const checkAuth = async () => {
			try {
				const res = await axios.get(BASE_URL + "api/auth/me", {
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
