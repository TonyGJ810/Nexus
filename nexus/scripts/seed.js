/**
 * Script de seed para Nexus - Carga masiva de events y tickets en Supabase.
 * Lee SUPABASE_URL (o NEXT_PUBLIC_SUPABASE_URL) y SUPABASE_SERVICE_ROLE_KEY desde .env.local o entorno.
 * Carga primero la raíz del repo y luego nexus/.env.local (esta sobrescribe claves repetidas).
 *
 * Ejecutar: npm run seed (desde la carpeta nexus)
 */

import { config } from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const nexusRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(__dirname, "../..");

config({ path: path.join(repoRoot, ".env.local") });
config({ path: path.join(nexusRoot, ".env.local"), override: true });

import { createClient } from "@supabase/supabase-js";
import { faker } from "@faker-js/faker";

const SUPABASE_URL =
  process.env.SUPABASE_URL?.trim() || process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || "";
const FIXED_USER_ID = "ecba6296-40dc-491e-bd3e-efac6fbf0ca8";

const EVENTS_COUNT = 50;
const TICKETS_PER_EVENT_MIN = 100;
const TICKETS_PER_EVENT_MAX = 500;
const TICKETS_BATCH_SIZE = 1000;
const EVENT_STOCK = 100_000;

function log(msg) {
  const ts = new Date().toISOString().slice(11, 23);
  console.log(`[${ts}] ${msg}`);
}

function validateEnv() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error("Error: Faltan variables de entorno.");
    console.error("  SUPABASE_URL / NEXT_PUBLIC_SUPABASE_URL: " + (SUPABASE_URL ? "OK" : "NO DEFINIDA"));
    console.error("  SUPABASE_SERVICE_ROLE_KEY: " + (SUPABASE_SERVICE_ROLE_KEY ? "OK" : "NO DEFINIDA"));
    process.exit(1);
  }
}

function generateEvents(count) {
  const categories = ["music", "conference", "party", "sports", "general"];
  const events = [];
  for (let i = 0; i < count; i++) {
    const city = faker.location.city();
    const address = faker.location.streetAddress();
    events.push({
      title: faker.helpers.arrayElement([
        faker.lorem.words(3),
        `${faker.company.name()} ${faker.helpers.arrayElement(["Summit", "Festival", "Night", "Concert"])}`,
      ]),
      description: `${faker.lorem.paragraphs(2)}\n\nUbicación: ${address}, ${city}.`,
      date: faker.date.future().toISOString(),
      price: parseFloat(faker.commerce.price({ min: 10, max: 500 })),
      stock: EVENT_STOCK,
      image_url: faker.image.url(),
      category: faker.helpers.arrayElement(categories),
    });
  }
  return events;
}

function generateTicketsForEvent(eventId, count) {
  const tickets = [];
  for (let i = 0; i < count; i++) {
    tickets.push({
      user_id: FIXED_USER_ID,
      event_id: eventId,
      purchase_date: faker.date.past().toISOString(),
      status: "confirmed",
    });
  }
  return tickets;
}

async function main() {
  const startTime = Date.now();
  log("Iniciando seed de Nexus...");

  validateEnv();

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  log("Conectado a Supabase.");

  // 1. Generar e insertar eventos
  log(`Generando ${EVENTS_COUNT} eventos (stock: ${EVENT_STOCK} cada uno)...`);
  const events = generateEvents(EVENTS_COUNT);

  const batchSize = 50;
  const eventBatches = [];
  for (let i = 0; i < events.length; i += batchSize) {
    eventBatches.push(events.slice(i, i + batchSize));
  }

  const insertedEventIds = [];
  for (let i = 0; i < eventBatches.length; i++) {
    const batch = eventBatches[i];
    const { data, error } = await supabase.from("events").insert(batch).select("id");
    if (error) {
      console.error("Error insertando eventos:", error.message);
      process.exit(1);
    }
    insertedEventIds.push(...data.map((r) => r.id));
    log(`Insertando eventos: lote ${i + 1}/${eventBatches.length} (${batch.length} registros).`);
  }

  log(`Eventos insertados: ${insertedEventIds.length}.`);

  // 2. Generar tickets por evento (100–500 cada uno)
  const allTickets = [];
  for (const eventId of insertedEventIds) {
    const count = faker.number.int({ min: TICKETS_PER_EVENT_MIN, max: TICKETS_PER_EVENT_MAX });
    allTickets.push(...generateTicketsForEvent(eventId, count));
  }

  log(`Generados ${allTickets.length} tickets. Insertando en lotes de ${TICKETS_BATCH_SIZE}...`);

  let insertedTickets = 0;
  for (let i = 0; i < allTickets.length; i += TICKETS_BATCH_SIZE) {
    const batch = allTickets.slice(i, i + TICKETS_BATCH_SIZE);
    const { error } = await supabase.from("tickets").insert(batch);
    if (error) {
      console.error("Error insertando tickets:", error.message);
      process.exit(1);
    }
    insertedTickets += batch.length;
    const batchNum = Math.floor(i / TICKETS_BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(allTickets.length / TICKETS_BATCH_SIZE);
    log(`Insertando tickets: lote ${batchNum}/${totalBatches} (${batch.length} registros, total: ${insertedTickets}).`);
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
  log("Completado.");
  console.log(`\n--- Resumen ---`);
  console.log(`  Eventos: ${insertedEventIds.length}`);
  console.log(`  Tickets: ${insertedTickets}`);
  console.log(`  Tiempo: ${elapsed}s`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
