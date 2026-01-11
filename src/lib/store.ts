import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  serviceId: string;
  serviceName: string;
  price: number;
  channels: string[];
  icon: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  status: string;
  avatar?: string;
}

interface AppState {
  user: User | null;
  token: string | null;
  cart: CartItem[];
  isCartOpen: boolean;
  
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  
  addToCart: (item: CartItem) => void;
  removeFromCart: (serviceId: string) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setCartOpen: (open: boolean) => void;
  
  getCartTotal: () => number;
  getCartCount: () => number;
  isInCart: (serviceId: string) => boolean;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      cart: [],
      isCartOpen: false,

      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      
      login: (user, token) => {
        set({ user, token });
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', token);
        }
      },
      
      logout: () => {
        set({ user: null, token: null, cart: [] });
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
        }
      },

      addToCart: (item) => {
        const { cart } = get();
        if (!cart.find(i => i.serviceId === item.serviceId)) {
          set({ cart: [...cart, item] });
        }
      },
      
      removeFromCart: (serviceId) => {
        set({ cart: get().cart.filter(i => i.serviceId !== serviceId) });
      },
      
      clearCart: () => set({ cart: [] }),
      
      toggleCart: () => set({ isCartOpen: !get().isCartOpen }),
      
      setCartOpen: (open) => set({ isCartOpen: open }),

      getCartTotal: () => {
        return get().cart.reduce((total, item) => total + item.price, 0);
      },
      
      getCartCount: () => get().cart.length,
      
      isInCart: (serviceId) => {
        return get().cart.some(i => i.serviceId === serviceId);
      },
    }),
    {
      name: 'magnetic-nobot-store',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        cart: state.cart,
      }),
    }
  )
);
