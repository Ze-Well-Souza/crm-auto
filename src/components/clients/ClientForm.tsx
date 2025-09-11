import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useClients } from "@/hooks/useClients";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await createClient({
      name: formData.name,
      email: formData.email || null,
      phone: formData.phone || null,
      cpf_cnpj: formData.cpf_cnpj || null,
      address: formData.address || null,
      city: formData.city || null,
      state: formData.state || null,
      zip_code: formData.zip_code || null,
      notes: formData.notes || null,
    });

    setLoading(false);

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
      onSuccess?.();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Label htmlFor="name">Nome Completo *</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="João Silva"
          />
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="joao@email.com"
          />
        </div>

        <div>
          <Label htmlFor="phone">Telefone</Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="(11) 99999-9999"
          />
        </div>

        <div className="col-span-2">
          <Label htmlFor="cpf_cnpj">CPF/CNPJ</Label>
          <Input
            id="cpf_cnpj"
            name="cpf_cnpj"
            value={formData.cpf_cnpj}
            onChange={handleChange}
            placeholder="000.000.000-00"
          />
        </div>

        <div className="col-span-2">
          <Label htmlFor="address">Endereço</Label>
          <Input
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Rua das Flores, 123"
          />
        </div>

        <div>
          <Label htmlFor="city">Cidade</Label>
          <Input
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="São Paulo"
          />
        </div>

        <div>
          <Label htmlFor="state">Estado</Label>
          <Input
            id="state"
            name="state"
            value={formData.state}
            onChange={handleChange}
            placeholder="SP"
            maxLength={2}
          />
        </div>

        <div className="col-span-2">
          <Label htmlFor="zip_code">CEP</Label>
          <Input
            id="zip_code"
            name="zip_code"
            value={formData.zip_code}
            onChange={handleChange}
            placeholder="00000-000"
          />
        </div>

        <div className="col-span-2">
          <Label htmlFor="notes">Observações</Label>
          <Textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Informações adicionais sobre o cliente..."
            rows={3}
          />
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