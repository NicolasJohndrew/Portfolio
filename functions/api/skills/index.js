import { requireAdmin } from "../../_lib/auth.js";
import { assertSameOrigin, error, json, mapSkill, sanitizeSkillInput } from "../../_lib/http.js";

export async function onRequestGet(context) {
  try {
    const result = await context.env.DB.prepare(
      `SELECT id, category, name, sort_order FROM skills ORDER BY category ASC, sort_order ASC, id ASC`
    ).all();
    return json((result.results || []).map(mapSkill));
  } catch (err) {
    console.error("skills:get", err);
    return json([]);
  }
}

export async function onRequestPost(context) {
  if (!assertSameOrigin(context.request)) return error("Invalid request origin.", 403);
  const session = await requireAdmin(context);
  if (!session) return error("Unauthorized.", 401);

  let body;
  try { body = await context.request.json(); } catch { return error("Invalid JSON body."); }
  const parsed = sanitizeSkillInput(body);
  if (!parsed.ok) return error(parsed.message);

  const { category, name, sortOrder } = parsed.value;
  try {
    const insert = await context.env.DB.prepare(
      `INSERT INTO skills (category, name, sort_order) VALUES (?, ?, ?)`
    ).bind(category, name, sortOrder).run();
    const row = await context.env.DB.prepare(
      `SELECT id, category, name, sort_order FROM skills WHERE id = ?`
    ).bind(Number(insert.meta.last_row_id)).first();
    return json(mapSkill(row), 201);
  } catch (err) {
    console.error("skills:create", err);
    return error("Could not create skill.", 500);
  }
}
