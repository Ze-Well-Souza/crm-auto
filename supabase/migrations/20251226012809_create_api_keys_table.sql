/*
  # Criar Tabela de API Keys

  1. Nova Tabela
    - `crm_api_keys`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key para auth.users)
      - `name` (text) - Nome descritivo da chave
      - `key_hash` (text) - Hash bcrypt da API key
      - `key_preview` (text) - Últimos 8 caracteres para preview
      - `permissions` (jsonb) - Permissões granulares {read: [], write: [], delete: []}
      - `rate_limit_per_minute` (integer) - Limite de requests por minuto
      - `rate_limit_per_day` (integer) - Limite de requests por dia
      - `is_active` (boolean) - Status ativo/inativo
      - `last_used_at` (timestamptz) - Última vez que foi usada
      - `expires_at` (timestamptz) - Data de expiração (opcional)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  
  2. Security
    - Enable RLS
    - Policy: Usuários podem ver apenas suas próprias chaves
    - Policy: Usuários podem criar chaves
    - Policy: Usuários podem atualizar/deletar suas chaves
    - Policy: Admins podem ver todas as chaves
  
  3. Indexes
    - Index em `user_id` para queries rápidas
    - Index em `key_hash` para autenticação rápida
    - Index em `is_active` para filtros
*/

-- Criar tabela de API Keys
CREATE TABLE IF NOT EXISTS crm_api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  key_hash text NOT NULL UNIQUE,
  key_preview text NOT NULL,
  permissions jsonb DEFAULT '{"read": ["*"], "write": [], "delete": []}'::jsonb,
  rate_limit_per_minute integer DEFAULT 60,
  rate_limit_per_day integer DEFAULT 10000,
  is_active boolean DEFAULT true,
  last_used_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE crm_api_keys ENABLE ROW LEVEL SECURITY;

-- Policy: Usuários podem ver suas próprias chaves
CREATE POLICY "Users can view own API keys"
  ON crm_api_keys
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Admins podem ver todas as chaves
CREATE POLICY "Admins can view all API keys"
  ON crm_api_keys
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Policy: Usuários podem criar suas chaves
CREATE POLICY "Users can create own API keys"
  ON crm_api_keys
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Usuários podem atualizar suas chaves
CREATE POLICY "Users can update own API keys"
  ON crm_api_keys
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Usuários podem deletar suas chaves
CREATE POLICY "Users can delete own API keys"
  ON crm_api_keys
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Indexes para performance
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON crm_api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_key_hash ON crm_api_keys(key_hash);
CREATE INDEX IF NOT EXISTS idx_api_keys_is_active ON crm_api_keys(is_active);
CREATE INDEX IF NOT EXISTS idx_api_keys_expires_at ON crm_api_keys(expires_at) WHERE expires_at IS NOT NULL;

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_api_keys_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_api_keys_updated_at
  BEFORE UPDATE ON crm_api_keys
  FOR EACH ROW
  EXECUTE FUNCTION update_api_keys_updated_at();