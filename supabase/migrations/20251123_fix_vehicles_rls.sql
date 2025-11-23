-- =====================================================
-- FIX: Adicionar RLS e Políticas para tabela vehicles
-- =====================================================

-- Habilitar RLS na tabela vehicles
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;

-- Políticas para vehicles
CREATE POLICY "Parceiros podem ver seus próprios veículos"
  ON public.vehicles FOR SELECT
  USING (auth.uid() = partner_id);

CREATE POLICY "Parceiros podem inserir veículos"
  ON public.vehicles FOR INSERT
  WITH CHECK (auth.uid() = partner_id);

CREATE POLICY "Parceiros podem atualizar seus veículos"
  ON public.vehicles FOR UPDATE
  USING (auth.uid() = partner_id);

CREATE POLICY "Parceiros podem deletar seus veículos"
  ON public.vehicles FOR DELETE
  USING (auth.uid() = partner_id);

-- Comentários
COMMENT ON POLICY "Parceiros podem ver seus próprios veículos" ON public.vehicles IS
'Permite que parceiros vejam apenas os veículos que eles cadastraram';

COMMENT ON POLICY "Parceiros podem inserir veículos" ON public.vehicles IS
'Permite que parceiros cadastrem novos veículos';

COMMENT ON POLICY "Parceiros podem atualizar seus veículos" ON public.vehicles IS
'Permite que parceiros atualizem apenas seus próprios veículos';

COMMENT ON POLICY "Parceiros podem deletar seus veículos" ON public.vehicles IS
'Permite que parceiros deletem apenas seus próprios veículos';

