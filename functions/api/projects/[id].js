import { requireAdmin } from "../../_lib/auth.js";
import { assertSameOrigin, error, json, mapProject, sanitizeProjectInput } from "../../_lib/http.js";

function parseId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function onRequestPut(context) {
  if (!assertSameOrigin(context.request)) {
    return error("Invalid request origin.", 403);
  }

  const session = await requireAdmin(context);
  if (!session) return error("Unauthorized.", 401);

  const id = parseId(context.params.id);
  if (!id) return error("Invalid project id.");

  let body;
  try {
    body = await context.request.json();
  } catch {
    return error("Invalid JSON body.");
  }

  const parsed = sanitizeProjectInput(body);
  if (!parsed.ok) return error(parsed.message);

  const { title, description, link, imageKey, sortOrder } = parsed.value;

  try {
    const existing = await context.env.DB.prepare(
      `SELECT image_key FROM projects WHERE id = ?`
    ).bind(id).first();

    if (!existing) return error("Project not found.", 404);

    const now = new Date().toISOString();

    await context.env.DB.prepare(
      `UPDATE projects
       SET title = ?, description = ?, link = ?, image_key = ?, sort_order = ?, updated_at = ?
       WHERE id = ?`
    )
      .bind(title, description, link, imageKey, sortOrder, now, id)
      .run();

    if (existing.image_key && existing.image_key !== imageKey) {
      try {
        await context.env.PORTFOLIO_IMAGES.delete(existing.image_key);
      } catch (storageError) {
        console.warn("Could not delete replaced image", storageError);
      }
    }

    const row = await context.env.DB.prepare(
      `SELECT id, title, description, link, image_key, sort_order, created_at, updated_at
       FROM projects WHERE id = ?`
    ).bind(id).first();

    return json(mapProject(row));
  } catch (err) {
    console.error("projects:update", err);
    return error("Could not update the project.", 500);
  }
}

export async function onRequestDelete(context) {
  if (!assertSameOrigin(context.request)) {
    return error("Invalid request origin.", 403);
  }

  const session = await requireAdmin(context);
  if (!session) return error("Unauthorized.", 401);

  const id = parseId(context.params.id);
  if (!id) return error("Invalid project id.");

  try {
    const existing = await context.env.DB.prepare(
      `SELECT image_key FROM projects WHERE id = ?`
    ).bind(id).first();

    if (!existing) return error("Project not found.", 404);

    await context.env.DB.prepare(
      `DELETE FROM projects WHERE id = ?`
    ).bind(id).run();

    if (existing.image_key) {
      try {
        await context.env.PORTFOLIO_IMAGES.delete(existing.image_key);
      } catch (storageError) {
        console.warn("Could not delete project image", storageError);
      }
    }

    return json({ ok: true });
  } catch (err) {
    console.error("projects:delete", err);
    return error("Could not delete the project.", 500);
  }
}
