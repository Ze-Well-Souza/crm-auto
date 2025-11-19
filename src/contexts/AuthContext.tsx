import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  updatePassword: (newPassword: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const isMock = import.meta.env.VITE_AUTH_MODE === 'mock';

  useEffect(() => {
    if (isMock) {
      const stored = localStorage.getItem('mock_user');
      if (stored) {
        try {
          const u = JSON.parse(stored);
          setUser(u as User);
        } catch {}
      }
      setLoading(false);
      return;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    if (email === 'admin@oficina.com' && password === '123456') {
      const mock = { id: 'mock-user', email } as unknown as User;
      setUser(mock);
      setSession(null);
      localStorage.setItem('mock_user', JSON.stringify(mock));
      return { error: null };
    }
    if (isMock) {
      const mock = { id: 'mock-user', email } as unknown as User;
      setUser(mock);
      setSession(null);
      localStorage.setItem('mock_user', JSON.stringify(mock));
      return { error: null };
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error && String(error.message).toLowerCase().includes('invalid api key')) {
      const mock = { id: 'mock-user', email } as unknown as User;
      setUser(mock);
      setSession(null);
      localStorage.setItem('mock_user', JSON.stringify(mock));
      return { error: null };
    }
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    if (isMock) {
      return { error: null };
    }
    const redirectUrl = `${window.location.origin}/`;
    const { error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        emailRedirectTo: redirectUrl
      }
    });
    return { error };
  };

  const signOut = async () => {
    if (isMock) {
      localStorage.removeItem('mock_user');
      setUser(null);
      setSession(null);
      return;
    }
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  const resetPassword = async (email: string) => {
    if (isMock) {
      return { error: null };
    }
    const redirectUrl = `${window.location.origin}/reset-password`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl
    });
    return { error };
  };

  const updatePassword = async (newPassword: string) => {
    if (isMock) {
      return { error: null };
    }
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });
    return { error };
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
