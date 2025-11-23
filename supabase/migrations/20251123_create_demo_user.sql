-- Criar usuário demo para testes
-- Email: admin@oficina.com
-- Senha: 123456

-- Inserir usuário na tabela auth.users
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@oficina.com',
  crypt('123456', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Admin Demo"}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
)
ON CONFLICT (email) DO NOTHING
RETURNING id;

-- Criar perfil para o usuário
INSERT INTO public.profiles (
  user_id,
  full_name,
  email,
  phone,
  role,
  subscription_status,
  subscription_plan_id,
  created_at,
  updated_at
)
SELECT 
  id,
  'Admin Demo',
  'admin@oficina.com',
  '(11) 99999-9999',
  'admin',
  'active',
  (SELECT id FROM public.subscription_plans WHERE name = 'Gratuito' LIMIT 1),
  NOW(),
  NOW()
FROM auth.users
WHERE email = 'admin@oficina.com'
ON CONFLICT (user_id) DO NOTHING;

