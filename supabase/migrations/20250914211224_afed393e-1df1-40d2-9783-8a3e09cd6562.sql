-- FINALIZAÇÃO DEFINITIVA - ÚLTIMAS 9 FUNÇÕES COM SEARCH PATH
-- Corrigir as funções restantes que ainda precisam do search_path

-- Função get_user_role (caractere varying)
CREATE OR REPLACE FUNCTION public.get_user_role(user_id_param character varying)
RETURNS character varying
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN (SELECT role FROM users WHERE id = user_id_param);
END;
$function$;

-- Função get_current_user_role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS character varying
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN get_user_role(auth.uid()::VARCHAR);
END;
$function$;

-- Função limpar_dados_antigos
CREATE OR REPLACE FUNCTION public.limpar_dados_antigos(dias_retencao integer DEFAULT 7)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
    tarefas_removidas INTEGER;
    data_limite TIMESTAMP WITH TIME ZONE;
BEGIN
    data_limite := NOW() - (dias_retencao || ' days')::INTERVAL;
    
    -- Remover tarefas antigas concluídas ou falhadas
    DELETE FROM public.fila_de_tarefas 
    WHERE status IN ('concluido', 'falhou') 
    AND created_at < data_limite;
    
    GET DIAGNOSTICS tarefas_removidas = ROW_COUNT;
    
    -- Log da limpeza
    INSERT INTO public.fila_de_tarefas (tipo_tarefa, payload)
    VALUES (
        'log_sistema',
        jsonb_build_object(
            'evento', 'limpeza_dados_antigos',
            'timestamp', NOW(),
            'tarefas_removidas', tarefas_removidas,
            'dias_retencao', dias_retencao,
            'data_limite', data_limite
        )
    );
    
    RETURN jsonb_build_object(
        'status', 'sucesso',
        'tarefas_removidas', tarefas_removidas,
        'data_limite', data_limite,
        'timestamp', NOW()
    );
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'status', 'erro',
            'erro', SQLERRM,
            'timestamp', NOW()
        );
END;
$function$;

-- Função reprocessar_tarefas_falhadas
CREATE OR REPLACE FUNCTION public.reprocessar_tarefas_falhadas(limite integer DEFAULT 10)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
    tarefas_reprocessadas INTEGER;
BEGIN
    -- Resetar tarefas falhadas para reprocessamento
    UPDATE public.fila_de_tarefas 
    SET 
        status = 'pendente',
        tentativas = 0,
        erro_detalhes = NULL,
        updated_at = NOW()
    WHERE status = 'falhou'
    AND tentativas < 5  -- Só reprocessar se não excedeu limite de tentativas
    AND id IN (
        SELECT id 
        FROM public.fila_de_tarefas 
        WHERE status = 'falhou' 
        AND tentativas < 5
        ORDER BY created_at DESC 
        LIMIT limite
    );
    
    GET DIAGNOSTICS tarefas_reprocessadas = ROW_COUNT;
    
    -- Log do reprocessamento
    INSERT INTO public.fila_de_tarefas (tipo_tarefa, payload)
    VALUES (
        'log_sistema',
        jsonb_build_object(
            'evento', 'reprocessamento_tarefas_falhadas',
            'timestamp', NOW(),
            'tarefas_reprocessadas', tarefas_reprocessadas,
            'limite', limite
        )
    );
    
    RETURN jsonb_build_object(
        'status', 'sucesso',
        'tarefas_reprocessadas', tarefas_reprocessadas,
        'timestamp', NOW()
    );
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'status', 'erro',
            'erro', SQLERRM,
            'timestamp', NOW()
        );
END;
$function$;

-- Função executar_testes_sistema
CREATE OR REPLACE FUNCTION public.executar_testes_sistema()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
    resultado JSONB := '{}'::JSONB;
    teste_trigger JSONB;
    teste_fila JSONB;
    teste_cron JSONB;
    teste_monitoramento JSONB;
    appointment_id BIGINT;
BEGIN
    -- Inicializar resultado
    resultado := jsonb_build_object(
        'inicio_testes', NOW(),
        'status_geral', 'executando',
        'testes', '{}'
    );
    
    -- TESTE 1: Verificar estrutura da tabela fila_de_tarefas
    BEGIN
        PERFORM 1 FROM public.fila_de_tarefas LIMIT 1;
        
        resultado := jsonb_set(
            resultado, 
            '{testes,teste_estrutura_tabela}',
            jsonb_build_object(
                'status', 'sucesso',
                'descricao', 'Tabela fila_de_tarefas existe e é acessível',
                'timestamp', NOW()
            )
        );
    EXCEPTION
        WHEN OTHERS THEN
            resultado := jsonb_set(
                resultado, 
                '{testes,teste_estrutura_tabela}',
                jsonb_build_object(
                    'status', 'falha',
                    'erro', SQLERRM,
                    'timestamp', NOW()
                )
            );
    END;
    
    -- Finalizar resultado
    resultado := jsonb_set(
        resultado, 
        '{fim_testes}',
        to_jsonb(NOW())
    );
    
    resultado := jsonb_set(
        resultado, 
        '{status_geral}',
        to_jsonb('concluido')
    );
    
    RETURN resultado;
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'status_geral', 'erro_critico',
            'erro', SQLERRM,
            'timestamp', NOW()
        );
END;
$function$;

-- Função limpar_dados_teste
CREATE OR REPLACE FUNCTION public.limpar_dados_teste()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
    tarefas_removidas INTEGER;
    appointments_removidos INTEGER;
