export function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      ...headers,
    },
  });
}

export function error(message, status = 400) {
  return json({ error: message }, status);
}

export function assertSameOrigin(request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;

  const url = new URL(request.url);
  return origin === url.origin;
}

export function sanitizeProjectInput(input = {}) {
  const title = String(input.title ?? "").trim();
  const description = String(input.description ?? "").trim();
  const link = String(input.link ?? "").trim();
  const imageKey = String(input.imageKey ?? "").trim();
  const sortOrderRaw = Number(input.sortOrder ?? 0);

  if (!title || title.length > 120) {
    return { ok: false, message: "Title is required and must be 120 characters or fewer." };
  }

  if (!description || description.length > 2000) {
    return { ok: false, message: "Description is required and must be 2000 characters or fewer." };
  }

  if (link) {
    try {
      const parsed = new URL(link);
      if (!["http:", "https:"].includes(parsed.protocol)) {
        return { ok: false, message: "Project link must use http or https." };
      }
    } catch {
      return { ok: false, message: "Project link is not a valid URL." };
    }
  }

  const sortOrder = Number.isFinite(sortOrderRaw)
    ? Math.max(0, Math.min(10000, Math.trunc(sortOrderRaw)))
    : 0;

  return {
    ok: true,
    value: {
      title,
      description,
      link: link || null,
      imageKey: imageKey || null,
      sortOrder,
    },
  };
}

export function mapProject(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    link: row.link,
    imageKey: row.image_key,
    imageUrl: row.image_key ? `/api/media/${encodeURIComponent(row.image_key)}` : null,
    sortOrder: row.sort_order ?? 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
