CREATE TABLE users (
  id UUID PRIMARY KEY,
  daycare_id UUID REFERENCES daycares(id) ON DELETE SET NULL,
  role user_role NOT NULL DEFAULT 'parent',
  status user_status NOT NULL DEFAULT 'active',
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  notify_on_post BOOLEAN NOT NULL DEFAULT true,
  daily_summary_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE users IS 'Perfil de aplicación vinculado a Supabase Auth. Padres y staff comparten tabla.';
COMMENT ON COLUMN users.id IS 'UUID de Supabase Auth (auth.users). FK con CASCADE DELETE.';
COMMENT ON COLUMN users.daycare_id IS 'Guardería a la que pertenece el usuario';
COMMENT ON COLUMN users.role IS 'Rol: staff, parent o admin';
COMMENT ON COLUMN users.status IS 'Estado: pending (pre-signup) o active';
COMMENT ON COLUMN users.full_name IS 'Nombre completo del usuario';
COMMENT ON COLUMN users.avatar_url IS 'URL del avatar (nullable)';
COMMENT ON COLUMN users.notify_on_post IS 'Recibe notificaciones cuando publican';
COMMENT ON COLUMN users.daily_summary_enabled IS 'Recibe resumen diario a las 19:00';
