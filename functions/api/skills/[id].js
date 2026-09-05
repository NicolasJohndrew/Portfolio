import { requireAdmin } from "../../_lib/auth.js";
import { assertSameOrigin, error, json, mapSkill, parseRecordId, sanitizeSkillInput } from "../../_lib/http.js";

export async function onRequestPut(context) {
  if (!assertSameOrigin(context.request)) return error("Invalid request origin.", 403);
  const session = await requireAdmin(context);
  if (!session) return error("Unauthorized.", 401);
  const id = parseRecordId(context.params.id);
  if (!id) return error("Invalid skill id.");

  let body;
  try { body = await context.request.json(); } catch { return error("Invalid JSON body."); }
  const parsed = sanitizeSkillInput(body);
  if (!parsed.ok) return error(parsed.message);
  const { category, name, sortOrder } = parsed.value;

  try {
    await context.env.DB.prepare(
      `UPDATE skills SET category = ?, name = ?, sort_order = ? WHERE id = ?`
    ).bind(category, name, sortOrder, id).run();
    const row = await context.env.DB.prepare(
      `SELECT id, category, name, sort_order FROM skills WHERE id = ?`
    ).bind(id).first();
    if (!row) return error("Skill not found.", 404);
    return json(mapSkill(row));
  } catch (err) {
    console.error("skills:update", err);
    return error("Could not update skill.", 500);
  }
}

export async function onRequestDelete(context) {
  if (!assertSameOrigin(context.request)) return error("Invalid request origin.", 403);
  const session = await requireAdmin(context);
  if (!session) return error("Unauthorized.", 401);
  const id = parseRecordId(context.params.id);
  if (!id) return error("Invalid skill id.");

  try {
    await context.env.DB.prepare(`DELETE FROM skills WHERE id = ?`).bind(id).run();
    return json({ ok: true });
  } catch (err) {
    console.error("skills:delete", err);
    return error("Could not delete skill.", 500);
  }
}
