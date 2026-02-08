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

## Si Vercel no detecta los cambios del repo

1. **Comprueba la rama en Vercel**  
   **Settings** → **Git** → **Production Branch**. Debe ser **main** (o la rama a la que haces `git push`). Si pone otra (por ejemplo `master`), cámbiala a **main** y guarda.

2. **Redeploy manual (solución rápida)**  
   **Deployments** → en el último deployment → **⋯** (tres puntos) → **Redeploy**. Elige **Redeploy with existing Build Cache** si quieres ir más rápido, o sin cache si quieres forzar un build limpio. Así Vercel vuelve a construir con el código actual del repo.

3. **Comprueba que el repo es el correcto**  
   **Settings** → **Git** → **Connected Git Repository**. Debe ser `TonyGJ810/Nexus` (o tu usuario/repo). Si está conectado a otro repo, desconecta y vuelve a importar el correcto.

4. **Permisos de GitHub**  
   Si Vercel no tiene acceso al repo: [vercel.com/account](https://vercel.com/account) → **Integrations** → **GitHub** → comprueba que el repo **Nexus** está autorizado. Si no, edita la integración y marca el repo.

5. **Webhooks**  
   En GitHub: **Tu repo** → **Settings** → **Webhooks**. Debería haber un webhook de Vercel. Si no existe o da error, en Vercel **Settings** → **Git** puedes ver un botón para reconectar; a veces **Disconnect** y volver a **Connect** al repo arregla la detección de pushes.

---

## Si ves "404 NOT_FOUND" al entrar a la página

Esa pantalla es de **Vercel**, no de tu app: significa que no encuentra nada que servir en esa URL.

1. **Root Directory (lo más importante)**  
   **Settings** → **General** → **Root Directory** → **Edit** → escribe **`nexus`** (sin barra) → **Save**.  
   Si aquí está vacío o en otra carpeta, Vercel construye desde la raíz del repo y no encuentra la app Next.js, y al entrar sale 404.

2. **Redeploy después de cambiar Root Directory**  
   **Deployments** → en el último deployment → **⋯** → **Redeploy**.  
   Sin un redeploy, el cambio de Root Directory no se aplica al despliegue actual.

3. **Comprobar la URL que abres**  
   En **Deployments**, el que esté en verde (Ready) tiene un enlace tipo `nexus-xxx.vercel.app`. Abre **ese** enlace (o el dominio que tengas asignado al proyecto). No uses una URL antigua o de otro proyecto.

4. **Si ya tienes Root Directory = nexus**  
   Prueba **Redeploy** del último deployment. A veces un redeploy limpia el estado y la app empieza a servirse bien.

---

## Resumen rápido

| Dónde        | Qué hacer |
|-------------|-----------|
| GitHub      | Subir código sin `.env` / `.env.local`. |
| Vercel      | Root Directory = **nexus** (obligatorio para evitar 404). |
| Vercel      | Añadir `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`. |
| Supabase    | (Opcional) Site URL / Redirect URLs con la URL de Vercel. |
