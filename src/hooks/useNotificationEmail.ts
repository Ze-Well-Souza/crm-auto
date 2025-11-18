import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AppointmentEmailData {
  clientName: string;
  appointmentDate: string;
  appointmentTime: string;
  serviceType: string;
  vehicleInfo?: string;
  estimatedPrice?: number;
}

interface PaymentEmailData {
  clientName: string;
  amount: number;
  paymentMethod: string;
  orderNumber?: string;
  description: string;
  paymentDate: string;
}

interface SubscriptionEmailData {
  clientName: string;
  changeType: 'upgrade' | 'downgrade' | 'cancelled' | 'renewed';
  oldPlan: string;
  newPlan: string;
  effectiveDate: string;
  newPrice?: number;
  features?: string[];
}

interface WelcomeEmailData {
  userName: string;
  planName: string;
  planDisplayName: string;
  planLimits: {
    clients: number;
    appointments: number;
    serviceOrders: number;
    users: number;
  };
  features: string[];
}

export const useNotificationEmail = () => {
  const [sending, setSending] = useState(false);

  const sendWelcomeEmail = async (
    to: string,
    data: WelcomeEmailData
  ) => {
    setSending(true);
    try {
      const { data: result, error } = await supabase.functions.invoke(
        'send-notification-email',
        {
          body: {
            type: 'welcome',
            to,
            data,
          },
        }
      );

      if (error) throw error;

      toast.success('Email de boas-vindas enviado!');
      return result;
    } catch (error) {
      console.error('Error sending welcome email:', error);
      toast.error('Erro ao enviar email de boas-vindas');
      throw error;
    } finally {
      setSending(false);
    }
  };

  const sendAppointmentReminder = async (
    to: string,
    data: AppointmentEmailData
  ) => {
    setSending(true);
    try {
      const { data: result, error } = await supabase.functions.invoke(
        'send-notification-email',
        {
          body: {
            type: 'appointment_reminder',
            to,
            data,
          },
        }
      );

      if (error) throw error;

      toast.success('Lembrete enviado!');
      return result;
    } catch (error) {
      console.error('Error sending reminder email:', error);
      toast.error('Erro ao enviar lembrete');
      throw error;
    } finally {
      setSending(false);
    }
  };

  const sendAppointmentConfirmation = async (
    to: string,
    data: AppointmentEmailData
  ) => {
    setSending(true);
    try {
      const { data: result, error } = await supabase.functions.invoke(
        'send-notification-email',
        {
          body: {
            type: 'appointment',
            to,
            data,
          },
        }
      );

      if (error) throw error;

      toast.success('Email de confirmação enviado!');
      return result;
    } catch (error) {
      console.error('Error sending appointment email:', error);
      toast.error('Erro ao enviar email de confirmação');
      throw error;
    } finally {
      setSending(false);
    }
  };

  const sendPaymentConfirmation = async (
    to: string,
    data: PaymentEmailData
  ) => {
    setSending(true);
    try {
      const { data: result, error } = await supabase.functions.invoke(
        'send-notification-email',
        {
          body: {
            type: 'payment',
            to,
            data,
          },
        }
      );

      if (error) throw error;

      toast.success('Comprovante de pagamento enviado!');
      return result;
    } catch (error) {
      console.error('Error sending payment email:', error);
      toast.error('Erro ao enviar comprovante');
      throw error;
    } finally {
      setSending(false);
    }
  };

  const sendSubscriptionChange = async (
    to: string,
    data: SubscriptionEmailData
  ) => {
    setSending(true);
    try {
      const { data: result, error } = await supabase.functions.invoke(
        'send-notification-email',
        {
          body: {
            type: 'subscription',
            to,
            data,
          },
        }
      );

      if (error) throw error;

      toast.success('Notificação de mudança de plano enviada!');
      return result;
    } catch (error) {
      console.error('Error sending subscription email:', error);
      toast.error('Erro ao enviar notificação');
      throw error;
    } finally {
      setSending(false);
    }
  };

  return {
    sending,
    sendWelcomeEmail,
    sendAppointmentReminder,
    sendAppointmentConfirmation,
    sendPaymentConfirmation,
    sendSubscriptionChange,
  };
};
