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

export function parseRecordId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function cleanText(value, maxLength) {
  const text = String(value ?? "").trim();
  return text.slice(0, maxLength);
}

function cleanOrder(value) {
  const raw = Number(value ?? 0);
  return Number.isFinite(raw) ? Math.max(0, Math.min(10000, Math.trunc(raw))) : 0;
}

function validateHttpOrLocalPath(value, label) {
  if (!value) return { ok: true, value: null };

  if (value.startsWith("/")) {
    if (value.startsWith("//")) return { ok: false, message: `${label} is not a valid local path.` };
    return { ok: true, value };
  }

  try {
    const parsed = new URL(value);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return { ok: false, message: `${label} must use http, https, or a local / path.` };
    }
    return { ok: true, value };
  } catch {
    return { ok: false, message: `${label} is not a valid URL or local path.` };
  }
}

export function sanitizeProjectInput(input = {}) {
  const title = cleanText(input.title, 120);
  const description = cleanText(input.description, 2000);
  const link = cleanText(input.link, 1000);
  const imageKey = cleanText(input.imageKey, 1000);
  const sortOrder = cleanOrder(input.sortOrder);

  if (!title) return { ok: false, message: "Title is required." };
  if (!description) return { ok: false, message: "Description is required." };

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

  const imageValidation = validateHttpOrLocalPath(imageKey, "Cover image");
  if (!imageValidation.ok) return imageValidation;

  return {
    ok: true,
    value: {
      title,
      description,
      link: link || null,
      imageKey: imageValidation.value,
      sortOrder,
    },
  };
}

export function sanitizeSkillInput(input = {}) {
  const category = cleanText(input.category, 80);
  const name = cleanText(input.name, 100);
  const sortOrder = cleanOrder(input.sortOrder);
  if (!category) return { ok: false, message: "Skill category is required." };
  if (!name) return { ok: false, message: "Skill name is required." };
  return { ok: true, value: { category, name, sortOrder } };
}

export function sanitizeExperienceInput(input = {}) {
  const organization = cleanText(input.organization, 150);
  const title = cleanText(input.title, 150);
  const period = cleanText(input.period, 100);
  const description = cleanText(input.description, 2000);
  const sortOrder = cleanOrder(input.sortOrder);

  if (!organization) return { ok: false, message: "Organization is required." };
  if (!title) return { ok: false, message: "Title is required." };

  return { ok: true, value: { organization, title, period, description, sortOrder } };
}

export function mapProject(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    link: row.link,
    imageKey: row.image_key,
    imageUrl: row.image_key || null,
    sortOrder: row.sort_order ?? 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapSkill(row) {
  return {
    id: row.id,
    category: row.category,
    name: row.name,
    sortOrder: row.sort_order ?? 0,
  };
}

export function mapExperience(row) {
  return {
    id: row.id,
    organization: row.organization,
    title: row.title,
    period: row.period,
    description: row.description,
    sortOrder: row.sort_order ?? 0,
  };
}
