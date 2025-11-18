import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { SERVICE_TYPES, TIME_SLOTS } from "@/utils/constants";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useClients } from "@/hooks/useClients";
import { useVehicles } from "@/hooks/useVehicles";
import { useAppointmentsNew } from "@/hooks/useAppointmentsNew";
import { useNotificationEmail } from "@/hooks/useNotificationEmail";
import type { Appointment } from "@/types";

const appointmentSchema = z.object({
  client_id: z.string().min(1, "Cliente é obrigatório"),
  vehicle_id: z.string().optional(),
  service_type: z.string().min(1, "Tipo de serviço é obrigatório"),
  service_description: z.string().optional(),
  scheduled_date: z.date({
    required_error: "Data é obrigatória",
  }),
  scheduled_time: z.string().min(1, "Horário é obrigatório"),
  estimated_duration: z.number().min(15, "Duração mínima de 15 minutos"),
  estimated_value: z.number().optional(),
  notes: z.string().optional(),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

interface AppointmentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment?: any;
  onSuccess?: () => void;
}

export const AppointmentForm = ({
  open,
  onOpenChange,
  appointment,
  onSuccess,
}: AppointmentFormProps) => {
  const [loading, setLoading] = useState(false);
  const { clients } = useClients();
  const { vehicles } = useVehicles();
  const { createAppointment, updateAppointment } = useAppointmentsNew();
  const { sendAppointmentConfirmation } = useNotificationEmail();

  const form = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      client_id: appointment?.client_id || "",
      vehicle_id: appointment?.vehicle_id || "",
      service_type: appointment?.service_type || "",
      service_description: appointment?.service_description || "",
      scheduled_date: appointment?.scheduled_date ? new Date(appointment.scheduled_date) : undefined,
      scheduled_time: appointment?.scheduled_time || "",
      estimated_duration: appointment?.estimated_duration || 60,
      estimated_value: appointment?.estimated_value || 0,
      notes: appointment?.notes || "",
    },
  });

  const onSubmit = async (data: AppointmentFormData) => {
    try {
      setLoading(true);

      // ✅ VERIFICAR LIMITE ANTES DE CRIAR (apenas para novos agendamentos)
      if (!appointment) {
        const { usePlanLimits } = await import('@/hooks/usePlanLimits');
        const { checkAndIncrement } = usePlanLimits();
        
        const canCreate = await checkAndIncrement('appointments', 'agendamentos');
        if (!canCreate) {
          setLoading(false);
          return; // Bloqueia criação se limite foi atingido
        }
      }

      const appointmentData = {
        ...data,
        scheduled_date: format(data.scheduled_date, 'yyyy-MM-dd'),
        status: appointment ? appointment.status : 'agendado',
        final_value: null,
        cancellation_reason: null,
        cancelled_at: null,
        cancelled_by: null,
      };

      if (appointment) {
        await updateAppointment(appointment.id, appointmentData as any);
      } else {
        await createAppointment(appointmentData as any);
        
        // Enviar email de confirmação para novos agendamentos
        const client = clients?.find(c => c.id === data.client_id);
        const vehicle = vehicles?.find(v => v.id === data.vehicle_id);
        
        if (client?.email) {
          try {
            await sendAppointmentConfirmation(client.email, {
              clientName: client.name,
              appointmentDate: format(data.scheduled_date, 'dd/MM/yyyy'),
              appointmentTime: data.scheduled_time,
              serviceType: data.service_type,
              vehicleInfo: vehicle ? `${vehicle.brand} ${vehicle.model} - ${vehicle.license_plate || 'Sem placa'}` : undefined,
              estimatedPrice: data.estimated_value,
            });
          } catch (emailError) {
            // Não bloqueia o fluxo se o email falhar
            console.error('Email não enviado:', emailError);
          }
        }
      }

      onSuccess?.();
      onOpenChange(false);
      form.reset();
    } catch (error: any) {
      console.error("Erro ao salvar agendamento:", error);
      
      // Verificar se o erro é de RLS (limite atingido)
      if (error?.message?.includes('row-level security') || error?.message?.includes('policy')) {
        alert("Você atingiu o limite de agendamentos do seu plano. Faça upgrade para continuar.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {appointment ? "Editar Agendamento" : "Novo Agendamento"}
          </DialogTitle>
          <DialogDescription>
            {appointment 
              ? "Atualize as informações do agendamento." 
              : "Preencha os dados para criar um novo agendamento."
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="client_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cliente</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um cliente" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {clients?.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="vehicle_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Veículo (Opcional)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um veículo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {vehicles?.map((vehicle) => (
                          <SelectItem key={vehicle.id} value={vehicle.id}>
                            {vehicle.brand} {vehicle.model} ({vehicle.year}) - {vehicle.license_plate}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="service_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Serviço</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo de serviço" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {SERVICE_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="scheduled_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data do Agendamento</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy")
                            ) : (
                              <span>Selecione uma data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="scheduled_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Horário</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um horário" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TIME_SLOTS.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="estimated_duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duração Estimada (minutos)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="15"
                        step="15"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="estimated_value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor Estimado (R$)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="service_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição do Serviço</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva os detalhes do serviço..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Observações adicionais..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Salvando..." : appointment ? "Atualizar" : "Criar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};