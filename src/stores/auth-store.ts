import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { apiGet, apiPost, apiPut } from '../services/api';
import type { Profile } from '../types';
import type { Session, User } from '@supabase/supabase-js';

interface AuthState {
  user: Profile | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  initialize: () => Promise<void>;
  setSession: (session: Session | null) => void;
  setUser: (user: Profile | null) => void;
}

async function loadProfile(): Promise<Profile | null> {
  try {
    const response = await apiGet<Profile>('/profile/me');
    return response.data;
  } catch {
    return null;
  }
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  isAuthenticated: false,
  isLoading: true,

  setSession: (session: Session | null) => {
    set({
      session,
      isAuthenticated: !!session,
    });
  },

  setUser: (user: Profile | null) => {
    set({ user });
  },

  signUp: async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    if (data.session) {
      set({ session: data.session, isAuthenticated: true });

      // Create profile in backend
      try {
        const response = await apiPut<Profile>('/profile/me', {
          email,
          fullName,
        });
        set({ user: response.data });
      } catch {
        // Profile creation failed but auth succeeded - profile will be created on next load
        const profile = await loadProfile();
        if (profile) {
          set({ user: profile });
        }
      }
    }
  },

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    set({ session: data.session, isAuthenticated: true });

    const profile = await loadProfile();
    if (profile) {
      set({ user: profile });
    }
  },

  signInWithGoogle: async () => {
    const redirectUrl = typeof window !== 'undefined'
      ? `${window.location.origin}/auth/callback`
      : undefined;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
      },
    });

    if (error) {
      throw new Error(error.message);
    }
  },

  signOut: async () => {
    // Clear client-side state immediately to prevent slow redirect times
    set({
      user: null,
      session: null,
      isAuthenticated: false,
    });

    // Run supabase sign out in the background
    supabase.auth.signOut().catch((error) => {
      console.error('SignOut error:', error);
    });
  },

  resetPassword: async (email: string) => {
    const redirectUrl = typeof window !== 'undefined'
      ? `${window.location.origin}/reset-password`
      : undefined;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });

    if (error) {
      throw new Error(error.message);
    }
  },

  initialize: async () => {
    try {
      set({ isLoading: true });

      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        set({ session, isAuthenticated: true });

        const profile = await loadProfile();
        if (profile) {
          set({ user: profile });
        }
      } else {
        set({
          user: null,
          session: null,
          isAuthenticated: false,
        });
      }
    } catch {
      set({
        user: null,
        session: null,
        isAuthenticated: false,
      });
    } finally {
      set({ isLoading: false });
    }
  },
}));
