/*
  # Criar Tabela de Rate Limiting

  1. Nova Tabela
    - `crm_api_rate_limits`
      - `id` (uuid, primary key)
      - `api_key_id` (uuid, foreign key para crm_api_keys)
      - `endpoint` (text) - Endpoint que foi acessado
      - `window_start` (timestamptz) - Início da janela de tempo
      - `window_type` (text) - 'minute' ou 'day'
      - `request_count` (integer) - Número de requests na janela
      - `created_at` (timestamptz)
  
  2. Nova Tabela de Logs
    - `crm_api_logs`
      - `id` (uuid, primary key)
      - `api_key_id` (uuid)
      - `endpoint` (text)
      - `method` (text) - GET, POST, PUT, DELETE
      - `status_code` (integer)
      - `response_time_ms` (integer)
      - `ip_address` (inet)
      - `user_agent` (text)
      - `error_message` (text)
      - `created_at` (timestamptz)
  
  3. Security
    - Enable RLS
    - Usuários podem ver apenas logs de suas chaves
    - Admins podem ver todos os logs
  
  4. Indexes
    - Index em `api_key_id` e `window_start`
    - Index em `created_at` para queries de histórico
*/

-- Criar tabela de rate limiting
CREATE TABLE IF NOT EXISTS crm_api_rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key_id uuid NOT NULL REFERENCES crm_api_keys(id) ON DELETE CASCADE,
  endpoint text NOT NULL,
  window_start timestamptz NOT NULL,
  window_type text NOT NULL CHECK (window_type IN ('minute', 'day')),
  request_count integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  UNIQUE(api_key_id, endpoint, window_start, window_type)
);

-- Criar tabela de logs de API
CREATE TABLE IF NOT EXISTS crm_api_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key_id uuid REFERENCES crm_api_keys(id) ON DELETE SET NULL,
  endpoint text NOT NULL,
  method text NOT NULL CHECK (method IN ('GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS')),
  status_code integer NOT NULL,
  response_time_ms integer,
  ip_address inet,
  user_agent text,
  request_body jsonb,
  response_body jsonb,
  error_message text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS para rate_limits
ALTER TABLE crm_api_rate_limits ENABLE ROW LEVEL SECURITY;

-- Policy: Usuários podem ver rate limits de suas chaves
CREATE POLICY "Users can view own rate limits"
  ON crm_api_rate_limits
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM crm_api_keys
      WHERE crm_api_keys.id = api_key_id
      AND crm_api_keys.user_id = auth.uid()
    )
  );

-- Policy: Sistema pode inserir/atualizar rate limits (service_role)
CREATE POLICY "Service role can manage rate limits"
  ON crm_api_rate_limits
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Enable RLS para logs
ALTER TABLE crm_api_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Usuários podem ver logs de suas chaves
CREATE POLICY "Users can view own API logs"
  ON crm_api_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM crm_api_keys
      WHERE crm_api_keys.id = api_key_id
      AND crm_api_keys.user_id = auth.uid()
    )
  );

-- Policy: Admins podem ver todos os logs
CREATE POLICY "Admins can view all API logs"
  ON crm_api_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Policy: Sistema pode inserir logs (service_role)
CREATE POLICY "Service role can create logs"
  ON crm_api_logs
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Indexes para performance
CREATE INDEX IF NOT EXISTS idx_rate_limits_api_key_window ON crm_api_rate_limits(api_key_id, window_start, window_type);
CREATE INDEX IF NOT EXISTS idx_rate_limits_created_at ON crm_api_rate_limits(created_at);
CREATE INDEX IF NOT EXISTS idx_api_logs_api_key_id ON crm_api_logs(api_key_id);
CREATE INDEX IF NOT EXISTS idx_api_logs_created_at ON crm_api_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_api_logs_endpoint ON crm_api_logs(endpoint);

-- Função para limpar logs antigos (execução manual ou scheduled)
CREATE OR REPLACE FUNCTION cleanup_old_api_logs(days_to_keep integer DEFAULT 90)
RETURNS integer AS $$
DECLARE
  deleted_count integer;
BEGIN
  DELETE FROM crm_api_logs
  WHERE created_at < now() - (days_to_keep || ' days')::interval;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para limpar rate limits antigos
CREATE OR REPLACE FUNCTION cleanup_old_rate_limits(hours_to_keep integer DEFAULT 48)
RETURNS integer AS $$
DECLARE
  deleted_count integer;
BEGIN
  DELETE FROM crm_api_rate_limits
  WHERE created_at < now() - (hours_to_keep || ' hours')::interval;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;