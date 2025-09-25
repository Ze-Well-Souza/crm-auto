/*
  # Adicionar dados de exemplo para agendamentos

  1. Dados de Exemplo
    - Inserir 8 agendamentos de exemplo
    - Diferentes status: agendado, confirmado, em_andamento, concluido
    - Relacionados aos clientes e veículos existentes
    - Datas variadas para demonstrar funcionalidade

  2. Objetivo
    - Permitir teste completo do módulo de agendamentos
    - Demonstrar diferentes cenários de uso
    - Validar filtros e busca
*/

-- Inserir agendamentos de exemplo relacionados aos clientes e veículos existentes
INSERT INTO public.appointments (
  client_id, 
  vehicle_id, 
  service_type, 
  service_description, 
  scheduled_date, 
  scheduled_time, 
  estimated_duration, 
  estimated_value, 
  final_value, 
  status, 
  notes
) 
WITH client_vehicle_data AS (
  SELECT 
    c.id as client_id,
    v.id as vehicle_id,
    c.name as client_name,
    v.brand || ' ' || v.model as vehicle_name,
    ROW_NUMBER() OVER (ORDER BY RANDOM()) as rn
  FROM public.clients c
  JOIN public.vehicles v ON v.client_id = c.id
  LIMIT 8
),
appointment_data AS (
  SELECT 
    rn,
    service_type,
    service_description,
    scheduled_date,
    scheduled_time,
    estimated_duration,
    estimated_value,
    final_value,
    status,
    notes
  FROM (
    VALUES 
    (1, 'Revisão Preventiva', 'Revisão completa de 60.000km conforme manual do fabricante', '2024-09-20', '09:00', 180, 350.00, NULL, 'agendado', 'Cliente solicitou revisão completa. Verificar todos os fluidos.'),
    (2, 'Troca de Óleo', 'Troca de óleo do motor e filtros', '2024-09-18', '14:00', 45, 120.00, 120.00, 'concluido', 'Serviço realizado com sucesso. Cliente satisfeito.'),
    (3, 'Reparo de Freios', 'Verificação e possível troca de pastilhas de freio', '2024-09-22', '10:30', 120, 280.00, NULL, 'confirmado', 'Cliente confirmou agendamento. Pastilhas chegaram na oficina.'),
    (4, 'Diagnóstico Eletrônico', 'Diagnóstico completo do sistema eletrônico do veículo', '2024-09-19', '08:00', 90, 150.00, 180.00, 'concluido', 'Problema identificado e corrigido no módulo de injeção.'),
    (5, 'Alinhamento e Balanceamento', 'Alinhamento das rodas e balanceamento dos pneus', '2024-09-21', '15:30', 60, 100.00, NULL, 'em_andamento', 'Serviço em andamento. Previsão de conclusão às 16:30.'),
    (6, 'Manutenção do Ar Condicionado', 'Limpeza e recarga do sistema de ar condicionado', '2024-09-25', '11:00', 90, 180.00, NULL, 'agendado', 'Agendamento para próxima semana. Cliente preferiu horário da manhã.'),
    (7, 'Troca de Correia Dentada', 'Substituição da correia dentada e tensor', '2024-09-17', '13:00', 240, 450.00, 420.00, 'concluido', 'Serviço complexo realizado com perfeição. Garantia de 1 ano.'),
    (8, 'Revisão Geral', 'Revisão geral do veículo antes de viagem', '2024-09-23', '16:00', 150, 250.00, NULL, 'confirmado', 'Cliente vai viajar. Revisão completa agendada para garantir segurança.')
  ) AS appointment_values(rn, service_type, service_description, scheduled_date, scheduled_time, estimated_duration, estimated_value, final_value, status, notes)
)
SELECT 
  cvd.client_id,
  cvd.vehicle_id,
  ad.service_type,
  ad.service_description,
  ad.scheduled_date::date,
  ad.scheduled_time::time,
  ad.estimated_duration,
  ad.estimated_value,
  ad.final_value,
  ad.status,
  ad.notes
FROM client_vehicle_data cvd
JOIN appointment_data ad ON cvd.rn = ad.rn;