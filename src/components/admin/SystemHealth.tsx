import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

type HealthStatus = 'healthy' | 'warning' | 'error' | 'checking';

interface HealthCheck {
  name: string;
  status: HealthStatus;
  message: string;
  lastChecked: Date;
}

export const SystemHealth = () => {
  const [checks, setChecks] = useState<HealthCheck[]>([
    { name: 'Database', status: 'checking', message: 'Verificando...', lastChecked: new Date() },
    { name: 'Authentication', status: 'checking', message: 'Verificando...', lastChecked: new Date() },
    { name: 'Edge Functions', status: 'checking', message: 'Verificando...', lastChecked: new Date() },
    { name: 'Storage', status: 'checking', message: 'Verificando...', lastChecked: new Date() },
  ]);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    runHealthChecks();
  }, []);

  const runHealthChecks = async () => {
    setChecking(true);

    // Database Check
    await checkDatabase();

    // Auth Check
    await checkAuth();

    // Edge Functions Check
    await checkEdgeFunctions();

    // Storage Check
    await checkStorage();

    setChecking(false);
    toast.success('Health checks concluídos');
  };

  const checkDatabase = async () => {
    try {
      const { error } = await supabase
        .from('subscription_plans')
        .select('id')
        .limit(1);

      updateCheck('Database', error ? 'error' : 'healthy', 
        error ? 'Erro de conexão' : 'Conectado e respondendo');
    } catch (err) {
      updateCheck('Database', 'error', 'Erro ao conectar');
    }
  };

  const checkAuth = async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      updateCheck('Authentication', error ? 'error' : 'healthy',
        error ? 'Erro no serviço de auth' : 'Serviço funcionando normalmente');
    } catch (err) {
      updateCheck('Authentication', 'error', 'Erro ao verificar auth');
    }
  };

  const checkEdgeFunctions = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('validate-plan-limit', {
        body: { action_type: 'clients' }
      });

      updateCheck('Edge Functions', error ? 'warning' : 'healthy',
        error ? 'Edge function com erro' : 'Funções respondendo corretamente');
    } catch (err) {
      updateCheck('Edge Functions', 'error', 'Erro ao testar edge function');
    }
  };

  const checkStorage = async () => {
    try {
      const { data, error } = await supabase.storage.listBuckets();
      updateCheck('Storage', error ? 'error' : 'healthy',
        error ? 'Erro no storage' : `${data?.length || 0} buckets disponíveis`);
    } catch (err) {
      updateCheck('Storage', 'error', 'Erro ao verificar storage');
    }
  };

  const updateCheck = (name: string, status: HealthStatus, message: string) => {
    setChecks(prev => prev.map(check => 
      check.name === name 
        ? { ...check, status, message, lastChecked: new Date() }
        : check
    ));
  };

  const getStatusIcon = (status: HealthStatus) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle2 className="h-6 w-6 text-green-600" />;
      case 'warning':
        return <AlertCircle className="h-6 w-6 text-orange-600" />;
      case 'error':
        return <XCircle className="h-6 w-6 text-red-600" />;
      default:
        return <RefreshCw className="h-6 w-6 text-blue-600 animate-spin" />;
    }
  };

  const getStatusBadge = (status: HealthStatus) => {
    switch (status) {
      case 'healthy':
        return <Badge className="bg-green-600">Healthy</Badge>;
      case 'warning':
        return <Badge className="bg-orange-600">Warning</Badge>;
      case 'error':
        return <Badge className="bg-red-600">Error</Badge>;
      default:
        return <Badge variant="outline">Checking...</Badge>;
    }
  };

  const overallStatus = checks.every(c => c.status === 'healthy') ? 'healthy' 
    : checks.some(c => c.status === 'error') ? 'error' 
    : 'warning';

  return (
    <div className="space-y-6">
      {/* Overall Status Card */}
      <Card className={
        overallStatus === 'healthy' ? 'border-green-500' :
        overallStatus === 'error' ? 'border-red-500' : 'border-orange-500'
      }>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Status Geral do Sistema</CardTitle>
              <CardDescription>
                Última verificação: {new Date().toLocaleString('pt-BR')}
              </CardDescription>
            </div>
            <Button onClick={runHealthChecks} disabled={checking} size="sm">
              <RefreshCw className={`h-4 w-4 mr-2 ${checking ? 'animate-spin' : ''}`} />
              Verificar Novamente
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            {getStatusIcon(overallStatus)}
            <div>
              <h3 className="text-lg font-semibold">
                {overallStatus === 'healthy' && 'Todos os serviços operacionais'}
                {overallStatus === 'warning' && 'Alguns serviços com avisos'}
                {overallStatus === 'error' && 'Serviços com problemas detectados'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {checks.filter(c => c.status === 'healthy').length} de {checks.length} serviços saudáveis
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual Health Checks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {checks.map((check) => (
          <Card key={check.name}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{check.name}</CardTitle>
                {getStatusBadge(check.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-3">
                {getStatusIcon(check.status)}
                <div className="flex-1">
                  <p className="text-sm font-medium">{check.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {check.lastChecked.toLocaleTimeString('pt-BR')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
