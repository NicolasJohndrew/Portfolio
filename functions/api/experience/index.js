import { requireAdmin } from "../../_lib/auth.js";
import { assertSameOrigin, error, json, mapExperience, sanitizeExperienceInput } from "../../_lib/http.js";

export async function onRequestGet(context) {
  try {
    const result = await context.env.DB.prepare(
      `SELECT id, organization, title, period, description, sort_order FROM experience ORDER BY sort_order ASC, id ASC`
    ).all();
    return json((result.results || []).map(mapExperience));
  } catch (err) {
    console.error("experience:get", err);
    return json([]);
  }
}

export async function onRequestPost(context) {
  if (!assertSameOrigin(context.request)) return error("Invalid request origin.", 403);
  const session = await requireAdmin(context);
  if (!session) return error("Unauthorized.", 401);

  let body;
  try { body = await context.request.json(); } catch { return error("Invalid JSON body."); }
  const parsed = sanitizeExperienceInput(body);
  if (!parsed.ok) return error(parsed.message);
  const { organization, title, period, description, sortOrder } = parsed.value;

  try {
    const insert = await context.env.DB.prepare(
      `INSERT INTO experience (organization, title, period, description, sort_order) VALUES (?, ?, ?, ?, ?)`
    ).bind(organization, title, period, description, sortOrder).run();
    const row = await context.env.DB.prepare(
      `SELECT id, organization, title, period, description, sort_order FROM experience WHERE id = ?`
    ).bind(Number(insert.meta.last_row_id)).first();
    return json(mapExperience(row), 201);
  } catch (err) {
    console.error("experience:create", err);
    return error("Could not create experience item.", 500);
  }
}
