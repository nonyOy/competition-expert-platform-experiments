import { defineStore } from 'pinia';
import { login, type UserInfo } from '../api/http';

const storageKey = 'competition-expert-user';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem(storageKey) || 'null') as UserInfo | null
  }),
  getters: {
    isLoggedIn: (state) => Boolean(state.user),
    isAdmin: (state) => state.user?.role === 'admin'
  },
  actions: {
    async signIn(username: string, password: string) {
      const user = await login(username, password);
      this.user = user;
      localStorage.setItem(storageKey, JSON.stringify(user));
      return user;
    },
    signOut() {
      this.user = null;
      localStorage.removeItem(storageKey);
    }
  }
});

