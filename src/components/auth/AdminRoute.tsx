import { ReactNode } from 'react';
import { useUserRole } from '@/hooks/useUserRole';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AdminRouteProps {
  children: ReactNode;
  requireSuperAdmin?: boolean;
}

export const AdminRoute = ({ children, requireSuperAdmin = false }: AdminRouteProps) => {
  const { isAdmin, isSuperAdmin, loading } = useUserRole();
  const navigate = useNavigate();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  
  // Verificar se requer super admin
  if (requireSuperAdmin && !isSuperAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <Shield className="h-8 w-8 text-red-500" />
              <CardTitle>Acesso Restrito</CardTitle>
            </div>
            <CardDescription>
              Esta área requer permissões de Super Administrador.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800">
                <Lock className="h-5 w-5 text-red-600 dark:text-red-400" />
                <p className="text-sm text-red-900 dark:text-red-100">
                  Você não tem permissão para acessar esta página.
                </p>
              </div>
              <Button onClick={() => navigate('/')} className="w-full">
                Voltar ao Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Verificar se é admin
  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <Shield className="h-8 w-8 text-yellow-500" />
              <CardTitle>Acesso Negado</CardTitle>
            </div>
            <CardDescription>
              Esta área é restrita a administradores do sistema.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <Lock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                <p className="text-sm text-yellow-900 dark:text-yellow-100">
                  Você precisa ser administrador para acessar o painel admin.
                </p>
              </div>
              <Button onClick={() => navigate('/')} className="w-full">
                Voltar ao Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return <>{children}</>;
};
