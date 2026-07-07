# PromptShot

**The missing clipboard between AI tools.**

PromptShot turns messy screenshots into clean, AI‑ready **handoff packets** you
can paste into ChatGPT, Claude, Manus, Lovable, v0, Figma AI, Framer AI, Cursor,
or any other AI workspace.

It doesn't replace Snagit, ShareX, Greenshot, or the Windows Snipping Tool — it
sits beside them. You keep taking screenshots however you like; PromptShot picks
them up and turns them into a perfect brief for the next AI.

> The magic is simple: **screenshot + context + mode = perfect AI handoff packet.**

It is **local‑first**: no accounts, no login, no cloud, no payment, no AI API
calls. Nothing leaves your machine unless *you* copy, paste, export, or upload
it.

---

## 1. What this is

A Windows‑first desktop app built with **Tauri v2 + React + TypeScript + Vite**.

Workflow:

1. Take a screenshot with any tool.
2. PromptShot detects it (clipboard / watched folder) or you upload it.
3. Select one or more screenshots.
4. Add a short note: *what are you trying to do?*
5. Pick a **mode** (Ask Boss AI, Send to Builder AI, Fix This Website, …).
6. PromptShot generates a clean markdown packet.
7. Copy it, paste into your next AI, and attach the screenshots.

### Features

- **Home / landing** — headline, 3‑step visual, quick actions, live stats.
- **Screenshot Inbox** — thumbnails, filename, source badge (Clipboard /
  Watched Folder / Upload), date, selection, delete, drag‑drop + paste zone.
- **Folder watch** — pick a folder; new PNG/JPG/JPEG/WebP files import
  automatically (de‑duplicated).
- **Clipboard import** — one‑click "Import from clipboard" (native image read on
  desktop) plus a paste/drop fallback.
- **Multi‑select** — build one packet from several screenshots; selection
  carries across pages ("3 screenshots selected").
- **6 AI handoff modes**, each with its own purpose‑built template:
  Ask Boss AI · Send to Builder AI · Fix This Website · Explain This Error ·
  Client Reply · Compare Screenshots.
- **Prompt packet generator** — Title, Goal, Context, Screenshot list,
  Instructions, and Output Required, in copy/paste markdown.
- **Copy AI Packet** — one click, with a "Copied" success state.
- **Projects** — group screenshots and saved packets locally.
- **History** — every generated packet, with preview and "Copy again".
- **Settings** — watched folder, storage location, privacy, clear history.

---

## 2. Project file tree

```
promptshot/
├── index.html                 # Vite entry
├── package.json
├── vite.config.ts
├── tsconfig.json / tsconfig.node.json
├── public/
│   └── promptshot.png         # app logo (used in-app + favicon)
├── src/
│   ├── main.tsx               # React bootstrap
│   ├── App.tsx                # shell + simple page router
│   ├── styles.css             # full design system (charcoal / white / orange)
│   ├── types.ts               # local data model
│   ├── components/
│   │   ├── Icon.tsx           # dependency-free inline SVG icon set
│   │   ├── Sidebar.tsx
│   │   ├── ScreenshotCard.tsx
│   │   ├── ModeCard.tsx
│   │   └── Toast.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Inbox.tsx
│   │   ├── CreatePacket.tsx
│   │   ├── Projects.tsx
│   │   ├── History.tsx
│   │   └── Settings.tsx
│   ├── state/
│   │   ├── store.tsx          # app state, actions, folder-watch lifecycle
│   │   └── nav.tsx            # tiny navigation context
│   └── lib/
│       ├── env.ts             # Tauri vs browser detection
│       ├── persistence.ts     # db.json + image IO  (Tauri) / localStorage + IndexedDB (web)
│       ├── idb.ts             # IndexedDB blob store (browser fallback)
│       ├── fileio.ts          # native pickers + file→bytes helpers
│       ├── clipboard.ts       # copy text / read clipboard image
│       ├── folderWatch.ts     # fs watcher (desktop)
│       ├── useImageUrl.ts     # cached image URL resolver hook
│       ├── prompts.ts         # the 6 mode templates + generatePacket()
│       └── format.ts          # ids, dates, filenames
└── src-tauri/
    ├── Cargo.toml
    ├── build.rs
    ├── tauri.conf.json
    ├── gen_icons.py           # regenerates all app icons (pure Python, no deps)
    ├── capabilities/
    │   └── default.json       # fs / dialog / clipboard permissions + scope
    ├── icons/                 # generated PNG / ICO / ICNS app icons
    └── src/
        ├── main.rs
        └── lib.rs             # read_clipboard_image command (arboard → PNG → base64)
```

---

## 3. Setup

Prerequisites:

