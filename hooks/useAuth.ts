'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, AuthTokens } from '@/types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  isInitialized: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  fetchUser: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isLoading: false,
      isInitialized: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          console.log('Making login request to API...');
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });

          console.log('Login API response status:', response.status);
          const data = await response.json();
          console.log('Login API response data:', data);

          if (!response.ok) {
            throw new Error(data.message || 'Login failed');
          }

          // Store access token in cookie for middleware
          if (typeof document !== 'undefined') {
            const secure = window.location.protocol === 'https:' ? '; Secure' : '';
            document.cookie = `accessToken=${data.accessToken}; path=/; max-age=900; SameSite=Strict${secure}`;
            console.log('Access token cookie set:', document.cookie.includes('accessToken'));
          }

          set({
            user: data.user,
            accessToken: data.accessToken,
            isLoading: false,
          });
          
          console.log('Login state updated successfully');
        } catch (error) {
          console.error('Login error in auth hook:', error);
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (name: string, email: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || 'Registration failed');
          }

          // Store access token in cookie for middleware
          if (typeof document !== 'undefined') {
            document.cookie = `accessToken=${data.accessToken}; path=/; max-age=900; SameSite=Strict; ${window.location.protocol === 'https:' ? 'Secure;' : ''}`;
          }

          set({
            user: data.user,
            accessToken: data.accessToken,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        // Call logout API to clear refresh token cookie
        fetch('/api/auth/logout', { method: 'POST' });
        
        // Clear access token cookie
        if (typeof document !== 'undefined') {
          document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
        }
        
        set({
          user: null,
          accessToken: null,
        });
      },

      refreshToken: async () => {
        try {
          const response = await fetch('/api/auth/refresh', {
            method: 'POST',
          });

          const data = await response.json();

          if (response.ok) {
            // Store new access token in cookie
            if (typeof document !== 'undefined') {
              document.cookie = `accessToken=${data.accessToken}; path=/; max-age=900; SameSite=Strict; ${window.location.protocol === 'https:' ? 'Secure;' : ''}`;
            }

            set({
              user: data.user,
              accessToken: data.accessToken,
            });
          } else {
            // Refresh failed, logout user
            get().logout();
          }
        } catch (error) {
          get().logout();
        }
      },

      updateUser: (userData: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, ...userData },
          });
        }
      },

      fetchUser: async () => {
        const { accessToken } = get();
        if (!accessToken) return;

        try {
          const response = await fetch('/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            set({ user: data.user });
          } else {
            // Token might be invalid, try to refresh
            await get().refreshToken();
          }
        } catch (error) {
          console.error('Failed to fetch user:', error);
        }
      },

      initialize: async () => {
        set({ isLoading: true });
        
        try {
          // Check if we have a stored token
          const { accessToken } = get();
          
          if (accessToken) {
            // Try to fetch user data with existing token
            await get().fetchUser();
          } else {
            // Try to refresh token from cookie
            await get().refreshToken();
          }
        } catch (error) {
          console.error('Auth initialization failed:', error);
        } finally {
          set({ isLoading: false, isInitialized: true });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
      }),
      skipHydration: true,
    }
  )
);