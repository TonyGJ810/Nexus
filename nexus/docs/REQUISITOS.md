# NEXUS – Requisitos funcionales y no funcionales

**Proyecto:** Plataforma de venta de boletos para eventos premium  
**Versión del documento:** 1.0  
**Stack:** Next.js (App Router), TypeScript, Tailwind CSS, Supabase (Auth + PostgreSQL)

---

## 1. Requisitos funcionales

Definición de las funciones principales que realiza la aplicación.

### 1.1 Gestión de usuarios y autenticación
- **RF-01** La aplicación debe permitir el registro de nuevos usuarios (email y contraseña).
- **RF-02** La aplicación debe permitir el inicio de sesión con email y contraseña.
- **RF-03** La aplicación debe permitir cerrar sesión.
- **RF-04** La aplicación debe crear automáticamente un perfil asociado al usuario en el registro (rol por defecto: cliente).

### 1.2 Catálogo de eventos (público)
- **RF-05** La aplicación debe mostrar un listado de eventos disponibles en la página principal.
- **RF-06** La aplicación debe mostrar un evento destacado (hero) en la parte superior de la página principal.
- **RF-07** La aplicación debe permitir filtrar eventos por categoría (music, conference, party, sports, general, todos).
- **RF-08** La aplicación debe mostrar la página de detalle de un evento (título, descripción, fecha, precio, stock, imagen, categoría).
- **RF-09** Cualquier visitante (incluido anónimo) puede consultar el catálogo de eventos sin iniciar sesión.

### 1.3 Carrito y compra (cliente)
- **RF-10** La aplicación debe permitir añadir boletos al carrito desde la tarjeta del evento o desde la página de detalle (botón “Comprar boleto”).
- **RF-11** La aplicación debe mostrar un carrito con los ítems añadidos, cantidad por evento y total a pagar.
- **RF-12** La aplicación debe permitir modificar la cantidad de boletos por evento en el carrito (selector 1–10).
- **RF-13** La aplicación debe permitir eliminar ítems del carrito.
- **RF-14** La aplicación debe persistir el carrito en el navegador (localStorage) entre sesiones.
- **RF-15** La aplicación debe permitir “Finalizar compra” desde el carrito: solo si el usuario está autenticado se registran los tickets en base de datos y se descuenta el stock.
- **RF-16** Al comprar, la aplicación debe insertar un registro por boleto en la tabla `tickets` y decrementar el stock del evento (trigger en BD).

### 1.4 Panel de administración (admin)
- **RF-17** Solo los usuarios con rol `admin` pueden acceder al panel de administración (`/admin`).
- **RF-18** El admin debe poder crear eventos (título, descripción, fecha, precio, stock, imagen, categoría) con validación en formulario.
- **RF-19** El admin debe poder editar eventos existentes (mismo conjunto de campos).
- **RF-20** El admin debe poder eliminar eventos.
- **RF-21** El admin debe poder ver el total de ventas (número de registros en la tabla `tickets`).

### 1.5 Navegación y experiencia
- **RF-22** La aplicación debe ofrecer una barra de navegación fija con enlaces a Eventos, Admin, carrito e inicio de sesión / usuario actual.
- **RF-23** La aplicación debe mostrar notificaciones (toast) para éxito o error en acciones como registro, compra o añadir al carrito.

---

## 2. Requisitos no funcionales

Criterios de rendimiento, seguridad y usabilidad.

### 2.1 Rendimiento
- **RNF-01** Las páginas deben cargarse en un tiempo razonable (< 3 s en condiciones normales de red).
- **RNF-02** Las consultas de listado de eventos y detalle deben aprovechar índices en base de datos (fecha, categoría, id).
- **RNF-03** Las transiciones entre páginas deben ser fluidas (animación ligera con Framer Motion).
- **RNF-04** El estado del carrito debe actualizarse de forma inmediata en la UI sin recarga completa de página.

