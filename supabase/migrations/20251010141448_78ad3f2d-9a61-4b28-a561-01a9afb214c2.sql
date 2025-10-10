-- ====================================
-- MÓDULO: BIBLIOTECA DE IMAGENS
-- Versão: 1.0.0
-- Data: 2025-10-10
-- ====================================

-- ====================================
-- TABELA: image_collections
-- Organiza imagens em coleções/álbuns
-- ====================================
CREATE TABLE image_collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  
  name TEXT NOT NULL,
  description TEXT,
  cover_image_id UUID,
  
  -- Metadata
  image_count INTEGER DEFAULT 0,
  total_size INTEGER DEFAULT 0,
  
  -- Controle
  is_public BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_collections_user ON image_collections(user_id);

-- ====================================
-- TABELA: image_library
-- Armazena todas as imagens da biblioteca
-- ====================================
CREATE TABLE image_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  
  -- Informações da Imagem
  title TEXT NOT NULL,
  description TEXT,
  alt_text TEXT,
  
  -- Armazenamento
  storage_type TEXT NOT NULL CHECK (storage_type IN ('upload', 'url')),
  file_path TEXT,
  external_url TEXT,
  thumbnail_url TEXT,
  
  -- Metadata
  file_size INTEGER,
  file_type TEXT,
  width INTEGER,
  height INTEGER,
  dominant_colors JSONB,
  
  -- Organização
  category TEXT CHECK (category IN ('veiculos', 'pecas', 'servicos', 'anuncios', 'outros')),
  tags TEXT[] DEFAULT '{}',
  collection_id UUID REFERENCES image_collections(id) ON DELETE SET NULL,
  
  -- Controle
  is_favorite BOOLEAN DEFAULT false,
  is_public BOOLEAN DEFAULT false,
  usage_count INTEGER DEFAULT 0,
  last_used_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Validação
  CONSTRAINT valid_storage CHECK (
    (storage_type = 'upload' AND file_path IS NOT NULL) OR
    (storage_type = 'url' AND external_url IS NOT NULL)
  )
);

-- Índices para performance
CREATE INDEX idx_image_library_user ON image_library(user_id);
CREATE INDEX idx_image_library_category ON image_library(category);
CREATE INDEX idx_image_library_tags ON image_library USING GIN(tags);
CREATE INDEX idx_image_library_created ON image_library(created_at DESC);
CREATE INDEX idx_image_library_collection ON image_library(collection_id);

-- ====================================
-- TABELA: image_templates
-- Templates pré-configurados para anúncios
-- ====================================
CREATE TABLE image_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  
  name TEXT NOT NULL,
  description TEXT,
  category TEXT CHECK (category IN ('olx', 'facebook', 'instagram', 'whatsapp', 'custom')),
  
  -- Template Data (JSON com estrutura do template)
  template_data JSONB NOT NULL,
  
  preview_image TEXT,
  is_favorite BOOLEAN DEFAULT false,
  usage_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_templates_user ON image_templates(user_id);
CREATE INDEX idx_templates_category ON image_templates(category);

-- ====================================
-- TABELA: image_usage_log
-- Rastreia onde e quando cada imagem foi usada
-- ====================================
CREATE TABLE image_usage_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_id UUID REFERENCES image_library(id) ON DELETE CASCADE NOT NULL,
  user_id UUID NOT NULL,
  
  -- Onde foi usado
  usage_context TEXT NOT NULL CHECK (usage_context IN ('ad', 'email', 'whatsapp', 'report', 'service_order')),
  reference_id UUID,
  
  used_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_usage_image ON image_usage_log(image_id);
CREATE INDEX idx_usage_user ON image_usage_log(user_id);

-- ====================================
-- ROW LEVEL SECURITY POLICIES
-- ====================================

-- RLS para image_library
ALTER TABLE image_library ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own images or public images"
  ON image_library FOR SELECT
  USING (
    (user_id)::text = auth.uid()::text OR 
    is_public = true
  );

