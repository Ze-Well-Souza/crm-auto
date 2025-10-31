import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Search, MoreVertical, UserCog, Shield, User } from 'lucide-react';
import { toast } from 'sonner';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

interface UserData {
  id: string;
  email: string;
  created_at: string;
  role: string | null;
  subscription_plan: string | null;
  subscription_status: string | null;
}

export const UsersManagement = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      
      // Buscar usuários do auth.users via RPC ou query personalizada
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) throw authError;

      // Para cada usuário, buscar role e subscription
      const usersWithData = await Promise.all(
        authUsers.users.map(async (user) => {
          // Buscar role
          const { data: roleData } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id)
            .single();

          // Buscar subscription
          const { data: subData } = await supabase
            .from('partner_subscriptions')
            .select('subscription_plans(name), status')
            .eq('partner_id', user.id)
            .in('status', ['trial', 'active'])
            .single();

          return {
            id: user.id,
            email: user.email || 'Sem email',
            created_at: user.created_at,
            role: roleData?.role || 'user',
            subscription_plan: (subData?.subscription_plans as any)?.name || 'Nenhum',
            subscription_status: subData?.status || 'Inativo',
          };
        })
      );

      setUsers(usersWithData);
    } catch (err: any) {
      console.error('Error loading users:', err);
      toast.error('Erro ao carregar usuários: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePromoteToAdmin = async (userId: string, currentRole: string | null) => {
    try {
      const newRole = currentRole === 'admin' ? 'super_admin' : 'admin';
      
      const { error } = await supabase
        .from('user_roles')
        .upsert({ user_id: userId, role: newRole });

      if (error) throw error;

      toast.success(`Usuário promovido para ${newRole === 'super_admin' ? 'Super Admin' : 'Admin'}`);
      loadUsers();
    } catch (err: any) {
      toast.error('Erro ao promover usuário: ' + err.message);
    }
  };

  const handleDemoteToUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;

      toast.success('Usuário rebaixado para User');
      loadUsers();
    } catch (err: any) {
      toast.error('Erro ao rebaixar usuário: ' + err.message);
    }
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleBadge = (role: string | null) => {
    if (role === 'super_admin') return <Badge className="bg-red-600">Super Admin</Badge>;
    if (role === 'admin') return <Badge className="bg-orange-600">Admin</Badge>;
    return <Badge variant="secondary">User</Badge>;
  };

  const getStatusBadge = (status: string | null) => {
    if (status === 'active') return <Badge className="bg-green-600">Ativo</Badge>;
    if (status === 'trial') return <Badge className="bg-blue-600">Trial</Badge>;
    return <Badge variant="outline">Inativo</Badge>;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerenciamento de Usuários</CardTitle>
        <CardDescription>
          Total de {users.length} usuários cadastrados
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Busca */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Tabela */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Plano</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Cadastro</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.email}</TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>{user.subscription_plan}</TableCell>
                  <TableCell>{getStatusBadge(user.subscription_status)}</TableCell>
                  <TableCell>
                    {new Date(user.created_at).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {user.role !== 'super_admin' && (
                          <DropdownMenuItem onClick={() => handlePromoteToAdmin(user.id, user.role)}>
                            <Shield className="h-4 w-4 mr-2" />
                            {user.role === 'admin' ? 'Promover para Super Admin' : 'Promover para Admin'}
                          </DropdownMenuItem>
                        )}
                        {user.role !== 'user' && (
                          <DropdownMenuItem onClick={() => handleDemoteToUser(user.id)}>
                            <User className="h-4 w-4 mr-2" />
                            Rebaixar para User
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum usuário encontrado
          </div>
        )}
      </CardContent>
    </Card>
  );
};
