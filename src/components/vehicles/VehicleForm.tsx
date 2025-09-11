import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useVehicles } from "@/hooks/useVehicles";
import { useClients } from "@/hooks/useClients";

interface VehicleFormProps {
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
          <Label htmlFor="client_id">Cliente *</Label>
          <Select
            value={formData.client_id}
            onValueChange={(value) => setFormData(prev => ({ ...prev, client_id: value }))}
          >
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
          <Label htmlFor="brand">Marca *</Label>
          <Input
            id="brand"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            required
            placeholder="Toyota"
          />
        </div>

        <div>
          <Label htmlFor="model">Modelo *</Label>
          <Input
            id="model"
            name="model"
            value={formData.model}
            onChange={handleChange}
            required
            placeholder="Corolla"
          />
        </div>

        <div>
          <Label htmlFor="year">Ano</Label>
          <Input
            id="year"
            name="year"
            type="number"
            value={formData.year}
            onChange={handleChange}
            placeholder="2020"
            min="1900"
            max="2030"
          />
        </div>

        <div>
          <Label htmlFor="license_plate">Placa</Label>
          <Input
            id="license_plate"
            name="license_plate"
            value={formData.license_plate}
            onChange={handleChange}
            placeholder="ABC-1234"
            style={{ textTransform: 'uppercase' }}
          />
        </div>

        <div className="col-span-2">
          <Label htmlFor="vin">Chassi (VIN)</Label>
          <Input
            id="vin"
            name="vin"
            value={formData.vin}
            onChange={handleChange}
            placeholder="9BWZZZ377VT012345"
            style={{ textTransform: 'uppercase' }}
          />
        </div>

        <div>
          <Label htmlFor="color">Cor</Label>
          <Input
            id="color"
            name="color"
            value={formData.color}
            onChange={handleChange}
            placeholder="Branco"
          />
        </div>

        <div>
          <Label htmlFor="fuel_type">Combustível</Label>
          <Select
            value={formData.fuel_type}
            onValueChange={(value) => setFormData(prev => ({ ...prev, fuel_type: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o combustível" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Gasolina">Gasolina</SelectItem>
              <SelectItem value="Etanol">Etanol</SelectItem>
              <SelectItem value="Flex">Flex</SelectItem>
              <SelectItem value="Diesel">Diesel</SelectItem>
              <SelectItem value="GNV">GNV</SelectItem>
              <SelectItem value="Elétrico">Elétrico</SelectItem>
              <SelectItem value="Híbrido">Híbrido</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="engine">Motor</Label>
          <Input
            id="engine"
            name="engine"
            value={formData.engine}
            onChange={handleChange}
            placeholder="2.0 16V"
          />
        </div>

        <div>
          <Label htmlFor="mileage">Quilometragem</Label>
          <Input
            id="mileage"
            name="mileage"
            type="number"
            value={formData.mileage}
            onChange={handleChange}
            placeholder="50000"
            min="0"
          />
        </div>

        <div className="col-span-2">
          <Label htmlFor="notes">Observações</Label>
          <Textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Informações adicionais sobre o veículo..."
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
        <Button type="submit" disabled={loading || !formData.client_id}>
          {loading ? "Salvando..." : "Salvar Veículo"}
        </Button>
      </div>
    </form>
  );
};