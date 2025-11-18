-- Adicionar campo reminder_sent à tabela appointments
ALTER TABLE public.appointments 
ADD COLUMN IF NOT EXISTS reminder_sent boolean DEFAULT false;

-- Criar índice para melhorar performance da busca de lembretes
CREATE INDEX IF NOT EXISTS idx_appointments_reminder_search 
ON public.appointments(scheduled_date, reminder_sent) 
WHERE reminder_sent = false;