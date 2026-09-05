# Full CMS Upgrade

This upgrade expands the existing game portfolio CMS so the public site content is managed from Cloudflare D1.

## What becomes editable
- General brand/site settings
- Hero copy, CTA labels/links, HUD labels and meta values
- Projects section headings + game cards
- About/profile copy + four highlight cards
- Skills section + repeatable skills/categories
- Experience section + repeatable timeline items
- Contact section

## Apply code in GitHub Codespaces
Upload `full-cms-upgrade.zip` into the repository root, then run:

```bash
unzip -o full-cms-upgrade.zip
rm full-cms-upgrade.zip

git add .
git commit -m "Expand portfolio to full CMS"
git push
```

## Upgrade the existing Cloudflare D1 database
Open your existing D1 database > Console and run the entire contents of:

`database/cms-upgrade.sql`

The script is safe to run on the existing database: it creates only missing tables/seed rows and does not remove the existing `projects` data.

## Cloudflare bindings/secrets that must remain
- D1 binding: `DB`
- Secret: `ADMIN_PASSWORD`
- Secret: `AUTH_SECRET`

No R2 binding is required for this version. Project cover images use either:
- `/images/projects/filename.jpg` for images committed under `GamePortfolio/wwwroot/images/projects/`
- or an external `https://...` image URL

## After deployment
Open `/admin`, sign in, and you should see tabs for General, Hero, About, Skills, Experience, Games, and Contact.
