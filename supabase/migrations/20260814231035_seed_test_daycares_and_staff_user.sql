INSERT INTO daycares (id, name) VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Guardería Sala Soles'),
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Guardería Sala Estrellas'),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'Guardería Sala Lunas'),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'Guardería Sala Nubes'),
  ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'Guardería Sala Colores');

INSERT INTO users (id, daycare_id, role, status, full_name)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'staff',
  'active',
  'Staff de Prueba'
);
