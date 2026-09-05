import { requireAdmin } from "../../_lib/auth.js";
import { assertSameOrigin, error, json, mapProject, sanitizeProjectInput } from "../../_lib/http.js";

export async function onRequestGet(context) {
  try {
    const result = await context.env.DB.prepare(
      `SELECT id, title, description, link, image_key, sort_order, created_at, updated_at
       FROM projects
       ORDER BY sort_order ASC, id DESC`
    ).all();

    return json((result.results || []).map(mapProject));
  } catch (err) {
    console.error("projects:get", err);
    return error("Project database is not configured yet.", 500);
  }
}

export async function onRequestPost(context) {
  if (!assertSameOrigin(context.request)) {
    return error("Invalid request origin.", 403);
  }

  const session = await requireAdmin(context);
  if (!session) return error("Unauthorized.", 401);

  let body;
  try {
    body = await context.request.json();
  } catch {
    return error("Invalid JSON body.");
  }

  const parsed = sanitizeProjectInput(body);
  if (!parsed.ok) return error(parsed.message);

  const { title, description, link, imageKey, sortOrder } = parsed.value;
  const now = new Date().toISOString();

  try {
    const insert = await context.env.DB.prepare(
      `INSERT INTO projects (title, description, link, image_key, sort_order, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(title, description, link, imageKey, sortOrder, now, now)
      .run();

    const id = Number(insert.meta.last_row_id);

    const row = await context.env.DB.prepare(
      `SELECT id, title, description, link, image_key, sort_order, created_at, updated_at
       FROM projects WHERE id = ?`
    ).bind(id).first();

    return json(mapProject(row), 201);
  } catch (err) {
    console.error("projects:create", err);
    return error("Could not create the project.", 500);
  }
}
