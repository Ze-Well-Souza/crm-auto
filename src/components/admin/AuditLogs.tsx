import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

interface AuditLog {
  id: string;
  created_at: string;
  user_id: string;
  action: string;
  resource: string;
  details: any;
  user_email?: string;
}

export const AuditLogs = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      setLoading(true);
      
      // Buscar últimos 100 logs
      const { data, error } = await supabase
        .from('subscription_audit_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      // Buscar emails dos usuários
      const logsWithEmails = await Promise.all(
        (data || []).map(async (log) => {
          const { data: { user } } = await supabase.auth.admin.getUserById(log.user_id);
          return {
            ...log,
            user_email: user?.email || 'Usuário desconhecido',
          };
        })
      );

      setLogs(logsWithEmails);
    } catch (err: any) {
      console.error('Error loading audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const getActionBadge = (action: string) => {
    const actionMap: Record<string, { variant: string; label: string }> = {
      'subscription_created': { variant: 'bg-green-600', label: 'Criado' },
      'subscription_updated': { variant: 'bg-blue-600', label: 'Atualizado' },
      'subscription_cancelled': { variant: 'bg-red-600', label: 'Cancelado' },
      'limit_reached': { variant: 'bg-yellow-600', label: 'Limite' },
      'trial_started': { variant: 'bg-purple-600', label: 'Trial' },
    };

    const actionData = actionMap[action] || { variant: 'bg-gray-600', label: action };

    return (
      <Badge className={actionData.variant}>
        {actionData.label}
      </Badge>
    );
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
        <CardTitle>Logs de Auditoria</CardTitle>
        <CardDescription>
          Últimos 100 eventos do sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Ação</TableHead>
                <TableHead>Recurso</TableHead>
                <TableHead className="text-right">Detalhes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-mono text-xs">
                    {new Date(log.created_at).toLocaleString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </TableCell>
                  <TableCell className="text-sm">{log.user_email}</TableCell>
                  <TableCell>{getActionBadge(log.action)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{log.resource}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="hover:bg-accent p-1 rounded">
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="left" className="max-w-md">
                        <pre className="text-xs overflow-auto max-h-48">
                          {JSON.stringify(log.details, null, 2)}
                        </pre>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {logs.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum log de auditoria encontrado
          </div>
        )}
      </CardContent>
    </Card>
  );
};