### 2.2 Seguridad
- **RNF-05** Las contraseñas deben ser gestionadas por Supabase Auth (hash, nunca almacenadas en texto plano).
- **RNF-06** El acceso a datos debe estar gobernado por Row Level Security (RLS) en Supabase: solo los permisos definidos por rol se aplican.
- **RNF-07** Las variables sensibles (URL y clave anónima de Supabase) deben estar en variables de entorno y no en el código fuente.
- **RNF-08** Las operaciones de escritura en `events` y `tickets` deben estar restringidas según el rol (admin para eventos; usuario autenticado para sus propios tickets).

### 2.3 Usabilidad
- **RNF-09** La interfaz debe ser responsive (escritorio y móvil).
- **RNF-10** La aplicación debe usar un diseño coherente (tema oscuro, acentos cyan–violeta, tipografía Space Grotesk / Inter).
- **RNF-11** Los botones de acción principal deben ser claramente identificables y no parecer deshabilitados cuando están disponibles.
- **RNF-12** Los mensajes de error o éxito deben mostrarse de forma visible (toast) y en español.

---

## 3. Usuarios y roles

Identificación de tipos de usuarios y permisos.

| Rol        | Descripción                          | Permisos principales |
|-----------|---------------------------------------|----------------------|
| **Cliente** | Usuario registrado que compra boletos | Ver eventos; filtrar por categoría; añadir al carrito; finalizar compra (insertar tickets propios); ver y editar su propio perfil. No puede acceder a `/admin` ni modificar eventos. |
| **Admin**   | Administrador de la plataforma         | Todo lo del cliente; acceso a `/admin`; crear, editar y eliminar eventos; ver ventas totales (conteo de tickets). No puede editar el rol de otros usuarios desde la app (solo vía SQL en Supabase si se requiere). |
| **Anónimo** | Visitante no autenticado              | Ver listado y detalle de eventos; añadir al carrito. No puede finalizar compra (se le indica iniciar sesión). |

### Resumen de permisos por recurso
- **Eventos (lectura):** Público (todos).
- **Eventos (crear/editar/eliminar):** Solo Admin.
- **Tickets (crear):** Usuario autenticado, solo para su propio `user_id`.
- **Tickets (lectura):** Usuario ve solo los suyos; Admin ve todos (para ventas totales).
- **Perfiles (lectura/edición):** Cada usuario solo el suyo; Admin puede leer todos.

---

## 4. Restricciones del sistema

Limitaciones técnicas y operativas.

### 4.1 Técnicas
- **RT-01** La aplicación depende de los servicios de Supabase (Auth y PostgreSQL). La no disponibilidad de Supabase afecta login, registro y persistencia de eventos/tickets.
- **RT-02** El frontend está desplegado como aplicación Next.js; requiere soporte para JavaScript en el navegador.
- **RT-03** El carrito se almacena en `localStorage`; si el usuario limpia datos del sitio o usa otro dispositivo/navegador, el carrito no se recupera.
- **RT-04** No se implementa pasarela de pago; la “compra” registra la venta en BD pero no cobro real.
- **RT-05** Las imágenes de eventos se referencian por URL; no hay subida directa a Supabase Storage en la versión actual (se usa `image_url` en `events`).

### 4.2 Operativas
- **RO-01** La asignación del rol Admin se realiza manualmente en Supabase (SQL sobre la tabla `profiles`).
- **RO-02** La confirmación de email está desactivada en Supabase para el flujo actual; los usuarios pueden usar la app sin verificar correo.
- **RO-03** No hay recuperación de contraseña implementada en la UI (dependería de las opciones de Supabase Auth).
- **RO-04** El stock se controla a nivel de base de datos (trigger al insertar ticket); no hay reserva temporal de entradas (por tiempo limitado) antes de pagar.

### 4.3 De negocio / diseño
- **RO-05** Cantidad máxima por evento en el carrito limitada a 10 unidades (selector en la página de carrito).
- **RO-06** Categorías de eventos fijas en código: music, conference, party, sports, general.

---

*Documento generado a partir del estado actual del proyecto Nexus.*
