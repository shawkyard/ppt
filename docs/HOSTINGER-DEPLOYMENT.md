# HOSTINGER DEPLOYMENT GUIDE — Fajita Grill

The site is 100% static (HTML/CSS/JS) — no database, no build step. Any Hostinger plan works.

## 1. Before uploading

1. Pick the live domain (e.g. a new domain in Hostinger, or one the owner already has).
2. **Find & replace `https://example.com` with the live domain** in:
   - every `.html` file in `public_html/` (canonical links + JSON-LD on index.html)
   - `sitemap.xml`
   - `robots.txt`
3. Set the owner's email in the two forms: in `catering.html` and `contact.html`, change `data-inquiry-to=""` to `data-inquiry-to="owner@email.com"`.
   - Optional upgrade: replace the mailto behavior with a real form endpoint (Formspree or similar): give the `<form>` an `action` URL and `method="POST"`, remove the `data-inquiry` attribute, and add a hidden redirect field to `thank-you.html`.

## 2. Upload

**Option A — hPanel File Manager:** Websites → Manage → File Manager → open `public_html` → upload the *contents* of this repo's `public_html/` folder (including the hidden `.htaccess`).

**Option B — FTP:** create an FTP account in hPanel, connect with FileZilla, upload the contents of `public_html/`.

Do **not** upload the `docs/` folder — it's internal.

## 3. After uploading

1. In hPanel enable free SSL (Let's Encrypt) for the domain. The `.htaccess` already redirects HTTP → HTTPS.
2. Test: homepage, a few audience pages, the 404 (visit any bad URL), tel: links on a phone, both order links, the map embeds.
3. Google Search Console: verify the domain, submit `sitemap.xml`.
4. Update the **Google Business Profile** and **Facebook page** website fields to the new domain — that's where this business's traffic already is.

## 4. Adding the Entavo videos later

1. Compress each video to MP4 (H.264). Hero loop: ≤1080p, ideally under 8 MB. Story video: under ~40 MB or host on YouTube and embed.
2. Upload to `public_html/assets/video/` (create the folder).
3. In `index.html`, `about.html`, `halal.html`: each `.video-slot` placeholder has an HTML comment directly above it with the exact `<video>` markup to paste in. Replace the placeholder `<div class="video-slot">…</div>` with that markup.
4. Add a poster image (first frame JPG) per video for fast loading.

## 5. Updating content later

- Hours/phone/address appear in: topbar, footer, contact.html, visit.html, index.html location section, FAQ answers. Search the text to catch all spots.
- Menu changes: edit `menu.html` cards; prices intentionally live only on the ordering site so the website never goes stale.
