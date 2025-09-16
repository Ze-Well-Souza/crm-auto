-- Inserir 15 ordens de serviço de exemplo relacionadas aos clientes e veículos existentes
INSERT INTO public.service_orders (client_id, vehicle_id, description, total_labor, total_parts, total_amount, discount, status, mechanic_id, notes, started_at, finished_at, delivered_at) 
WITH client_vehicle_pairs AS (
  SELECT 
    c.id as client_id,
    v.id as vehicle_id,
    ROW_NUMBER() OVER (ORDER BY RANDOM()) as rn
  FROM public.clients c
  JOIN public.vehicles v ON v.client_id = c.id
  LIMIT 15
),
service_data AS (
  SELECT 
    rn,
    description,
    total_labor,
    total_parts,
    total_labor + total_parts as total_amount,
    discount,
    status,
    notes,
    started_at,
    finished_at,
    delivered_at
  FROM (
    VALUES 
    (1, 'Revisão completa de 60.000km + troca de óleo e filtros', 350.00, 180.50, 0, 'concluido', 'Revisão preventiva completa realizada conforme manual do fabricante.', '2024-09-10 08:00:00'::timestamp, '2024-09-10 17:30:00'::timestamp, '2024-09-11 09:00:00'::timestamp),
    (2, 'Reparo no sistema de freios - pastilhas e discos', 280.00, 420.00, 50.00, 'concluido', 'Troca completa do sistema de freios dianteiro. Garantia de 6 meses.', '2024-09-08 09:00:00'::timestamp, '2024-09-08 16:00:00'::timestamp, '2024-09-08 18:00:00'::timestamp),
    (3, 'Manutenção preventiva + alinhamento e balanceamento', 180.00, 95.00, 0, 'concluido', 'Serviço realizado com precisão. Pneus em excelente estado.', '2024-09-12 13:00:00'::timestamp, '2024-09-12 16:30:00'::timestamp, '2024-09-13 08:00:00'::timestamp),
    (4, 'Troca do sistema de embreagem completo', 450.00, 680.00, 0, 'concluido', 'Sistema de embreagem substituído. Inclui disco, platô e rolamento.', '2024-09-05 08:00:00'::timestamp, '2024-09-06 17:00:00'::timestamp, '2024-09-07 10:00:00'::timestamp),
    (5, 'Reparo no ar condicionado + recarga de gás', 120.00, 85.00, 0, 'concluido', 'Vazamento localizado e corrigido. Ar condicionado funcionando perfeitamente.', '2024-09-13 10:00:00'::timestamp, '2024-09-13 14:00:00'::timestamp, '2024-09-13 16:00:00'::timestamp),
    (6, 'Troca de correia dentada + bomba d\'água', 200.00, 320.00, 0, 'em_andamento', 'Serviço em andamento. Previsão de conclusão amanhã.', '2024-09-16 08:00:00'::timestamp, NULL, NULL),
    (7, 'Diagnóstico eletrônico + reparo no módulo de injeção', 180.00, 450.00, 0, 'em_andamento', 'Problema identificado no módulo. Aguardando peça de reposição.', '2024-09-15 14:00:00'::timestamp, NULL, NULL),
    (8, 'Revisão geral do motor + troca de velas e cabos', 320.00, 280.00, 30.00, 'concluido', 'Motor revisado completamente. Performance melhorada significativamente.', '2024-09-09 08:00:00'::timestamp, '2024-09-10 12:00:00'::timestamp, '2024-09-10 15:00:00'::timestamp),
    (9, 'Manutenção no câmbio automático + troca de filtro', 380.00, 150.00, 0, 'concluido', 'Câmbio funcionando suavemente após manutenção preventiva.', '2024-09-11 09:00:00'::timestamp, '2024-09-11 16:00:00'::timestamp, '2024-09-12 08:00:00'::timestamp),
    (10, 'Reparo na suspensão dianteira + alinhamento', 250.00, 340.00, 0, 'em_andamento', 'Amortecedores sendo substituídos. Serviço em andamento.', '2024-09-16 10:00:00'::timestamp, NULL, NULL),
    (11, 'Troca de pneus + balanceamento', 80.00, 600.00, 50.00, 'concluido', 'Conjunto completo de pneus novos instalado. Garantia de 2 anos.', '2024-09-14 13:00:00'::timestamp, '2024-09-14 15:30:00'::timestamp, '2024-09-14 17:00:00'::timestamp),
    (12, 'Reparo no sistema elétrico + troca da bateria', 150.00, 220.00, 0, 'concluido', 'Problema elétrico solucionado. Bateria nova com 2 anos de garantia.', '2024-09-06 11:00:00'::timestamp, '2024-09-06 15:00:00'::timestamp, '2024-09-06 17:30:00'::timestamp),
    (13, 'Limpeza de bicos injetores + troca do filtro de combustível', 120.00, 95.00, 0, 'pendente', 'Orçamento aprovado. Agendado para início amanhã.', NULL, NULL, NULL),
    (14, 'Reparo na caixa de direção hidráulica', 280.00, 380.00, 0, 'em_andamento', 'Vazamento na caixa de direção sendo reparado.', '2024-09-15 09:00:00'::timestamp, NULL, NULL),
    (15, 'Troca do radiador + revisão do sistema de arrefecimento', 200.00, 480.00, 40.00, 'orcamento', 'Orçamento apresentado ao cliente. Aguardando aprovação.', NULL, NULL, NULL)
  ) AS service_data_values(rn, description, total_labor, total_parts, discount, status, notes, started_at, finished_at, delivered_at)
)
SELECT 
  cvp.client_id,
  cvp.vehicle_id,
  sd.description,
  sd.total_labor,
  sd.total_parts,
  sd.total_amount - COALESCE(sd.discount, 0) as total_amount,
  sd.discount,
  sd.status,
  NULL as mechanic_id, -- Não temos mecânicos cadastrados ainda
  sd.notes,
  sd.started_at,
  sd.finished_at,
  sd.delivered_at
FROM client_vehicle_pairs cvp
JOIN service_data sd ON cvp.rn = sd.rn;