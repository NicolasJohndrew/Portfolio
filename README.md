# Johnny Andrew Nicolas — Game Developer Portfolio

A responsive, game-inspired developer portfolio built with **C# and Blazor WebAssembly**, deployed on **Cloudflare Pages** and backed by **Cloudflare D1**.

The portfolio includes a custom password-protected `/admin` CMS that allows the site owner to manage the portfolio content without editing the source code.

---

## Tech Stack

### Frontend
- **C#**
- **.NET 8**
- **Blazor WebAssembly**
- **Razor Components**
- **HTML**
- **CSS**
- **JavaScript**

### Backend / API
- **Cloudflare Pages Functions**
- **JavaScript**
- **Cloudflare D1**
- **SQL**

### Hosting & Source Control
- **Cloudflare Pages**
- **GitHub**

---

## Features

- Responsive dark gaming / indie-launcher inspired interface
- Blazor WebAssembly frontend
- Dynamic portfolio content loaded from Cloudflare D1
- Custom password-protected CMS at `/admin`
- Signed admin session using HttpOnly cookies
- Same-origin validation for CMS write actions
- Automatic deployment from GitHub to Cloudflare Pages
- Static project artwork stored inside the repository
- External HTTPS image URL support
- Public fallback content if the CMS API is temporarily unavailable
- Fully editable portfolio content without changing source code

---

# Full CMS

The portfolio includes a custom CMS available at:

```text
/admin
```

The CMS currently manages the following sections.

## General

Editable site-wide information:

- Display name
- Brand mark
- Brand subline
- Availability text
- Footer text
- Footer technology text

---

## Hero

Editable landing-screen content:

- Eyebrow prefix
- Eyebrow text
- Main heading
- Secondary heading
- Description
- Primary CTA label
- Primary CTA link
- Secondary CTA label
- Secondary CTA link
- Hero metadata
- Engine information
- Programming language information
- HUD labels
- Floating tags
- Scroll cue

---

## About

Editable player-profile content:

- Section label
- Main headings
- Profile paragraphs
- Profile highlight cards
- Highlight titles
- Highlight descriptions

---

## Skills

The Skills CMS allows the owner to:

- Change the Skills section heading
- Add skills
- Edit skills
- Delete skills
- Assign categories
- Set display order

Example categories:

```text
Programming
Game engines
Creative tools
```

Example skills:

```text
C#
Java
GDScript
Unity
Godot
Figma
Premiere Pro
CapCut
```

---

## Experience

The Experience section supports:

- Add item
- Edit item
- Delete item
- Organization
- Role / title
- Period
- Description
- Display order

It can be used for:

- Work experience
- Internship experience
- Education
- Certifications
- Other timeline entries

---

## Games / Projects

Game projects are dynamically stored in Cloudflare D1.

The CMS allows:

- Add game
- Edit game
- Delete game
- Reorder projects

Each project contains:

- Title
- Description
- Game / project URL
- Cover image path or URL
- Display order

Example projects currently used by the portfolio include:

```text
Cantilena: Whispers of the Last Song
NUMERO
Tiktilaok
```

---

## Contact

Editable contact information:

- Section label
- Main heading
- Secondary heading
- Description
- Email address
- Location

---

# Project Artwork

The current portfolio does **not require Cloudflare R2**.

Project artwork can be stored directly inside the GitHub repository.

Recommended directory:

```text
GamePortfolio/wwwroot/images/projects/
```

Example:

```text
GamePortfolio/
└── wwwroot/
    └── images/
        └── projects/
            ├── CANTILENA.png
            ├── NUMERO.png
            └── TIKTILAOK.png
```

Inside the CMS, use the public image path:

```text
/images/projects/NUMERO.png
```

or:

```text
/images/projects/TIKTILAOK.png
```

or:

```text
/images/projects/CANTILENA.png
```

External HTTPS images are also supported:

```text
https://example.com/project-cover.png
```

### Important

Paths are case-sensitive after deployment.

For example:

```text
/images/projects/NUMERO.png
```

is different from:

```text
/images/projects/numero.png
```

---

# Database

The CMS uses **Cloudflare D1**.

Current database:

```text
johnny-portfolio-db
```

The Cloudflare Pages binding name must be:

```text
DB
```

---

## Database Tables

The current CMS uses the following tables:

```text
projects
site_content
skills
experience
```

### `projects`

Stores game/project information.

Main fields include:

```text
id
title
description
link
image_key
sort_order
created_at
updated_at
```

### `site_content`

Stores editable portfolio text and site settings using key-value records.

Examples:

```text
general.siteName
hero.headingLine1
hero.description
projects.heading
about.paragraph1
skills.heading
contact.email
```

### `skills`

Stores editable skill/loadout items.

### `experience`

Stores editable timeline entries such as work experience and education.

---

# Database Setup

For a fresh Cloudflare D1 database, run:

```text
database/schema.sql
```

Then run:

```text
database/cms-upgrade.sql
```

`schema.sql` creates the original project structure.

`cms-upgrade.sql` adds the full CMS tables and default portfolio content.

---

# Run Locally

Install the **.NET 8 SDK**.

From the repository root:

```bash
dotnet run --project GamePortfolio/GamePortfolio.csproj
```

Or enter the project directory:

```bash
cd GamePortfolio
```

Then:

```bash
dotnet run --urls http://0.0.0.0:5000
```

The Blazor frontend can run locally.

