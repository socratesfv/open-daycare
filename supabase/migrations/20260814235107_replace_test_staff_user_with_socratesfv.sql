DELETE FROM public.users WHERE id = '11111111-1111-1111-1111-111111111111';

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  'authenticated',
  'authenticated',
  'socratesfv@gmail.com',
  crypt('123abc@', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"daycare_id":"a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11","role":"staff","full_name":"Staff de Prueba"}',
  now(), now(),
  '', ''
);

INSERT INTO auth.identities (
  id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  jsonb_build_object('sub', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'email', 'socratesfv@gmail.com'),
  'email',
  now(), now(), now()
);
