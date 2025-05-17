import { create } from 'zustand';

const useAuthStore = create((set) => ({
  isAuthenticated: false,
  userName: null,
  token: localStorage.getItem('token') || null,
  login: (userName, token) => {
    localStorage.setItem('token', token);
    set({ isAuthenticated: true, userName, token });
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ userName: null, isAuthenticated: false, token: null });
  }
}));

export default useAuthStore;
