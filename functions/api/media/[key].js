export async function onRequestGet(context) {
  const key = decodeURIComponent(String(context.params.key ?? ""));

  if (!key || key.includes("/") || key.includes("\\") || key.includes("..")) {
    return new Response("Not found", { status: 404 });
  }

  if (!context.env.PORTFOLIO_IMAGES) {
    return new Response("Storage unavailable", { status: 503 });
  }

  const object = await context.env.PORTFOLIO_IMAGES.get(key);

  if (!object) {
    return new Response("Not found", { status: 404 });
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  headers.set("cache-control", "public, max-age=31536000, immutable");
  headers.set("x-content-type-options", "nosniff");

  return new Response(object.body, { headers });
}
