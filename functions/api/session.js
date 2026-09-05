import { requireAdmin } from "../_lib/auth.js";
import { error, json } from "../_lib/http.js";

export async function onRequestGet(context) {
  const session = await requireAdmin(context);

  if (!session) {
    return error("Unauthorized.", 401);
  }

  return json({ authenticated: true });
}
