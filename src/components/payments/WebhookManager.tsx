import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Webhook, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Settings, 
  Copy, 
  RefreshCw,
  AlertTriangle,
  Info
} from 'lucide-react';
import { formatDate } from '@/utils/formatters';
import { cn } from '@/lib/utils';

interface WebhookEvent {
  id: string;
  type: string;
  created: string;
  data: any;
  status: 'succeeded' | 'failed' | 'pending';
  attempts: number;
  next_retry?: string;
}

interface WebhookEndpoint {
  id: string;
  url: string;
  enabled_events: string[];
  status: 'enabled' | 'disabled';
  created: string;
  last_response_status?: number;
  last_response_time?: string;
}

export const WebhookManager: React.FC = () => {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [webhookSecret, setWebhookSecret] = useState('');
  const [events, setEvents] = useState<WebhookEvent[]>([]);
  const [endpoints, setEndpoints] = useState<WebhookEndpoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Simular dados de webhooks
  useEffect(() => {
    const mockEvents: WebhookEvent[] = [
      {
        id: 'evt_1234567890',
        type: 'payment_intent.succeeded',
        created: '2024-01-15T14:30:00Z',
        data: {
          object: {
            id: 'pi_1234567890',
            amount: 15000,
            currency: 'brl',
            metadata: {
              order_id: 'OS001',
              customer_name: 'João Silva'
            }
          }
        },
        status: 'succeeded',
        attempts: 1
      },
      {
        id: 'evt_0987654321',
        type: 'payment_intent.payment_failed',
        created: '2024-01-15T12:15:00Z',
        data: {
          object: {
            id: 'pi_0987654321',
            amount: 8990,
            currency: 'brl',
            last_payment_error: {
              message: 'Your card was declined.',
              code: 'card_declined'
            }
          }
        },
        status: 'succeeded',
        attempts: 1
      },
      {
        id: 'evt_1122334455',
        type: 'payment_intent.requires_action',
        created: '2024-01-15T16:45:00Z',
        data: {
          object: {
            id: 'pi_1122334455',
            amount: 32050,
            currency: 'brl',
            next_action: {
              type: 'use_stripe_sdk'
            }
          }
        },
        status: 'pending',
        attempts: 3,
        next_retry: '2024-01-15T17:00:00Z'
      }
    ];

    const mockEndpoints: WebhookEndpoint[] = [
      {
        id: 'we_1234567890',
        url: 'https://your-domain.com/api/webhooks/stripe',
        enabled_events: [
          'payment_intent.succeeded',
          'payment_intent.payment_failed',
          'payment_intent.canceled',
          'payment_intent.requires_action'
        ],
        status: 'enabled',
        created: '2024-01-10T10:00:00Z',
        last_response_status: 200,
        last_response_time: '2024-01-15T14:30:05Z'
      }
    ];

    setEvents(mockEvents);
    setEndpoints(mockEndpoints);
    setWebhookUrl('https://your-domain.com/api/webhooks/stripe');
    setWebhookSecret('whsec_1234567890abcdef...');
  }, []);

  const getEventStatusBadge = (status: WebhookEvent['status']) => {
    const variants = {
      succeeded: 'bg-green-100 text-green-800 border-green-200',
      failed: 'bg-red-100 text-red-800 border-red-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };

    const icons = {
      succeeded: CheckCircle,
      failed: XCircle,
      pending: Clock
    };

    const Icon = icons[status];

    return (
      <Badge className={cn('border flex items-center gap-1', variants[status])}>
        <Icon className="h-3 w-3" />
        {status === 'succeeded' ? 'Sucesso' : status === 'failed' ? 'Falhou' : 'Pendente'}
      </Badge>
    );
  };

  const getEventTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'payment_intent.succeeded': 'Pagamento Confirmado',
      'payment_intent.payment_failed': 'Pagamento Falhou',
      'payment_intent.canceled': 'Pagamento Cancelado',
      'payment_intent.requires_action': 'Ação Necessária'
    };

    return labels[type] || type;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Aqui você poderia mostrar uma notificação de sucesso
  };

  const testWebhook = async () => {
    setIsLoading(true);
    try {
      // Simular teste de webhook
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Webhook test completed');
    } catch (error) {
      console.error('Webhook test failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gerenciamento de Webhooks</h2>
          <p className="text-muted-foreground">
            Configure e monitore webhooks do Stripe para confirmação automática de pagamentos
          </p>
        </div>
        <Button onClick={testWebhook} disabled={isLoading}>
          <RefreshCw className={cn('h-4 w-4 mr-2', isLoading && 'animate-spin')} />
          Testar Webhook
        </Button>
      </div>

      <Tabs defaultValue="configuration" className="space-y-4">
        <TabsList>
          <TabsTrigger value="configuration">Configuração</TabsTrigger>
          <TabsTrigger value="events">Eventos</TabsTrigger>
          <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
        </TabsList>

        <TabsContent value="configuration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configuração do Webhook
              </CardTitle>
              <CardDescription>
                Configure o endpoint e eventos para receber notificações do Stripe
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Para configurar webhooks no Stripe Dashboard, acesse: Dashboard → Developers → Webhooks
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="webhook-url">URL do Endpoint</Label>
                <div className="flex gap-2">
                  <Input
                    id="webhook-url"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    placeholder="https://your-domain.com/api/webhooks/stripe"
                  />
                  <Button variant="outline" size="icon" onClick={() => copyToClipboard(webhookUrl)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="webhook-secret">Webhook Secret</Label>
                <div className="flex gap-2">
                  <Input
                    id="webhook-secret"
                    type="password"
                    value={webhookSecret}
                    onChange={(e) => setWebhookSecret(e.target.value)}
                    placeholder="whsec_..."
                  />
                  <Button variant="outline" size="icon" onClick={() => copyToClipboard(webhookSecret)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Eventos Recomendados</Label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'payment_intent.succeeded',
                    'payment_intent.payment_failed',
                    'payment_intent.canceled',
                    'payment_intent.requires_action'
                  ].map((event) => (
                    <div key={event} className="flex items-center gap-2 p-2 border rounded">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">{event}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Certifique-se de que seu endpoint está acessível publicamente e retorna status 200 para eventos válidos.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Webhook className="h-5 w-5" />
                Eventos Recentes
              </CardTitle>
              <CardDescription>
                Histórico de eventos de webhook recebidos do Stripe
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID do Evento</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Tentativas</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Próxima Tentativa</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {events.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell className="font-mono text-sm">{event.id}</TableCell>
                        <TableCell>{getEventTypeLabel(event.type)}</TableCell>
                        <TableCell>{getEventStatusBadge(event.status)}</TableCell>
                        <TableCell>{event.attempts}</TableCell>
                        <TableCell>{formatDate(event.created)}</TableCell>
                        <TableCell>
                          {event.next_retry ? formatDate(event.next_retry) : '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="endpoints" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Endpoints Configurados</CardTitle>
              <CardDescription>
                Lista de endpoints de webhook configurados no Stripe
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>URL</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Eventos</TableHead>
                      <TableHead>Última Resposta</TableHead>
                      <TableHead>Criado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {endpoints.map((endpoint) => (
                      <TableRow key={endpoint.id}>
                        <TableCell className="font-mono text-sm">{endpoint.url}</TableCell>
                        <TableCell>
                          <Badge className={cn(
                            'border',
                            endpoint.status === 'enabled' 
                              ? 'bg-green-100 text-green-800 border-green-200'
                              : 'bg-red-100 text-red-800 border-red-200'
                          )}>
                            {endpoint.status === 'enabled' ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </TableCell>
                        <TableCell>{endpoint.enabled_events.length} eventos</TableCell>
                        <TableCell>
                          {endpoint.last_response_status && (
                            <div className="flex items-center gap-2">
                              <Badge variant={endpoint.last_response_status === 200 ? 'default' : 'destructive'}>
                                {endpoint.last_response_status}
                              </Badge>
                              {endpoint.last_response_time && (
                                <span className="text-xs text-muted-foreground">
                                  {formatDate(endpoint.last_response_time)}
                                </span>
                              )}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>{formatDate(endpoint.created)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};