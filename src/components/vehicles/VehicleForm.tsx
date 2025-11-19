import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useVehicles } from "@/hooks/useVehicles";
import { useClients } from "@/hooks/useClients";
import { FUEL_TYPES } from "@/utils/constants";
import type { Vehicle } from "@/types";

interface VehicleFormProps {
  vehicle?: Vehicle;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
}

export const VehicleForm = ({ onSuccess }: VehicleFormProps) => {
  const [loading, setLoading] = useState(false);
  const { createVehicle } = useVehicles();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await createVehicle({
      client_id: formData.client_id,
      brand: formData.brand,
      model: formData.model,
      year: formData.year ? parseInt(formData.year) : null,
      license_plate: formData.license_plate || null,
      vin: formData.vin || null,
      color: formData.color || null,
      fuel_type: formData.fuel_type || null,
      engine: formData.engine || null,
      mileage: formData.mileage ? parseInt(formData.mileage) : null,
      notes: formData.notes || null,
    });

    setLoading(false);

    if (result) {
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
          <Label htmlFor="client_id" className="text-blue-300">Cliente *</Label>
          <Select
            value={formData.client_id}
            onValueChange={(value) => setFormData(prev => ({ ...prev, client_id: value }))}
          >
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
          <Label htmlFor="brand" className="text-blue-300">Marca *</Label>
          <Input
            id="brand"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            required
            placeholder="Toyota"
            className="bg-white/5 border-white/10 text-white placeholder:text-slate-400 focus:border-purple-500/50 focus:ring-purple-500/20"
          />
        </div>

        <div>
          <Label htmlFor="model" className="text-blue-300">Modelo *</Label>
          <Input
            id="model"
            name="model"
            value={formData.model}
            onChange={handleChange}
            required
            placeholder="Corolla"
            className="bg-white/5 border-white/10 text-white placeholder:text-slate-400 focus:border-purple-500/50 focus:ring-purple-500/20"
          />
        </div>

        <div>
          <Label htmlFor="year" className="text-blue-300">Ano</Label>
          <Input
            id="year"
            name="year"
            type="number"
            value={formData.year}
            onChange={handleChange}
            placeholder="2020"
            min="1900"
            max="2030"
            className="bg-white/5 border-white/10 text-white placeholder:text-slate-400 focus:border-purple-500/50 focus:ring-purple-500/20"
          />
        </div>

        <div>
          <Label htmlFor="license_plate" className="text-blue-300">Placa</Label>
          <Input
            id="license_plate"
            name="license_plate"
            value={formData.license_plate}
            onChange={handleChange}
            placeholder="ABC-1234"
            style={{ textTransform: 'uppercase' }}
            className="bg-white/5 border-white/10 text-white placeholder:text-slate-400 focus:border-purple-500/50 focus:ring-purple-500/20"
          />
        </div>

        <div className="col-span-2">
          <Label htmlFor="vin" className="text-blue-300">Chassi (VIN)</Label>
          <Input
            id="vin"
            name="vin"
            value={formData.vin}
            onChange={handleChange}
            placeholder="9BWZZZ377VT012345"
            style={{ textTransform: 'uppercase' }}
            className="bg-white/5 border-white/10 text-white placeholder:text-slate-400 focus:border-purple-500/50 focus:ring-purple-500/20"
          />
        </div>

        <div>
          <Label htmlFor="color" className="text-blue-300">Cor</Label>
          <Input
            id="color"
            name="color"
            value={formData.color}
            onChange={handleChange}
            placeholder="Branco"
            className="bg-white/5 border-white/10 text-white placeholder:text-slate-400 focus:border-purple-500/50 focus:ring-purple-500/20"
          />
        </div>

        <div>
          <Label htmlFor="fuel_type" className="text-blue-300">Combustível</Label>
          <Select
            value={formData.fuel_type}
            onValueChange={(value) => setFormData(prev => ({ ...prev, fuel_type: value }))}
          >
            <SelectTrigger className="bg-white/5 border-white/10 text-white focus:border-purple-500/50 focus:ring-purple-500/20">
              <SelectValue placeholder="Selecione o combustível" className="text-slate-400" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-white/10">
              {FUEL_TYPES.map((fuel) => (
                <SelectItem key={fuel} value={fuel} className="text-white hover:bg-white/10">
                  {fuel}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="engine" className="text-blue-300">Motor</Label>
          <Input
            id="engine"
            name="engine"
            value={formData.engine}
            onChange={handleChange}
            placeholder="2.0 16V"
            className="bg-white/5 border-white/10 text-white placeholder:text-slate-400 focus:border-purple-500/50 focus:ring-purple-500/20"
          />
        </div>

        <div>
          <Label htmlFor="mileage" className="text-blue-300">Quilometragem</Label>
          <Input
            id="mileage"
            name="mileage"
            type="number"
            value={formData.mileage}
            onChange={handleChange}
            placeholder="50000"
            min="0"
            className="bg-white/5 border-white/10 text-white placeholder:text-slate-400 focus:border-purple-500/50 focus:ring-purple-500/20"
          />
        </div>

        <div className="col-span-2">
          <Label htmlFor="notes" className="text-blue-300">Observações</Label>
          <Textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Informações adicionais sobre o veículo..."
            rows={3}
            className="bg-white/5 border-white/10 text-white placeholder:text-slate-400 focus:border-purple-500/50 focus:ring-purple-500/20"
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
          {loading ? "Salvando..." : "Salvar Veículo"}
        </Button>
      </div>
    </form>
  );
};