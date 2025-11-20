import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useClients } from "@/hooks/useClients";
import { useVehicles } from "@/hooks/useVehicles";
import { useToast } from "@/hooks/use-toast";
import { useServiceOrders } from "@/hooks/useServiceOrders";

interface ServiceOrderFormProps {
  serviceOrder?: any;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
}

export const ServiceOrderForm = ({ onSuccess }: ServiceOrderFormProps) => {
  const [loading, setLoading] = useState(false);
  const { clients } = useClients();
  const { vehicles } = useVehicles();
  const { createServiceOrder } = useServiceOrders();
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

      const result = await createServiceOrder({
        client_id: formData.client_id,
        vehicle_id: formData.vehicle_id || null,
        description: formData.description || null,
        total_labor: laborValue || null,
        total_parts: partsValue || null,
        total_amount: totalAmount || null,
        discount: discountValue || null,
        status: formData.status,
        mechanic_id: formData.mechanic_id || null,
        notes: formData.notes || null,
        delivered_at: null,
        finished_at: null,
        started_at: null,
      });

      if (result) {
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
          <Label htmlFor="client_id" className="text-blue-300">Cliente *</Label>
          <Select value={formData.client_id} onValueChange={(value) => handleChange("client_id", value)}>
            <SelectTrigger className="bg-white/5 border-white/10 text-white focus:border-purple-500/50 focus:ring-purple-500/20">
              <SelectValue placeholder="Selecione o cliente" className="text-slate-400" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-white/10">
              {clients?.map((client) => (
                <SelectItem key={client.id} value={client.id} className="text-white hover:bg-white/10">
                  {client.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="vehicle_id" className="text-blue-300">Veículo</Label>
          <Select
            value={formData.vehicle_id}
            onValueChange={(value) => handleChange("vehicle_id", value)}
            disabled={!formData.client_id}
          >
            <SelectTrigger className="bg-white/5 border-white/10 text-white focus:border-purple-500/50 focus:ring-purple-500/20 disabled:opacity-50">
              <SelectValue placeholder="Selecione o veículo" className="text-slate-400" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-white/10">
              {clientVehicles.map((vehicle) => (
                <SelectItem key={vehicle.id} value={vehicle.id} className="text-white hover:bg-white/10">
                  {vehicle.brand} {vehicle.model} - {vehicle.license_plate}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Descrição do Serviço */}
      <div>
        <Label htmlFor="description" className="text-blue-300">Descrição do Serviço *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Descreva os serviços que serão realizados..."
          rows={3}
          required
          className="bg-white/5 border-white/10 text-white placeholder:text-slate-400 focus:border-purple-500/50 focus:ring-purple-500/20"
        />
      </div>

      {/* Valores */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-lg text-white">Valores</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="total_labor" className="text-blue-300">Mão de Obra (R$)</Label>
              <Input
                id="total_labor"
                type="number"
                step="0.01"
                min="0"
                value={formData.total_labor}
                onChange={(e) => handleChange("total_labor", e.target.value)}
                placeholder="0,00"
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-400 focus:border-purple-500/50 focus:ring-purple-500/20"
              />
            </div>

            <div>
              <Label htmlFor="total_parts" className="text-blue-300">Peças (R$)</Label>
              <Input
                id="total_parts"
                type="number"
                step="0.01"
                min="0"
                value={formData.total_parts}
                onChange={(e) => handleChange("total_parts", e.target.value)}
                placeholder="0,00"
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-400 focus:border-purple-500/50 focus:ring-purple-500/20"
              />
            </div>

            <div>
              <Label htmlFor="discount" className="text-blue-300">Desconto (R$)</Label>
              <Input
                id="discount"
                type="number"
                step="0.01"
                min="0"
                value={formData.discount}
                onChange={(e) => handleChange("discount", e.target.value)}
                placeholder="0,00"
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-400 focus:border-purple-500/50 focus:ring-purple-500/20"
              />
            </div>
          </div>

          <div className="border-t border-white/10 pt-4">
            <div className="flex justify-between items-center">
              <span className="font-medium text-slate-300">Total Geral:</span>
              <span className="text-2xl font-bold text-emerald-400">
                R$ {calculateTotal().toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status e Informações Adicionais */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="status" className="text-blue-300">Status</Label>
          <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
            <SelectTrigger className="bg-white/5 border-white/10 text-white focus:border-purple-500/50 focus:ring-purple-500/20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-white/10">
              <SelectItem value="orcamento" className="text-white hover:bg-white/10">Orçamento</SelectItem>
              <SelectItem value="aprovado" className="text-white hover:bg-white/10">Aprovado</SelectItem>
              <SelectItem value="em_andamento" className="text-white hover:bg-white/10">Em Andamento</SelectItem>
              <SelectItem value="aguardando_pecas" className="text-white hover:bg-white/10">Aguardando Peças</SelectItem>
              <SelectItem value="concluido" className="text-white hover:bg-white/10">Concluído</SelectItem>
              <SelectItem value="entregue" className="text-white hover:bg-white/10">Entregue</SelectItem>
              <SelectItem value="cancelado" className="text-white hover:bg-white/10">Cancelado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="mechanic_id" className="text-blue-300">Mecânico Responsável</Label>
          <Input
            id="mechanic_id"
            value={formData.mechanic_id}
            onChange={(e) => handleChange("mechanic_id", e.target.value)}
            placeholder="Nome ou ID do mecânico"
            className="bg-white/5 border-white/10 text-white placeholder:text-slate-400 focus:border-purple-500/50 focus:ring-purple-500/20"
          />
        </div>
      </div>

      {/* Observações */}
      <div>
        <Label htmlFor="notes" className="text-blue-300">Observações</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => handleChange("notes", e.target.value)}
          placeholder="Observações adicionais sobre a ordem de serviço..."
          rows={3}
          className="bg-white/5 border-white/10 text-white placeholder:text-slate-400 focus:border-purple-500/50 focus:ring-purple-500/20"
        />
      </div>

      {/* Botões */}
      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onSuccess}
          disabled={loading}
          className="border-white/10 text-slate-300 hover:bg-white/10 hover:text-white"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={loading || !formData.client_id || !formData.description}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg shadow-purple-500/50 disabled:opacity-50"
        >
          {loading ? "Salvando..." : "Salvar Ordem"}
        </Button>
      </div>
    </form>
  );
};