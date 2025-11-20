import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { createPartnerSchema, CreatePartnerInput } from '@/schemas/partner.schema';
import { Partner } from '@/types';

interface PartnerFormProps {
  initialData?: Partner;
  onSubmit: (data: CreatePartnerInput) => void;
  onCancel: () => void;
}

export const PartnerForm = ({ initialData, onSubmit, onCancel }: PartnerFormProps) => {
  const form = useForm<CreatePartnerInput>({
    resolver: zodResolver(createPartnerSchema),
    defaultValues: initialData ? {
      name: initialData.name,
      cnpj: initialData.cnpj,
      email: initialData.email,
      phone: initialData.phone,
      address: initialData.address,
      city: initialData.city,
      state: initialData.state,
      zip_code: initialData.zip_code,
      category: initialData.category,
      status: (initialData.status as 'ativo' | 'pendente' | 'inativo') || 'pendente',
      rating: initialData.rating,
      marketplace_id: initialData.marketplace_id,
      notes: initialData.notes,
    } : {
      name: '',
      cnpj: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zip_code: '',
      category: '',
      status: 'pendente',
      rating: null,
      marketplace_id: '',
      notes: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-blue-400">Nome do Estabelecimento *</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Restaurante do João" {...field} className="bg-white/5 border-white/10 text-white placeholder:text-slate-500" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="cnpj"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-blue-400">CNPJ</FormLabel>
                <FormControl>
                  <Input placeholder="00.000.000/0000-00" {...field} value={field.value || ''} className="bg-white/5 border-white/10 text-white placeholder:text-slate-500" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-blue-400">Categoria</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ''}>
                  <FormControl>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Selecione a categoria" className="text-slate-400" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-slate-900 border-white/10">
                    <SelectItem value="restaurante" className="text-white hover:bg-white/10">Restaurante</SelectItem>
                    <SelectItem value="lanchonete" className="text-white hover:bg-white/10">Lanchonete</SelectItem>
                    <SelectItem value="pizzaria" className="text-white hover:bg-white/10">Pizzaria</SelectItem>
                    <SelectItem value="hamburgueria" className="text-white hover:bg-white/10">Hamburgueria</SelectItem>
                    <SelectItem value="padaria" className="text-white hover:bg-white/10">Padaria</SelectItem>
                    <SelectItem value="mercado" className="text-white hover:bg-white/10">Mercado</SelectItem>
                    <SelectItem value="farmacia" className="text-white hover:bg-white/10">Farmácia</SelectItem>
                    <SelectItem value="outro" className="text-white hover:bg-white/10">Outro</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-blue-400">Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="contato@parceiro.com" {...field} value={field.value || ''} className="bg-white/5 border-white/10 text-white placeholder:text-slate-500" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
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
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-blue-400">Endereço</FormLabel>
              <FormControl>
                <Input placeholder="Rua, número, bairro" {...field} value={field.value || ''} className="bg-white/5 border-white/10 text-white placeholder:text-slate-500" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-blue-400">Cidade</FormLabel>
                <FormControl>
                  <Input placeholder="Cidade" {...field} value={field.value || ''} className="bg-white/5 border-white/10 text-white placeholder:text-slate-500" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-blue-400">UF</FormLabel>
                <FormControl>
                  <Input placeholder="SP" maxLength={2} {...field} value={field.value || ''} className="bg-white/5 border-white/10 text-white placeholder:text-slate-500" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="zip_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-blue-400">CEP</FormLabel>
                <FormControl>
                  <Input placeholder="00000-000" {...field} value={field.value || ''} className="bg-white/5 border-white/10 text-white placeholder:text-slate-500" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
                  <SelectItem value="ativo" className="text-white hover:bg-white/10">Ativo</SelectItem>
                  <SelectItem value="pendente" className="text-white hover:bg-white/10">Pendente</SelectItem>
                  <SelectItem value="inativo" className="text-white hover:bg-white/10">Inativo</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="marketplace_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-blue-400">ID do Marketplace (externo)</FormLabel>
              <FormControl>
                <Input placeholder="ID no sistema do marketplace" {...field} value={field.value || ''} className="bg-white/5 border-white/10 text-white placeholder:text-slate-500" />
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
                  placeholder="Informações adicionais sobre o parceiro..."
                  rows={3}
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
