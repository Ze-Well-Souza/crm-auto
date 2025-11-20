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
                <FormLabel className="text-blue-400">Parceiro *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Selecione o parceiro" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-slate-900 border-white/10">
                    {partners.filter(p => p.status === 'ativo').map(partner => (
                      <SelectItem key={partner.id} value={partner.id} className="text-white hover:bg-white/10">
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
                <FormLabel className="text-blue-400">Número do Pedido *</FormLabel>
                <FormControl>
                  <Input placeholder="PED-001" {...field} className="bg-white/5 border-white/10 text-white placeholder:text-slate-500" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="border-t border-white/10 pt-4">
          <h3 className="font-medium mb-3 text-white">Dados do Cliente</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="customer_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-blue-400">Nome *</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do cliente" {...field} className="bg-white/5 border-white/10 text-white placeholder:text-slate-500" />
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
                  <FormLabel className="text-blue-400">Telefone</FormLabel>
                  <FormControl>
                    <Input placeholder="(00) 00000-0000" {...field} value={field.value || ''} className="bg-white/5 border-white/10 text-white placeholder:text-slate-500" />
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
                  <FormLabel className="text-blue-400">Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="cliente@email.com" {...field} value={field.value || ''} className="bg-white/5 border-white/10 text-white placeholder:text-slate-500" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="border-t border-white/10 pt-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-white">Itens do Pedido</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ name: '', quantity: 1, unit_price: 0, total: 0 })}
              className="gap-2 border-white/10 text-white hover:bg-white/10"
            >
              <Plus className="h-4 w-4" />
              Adicionar Item
            </Button>
          </div>

          <div className="space-y-3">
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2 items-start p-3 border border-white/10 rounded-lg bg-white/5">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-2">
                  <FormField
                    control={form.control}
                    name={`items.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Nome do item" {...field} className="bg-white/5 border-white/10 text-white placeholder:text-slate-500" />
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
                            className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
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
                            className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
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
                            className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
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
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <div className="mt-3 p-3 bg-white/5 border border-white/10 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-white">Total do Pedido:</span>
              <span className="text-lg font-bold text-emerald-400">
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
                <FormLabel className="text-blue-400">Status</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || 'pendente'}>
                  <FormControl>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-slate-900 border-white/10">
                    <SelectItem value="pendente" className="text-white hover:bg-white/10">Pendente</SelectItem>
                    <SelectItem value="confirmado" className="text-white hover:bg-white/10">Confirmado</SelectItem>
                    <SelectItem value="em_preparacao" className="text-white hover:bg-white/10">Em Preparação</SelectItem>
                    <SelectItem value="pronto" className="text-white hover:bg-white/10">Pronto</SelectItem>
                    <SelectItem value="em_entrega" className="text-white hover:bg-white/10">Em Entrega</SelectItem>
                    <SelectItem value="entregue" className="text-white hover:bg-white/10">Entregue</SelectItem>
                    <SelectItem value="cancelado" className="text-white hover:bg-white/10">Cancelado</SelectItem>
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
                <FormLabel className="text-blue-400">Status Pagamento</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || 'pendente'}>
                  <FormControl>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-slate-900 border-white/10">
                    <SelectItem value="pendente" className="text-white hover:bg-white/10">Pendente</SelectItem>
                    <SelectItem value="pago" className="text-white hover:bg-white/10">Pago</SelectItem>
                    <SelectItem value="estornado" className="text-white hover:bg-white/10">Estornado</SelectItem>
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
                <FormLabel className="text-blue-400">Método de Pagamento</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Cartão, Pix, Dinheiro" {...field} value={field.value || ''} className="bg-white/5 border-white/10 text-white placeholder:text-slate-500" />
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
                <FormLabel className="text-blue-400">Data de Entrega</FormLabel>
                <FormControl>
                  <Input type="date" {...field} value={field.value || ''} className="bg-slate-900 border-white/10 text-white" />
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
                <FormLabel className="text-blue-400">Ref. Externa (Marketplace)</FormLabel>
                <FormControl>
                  <Input placeholder="ID do pedido no marketplace" {...field} value={field.value || ''} className="bg-white/5 border-white/10 text-white placeholder:text-slate-500" />
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
              <FormLabel className="text-blue-400">Endereço de Entrega</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Endereço completo de entrega..."
                  rows={2}
                  {...field}
                  value={field.value || ''}
                  className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
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
              <FormLabel className="text-blue-400">Observações</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Informações adicionais do pedido..."
                  rows={2}
                  {...field}
                  value={field.value || ''}
                  className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-3 justify-end pt-4">
          <Button type="button" variant="outline" onClick={onCancel} className="border-white/10 text-white hover:bg-white/10">
            Cancelar
          </Button>
          <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0">
            {initialData ? 'Atualizar' : 'Cadastrar'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