CREATE POLICY "Users can insert their own images"
  ON image_library FOR INSERT
  WITH CHECK ((user_id)::text = auth.uid()::text);

CREATE POLICY "Users can update their own images"
  ON image_library FOR UPDATE
  USING ((user_id)::text = auth.uid()::text);

CREATE POLICY "Users can delete their own images"
  ON image_library FOR DELETE
  USING ((user_id)::text = auth.uid()::text);

-- RLS para image_collections
ALTER TABLE image_collections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own collections or public collections"
  ON image_collections FOR SELECT
  USING (
    (user_id)::text = auth.uid()::text OR 
    is_public = true
  );

CREATE POLICY "Users can insert their own collections"
  ON image_collections FOR INSERT
  WITH CHECK ((user_id)::text = auth.uid()::text);

CREATE POLICY "Users can update their own collections"
  ON image_collections FOR UPDATE
  USING ((user_id)::text = auth.uid()::text);

CREATE POLICY "Users can delete their own collections"
  ON image_collections FOR DELETE
  USING ((user_id)::text = auth.uid()::text);

-- RLS para image_templates
ALTER TABLE image_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view templates"
  ON image_templates FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own templates"
  ON image_templates FOR INSERT
  WITH CHECK ((user_id)::text = auth.uid()::text);

CREATE POLICY "Users can update their own templates"
  ON image_templates FOR UPDATE
  USING ((user_id)::text = auth.uid()::text);

CREATE POLICY "Users can delete their own templates"
  ON image_templates FOR DELETE
  USING ((user_id)::text = auth.uid()::text);

-- RLS para image_usage_log
ALTER TABLE image_usage_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own usage logs"
  ON image_usage_log FOR SELECT
  USING ((user_id)::text = auth.uid()::text);

CREATE POLICY "Users can insert their own usage logs"
  ON image_usage_log FOR INSERT
  WITH CHECK ((user_id)::text = auth.uid()::text);

-- ====================================
-- FUNÇÕES UTILITÁRIAS
-- ====================================

-- Função para atualizar contador de uso de imagem
CREATE OR REPLACE FUNCTION increment_image_usage(image_uuid UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE image_library
  SET 
    usage_count = usage_count + 1,
    last_used_at = NOW()
  WHERE id = image_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para atualizar contador de imagens em coleção
CREATE OR REPLACE FUNCTION update_collection_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.collection_id IS NOT NULL THEN
    UPDATE image_collections
    SET image_count = image_count + 1
    WHERE id = NEW.collection_id;
  ELSIF TG_OP = 'DELETE' AND OLD.collection_id IS NOT NULL THEN
    UPDATE image_collections
    SET image_count = image_count - 1
    WHERE id = OLD.collection_id;
  ELSIF TG_OP = 'UPDATE' THEN
    -- Se mudou de coleção
    IF OLD.collection_id IS DISTINCT FROM NEW.collection_id THEN
      IF OLD.collection_id IS NOT NULL THEN
        UPDATE image_collections
        SET image_count = image_count - 1
        WHERE id = OLD.collection_id;
      END IF;
      IF NEW.collection_id IS NOT NULL THEN
        UPDATE image_collections
        SET image_count = image_count + 1
        WHERE id = NEW.collection_id;
      END IF;
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER collection_counter_trigger
AFTER INSERT OR UPDATE OR DELETE ON image_library
FOR EACH ROW
EXECUTE FUNCTION update_collection_counts();

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_image_library_updated_at
BEFORE UPDATE ON image_library
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_image_collections_updated_at
BEFORE UPDATE ON image_collections
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ====================================
-- STORAGE BUCKET CONFIGURATION
-- ====================================

-- Criar bucket para biblioteca de imagens
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'image-library',
  'image-library',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Policies do Storage
CREATE POLICY "Users can upload their own images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'image-library' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Anyone can view images in image-library"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'image-library');

CREATE POLICY "Users can update their own images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'image-library' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'image-library' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );