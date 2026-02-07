-- ============================================================
-- AÑADIRTE COMO ADMIN (datos de prueba)
-- ============================================================
-- 1. En Supabase: Authentication → Users → crea o elige tu usuario y copia el "User UID".
-- 2. Sustituye 'TU-USER-UID-AQUI' por ese UUID y ejecuta este bloque en SQL Editor.

-- Si ya tienes perfil (te registraste por la app):
UPDATE public.profiles
SET role = 'admin', full_name = 'Admin Nexus'
WHERE id = 'TU-USER-UID-AQUI';

-- Si NO tienes perfil aún (primera vez), usa esto en su lugar:
-- INSERT INTO public.profiles (id, role, full_name)
-- VALUES ('TU-USER-UID-AQUI', 'admin', 'Admin Nexus')
-- ON CONFLICT (id) DO UPDATE SET role = 'admin', full_name = 'Admin Nexus';