- **Node.js 18+** and npm
- **Rust toolchain** (`rustup`) — <https://rustup.rs>
- Tauri v2 OS prerequisites — <https://tauri.app/start/prerequisites/>
  - **Windows:** Microsoft C++ Build Tools + **WebView2** (preinstalled on
    Windows 11; installer available for Windows 10).
  - **macOS:** Xcode Command Line Tools.
  - **Linux:** `webkit2gtk-4.1`, `libgtk-3`, `librsvg2`, etc. (see the link).

Install JS dependencies:

```bash
cd promptshot
npm install
```

---

## 4. Run & build

Run the desktop app in dev (hot reload):

```bash
npm run tauri:dev
# equivalent to: npm run tauri dev
```

Build a production installer (`.msi`/`.exe` on Windows, `.dmg` on macOS,
`.deb`/`.AppImage` on Linux):

```bash
npm run tauri:build
# output under src-tauri/target/release/bundle/
```

Frontend‑only commands (used by Tauri, but handy on their own):

```bash
npm run dev       # Vite dev server on http://localhost:1420
npm run build     # type-check + production web build
npm run preview   # preview the built web bundle
```

### Browser preview mode

The entire UI also runs in a plain browser via `npm run dev`. This is great for
fast iteration and is how the UI was verified. In browser mode:

- Import works via **drag‑drop / paste / file picker**.
- Metadata is stored in **localStorage**; images in **IndexedDB**.
- **Folder watching** and **native clipboard image read** are desktop‑only and
  degrade gracefully with clear in‑app messaging.

### Regenerating icons

App icons are checked in, but you can regenerate them any time:

```bash
cd src-tauri && python3 gen_icons.py
```

---

## 5. Tauri permission requirements

Permissions live in [`src-tauri/capabilities/default.json`](src-tauri/capabilities/default.json):

- `dialog:allow-open` — native file & folder pickers.
- `clipboard-manager:allow-write-text` / `read-text` — copy the packet.
- `fs:allow-read-file/write-file/read-dir/mkdir/remove/exists/copy-file` —
  store screenshots + `db.json` in the app local data dir.
- `fs:allow-watch` / `allow-unwatch` — watch the chosen folder.
- `fs:scope` — restricts filesystem access to `$APPLOCALDATA` (app storage) and
  the user's common picture/desktop/download/document/home locations.

The custom `read_clipboard_image` command (in `src-tauri/src/lib.rs`) uses
[`arboard`](https://crates.io/crates/arboard) to read a clipboard image and the
[`image`](https://crates.io/crates/image) crate to encode it to PNG, returned as
base64 for the frontend to save. Custom commands don't require extra capability
entries in Tauri v2.

The Content‑Security‑Policy in `tauri.conf.json` allows `data:` and `blob:`
images so screenshots render inside the webview.

---

## 6. Data model

Stored locally as JSON (`db.json` on desktop, `localStorage` in the browser):

```ts
Screenshot { id, fileName, ext, source, createdAt, importedAt, projectId?, storageRef }
Project    { id, name, createdAt }
Packet     { id, mode, contextNote, screenshotIds, screenshotNames, projectId?, generatedText, createdAt }
Settings   { watchedFolder? }
```

- **Desktop:** image files live in `<AppLocalData>/screenshots/`; `storageRef`
  points at the file.
- **Browser:** image blobs live in IndexedDB; `storageRef` points at the key.

The exact storage path is shown on the **Settings** page.

---

## 7. Privacy

> PromptShot is local‑first. Your screenshots and prompt packets stay on your
> computer unless you manually copy, paste, export, or upload them somewhere
> else.

No cloud accounts. No login. No payments. No AI API calls. No uploads. No
browser automation of AI websites.

---

## 8. Known limitations & v2 ideas

**Current limitations**

- **Native clipboard image read** and **folder watching** run only in the Tauri
  desktop build (both need the native OS layer). The browser preview covers
  everything else and clearly says so where a feature isn't available.
- `arboard` reads a *single* image from the clipboard; multi‑image clipboards
  fall back to the paste/drop zone.
- De‑duplication is heuristic (filename + created‑time + source), so an
  identical image re‑saved under a new name will import again.
- PromptShot never attaches images to the receiving AI for you — by design the
  packet reminds you to paste/upload them yourself.

**v2 ideas**

- Global hotkey + tray capture, and auto‑detect the OS screenshots folder.
- On‑device OCR to pull text/errors out of screenshots into the packet.
- Per‑mode editable templates and user‑defined custom modes.
- Export packets as `.md` files and export/import projects.
- Optional lightweight image annotation (crop, arrow, redact) before handoff.
- Encrypted local vault + optional cross‑device sync (still user‑controlled).

---

Built as a focused MVP: **screenshot + context + mode = perfect AI handoff packet.**
