import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Car } from "lucide-react";
import { useVehicles } from "@/hooks/useVehicles";
import { VehicleForm } from "@/components/vehicles/VehicleForm";
import { VehicleCard } from "@/components/vehicles/VehicleCard";
import { VehicleMetrics } from "@/components/vehicles/VehicleMetrics";
import { VehicleFilters } from "@/components/vehicles/VehicleFilters";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { SearchInput } from "@/components/common/SearchInput";
import { EmptyState } from "@/components/common/EmptyState";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

const Veiculos = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filters, setFilters] = useState<any>({});
  const { vehicles, loading, error, refetch } = useVehicles();

  const handleQuickAction = (action: string, vehicle: any) => {
    console.log(`Ação ${action} para veículo:`, vehicle);
    // Implementar ações específicas aqui
  };

  const applyFilters = (vehicleList: any[]) => {
    let filtered = [...vehicleList];

    // Apply search term
    if (searchTerm) {
      filtered = filtered.filter(vehicle => 
        vehicle.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.license_plate?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.clients?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply quick filters
    if (filters.highMileage) {
      filtered = filtered.filter(vehicle => vehicle.mileage && vehicle.mileage > 100000);
    }
    if (filters.flexFuel) {
      filtered = filtered.filter(vehicle => vehicle.fuel_type === 'Flex');
    }

    // Apply fuel type filters
    if (filters.fuelType?.length > 0) {
      filtered = filtered.filter(vehicle => 
        filters.fuelType.includes(vehicle.fuel_type)
      );
    }

    // Apply year range filter
    if (filters.yearRange) {
      filtered = filtered.filter(vehicle => 
        vehicle.year && 
        vehicle.year >= filters.yearRange[0] && 
        vehicle.year <= filters.yearRange[1]
      );
    }

    // Apply mileage range filter
    if (filters.mileageRange) {
      filtered = filtered.filter(vehicle => 
        vehicle.mileage && 
        vehicle.mileage >= filters.mileageRange[0] && 
        vehicle.mileage <= filters.mileageRange[1]
      );
    }

    return filtered;
  };

  const filteredVehicles = vehicles ? applyFilters(vehicles) : [];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <Card className="border-destructive bg-destructive/5">
          <CardContent className="pt-6">
            <p className="text-destructive">Erro ao carregar veículos: {error}</p>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header - Landing Page Style */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-500 bg-clip-text text-transparent">
              Gestão de Veículos
            </h1>
            <p className="text-slate-400">Controle detalhado da frota de veículos</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg shadow-purple-500/50">
                <Plus className="mr-2 h-4 w-4" />
                Novo Veículo
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] bg-slate-900 border-white/10">
              <DialogHeader>
                <DialogTitle className="text-white">Cadastrar Novo Veículo</DialogTitle>
              </DialogHeader>
              <VehicleForm onSuccess={() => setIsDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Enhanced Metrics */}
        <VehicleMetrics vehicles={vehicles || []} />

        {/* Advanced Filters */}
        <VehicleFilters 
          onFiltersChange={setFilters}
          activeFilters={filters}
        />

        {/* Search */}
        <SearchInput
          placeholder="Buscar veículos por marca, modelo, placa ou cliente..."
          value={searchTerm}
          onChange={setSearchTerm}
        />

        {/* Vehicles List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.length > 0 ? (
            filteredVehicles.map((vehicle) => (
              <VehicleCard 
                key={vehicle.id} 
                vehicle={vehicle} 
                onUpdate={refetch}
                onQuickAction={handleQuickAction}
              />
            ))
          ) : (
            <div className="col-span-full">
              <EmptyState
                icon={Car}
                title={searchTerm ? "Nenhum veículo encontrado" : "Nenhum veículo cadastrado"}
                description={searchTerm 
                  ? "Tente ajustar os termos de busca ou filtros." 
                  : "Comece cadastrando o primeiro veículo do sistema."
                }
                actionLabel="Novo Veículo"
                onAction={() => setIsDialogOpen(true)}
                showAction={!searchTerm}
              />
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Veiculos;