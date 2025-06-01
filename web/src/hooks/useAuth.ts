// hooks/useAuth.ts
import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "../constants";
import { authStore } from "../store/authStore";
import type { User } from "../types/user";

export function useAuth() {
  const [user, setUser] = useState<User | null>(authStore.getUser());
  const [loading, setLoading] = useState(authStore.isLoading());

  useEffect(() => {
    const unsubscribe = authStore.subscribe(() => {
      setUser(authStore.getUser());
      setLoading(authStore.isLoading());
    });

    // При первом монтировании: загрузка
    if (authStore.isLoading()) {
      authStore.setLoading(true);
      axios
        .get<{ user: User }>(BASE_URL + "api/auth/me", { withCredentials: true })
        .then((res) => {
          authStore.setUser(res.data.user);
        })
        .catch(() => {
          authStore.setUser(null);
        })
        .finally(() => {
          authStore.setLoading(false);
        });
    }

    return unsubscribe;
  }, []);

  return {
    user,
    isAuthenticated: !!user,
    loading,
    setUser: authStore.setUser.bind(authStore),
  };
}
