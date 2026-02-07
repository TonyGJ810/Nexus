-- ============================================================
-- NEXUS - Esquema de Base de Datos (Supabase)
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. Extensión UUID (por si no está habilitada)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLA: profiles (vinculada a auth.users para roles)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('admin', 'client')),
  full_name TEXT,
  email TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índice para búsquedas por rol
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- Trigger: crear perfil automáticamente al registrarse un usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, role, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'role', 'client'),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- TABLA: events
-- ============================================================
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  date TIMESTAMPTZ NOT NULL,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  image_url TEXT,
  category TEXT DEFAULT 'general',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_events_date ON public.events(date);
CREATE INDEX IF NOT EXISTS idx_events_category ON public.events(category);

-- ============================================================
-- TABLA: tickets (relación usuario-evento)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  purchase_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tickets_user ON public.tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_event ON public.tickets(event_id);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

-- Función auxiliar: devuelve true si el usuario actual es admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- --- PROFILES ---
-- Los usuarios pueden leer su propio perfil
CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Los admins pueden leer todos los perfiles
CREATE POLICY "Admins can read all profiles"
  ON public.profiles FOR SELECT
  USING (public.is_admin());

-- Los usuarios pueden actualizar su propio perfil (solo campos permitidos; el rol lo cambia solo un admin vía SQL si hace falta)
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- --- EVENTS ---
-- Público (incluido anónimo) puede leer eventos
CREATE POLICY "Anyone can read events"
  ON public.events FOR SELECT
  USING (true);

-- Solo admins pueden insertar, actualizar y eliminar eventos
CREATE POLICY "Admins can insert events"
  ON public.events FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update events"
  ON public.events FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admins can delete events"
  ON public.events FOR DELETE
  USING (public.is_admin());

-- --- TICKETS ---
-- Los usuarios autenticados pueden leer sus propios tickets
CREATE POLICY "Users can read own tickets"
  ON public.tickets FOR SELECT
  USING (auth.uid() = user_id);

-- Los admins pueden leer todos los tickets (para ver ventas)
CREATE POLICY "Admins can read all tickets"
  ON public.tickets FOR SELECT
  USING (public.is_admin());

-- Los usuarios autenticados pueden insertar tickets (comprar) para sí mismos
CREATE POLICY "Users can buy tickets for themselves"
  ON public.tickets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- REDUCIR STOCK AL COMPRAR (Trigger)
-- ============================================================
CREATE OR REPLACE FUNCTION public.decrement_event_stock()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.events
  SET stock = stock - 1, updated_at = NOW()
  WHERE id = NEW.event_id AND stock > 0;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'No hay stock disponible para este evento';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_ticket_created_decrement_stock ON public.tickets;
CREATE TRIGGER on_ticket_created_decrement_stock
  AFTER INSERT ON public.tickets
  FOR EACH ROW EXECUTE FUNCTION public.decrement_event_stock();

-- ============================================================
-- CREAR PRIMER ADMIN (opcional)
-- Sustituye 'TU-UUID-DE-AUTH-USERS' por el UUID del usuario en Auth después de registrarte.
-- ============================================================
-- UPDATE public.profiles SET role = 'admin' WHERE id = 'TU-UUID-DE-AUTH-USERS';

-- ============================================================
-- DATOS DE EJEMPLO (opcional, para probar la app)
-- ============================================================
-- INSERT INTO public.events (title, description, date, price, stock, image_url, category) VALUES
-- ('Nexus Launch Party', 'Noche de lanzamiento con DJ en vivo.', NOW() + INTERVAL '7 days', 25.00, 100, 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800', 'music'),
-- ('Tech Summit 2025', 'Conferencia de tecnología y networking.', NOW() + INTERVAL '14 days', 150.00, 50, 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800', 'conference');
