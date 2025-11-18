-- Criar função para enviar email de boas-vindas após criar perfil
CREATE OR REPLACE FUNCTION public.send_welcome_email()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'pg_temp'
AS $$
BEGIN
  -- Chamar a edge function send-welcome-email de forma assíncrona
  -- usando pg_net (necessário habilitar extensão)
  PERFORM net.http_post(
    url := 'https://lfsoxururyqknnjhrzxu.supabase.co/functions/v1/send-welcome-email',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('request.jwt.claims', true)::json->>'token'
    ),
    body := jsonb_build_object('userId', NEW.user_id)
  );
  
  RETURN NEW;
END;
$$;

-- Criar trigger para enviar email de boas-vindas quando perfil for criado
DROP TRIGGER IF EXISTS on_profile_created_send_welcome ON public.profiles;
CREATE TRIGGER on_profile_created_send_welcome
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.send_welcome_email();

-- Comentário explicativo
COMMENT ON FUNCTION public.send_welcome_email() IS 
'Envia email de boas-vindas automaticamente quando um novo perfil de usuário é criado';

COMMENT ON TRIGGER on_profile_created_send_welcome ON public.profiles IS 
'Dispara envio de email de boas-vindas após criação de perfil';