Cloudflare-specific functionality such as Pages Functions and D1 is available in the deployed Cloudflare environment.

---

# Cloudflare Pages Deployment

The portfolio is designed to deploy through GitHub integration with Cloudflare Pages.

Recommended configuration:

| Setting | Value |
| --- | --- |
| Production branch | `main` |
| Build command | `sh build.sh` |
| Build output directory | `output/wwwroot` |
| Root directory | Leave blank / repository root |

The repository root must be used because the Cloudflare:

```text
functions/
```

directory is located at the root of the project.

---

## Build Script

The repository includes:

```text
build.sh
```

The build script:

1. Downloads the .NET 8 SDK
2. Installs it in the Cloudflare build environment
3. Publishes the Blazor WebAssembly project
4. Outputs the site to:

```text
output/wwwroot
```

---

# Cloudflare Binding

Inside the Cloudflare Pages project, configure the D1 binding:

```text
Variable name: DB
Database: johnny-portfolio-db
```

Redeploy the site after changing bindings or environment secrets.

---

# Admin Authentication

The CMS uses two Cloudflare secrets.

Configure them under:

```text
Cloudflare Pages
→ Settings
→ Variables and Secrets
```

---

## `ADMIN_PASSWORD`

The password used to access the CMS.

CMS URL:

```text
https://YOUR_SITE.pages.dev/admin
```

Do not commit the password to GitHub.

---

## `AUTH_SECRET`

Used to cryptographically sign the admin session.

Generate one using:

```bash
openssl rand -hex 32
```

Example:

```text
AUTH_SECRET=<generated-secret>
```

The actual secret must never be committed to the repository.

---

# Security

The CMS includes several security controls:

- Password-protected admin interface
- Signed admin session
- HttpOnly cookies
- Secure cookies
- SameSite=Strict
- Same-origin validation for write operations
- Admin authentication required for create/update/delete actions
- Secrets stored through Cloudflare environment configuration
- No passwords stored inside source code

The session cookie uses:

```text
HttpOnly
Secure
SameSite=Strict
```

---

# Project Structure

```text
.
├── GamePortfolio/
│   ├── Components/
│   ├── Layout/
│   ├── Models/
│   ├── Pages/
│   │   ├── Home.razor
│   │   └── Admin.razor
│   ├── Services/
│   ├── Program.cs
│   ├── GamePortfolio.csproj
│   └── wwwroot/
│       ├── css/
│       ├── images/
│       │   └── projects/
│       │       ├── CANTILENA.png
│       │       ├── NUMERO.png
│       │       └── TIKTILAOK.png
│       ├── js/
│       ├── _redirects
│       └── _routes.json
│
├── functions/
│   ├── _lib/
│   │   ├── auth.js
│   │   └── http.js
│   └── api/
│       ├── login.js
│       ├── logout.js
│       ├── session.js
│       ├── projects/
│       ├── skills/
│       ├── experience/
│       └── content/
│
├── database/
│   ├── schema.sql
│   └── cms-upgrade.sql
│
├── build.sh
└── README.md
```

---

# Development Workflow

After making changes locally or through GitHub Codespaces:

```bash
git add .
```

Commit:

```bash
git commit -m "Describe your changes"
```

Push:

```bash
git push
```

Cloudflare Pages automatically starts a new deployment when changes are pushed to the configured production branch.

---

# Updating Project Images

Add the image to:

```text
GamePortfolio/wwwroot/images/projects/
```

Example:

```text
NUMERO.png
```

Then:

```bash
git add .
git commit -m "Add NUMERO project artwork"
git push
```

Wait for Cloudflare Pages to finish deploying.

After deployment, enter this path in the CMS:

```text
/images/projects/NUMERO.png
```

---

# Portfolio Owner

## Johnny Andrew Nicolas

**Game Programmer / Developer**

Based in:

```text
San Jose del Monte, Bulacan, Philippines
```

Core skills represented in the portfolio include:

### Programming

- C#
- Java
- GDScript

### Game Engines

- Unity
- Godot

### Creative Tools

- Figma
- Adobe Premiere Pro
- CapCut

---

# Education

**Bachelor of Science in Entertainment and Multimedia Computing**

Specialization:

```text
Game Development
```

New Era University

```text
2022 — 2026
```

---

# Experience

**INC Museum**

Video Editor / LED Wall Video Editor

```text
December 2025 — July 2026
```

Experience and education information can now be managed directly through the CMS.

---

# Architecture Summary

```text
Browser
   │
   ▼
Blazor WebAssembly
   │
   ├── Public Portfolio
   │
   └── /admin CMS
          │
          ▼
Cloudflare Pages Functions
          │
          ▼
Cloudflare D1
```

Static artwork:

```text
GitHub Repository
      │
      ▼
GamePortfolio/wwwroot/images/projects
      │
      ▼
Cloudflare Pages
```

---

# Current Architecture

**Frontend**

```text
C#
Blazor WebAssembly
Razor
HTML
CSS
JavaScript
```

**Backend**

```text
Cloudflare Pages Functions
JavaScript
```

**Database**

```text
Cloudflare D1
SQL
```

**Hosting**

```text
Cloudflare Pages
```

**Source Control**

```text
GitHub
```

**Image Storage**

```text
GitHub / Static Blazor Assets
```

---

## License

This repository contains a personal portfolio and associated project content belonging to **Johnny Andrew Nicolas**.

Game artwork, project materials, branding, and portfolio content remain the property of their respective owners.