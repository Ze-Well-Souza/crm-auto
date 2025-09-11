import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Car, Fuel, Calendar, Gauge } from "lucide-react";
import { useVehicles } from "@/hooks/useVehicles";
import { VehicleForm } from "@/components/vehicles/VehicleForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const Veiculos = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { vehicles, loading, error } = useVehicles();

  const filteredVehicles = vehicles?.filter(vehicle => 
    vehicle.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.license_plate?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.clients?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">Gestão de Veículos</h1>
              <p className="text-muted-foreground">Controle detalhado da frota de veículos</p>
            </div>
          </div>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">Gestão de Veículos</h1>
              <p className="text-muted-foreground">Controle detalhado da frota de veículos</p>
            </div>
          </div>
          <Card className="border-destructive bg-destructive/5">
            <CardContent className="pt-6">
              <p className="text-destructive">Erro ao carregar veículos: {error}</p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Gestão de Veículos</h1>
            <p className="text-muted-foreground">Controle detalhado da frota de veículos</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="shadow-primary">
                <Plus className="mr-2 h-4 w-4" />
                Novo Veículo
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Cadastrar Novo Veículo</DialogTitle>
              </DialogHeader>
              <VehicleForm onSuccess={() => setIsDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="gradient-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Car className="h-4 w-4 text-primary" />
                Total de Veículos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{vehicles?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Cadastrados no sistema</p>
            </CardContent>
          </Card>
          
          <Card className="gradient-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Fuel className="h-4 w-4 text-success" />
                Flex
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {vehicles?.filter(v => v.fuel_type === 'Flex').length || 0}
              </div>
              <p className="text-xs text-muted-foreground">Combustível flex</p>
            </CardContent>
          </Card>

          <Card className="gradient-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4 text-warning" />
                Até 2020
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {vehicles?.filter(v => v.year && v.year <= 2020).length || 0}
              </div>
              <p className="text-xs text-muted-foreground">Veículos mais antigos</p>
            </CardContent>
          </Card>

          <Card className="gradient-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Gauge className="h-4 w-4 text-destructive" />
                Alta Km
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {vehicles?.filter(v => v.mileage && v.mileage > 100000).length || 0}
              </div>
              <p className="text-xs text-muted-foreground">Acima de 100mil km</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar veículos por marca, modelo, placa ou cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Vehicles List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.length > 0 ? (
            filteredVehicles.map((vehicle) => (
              <Card key={vehicle.id} className="hover:shadow-elevated transition-smooth cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      {vehicle.brand} {vehicle.model}
                    </CardTitle>
                    <Badge variant={vehicle.year && vehicle.year >= 2020 ? "default" : "secondary"}>
                      {vehicle.year}
                    </Badge>
                  </div>
                  <CardDescription>
                    {vehicle.license_plate && (
                      <span className="font-medium">{vehicle.license_plate}</span>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {vehicle.clients && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Proprietário:</span>
                      <span className="font-medium">{vehicle.clients.name}</span>
                    </div>
                  )}
                  
                  {vehicle.color && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Cor:</span>
                      <span>{vehicle.color}</span>
                    </div>
                  )}
                  
                  {vehicle.fuel_type && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Combustível:</span>
                      <span>{vehicle.fuel_type}</span>
                    </div>
                  )}

                  {vehicle.engine && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Motor:</span>
                      <span>{vehicle.engine}</span>
                    </div>
                  )}

                  {vehicle.mileage && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Quilometragem:</span>
                      <Badge 
                        variant={vehicle.mileage > 100000 ? "destructive" : "secondary"}
                        className="text-xs"
                      >
                        {vehicle.mileage.toLocaleString('pt-BR')} km
                      </Badge>
                    </div>
                  )}

                  {vehicle.notes && (
                    <div className="mt-3 p-2 bg-muted/50 rounded-md">
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {vehicle.notes}
                      </p>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-xs text-muted-foreground">
                      Cadastrado em {new Date(vehicle.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full">
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Car className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground mb-2">
                    {searchTerm ? "Nenhum veículo encontrado" : "Nenhum veículo cadastrado"}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 text-center max-w-sm">
                    {searchTerm 
                      ? "Tente ajustar os termos de busca ou cadastre um novo veículo." 
                      : "Comece cadastrando o primeiro veículo do sistema."
                    }
                  </p>
                  {!searchTerm && (
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="mr-2 h-4 w-4" />
                          Cadastrar Primeiro Veículo
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                          <DialogTitle>Cadastrar Novo Veículo</DialogTitle>
                        </DialogHeader>
                        <VehicleForm onSuccess={() => setIsDialogOpen(false)} />
                      </DialogContent>
                    </Dialog>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Veiculos;