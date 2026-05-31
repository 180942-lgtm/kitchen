import { create } from 'zustand';

interface UserState {
  token: string | null;
  phone: string | null;
  isLoggedIn: boolean;
  login: (phone: string, code: string) => Promise<boolean>;
  logout: () => void;
}

const useUserStore = create<UserState>((set) => ({
  token: localStorage.getItem('token'),
  phone: localStorage.getItem('phone'),
  isLoggedIn: !!localStorage.getItem('token'),
  login: async (phone: string, code: string) => {
    // 模拟登录，验证码固定 1234
    if (code === '1234') {
      const token = 'mock-token-' + Date.now();
      localStorage.setItem('token', token);
      localStorage.setItem('phone', phone);
      set({ token, phone, isLoggedIn: true });
      return true;
    }
    return false;
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('phone');
    set({ token: null, phone: null, isLoggedIn: false });
  },
}));

export default useUserStore;