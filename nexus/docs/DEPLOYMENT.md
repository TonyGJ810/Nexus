# Desplegar Nexus en Vercel (desde GitHub)

## 1. Subir el proyecto a GitHub

1. Crea un repositorio nuevo en [GitHub](https://github.com/new) (por ejemplo `nexus` o `nexus-tickets`).
2. En la carpeta del proyecto (raíz del repo, donde está la carpeta `nexus`), ejecuta:

```bash
git init
git add .
git commit -m "Initial commit: Nexus - venta de boletos"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/TU-REPO.git
git push -u origin main
```

**Importante:** No subas archivos `.env` ni `.env.local`. El `.gitignore` ya los excluye. Las variables se configuran en Vercel.

---

## 2. Conectar el repo con Vercel

1. Entra en [vercel.com](https://vercel.com) e inicia sesión (con tu cuenta de GitHub si quieres).
2. **Add New** → **Project**.
3. Importa el repositorio de GitHub que acabas de subir.
4. **Configuración del proyecto:**
   - **Root Directory:** haz clic en "Edit" y escribe **`nexus`** (la app Next.js está dentro de esa carpeta).
   - **Framework Preset:** Next.js (se detecta solo).
   - **Build Command:** `npm run build` (por defecto).
   - **Output Directory:** se deja por defecto.
   - **Install Command:** `npm install` (por defecto).

5. **Environment Variables:** antes de desplegar, añade:
   - `NEXT_PUBLIC_SUPABASE_URL` → URL de tu proyecto Supabase (ej. `https://xxxx.supabase.co`).
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` → Clave anónima ( pública ) de Supabase (Project Settings → API).

6. Pulsa **Deploy**.

---

## 3. Después del despliegue

- Vercel te dará una URL (ej. `nexus-xxx.vercel.app`). La app usará esa URL contra tu Supabase.
- En **Supabase** → Authentication → URL Configuration, puedes añadir la URL de Vercel en **Site URL** y en **Redirect URLs** si usas redirects de auth.
- Para ver logs o redeployar: en el dashboard de Vercel, tu proyecto → **Deployments** o **Logs**.

---

## Si ves "404 NOT_FOUND" en Vercel

Casi siempre es porque **Vercel está construyendo desde la raíz del repo** en lugar de la carpeta donde está la app.

1. En Vercel: **tu proyecto** → **Settings** → **General**.
2. En **Root Directory** haz clic en **Edit**.
3. Escribe **`nexus`** (solo esa carpeta, sin barra final).
4. Guarda (**Save**).
5. Ve a **Deployments** → en el último despliegue → **⋯** → **Redeploy** (sin cambiar nada).

Tras el nuevo despliegue, la página principal debería cargar. Si sigue fallando, revisa la pestaña **Building** del último deployment por si el build terminó con error.

---

## Resumen rápido

| Dónde        | Qué hacer |
|-------------|-----------|
| GitHub      | Subir código sin `.env` / `.env.local`. |
| Vercel      | Root Directory = **nexus** (obligatorio para evitar 404). |
| Vercel      | Añadir `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`. |
| Supabase    | (Opcional) Site URL / Redirect URLs con la URL de Vercel. |
