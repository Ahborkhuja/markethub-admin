import { writable, derived } from 'svelte/store';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
}

const createAuthStore = () => {
  const { subscribe, set, update } = writable<AuthState>({
    user: null,
    token: typeof localStorage !== 'undefined'
      ? localStorage.getItem('accessToken')
      : null,
  });

  return {
    subscribe,
    login: (user: User, token: string, refreshToken: string) => {
      localStorage.setItem('accessToken', token);
      localStorage.setItem('refreshToken', refreshToken);
      set({ user, token });
    },
    logout: () => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      set({ user: null, token: null });
      window.location.href = '/login';
    },
  };
};

export const authStore = createAuthStore();
export const isLoggedIn = derived(authStore, $auth => !!$auth.token);