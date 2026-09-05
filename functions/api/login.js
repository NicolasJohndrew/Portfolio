import { createSession, safeSecretEquals, sessionCookie } from "../_lib/auth.js";
import { assertSameOrigin, error, json } from "../_lib/http.js";

export async function onRequestPost(context) {
  if (!assertSameOrigin(context.request)) {
    return error("Invalid request origin.", 403);
  }

  const adminPassword = context.env.ADMIN_PASSWORD;
  const authSecret = context.env.AUTH_SECRET;

  if (!adminPassword || !authSecret) {
    return error("Admin authentication is not configured.", 500);
  }

  let body;
  try {
    body = await context.request.json();
  } catch {
    return error("Invalid JSON body.");
  }

  const password = String(body?.password ?? "");

  if (!safeSecretEquals(password, adminPassword)) {
    return error("Invalid credentials.", 401);
  }

  const token = await createSession(authSecret);

  return json(
    { ok: true },
    200,
    { "set-cookie": sessionCookie(token) }
  );
}
