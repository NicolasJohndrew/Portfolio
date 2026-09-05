import { requireAdmin } from "../../_lib/auth.js";
import { assertSameOrigin, error, json, mapExperience, parseRecordId, sanitizeExperienceInput } from "../../_lib/http.js";

export async function onRequestPut(context) {
  if (!assertSameOrigin(context.request)) return error("Invalid request origin.", 403);
  const session = await requireAdmin(context);
  if (!session) return error("Unauthorized.", 401);
  const id = parseRecordId(context.params.id);
  if (!id) return error("Invalid experience id.");

  let body;
  try { body = await context.request.json(); } catch { return error("Invalid JSON body."); }
  const parsed = sanitizeExperienceInput(body);
  if (!parsed.ok) return error(parsed.message);
  const { organization, title, period, description, sortOrder } = parsed.value;

  try {
    await context.env.DB.prepare(
      `UPDATE experience SET organization = ?, title = ?, period = ?, description = ?, sort_order = ? WHERE id = ?`
    ).bind(organization, title, period, description, sortOrder, id).run();
    const row = await context.env.DB.prepare(
      `SELECT id, organization, title, period, description, sort_order FROM experience WHERE id = ?`
    ).bind(id).first();
    if (!row) return error("Experience item not found.", 404);
    return json(mapExperience(row));
  } catch (err) {
    console.error("experience:update", err);
    return error("Could not update experience item.", 500);
  }
}

export async function onRequestDelete(context) {
  if (!assertSameOrigin(context.request)) return error("Invalid request origin.", 403);
  const session = await requireAdmin(context);
  if (!session) return error("Unauthorized.", 401);
  const id = parseRecordId(context.params.id);
  if (!id) return error("Invalid experience id.");

  try {
    await context.env.DB.prepare(`DELETE FROM experience WHERE id = ?`).bind(id).run();
    return json({ ok: true });
  } catch (err) {
    console.error("experience:delete", err);
    return error("Could not delete experience item.", 500);
  }
}
