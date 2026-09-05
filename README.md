# Johnny Andrew Nicolas — Game Developer Portfolio

A game-themed portfolio built with **C# + Blazor WebAssembly**, designed for deployment to **Cloudflare Pages**. Dynamic project content is managed through a lightweight CMS at `/admin`, backed by **Cloudflare D1** and **Cloudflare R2**.

## Stack

- **Frontend:** Blazor WebAssembly / C# (.NET 8)
- **Hosting:** Cloudflare Pages
- **CMS API:** Cloudflare Pages Functions
- **Database:** Cloudflare D1
- **Image storage:** Cloudflare R2
- **Source control:** GitHub

## Features

- Responsive dark game-interface design
- Hero / About / Skills / Experience / Contact sections
- Dynamic game cards loaded from D1
- `/admin` CMS with:
  - Admin password login
  - Create project
  - Edit project
  - Delete project
  - Title
  - Description
  - Project/game link
  - Display order
  - Cover image upload
- R2-backed image serving
- Signed HttpOnly admin session cookie
- Same-origin checks on write actions
- 5 MB image upload limit
- JPG / PNG / WEBP / GIF / AVIF support
- Public fallback project while Cloudflare data bindings are still being configured

---

## 1. Run locally — frontend only

Install the .NET 8 SDK, then:

```bash
dotnet run --project GamePortfolio/GamePortfolio.csproj
```

The public UI can still render its built-in fallback project even without Cloudflare bindings. The CMS API requires Pages Functions + D1 + R2.

---

## 2. Push to GitHub

Create a new GitHub repository, then run from this project folder:

```bash
git init
git add .
git commit -m "Initial game developer portfolio"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

---

## 3. Create Cloudflare resources

In Cloudflare:

### D1

Create a D1 database, for example:

`game-portfolio-db`

Open the D1 SQL console and run everything in:

`database/schema.sql`

### R2

Create an R2 bucket, for example:

`game-portfolio-images`

---

## 4. Create the Cloudflare Pages project

Go to:

**Workers & Pages → Create → Pages → Import existing Git repository**

Select the GitHub repository.

Use:

| Setting | Value |
|---|---|
| Production branch | `main` |
| Build command | `./build.sh` |
| Build output directory | `output/wwwroot` |

The `build.sh` file installs .NET 8 in the Cloudflare build environment and publishes the Blazor WASM application.

---

## 5. Configure Pages bindings

Inside the new Pages project:

**Settings → Bindings**

Add:

### D1 binding

- Variable name: `DB`
- Database: your `game-portfolio-db`

### R2 binding

- Variable name: `PORTFOLIO_IMAGES`
- Bucket: your `game-portfolio-images`

Redeploy after adding bindings.

---

## 6. Add admin secrets

Inside the Pages project:

**Settings → Variables and Secrets**

Add these as **secrets**:

### `ADMIN_PASSWORD`

The password used to sign in at:

`https://YOUR_SITE.pages.dev/admin`

Use a strong unique password.

### `AUTH_SECRET`

A long random secret used to sign the admin session cookie.

Example generation command:

```bash
openssl rand -hex 32
```

Do not commit either secret to GitHub.

Redeploy after adding the secrets.

---

## 7. CMS

Open:

`/admin`

The CMS lets you add and manage game projects without changing source code.

Each project stores:

- Title
- Description
- Link
- Cover image
- Display order

Text metadata is stored in D1. Cover images are stored in R2.

---

## 8. Replace the starter project

The database seed contains:

**Cantilena: Whispers of the Last Song**

It has no public build link or cover image by default.

After signing into `/admin`, edit the project and add the real link + artwork. Add additional games the same way.

---

## Important security notes

- Do not place `ADMIN_PASSWORD` or `AUTH_SECRET` inside source code.
- Keep the GitHub repository private if preferred; Cloudflare Git integration can still deploy an authorized private repo.
- Uploaded SVG files are intentionally rejected.
- Write operations require an authenticated signed session.
- Session cookies are `HttpOnly`, `Secure`, and `SameSite=Strict`.

---

## Project structure

```text
.
├── GamePortfolio/
│   ├── Pages/
│   │   ├── Home.razor
│   │   └── Admin.razor
│   ├── Layout/
│   ├── Models/
│   ├── Services/
│   └── wwwroot/
│       ├── css/
│       ├── js/
│       ├── _redirects
│       └── _routes.json
├── functions/
│   ├── _lib/
│   └── api/
├── database/
│   └── schema.sql
├── build.sh
└── README.md
```

## Editing owner details

The portfolio copy currently uses:

- Johnny Andrew Nicolas
- Game Programmer / Developer
- Unity / C#
- Godot / GDScript
- Java
- Figma
- Adobe Premiere Pro
- CapCut
- BS Entertainment & Multimedia Computing — Game Development
- INC Museum internship

These are intentionally kept in the frontend source for now because only **game projects** were requested to be CMS-managed.
