import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type AppRole = 'user' | 'admin' | 'super_admin';

interface UserRoleData {
  role: AppRole | null;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  loading: boolean;
  error: string | null;
}

export const useUserRole = (): UserRoleData => {
  const [roleData, setRoleData] = useState<UserRoleData>({
    role: null,
    isAdmin: false,
    isSuperAdmin: false,
    loading: true,
    error: null,
  });

  useEffect(() => {
    loadUserRole();
  }, []);

  const loadUserRole = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setRoleData({
          role: null,
          isAdmin: false,
          isSuperAdmin: false,
          loading: false,
          error: null,
        });
        return;
      }

      // Buscar role do usuário na tabela user_roles
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (error) {
        // Se não encontrou role, assumir que é user comum
        if (error.code === 'PGRST116') {
          setRoleData({
            role: 'user',
            isAdmin: false,
            isSuperAdmin: false,
            loading: false,
            error: null,
          });
          return;
        }
        throw error;
      }

      const role = data.role as AppRole;
      const isAdmin = role === 'admin' || role === 'super_admin';
      const isSuperAdmin = role === 'super_admin';

      setRoleData({
        role,
        isAdmin,
        isSuperAdmin,
        loading: false,
        error: null,
      });
    } catch (err: any) {
      console.error('Error loading user role:', err);
      setRoleData({
        role: null,
        isAdmin: false,
        isSuperAdmin: false,
        loading: false,
        error: err.message,
      });
    }
  };

  return roleData;
};
