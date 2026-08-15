CREATE TYPE child_status AS ENUM ('active', 'archived');

CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  daycare_id UUID NOT NULL REFERENCES daycares(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE rooms IS 'Salas de la guardería (Soles, Estrellas, Lunas, etc.)';

CREATE TABLE children (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES rooms(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  birth_date DATE NOT NULL,
  enrolled_at DATE NOT NULL,
  medical_notes TEXT NOT NULL DEFAULT '',
  allergy_tags TEXT[] NOT NULL DEFAULT '{}',
  photo_consent BOOLEAN NOT NULL DEFAULT true,
  status child_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE children IS 'Niños inscritos en la guardería';

CREATE INDEX idx_rooms_daycare_id ON rooms(daycare_id);
CREATE INDEX idx_children_room_id ON children(room_id);
CREATE INDEX idx_children_status ON children(status);

ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE children ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view rooms of their daycare"
  ON rooms FOR SELECT
  TO authenticated
  USING (daycare_id = (SELECT daycare_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY "Users can view children in rooms of their daycare"
  ON children FOR SELECT
  TO authenticated
  USING (room_id IN (SELECT id FROM public.rooms WHERE daycare_id = (SELECT daycare_id FROM public.users WHERE id = auth.uid())));

CREATE POLICY "Users can insert children in rooms of their daycare"
  ON children FOR INSERT
  TO authenticated
  WITH CHECK (room_id IN (SELECT id FROM public.rooms WHERE daycare_id = (SELECT daycare_id FROM public.users WHERE id = auth.uid())));

CREATE POLICY "Users can update children in rooms of their daycare"
  ON children FOR UPDATE
  TO authenticated
  USING (room_id IN (SELECT id FROM public.rooms WHERE daycare_id = (SELECT daycare_id FROM public.users WHERE id = auth.uid())))
  WITH CHECK (room_id IN (SELECT id FROM public.rooms WHERE daycare_id = (SELECT daycare_id FROM public.users WHERE id = auth.uid())));
