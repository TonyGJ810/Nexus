# NEXUS – Boletos para eventos premium

Plataforma de venta de boletos para eventos. Next.js (App Router), TypeScript, Tailwind CSS, Supabase.

## Desarrollo local

```bash
cd nexus
npm install
npm run dev
```

Crea un archivo `.env.local` con (o copia desde `.env.example`):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Desplegar en Vercel

El proyecto está preparado para desplegar desde GitHub en Vercel.

1. Sube el repositorio a GitHub (la raíz del repo es la carpeta que contiene `nexus`).
2. En Vercel, importa el repo y configura **Root Directory** = `nexus`.
3. Añade las variables de entorno de Supabase en Vercel.
4. Despliega.

Instrucciones detalladas: [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)

## Documentación

- [Requisitos funcionales y no funcionales](docs/REQUISITOS.md)
- [Despliegue en Vercel](docs/DEPLOYMENT.md)
