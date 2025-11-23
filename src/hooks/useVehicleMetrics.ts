import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface VehicleMetrics {
  lastService: Date | null;
  nextService: Date | null;
  totalServices: number;
  totalSpent: number;
  averageServiceCost: number;
  daysSinceLastService: number | null;
  maintenanceStatus: 'em_dia' | 'atencao' | 'atrasado';
  currentMileage: number | null;
  estimatedNextMileage: number | null;
}

export const useVehicleMetrics = (vehicleId: string) => {
  const [metrics, setMetrics] = useState<VehicleMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          // Usuário não autenticado - usar dados mock
          console.log('Usuário não autenticado - usando dados mock de veículos');
          setMetrics({
            lastService: null,
            nextService: null,
            totalServices: 0,
            totalSpent: 0,
            averageServiceCost: 0,
            daysSinceLastService: null,
            maintenanceStatus: 'em_dia',
            currentMileage: null,
            estimatedNextMileage: null,
          });
          setLoading(false);
          return;
        }

        // Buscar dados do veículo
        const { data: vehicle, error: vehicleError } = await supabase
          .from('vehicles')
          .select('mileage, created_at')
          .eq('id', vehicleId)
          .eq('partner_id', session.user.id)
          .single();

        if (vehicleError) throw vehicleError;

        // Buscar ordens de serviço do veículo
        const { data: serviceOrders, error: ordersError } = await supabase
          .from('service_orders')
          .select('id, created_at, total_amount, status')
          .eq('vehicle_id', vehicleId)
          .eq('partner_id', session.user.id)
          .order('created_at', { ascending: false });

        if (ordersError) throw ordersError;

        // Buscar agendamentos do veículo
        const { data: appointments } = await supabase
          .from('appointments')
          .select('scheduled_date, status')
          .eq('vehicle_id', vehicleId)
          .eq('partner_id', session.user.id)
          .order('scheduled_date', { ascending: false });

        // Calcular métricas
        const totalServices = serviceOrders?.length || 0;
        
        const totalSpent = serviceOrders
          ?.filter(order => order.status === 'finalizado')
          .reduce((sum, order) => sum + Number(order.total_amount || 0), 0) || 0;

        const averageServiceCost = totalServices > 0 ? totalSpent / totalServices : 0;

        // Último serviço
        const lastService = serviceOrders && serviceOrders.length > 0
          ? new Date(serviceOrders[0].created_at)
          : null;

        // Dias desde último serviço
        const daysSinceLastService = lastService
          ? Math.floor((Date.now() - lastService.getTime()) / (1000 * 60 * 60 * 24))
          : null;

        // Próximo serviço estimado
        // Regra: 90 dias ou 5000 km desde último serviço
        let nextService: Date | null = null;
        let estimatedNextMileage: number | null = null;
        
        if (lastService) {
          nextService = new Date(lastService);
          nextService.setDate(nextService.getDate() + 90);
        } else if (vehicle?.created_at) {
          // Se nunca teve serviço, estimar 90 dias após compra
          nextService = new Date(vehicle.created_at);
          nextService.setDate(nextService.getDate() + 90);
        }

        if (vehicle?.mileage) {
          estimatedNextMileage = vehicle.mileage + 5000;
        }

        // Status de manutenção
        let maintenanceStatus: 'em_dia' | 'atencao' | 'atrasado';
        if (daysSinceLastService === null) {
          maintenanceStatus = 'atencao';
        } else if (daysSinceLastService > 120) {
          maintenanceStatus = 'atrasado';
        } else if (daysSinceLastService > 90) {
          maintenanceStatus = 'atencao';
        } else {
          maintenanceStatus = 'em_dia';
        }

        // Verificar agendamentos futuros
        const upcomingAppointment = appointments?.find(
          apt => apt.status === 'agendado' && new Date(apt.scheduled_date) > new Date()
        );

        if (upcomingAppointment) {
          nextService = new Date(upcomingAppointment.scheduled_date);
          if (daysSinceLastService && daysSinceLastService < 90) {
            maintenanceStatus = 'em_dia';
          }
        }

        setMetrics({
          lastService,
          nextService,
          totalServices,
          totalSpent,
          averageServiceCost,
          daysSinceLastService,
          maintenanceStatus,
          currentMileage: vehicle?.mileage || null,
          estimatedNextMileage
        });
      } catch (err: any) {
        console.error('Erro ao buscar métricas do veículo:', err);
        // Em caso de erro, usar dados mock
        setMetrics({
          lastService: null,
          nextService: null,
          totalServices: 0,
          totalSpent: 0,
          averageServiceCost: 0,
          daysSinceLastService: null,
          maintenanceStatus: 'em_dia',
          currentMileage: null,
          estimatedNextMileage: null,
        });
        setError(null); // Não mostrar erro se temos mock
      } finally {
        setLoading(false);
      }
    };

    if (vehicleId) {
      fetchMetrics();
    } else {
      setLoading(false);
    }
  }, [vehicleId]);

  return { metrics, loading, error };
};