BEGIN
    -- Remover tarefas de teste
    DELETE FROM public.fila_de_tarefas 
    WHERE tipo_tarefa = 'teste_sistema'
    OR (payload->>'email' = 'teste@exemplo.com')
    OR (payload->>'email' = 'teste.trigger@exemplo.com');
    
    GET DIAGNOSTICS tarefas_removidas = ROW_COUNT;
    
    -- Remover appointments de teste (se existir)
    BEGIN
        DELETE FROM public.appointments 
        WHERE customer_email IN ('teste@exemplo.com', 'teste.trigger@exemplo.com')
        OR customer_name LIKE '%Teste%';
        
        GET DIAGNOSTICS appointments_removidos = ROW_COUNT;
    EXCEPTION
        WHEN OTHERS THEN
            appointments_removidos := 0;
    END;
    
    RETURN jsonb_build_object(
        'status', 'sucesso',
        'tarefas_removidas', tarefas_removidas,
        'appointments_removidos', appointments_removidos,
        'timestamp', NOW()
    );
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'status', 'erro',
            'erro', SQLERRM,
            'timestamp', NOW()
        );
END;
$function$;

-- Função get_partner_statistics
CREATE OR REPLACE FUNCTION public.get_partner_statistics()
RETURNS TABLE(id bigint, nome_empresa text, status character varying, total_especialidades bigint, total_documentos bigint, documentos_aprovados bigint, total_avaliacoes bigint, media_avaliacoes numeric, created_at timestamp with time zone, aprovado_em timestamp with time zone)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
    SELECT 
        p.id,
        p.nome_empresa,
        p.status,
        COUNT(DISTINCT pe.id) AS total_especialidades,
        COUNT(DISTINCT pd.id) AS total_documentos,
        COUNT(DISTINCT CASE WHEN pd.status::text = 'aprovado'::text THEN pd.id ELSE NULL END) AS documentos_aprovados,
        COUNT(DISTINCT pa.id) AS total_avaliacoes,
        ROUND(AVG(pa.nota_geral), 2) AS media_avaliacoes,
        p.created_at,
        p.aprovado_em
    FROM parceiros p
    LEFT JOIN parceiro_especialidades pe ON p.id = pe.parceiro_id
    LEFT JOIN parceiro_documentos pd ON p.id = pd.parceiro_id  
    LEFT JOIN parceiro_avaliacoes pa ON p.id = pa.parceiro_id
    WHERE p.status = 'aprovado' -- Only show approved partners for security
    GROUP BY p.id, p.nome_empresa, p.status, p.created_at, p.aprovado_em;
$function$;

-- Função handle_new_agendamento_notification
CREATE OR REPLACE FUNCTION public.handle_new_agendamento_notification()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
    parceiro_email TEXT;
    cliente_email TEXT;
    parceiro_nome TEXT;
    cliente_nome TEXT;
    servico_nome TEXT;
    agendamento_data TIMESTAMP;
BEGIN
    parceiro_email := 'ricardojsbueno@gmail.com';
    cliente_email := 'wellington.0301@hotmail.com';
    
    SELECT nome_fantasia INTO parceiro_nome 
    FROM public.parceiros 
    WHERE id = NEW.parceiro_id;
    
    IF parceiro_nome IS NULL THEN
        parceiro_nome := 'Oficina Teste';
    END IF;
    
    cliente_nome := 'Cliente Teste Sistema';
    
    SELECT name INTO servico_nome 
    FROM public.services 
    WHERE id = NEW.service_id;
    
    IF servico_nome IS NULL THEN
        servico_nome := 'Serviço de Teste';
    END IF;
    
    agendamento_data := COALESCE(NEW.date::timestamp + NEW.time::interval, NOW());
    
    INSERT INTO public.fila_de_tarefas (tipo_tarefa, payload)
    VALUES (
        'notificar_parceiro_novo_agendamento',
        jsonb_build_object(
            'agendamento_id', NEW.id,
            'email_destinatario', parceiro_email,
            'parceiro_nome', parceiro_nome,
            'cliente_nome', cliente_nome,
            'servico_nome', servico_nome,
            'data_agendamento', agendamento_data,
            'template_type', 'novo_agendamento_parceiro'
        )
    );
    
    INSERT INTO public.fila_de_tarefas (tipo_tarefa, payload)
    VALUES (
        'enviar_email_confirmacao_cliente',
        jsonb_build_object(
            'agendamento_id', NEW.id,
            'email_destinatario', cliente_email,
            'cliente_nome', cliente_nome,
            'parceiro_nome', parceiro_nome,
            'servico_nome', servico_nome,
            'data_agendamento', agendamento_data,
            'template_type', 'confirmacao_agendamento_cliente'
        )
    );
    
    RETURN NEW;
END;
$function$;

-- Função handle_new_user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
    INSERT INTO public.usuarios (id, email, nome, email_verificado)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'nome', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        NEW.email_confirmed_at IS NOT NULL
    )
    ON CONFLICT (id) DO UPDATE SET
        email_verificado = (NEW.email_confirmed_at IS NOT NULL),
        updated_at = NOW();
    RETURN NEW;
END;
$function$;

-- Log final da correção de segurança
INSERT INTO public.fila_de_tarefas (tipo_tarefa, payload)
VALUES (
  'security_fix_final',
  jsonb_build_object(
    'fase', 'FASE_1_SEGURANCA_COMPLETA',
    'functions_fixed_final_batch', 9,
    'total_functions_secured', 30,
    'status', 'ALL_SECURITY_FUNCTIONS_FIXED',
    'timestamp', NOW(),
    'next_action', 'Autenticação desabilitada temporariamente - pronto para desenvolvimento'
  )
);