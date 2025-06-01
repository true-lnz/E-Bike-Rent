// stores/authStore.ts
import type { User } from "../types/user";

type Listener = () => void;

class AuthStore {
  private user: User | null = null;
  private loading: boolean = true;
  private listeners: Listener[] = [];

  getUser() {
    return this.user;
  }

  isLoading() {
    return this.loading;
  }

  isAuthenticated() {
    return !!this.user;
  }

  subscribe(listener: Listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    for (const listener of this.listeners) {
      listener();
    }
  }

  setUser(user: User | null) {
    this.user = user;
    this.notify();
  }

  setLoading(loading: boolean) {
    this.loading = loading;
    this.notify();
  }
}

export const authStore = new AuthStore();
