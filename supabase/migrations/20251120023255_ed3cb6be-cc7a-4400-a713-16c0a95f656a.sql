-- Criar bucket de avatares
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- RLS para avatares - Qualquer pessoa pode ver
CREATE POLICY "Avatares são públicos"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- Usuários podem fazer upload do próprio avatar
CREATE POLICY "Usuários podem fazer upload do próprio avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Usuários podem atualizar o próprio avatar
CREATE POLICY "Usuários podem atualizar o próprio avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Usuários podem deletar o próprio avatar
CREATE POLICY "Usuários podem deletar o próprio avatar"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);