import { requireAdmin } from "../_lib/auth.js";
import { assertSameOrigin, error, json } from "../_lib/http.js";

const MAX_BYTES = 5 * 1024 * 1024;

const allowedTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/gif", "gif"],
  ["image/avif", "avif"],
]);

export async function onRequestPost(context) {
  if (!assertSameOrigin(context.request)) {
    return error("Invalid request origin.", 403);
  }

  const session = await requireAdmin(context);
  if (!session) return error("Unauthorized.", 401);

  if (!context.env.PORTFOLIO_IMAGES) {
    return error("R2 image storage is not configured.", 500);
  }

  let form;
  try {
    form = await context.request.formData();
  } catch {
    return error("Invalid multipart form.");
  }

  const file = form.get("file");

  if (!(file instanceof File)) {
    return error("No image file was supplied.");
  }

  const extension = allowedTypes.get(file.type);
  if (!extension) {
    return error("Only JPG, PNG, WEBP, GIF and AVIF images are allowed.");
  }

  if (file.size <= 0 || file.size > MAX_BYTES) {
    return error("Image must be between 1 byte and 5 MB.");
  }

  const key = `${crypto.randomUUID()}.${extension}`;

  try {
    await context.env.PORTFOLIO_IMAGES.put(key, file.stream(), {
      httpMetadata: {
        contentType: file.type,
        cacheControl: "public, max-age=31536000, immutable",
      },
      customMetadata: {
        originalName: file.name.slice(0, 180),
      },
    });

    return json({
      key,
      url: `/api/media/${encodeURIComponent(key)}`,
    }, 201);
  } catch (err) {
    console.error("upload", err);
    return error("Could not upload the image.", 500);
  }
}
