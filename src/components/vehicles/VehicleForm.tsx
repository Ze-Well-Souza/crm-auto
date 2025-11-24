import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useVehicles } from "@/hooks/useVehicles";
import { useClients } from "@/hooks/useClients";
import { FUEL_TYPES } from "@/utils/constants";
import { toast } from "sonner";
import type { Vehicle } from "@/types";

interface VehicleFormProps {
  vehicle?: Vehicle;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
}

export const VehicleForm = ({ vehicle, onSuccess }: VehicleFormProps) => {
  const [loading, setLoading] = useState(false);
  const { createVehicle, updateVehicle } = useVehicles();
  const { clients } = useClients();

  const [formData, setFormData] = useState({
    client_id: "",
    brand: "",
    model: "",
    year: "",
    license_plate: "",
    vin: "",
    color: "",
    fuel_type: "",
    engine: "",
    mileage: "",
    notes: ""
  });

  // Preencher formulário quando estiver editando
  useEffect(() => {
    if (vehicle) {
      setFormData({
        client_id: vehicle.client_id || "",
        brand: vehicle.brand || "",
        model: vehicle.model || "",
        year: vehicle.year?.toString() || "",
        license_plate: vehicle.plate || "",
        vin: vehicle.chassis || "",
        color: vehicle.color || "",
        fuel_type: vehicle.fuel_type || "",
        engine: vehicle.engine || "",
        mileage: vehicle.mileage?.toString() || "",
        notes: vehicle.notes || ""
      });
    }
  }, [vehicle]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação de cliente
    if (!formData.client_id) {
      toast.error("Por favor, selecione um cliente");
      return;
    }

    // Validação de campos obrigatórios
    if (!formData.brand || !formData.model) {
      toast.error("Marca e Modelo são obrigatórios");
      return;
    }

    setLoading(true);

    try {
      const vehicleData: any = {
        client_id: formData.client_id,
        brand: formData.brand,
        model: formData.model,
      };

      // Adicionar campos opcionais apenas se tiverem valor
      if (formData.year) vehicleData.year = parseInt(formData.year);
      if (formData.license_plate) vehicleData.plate = formData.license_plate;
      if (formData.vin) vehicleData.chassis = formData.vin;
      if (formData.color) vehicleData.color = formData.color;
      if (formData.fuel_type) vehicleData.fuel_type = formData.fuel_type;
      if (formData.engine) vehicleData.engine = formData.engine;
      if (formData.mileage) vehicleData.mileage = parseInt(formData.mileage);
      if (formData.notes) vehicleData.notes = formData.notes;

      let result;
      if (vehicle) {
        // Modo edição
        result = await updateVehicle(vehicle.id, vehicleData);
      } else {
        // Modo criação
        result = await createVehicle(vehicleData);
      }

      if (result) {
        // Limpar formulário apenas se for criação
        if (!vehicle) {
          setFormData({
            client_id: "",
            brand: "",
            model: "",
            year: "",
            license_plate: "",
            vin: "",
            color: "",
            fuel_type: "",
            engine: "",
            mileage: "",
            notes: ""
          });
        }
        onSuccess?.();
      }
    } catch (err: any) {
      console.error('Erro no formulário:', err);
      toast.error(err.message || "Erro ao salvar veículo");
    } finally {
      setLoading(false);
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
          <Label htmlFor="client_id" className="text-blue-600 dark:text-blue-400">Cliente *</Label>
          <Select
            value={formData.client_id}
            onValueChange={(value) => setFormData(prev => ({ ...prev, client_id: value }))}
          >
            <SelectTrigger className="">
              <SelectValue placeholder="Selecione o cliente" className="text-slate-400 placeholder:text-slate-400" />
            </SelectTrigger>
            <SelectContent className="">
              {clients?.map((client) => (
                <SelectItem key={client.id} value={client.id} className="">
                  {client.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="brand" className="text-blue-600 dark:text-blue-400">Marca *</Label>
          <Input
            id="brand"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            required
            placeholder="Toyota"
            className=""
          />
        </div>

        <div>
          <Label htmlFor="model" className="text-blue-600 dark:text-blue-400">Modelo *</Label>
          <Input
            id="model"
            name="model"
            value={formData.model}
            onChange={handleChange}
            required
            placeholder="Corolla"
            className=""
          />
        </div>

        <div>
          <Label htmlFor="year" className="text-blue-600 dark:text-blue-400">Ano</Label>
          <Input
            id="year"
            name="year"
            type="number"
            value={formData.year}
            onChange={handleChange}
            placeholder="2020"
            min="1900"
            max="2030"
            className=""
          />
        </div>

        <div>
          <Label htmlFor="license_plate" className="text-blue-600 dark:text-blue-400">Placa</Label>
          <Input
            id="license_plate"
            name="license_plate"
            value={formData.license_plate}
            onChange={handleChange}
            placeholder="ABC-1234"
            style={{ textTransform: 'uppercase' }}
            className=""
          />
        </div>

        <div className="col-span-2">
          <Label htmlFor="vin" className="text-blue-600 dark:text-blue-400">Chassi (VIN)</Label>
          <Input
            id="vin"
            name="vin"
            value={formData.vin}
            onChange={handleChange}
            placeholder="9BWZZZ377VT012345"
            style={{ textTransform: 'uppercase' }}
            className=""
          />
        </div>

        <div>
          <Label htmlFor="color" className="text-blue-600 dark:text-blue-400">Cor</Label>
          <Input
            id="color"
            name="color"
            value={formData.color}
            onChange={handleChange}
            placeholder="Branco"
            className=""
          />
        </div>

        <div>
          <Label htmlFor="fuel_type" className="text-blue-600 dark:text-blue-400">Combustível</Label>
          <Select
            value={formData.fuel_type}
            onValueChange={(value) => setFormData(prev => ({ ...prev, fuel_type: value }))}
          >
            <SelectTrigger className="">
              <SelectValue placeholder="Selecione o combustível" className="text-slate-400 placeholder:text-slate-400" />
            </SelectTrigger>
            <SelectContent className="">
              {FUEL_TYPES.map((fuel) => (
                <SelectItem key={fuel} value={fuel} className="">
                  {fuel}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="engine" className="text-blue-600 dark:text-blue-400">Motor</Label>
          <Input
            id="engine"
            name="engine"
            value={formData.engine}
            onChange={handleChange}
            placeholder="2.0 16V"
            className=""
          />
        </div>

        <div>
          <Label htmlFor="mileage" className="text-blue-600 dark:text-blue-400">Quilometragem</Label>
          <Input
            id="mileage"
            name="mileage"
            type="number"
            value={formData.mileage}
            onChange={handleChange}
            placeholder="50000"
            min="0"
            className=""
          />
        </div>

        <div className="col-span-2">
          <Label htmlFor="notes" className="text-blue-600 dark:text-blue-400">Observações</Label>
          <Textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Informações adicionais sobre o veículo..."
            rows={3}
            className=""
          />
        </div>
      </div>

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
          disabled={loading || !formData.client_id}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg shadow-purple-500/50"
        >
          {loading ? "Salvando..." : vehicle ? "Atualizar Veículo" : "Salvar Veículo"}
        </Button>
      </div>
    </form>
  );
};
