import { requireAdmin } from "../_lib/auth.js";
import { assertSameOrigin, error, json } from "../_lib/http.js";

const defaults = {
  general: {
    siteName: "Johnny Nicolas",
    brandMark: "JN",
    brandSubline: "GAME DEV // PH",
    availabilityText: "Open to opportunities",
    footerText: "© 2026 Johnny Andrew Nicolas",
    footerTechText: "BUILT WITH C# / BLAZOR WASM",
  },
  hero: {
    eyebrowPrefix: "PLAYER 01",
    eyebrowText: "GAME PROGRAMMER + DEVELOPER",
    headingLine1: "BUILDING WORLDS",
    headingLine2: "PLAYERS REMEMBER.",
    description: "I turn mechanics, atmosphere, and narrative into interactive experiences—from gameplay systems in Unity to experimental worlds in Godot.",
    primaryCtaLabel: "Explore games",
    primaryCtaHref: "#games",
    secondaryCtaLabel: "Player profile",
    secondaryCtaHref: "#profile",
    meta1Label: "PRIMARY ENGINE",
    meta1Value: "UNITY",
    meta2Label: "LANGUAGE",
    meta2Value: "C#",
    meta3Label: "ALT ENGINE",
    meta3Value: "GODOT",
    visualTopLeft: "LIVE BUILD",
    visualTopRight: "v01.26",
    visualBottomLabel: "CREATIVE MODE",
    visualBottomValue: "ACTIVE",
    floatingTag1: "GAMEPLAY SYSTEMS",
    floatingTag2: "LEVEL DESIGN",
    scrollLabel: "SCROLL TO ENTER",
  },
  projects: {
    sectionLabel: "01 / SELECTED GAMES",
    heading: "Choose your next world.",
    intro: "Gameplay experiments, narrative systems, and interactive projects built with intention.",
    kickerLeft: "FEATURED BUILD",
    kickerRight: "GAME DEV",
    linkLabel: "Launch project",
    emptyLinkLabel: "Build link incoming",
  },
  about: {
    sectionLabel: "02 / PLAYER PROFILE",
    headingLine1: "Creative by instinct.",
    headingLine2: "Technical by craft.",
    paragraph1: "Passionate and creative game developer with hands-on experience in Unity and Godot, focused on building game mechanics and clear, engaging digital experiences.",
    paragraph2: "My background also spans video production and UI/UX, giving me a wider lens on pacing, composition, presentation, and how players experience an interface.",
    highlight1Title: "Unity",
    highlight1Subtitle: "C# development",
    highlight2Title: "Godot",
    highlight2Subtitle: "GDScript development",
    highlight3Title: "2026",
    highlight3Subtitle: "BS EMC · Game Development",
    highlight4Title: "Play.",
    highlight4Subtitle: "Prototype. Test. Improve.",
  },
  skills: {
    sectionLabel: "03 / LOADOUT",
    heading: "Tools in the inventory.",
  },
  experience: {
    sectionLabel: "04 / EXPERIENCE LOG",
  },
  contact: {
    sectionLabel: "05 / START A NEW QUEST",
    headingLine1: "Have a world",
    headingLine2: "worth building?",
    description: "Available for game development opportunities, creative collaborations, and projects where code meets experience.",
    email: "johndrewherreranicolas@gmail.com",
    location: "San Jose del Monte, Bulacan · Philippines",
  },
};

const limits = new Map();
for (const [section, fields] of Object.entries(defaults)) {
  for (const field of Object.keys(fields)) {
    const longField = ["description", "paragraph1", "paragraph2", "intro"].includes(field);
    limits.set(`${section}.${field}`, longField ? 3000 : 500);
  }
}

function cloneDefaults() {
  return JSON.parse(JSON.stringify(defaults));
}

function setByKey(target, key, value) {
  const [section, field] = key.split(".");
  if (target[section] && Object.prototype.hasOwnProperty.call(target[section], field)) {
    target[section][field] = value;
  }
}

export async function onRequestGet(context) {
  const result = cloneDefaults();

  try {
    const rows = await context.env.DB.prepare(
      `SELECT content_key, content_value FROM site_content ORDER BY content_key`
    ).all();

    for (const row of rows.results || []) {
      setByKey(result, row.content_key, row.content_value ?? "");
    }

    return json(result);
  } catch (err) {
    console.error("content:get", err);
    return json(result);
  }
}

export async function onRequestPut(context) {
  if (!assertSameOrigin(context.request)) return error("Invalid request origin.", 403);
  const session = await requireAdmin(context);
  if (!session) return error("Unauthorized.", 401);

  let body;
  try {
    body = await context.request.json();
  } catch {
    return error("Invalid JSON body.");
  }

  const statements = [];
  const now = new Date().toISOString();

  for (const [key, maxLength] of limits.entries()) {
    const [section, field] = key.split(".");
    const value = String(body?.[section]?.[field] ?? "").trim();

    if (value.length > maxLength) {
      return error(`${key} must be ${maxLength} characters or fewer.`);
    }

    statements.push(
      context.env.DB.prepare(
        `INSERT INTO site_content (content_key, content_value, updated_at)
         VALUES (?, ?, ?)
         ON CONFLICT(content_key) DO UPDATE SET content_value = excluded.content_value, updated_at = excluded.updated_at`
      ).bind(key, value, now)
    );
  }

  try {
    await context.env.DB.batch(statements);
    return onRequestGet(context);
  } catch (err) {
    console.error("content:update", err);
    return error("Could not update site content.", 500);
  }
}
