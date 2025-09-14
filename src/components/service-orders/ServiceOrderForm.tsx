import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useClients } from "@/hooks/useClients";
import { useVehicles } from "@/hooks/useVehicles";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ServiceOrderFormProps {
  onSuccess?: () => void;
}

export const ServiceOrderForm = ({ onSuccess }: ServiceOrderFormProps) => {
  const [loading, setLoading] = useState(false);
  const { clients } = useClients();
  const { vehicles } = useVehicles();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    client_id: "",
    vehicle_id: "",
    description: "",
    total_labor: "",
    total_parts: "",
    discount: "",
    status: "orcamento",
    mechanic_id: "",
    notes: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Calcular total
      const laborValue = parseFloat(formData.total_labor) || 0;
      const partsValue = parseFloat(formData.total_parts) || 0;
      const discountValue = parseFloat(formData.discount) || 0;
      const totalAmount = laborValue + partsValue - discountValue;

      const { error } = await supabase
        .from('service_orders_deprecated')
        .insert({
          client_id: formData.client_id,
          vehicle_id: formData.vehicle_id || null,
          description: formData.description || null,
          total_labor: laborValue || null,
          total_parts: partsValue || null,
          total_amount: totalAmount || null,
          discount: discountValue || null,
          status: formData.status,
          mechanic_id: formData.mechanic_id || null,
          notes: formData.notes || null
        });

      if (error) {
        console.error('Erro ao criar ordem de serviço:', error);
        toast({
          title: "Erro",
          description: "Erro ao criar ordem de serviço. Tente novamente.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Sucesso",
          description: "Ordem de serviço criada com sucesso!",
        });

        // Reset form
        setFormData({
          client_id: "",
          vehicle_id: "",
          description: "",
          total_labor: "",
          total_parts: "",
          discount: "",
          status: "orcamento",
          mechanic_id: "",
          notes: ""
        });

        onSuccess?.();
      }
    } catch (err) {
      console.error('Erro ao criar ordem de serviço:', err);
      toast({
        title: "Erro",
        description: "Erro inesperado. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Filtrar veículos do cliente selecionado
  const clientVehicles = vehicles?.filter(vehicle => 
    vehicle.client_id === formData.client_id
  ) || [];

  const calculateTotal = () => {
    const laborValue = parseFloat(formData.total_labor) || 0;
    const partsValue = parseFloat(formData.total_parts) || 0;
    const discountValue = parseFloat(formData.discount) || 0;
    return laborValue + partsValue - discountValue;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Cliente e Veículo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="client_id">Cliente *</Label>
          <Select value={formData.client_id} onValueChange={(value) => handleChange("client_id", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o cliente" />
            </SelectTrigger>
            <SelectContent>
              {clients?.map((client) => (
                <SelectItem key={client.id} value={client.id}>
                  {client.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="vehicle_id">Veículo</Label>
          <Select 
            value={formData.vehicle_id} 
            onValueChange={(value) => handleChange("vehicle_id", value)}
            disabled={!formData.client_id}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o veículo" />
            </SelectTrigger>
            <SelectContent>
              {clientVehicles.map((vehicle) => (
                <SelectItem key={vehicle.id} value={vehicle.id}>
                  {vehicle.brand} {vehicle.model} - {vehicle.license_plate}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Descrição do Serviço */}
      <div>
        <Label htmlFor="description">Descrição do Serviço *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Descreva os serviços que serão realizados..."
          rows={3}
          required
        />
      </div>

      {/* Valores */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Valores</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="total_labor">Mão de Obra (R$)</Label>
              <Input
                id="total_labor"
                type="number"
                step="0.01"
                min="0"
                value={formData.total_labor}
                onChange={(e) => handleChange("total_labor", e.target.value)}
                placeholder="0,00"
              />
            </div>

            <div>
              <Label htmlFor="total_parts">Peças (R$)</Label>
              <Input
                id="total_parts"
                type="number"
                step="0.01"
                min="0"
                value={formData.total_parts}
                onChange={(e) => handleChange("total_parts", e.target.value)}
                placeholder="0,00"
              />
            </div>

            <div>
              <Label htmlFor="discount">Desconto (R$)</Label>
              <Input
                id="discount"
                type="number"
                step="0.01"
                min="0"
                value={formData.discount}
                onChange={(e) => handleChange("discount", e.target.value)}
                placeholder="0,00"
              />
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total Geral:</span>
              <span className="text-2xl font-bold text-primary">
                R$ {calculateTotal().toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status e Informações Adicionais */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="orcamento">Orçamento</SelectItem>
              <SelectItem value="aprovado">Aprovado</SelectItem>
              <SelectItem value="em_andamento">Em Andamento</SelectItem>
              <SelectItem value="aguardando_pecas">Aguardando Peças</SelectItem>
              <SelectItem value="concluido">Concluído</SelectItem>
              <SelectItem value="entregue">Entregue</SelectItem>
              <SelectItem value="cancelado">Cancelado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="mechanic_id">Mecânico Responsável</Label>
          <Input
            id="mechanic_id"
            value={formData.mechanic_id}
            onChange={(e) => handleChange("mechanic_id", e.target.value)}
            placeholder="Nome ou ID do mecânico"
          />
        </div>
      </div>

      {/* Observações */}
      <div>
        <Label htmlFor="notes">Observações</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => handleChange("notes", e.target.value)}
          placeholder="Observações adicionais sobre a ordem de serviço..."
          rows={3}
        />
      </div>

      {/* Botões */}
      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onSuccess}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={loading || !formData.client_id || !formData.description}>
          {loading ? "Salvando..." : "Salvar Ordem"}
        </Button>
      </div>
    </form>
  );
};