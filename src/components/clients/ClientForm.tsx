import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useClients } from "@/hooks/useClients";
import { useZodFormValidation } from "@/hooks/useZodValidation";
import { createClientSchema, type CreateClientData } from "@/schemas/client.schema";
import { toast } from 'sonner';

interface ClientFormProps {
  onSuccess?: () => void;
}

export const ClientForm = ({ onSuccess }: ClientFormProps) => {
  const [loading, setLoading] = useState(false);
  const { createClient } = useClients();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    cpf_cnpj: "",
    address: "",
    city: "",
    state: "",
    zip_code: "",
    notes: ""
  });

  const { validate, validateField, errors, clearErrors } = useZodFormValidation(createClientSchema);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validationResult = validate(formData);
      
      if (!validationResult.isValid || !validationResult.data) {
        setLoading(false);
        return;
      }

      // ✅ VERIFICAR LIMITE ANTES DE CRIAR
      const { usePlanLimits } = await import('@/hooks/usePlanLimits');
      const { checkAndIncrement } = usePlanLimits();
      
      const canCreate = await checkAndIncrement('clients', 'clientes');
      if (!canCreate) {
        setLoading(false);
        return; // Bloqueia criação se limite foi atingido
      }

      const result = await createClient({
        name: validationResult.data.name,
        email: validationResult.data.email || null,
        phone: validationResult.data.phone || null,
        cpf_cnpj: validationResult.data.cpf_cnpj || null,
        address: validationResult.data.address || null,
        city: validationResult.data.city || null,
        state: validationResult.data.state || null,
        zip_code: validationResult.data.zip_code || null,
        notes: validationResult.data.notes || null,
      });

      if (result) {
        setFormData({
          name: "",
          email: "",
          phone: "",
          cpf_cnpj: "",
          address: "",
          city: "",
          state: "",
          zip_code: "",
          notes: ""
        });
        clearErrors();
        toast.success('Cliente cadastrado com sucesso!');
        onSuccess?.();
      }
    } catch (error: any) {
      // Verificar se o erro é de RLS (limite atingido)
      if (error?.message?.includes('row-level security') || error?.message?.includes('policy')) {
        toast.error('Limite atingido', {
          description: "Você atingiu o limite de clientes do seu plano. Faça upgrade para continuar.",
        });
      } else {
        toast.error('Erro ao criar cliente', {
          description: error?.message || 'Tente novamente mais tarde.',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Validação em tempo real para campos específicos
    if (name === 'email' || name === 'cpf_cnpj' || name === 'phone' || name === 'zip_code') {
      setTimeout(() => {
        validateField(name, value);
      }, 500);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Label htmlFor="name" className="text-blue-600 dark:text-blue-400">Nome Completo *</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="João Silva"
            className={errors.name ? "border-destructive" : ""}
          />
          {errors.name && (
            <p className="text-sm text-destructive mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <Label htmlFor="email" className="text-blue-600 dark:text-blue-400">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="joao@email.com"
            className={errors.email ? "border-destructive" : ""}
          />
          {errors.email && (
            <p className="text-sm text-destructive mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <Label htmlFor="phone" className="text-blue-600 dark:text-blue-400">Telefone</Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="(11) 99999-9999"
            className={errors.phone ? "border-destructive" : ""}
          />
          {errors.phone && (
            <p className="text-sm text-destructive mt-1">{errors.phone}</p>
          )}
        </div>

        <div className="col-span-2">
          <Label htmlFor="cpf_cnpj" className="text-blue-600 dark:text-blue-400">CPF/CNPJ</Label>
          <Input
            id="cpf_cnpj"
            name="cpf_cnpj"
            value={formData.cpf_cnpj}
            onChange={handleChange}
            placeholder="000.000.000-00"
            className={errors.cpf_cnpj ? "border-destructive" : ""}
          />
          {errors.cpf_cnpj && (
            <p className="text-sm text-destructive mt-1">{errors.cpf_cnpj}</p>
          )}
        </div>

        <div className="col-span-2">
          <Label htmlFor="address" className="text-blue-600 dark:text-blue-400">Endereço</Label>
          <Input
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Rua das Flores, 123"
            className={errors.address ? "border-destructive" : ""}
          />
          {errors.address && (
            <p className="text-sm text-destructive mt-1">{errors.address}</p>
          )}
        </div>

        <div>
          <Label htmlFor="city" className="text-blue-600 dark:text-blue-400">Cidade</Label>
          <Input
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="São Paulo"
            className={errors.city ? "border-destructive" : ""}
          />
          {errors.city && (
            <p className="text-sm text-destructive mt-1">{errors.city}</p>
          )}
        </div>

        <div>
          <Label htmlFor="state" className="text-blue-600 dark:text-blue-400">Estado</Label>
          <Input
            id="state"
            name="state"
            value={formData.state}
            onChange={handleChange}
            placeholder="SP"
            maxLength={2}
            className={errors.state ? "border-destructive" : ""}
          />
          {errors.state && (
            <p className="text-sm text-destructive mt-1">{errors.state}</p>
          )}
        </div>

        <div className="col-span-2">
          <Label htmlFor="zip_code" className="text-blue-600 dark:text-blue-400">CEP</Label>
          <Input
            id="zip_code"
            name="zip_code"
            value={formData.zip_code}
            onChange={handleChange}
            placeholder="00000-000"
            className={errors.zip_code ? "border-destructive" : ""}
          />
          {errors.zip_code && (
            <p className="text-sm text-destructive mt-1">{errors.zip_code}</p>
          )}
        </div>

        <div className="col-span-2">
          <Label htmlFor="notes" className="text-blue-600 dark:text-blue-400">Observações</Label>
          <Textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Informações adicionais sobre o cliente..."
            rows={3}
            className={errors.notes ? "border-destructive" : ""}
          />
          {errors.notes && (
            <p className="text-sm text-destructive mt-1">{errors.notes}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onSuccess}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Salvando..." : "Salvar Cliente"}
        </Button>
      </div>
    </form>
  );
};
