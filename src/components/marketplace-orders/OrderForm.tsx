import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { createMarketplaceOrderSchema, CreateMarketplaceOrderInput } from '@/schemas/marketplace-order.schema';
import { MarketplaceOrder } from '@/types';
import { Plus, Trash2 } from 'lucide-react';
import { usePartners } from '@/hooks/usePartners';
import { useEffect } from 'react';

interface OrderFormProps {
  initialData?: MarketplaceOrder;
  onSubmit: (data: CreateMarketplaceOrderInput) => void;
  onCancel: () => void;
}

export const OrderForm = ({ initialData, onSubmit, onCancel }: OrderFormProps) => {
  const { partners } = usePartners();

  const form = useForm<CreateMarketplaceOrderInput>({
    resolver: zodResolver(createMarketplaceOrderSchema),
    defaultValues: initialData ? {
      partner_id: initialData.partner_id,
      order_number: initialData.order_number,
      customer_name: initialData.customer_name,
      customer_phone: initialData.customer_phone,
      customer_email: initialData.customer_email,
      items: initialData.items,
      total_amount: initialData.total_amount,
      status: (initialData.status as any) || 'pendente',
      payment_status: (initialData.payment_status as any) || 'pendente',
      payment_method: initialData.payment_method,
      delivery_date: initialData.delivery_date,
      delivery_address: initialData.delivery_address,
      notes: initialData.notes,
      marketplace_reference: initialData.marketplace_reference,
    } : {
      partner_id: '',
      order_number: `PED-${Date.now()}`,
      customer_name: '',
      customer_phone: '',
      customer_email: '',
      items: [{ name: '', quantity: 1, unit_price: 0, total: 0 }],
      total_amount: 0,
      status: 'pendente',
      payment_status: 'pendente',
      payment_method: '',
      delivery_date: '',
      delivery_address: '',
      notes: '',
      marketplace_reference: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  });

  const items = form.watch('items');

  useEffect(() => {
    const total = items.reduce((sum, item) => sum + (item.total || 0), 0);
    form.setValue('total_amount', total);
  }, [items, form]);

  const updateItemTotal = (index: number) => {
    const item = items[index];
    const total = item.quantity * item.unit_price;
    form.setValue(`items.${index}.total`, total);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="partner_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Parceiro *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o parceiro" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {partners.filter(p => p.status === 'ativo').map(partner => (
                      <SelectItem key={partner.id} value={partner.id}>
                        {partner.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="order_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número do Pedido *</FormLabel>
                <FormControl>
                  <Input placeholder="PED-001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="border-t pt-4">
          <h3 className="font-medium mb-3">Dados do Cliente</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="customer_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome *</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do cliente" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="customer_phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input placeholder="(00) 00000-0000" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="customer_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="cliente@email.com" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium">Itens do Pedido</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ name: '', quantity: 1, unit_price: 0, total: 0 })}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Adicionar Item
            </Button>
          </div>

          <div className="space-y-3">
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2 items-start p-3 border rounded-lg">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-2">
                  <FormField
                    control={form.control}
                    name={`items.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Nome do item" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`items.${index}.quantity`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Qtd"
                            {...field}
                            onChange={(e) => {
                              field.onChange(parseFloat(e.target.value));
                              updateItemTotal(index);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`items.${index}.unit_price`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="Preço unit."
                            {...field}
                            onChange={(e) => {
                              field.onChange(parseFloat(e.target.value));
                              updateItemTotal(index);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`items.${index}.total`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="Total"
                            {...field}
                            disabled
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    className="text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <div className="mt-3 p-3 bg-muted rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Total do Pedido:</span>
              <span className="text-lg font-bold text-green-600">
                R$ {form.watch('total_amount').toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || 'pendente'}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="confirmado">Confirmado</SelectItem>
                    <SelectItem value="em_preparacao">Em Preparação</SelectItem>
                    <SelectItem value="pronto">Pronto</SelectItem>
                    <SelectItem value="em_entrega">Em Entrega</SelectItem>
                    <SelectItem value="entregue">Entregue</SelectItem>
                    <SelectItem value="cancelado">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="payment_status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status Pagamento</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || 'pendente'}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="pago">Pago</SelectItem>
                    <SelectItem value="estornado">Estornado</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="payment_method"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Método de Pagamento</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Cartão, Pix, Dinheiro" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="delivery_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de Entrega</FormLabel>
                <FormControl>
                  <Input type="date" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="marketplace_reference"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ref. Externa (Marketplace)</FormLabel>
                <FormControl>
                  <Input placeholder="ID do pedido no marketplace" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="delivery_address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Endereço de Entrega</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Endereço completo de entrega..."
                  rows={2}
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Informações adicionais do pedido..."
                  rows={2}
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-3 justify-end pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            {initialData ? 'Atualizar' : 'Cadastrar'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
