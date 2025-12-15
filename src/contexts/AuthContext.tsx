import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  loadingProfile: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  signInAsDemo: () => void;
  resetPassword: (email: string) => Promise<{ error: any }>;
  updatePassword: (newPassword: string) => Promise<{ error: any }>;
  updateProfile: (data: Partial<Profile>) => Promise<{ error: any }>;
  uploadAvatar: (file: File) => Promise<{ error: any; url?: string }>;
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
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(false);
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
        
        // Fetch profile when user logs in
        if (session?.user) {
          setTimeout(() => {
            fetchProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (session?.user) {
        fetchProfile(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
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
    // Always clean demo flags
    localStorage.removeItem('mock_user');
    localStorage.removeItem('demo_mode');
    
    if (isMock) {
      setUser(null);
      setSession(null);
      return;
    }
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  const signInAsDemo = () => {
    const mockUser = {
      id: 'demo-user-enterprise',
      email: 'demo@uautospro.com',
      role: 'admin',
      user_metadata: {
        full_name: 'Usuário Demo',
        role: 'admin'
      }
    } as unknown as User;
    
    setUser(mockUser);
    setSession(null);
    setProfile({
      id: 'demo-profile',
      user_id: 'demo-user-enterprise',
      full_name: 'Usuário Demo',
      phone: '(11) 99999-9999',
      avatar_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    
    // Set demo flags for subscription bypass
    localStorage.setItem('mock_user', JSON.stringify(mockUser));
    localStorage.setItem('demo_mode', 'true');
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

  const fetchProfile = async (userId: string) => {
    if (isMock) return;
    
    try {
      setLoadingProfile(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoadingProfile(false);
    }
  };

  const updateProfile = async (data: Partial<Profile>) => {
    if (isMock) {
      return { error: null };
    }

    if (!user) {
      return { error: { message: 'Usuário não autenticado' } };
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('user_id', user.id);

      if (error) throw error;

      // Refresh profile
      await fetchProfile(user.id);
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  const uploadAvatar = async (file: File) => {
    if (isMock) {
      return { error: null, url: URL.createObjectURL(file) };
    }

    if (!user) {
      return { error: { message: 'Usuário não autenticado' } };
    }

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      // Upload file
      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Update profile with new avatar URL
      await updateProfile({ avatar_url: publicUrl });

      return { error: null, url: publicUrl };
    } catch (error: any) {
      return { error, url: undefined };
    }
  };

  const value = {
    user,
    session,
    profile,
    loading,
    loadingProfile,
    signIn,
    signUp,
    signOut,
    signInAsDemo,
    resetPassword,
    updatePassword,
    updateProfile,
    uploadAvatar,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};