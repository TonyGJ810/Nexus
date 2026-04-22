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

5. **Environment Variables (obligatorias para auth y datos):** antes de desplegar, añade:
   - `NEXT_PUBLIC_SUPABASE_URL` → URL de tu proyecto Supabase (ej. `https://xxxx.supabase.co`).
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` → Clave anónima (pública) de Supabase (Project Settings → API).  
   Si no están definidas, la app puede cargar pero login y datos no funcionarán. Si ves en consola "supabaseUrl is required", añade estas variables en **Settings → Environment Variables** y haz un **Redeploy** (las `NEXT_PUBLIC_*` se inyectan en el build).

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

## CI: imagen Docker y GitHub Actions

El workflow [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml) construye la imagen con argumentos de build:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Deben existir como **Repository secrets** en GitHub: el repositorio → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**. Usa exactamente esos nombres (coinciden con `${{ secrets.… }}` en el workflow).

Si rotas las claves en Supabase, actualiza ambos secretos y vuelve a generar la imagen (por ejemplo un `push` a `main` que toque `nexus/**` o el workflow, o un **Run workflow** manual). Si no, el bundle del cliente seguirá llevando valores antiguos.

---

## Tras rotar o sustituir API keys (Supabase)

1. **Local:** mantén todo en **`nexus/.env.local`** (Next solo carga env desde la carpeta `nexus/`). Incluye `NEXT_PUBLIC_*` y, si quieres SSR coherente, `SUPABASE_URL` / `SUPABASE_ANON_KEY` con los mismos valores del proyecto.
2. **Kubernetes:** actualiza **`helm/nexus/values-local.yaml`** (no se sube a Git) con la misma URL y anon key; vuelve a desplegar el chart.
3. **GitHub Actions:** actualiza los dos secretos anteriores y reconstruye la imagen.
4. **Vercel:** **Settings** → **Environment Variables** → mismas `NEXT_PUBLIC_*` en los entornos que uses → **Redeploy**.
5. **Supabase** → **Authentication** → **URL Configuration:** **Site URL** y **Redirect URLs** deben incluir cada origen desde el que los usuarios usan la app (por ejemplo `http://localhost:3000`, la URL de Vercel, o el host del ingress tipo `https://nexus.local`).
6. Comprueba en **Project Settings** → **API** que la **Project URL** y las keys (anon / service_role) corresponden al mismo proyecto que ves en la barra de Supabase.

---

## Resumen rápido

| Dónde        | Qué hacer |
|-------------|-----------|
| GitHub      | Subir código sin `.env` / `.env.local`. |
| GitHub      | Secretos `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` para el workflow Docker. |
| Vercel      | Root Directory = **nexus** (obligatorio para evitar 404). |
| Vercel      | Añadir `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`. |
| Supabase    | (Opcional) Site URL / Redirect URLs con la URL de Vercel. |
