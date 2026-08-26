# Five Hours Back — consulting site

One-page site for local AI consulting. Pure static HTML — no build step, no dependencies.

## Deploy to Netlify (2 minutes)

Easiest way: go to https://app.netlify.com/drop and drag the `consulting-site`
folder onto the page. Done — you get a live URL immediately.

Or connect the repo in Netlify: **Add new site → Import from Git**, set
**Base directory** to `consulting-site`, leave build command empty, and set
**Publish directory** to `consulting-site`.

## Get the leads

The intake form uses **Netlify Forms** — it works automatically once deployed.

1. In your Netlify site dashboard, open **Forms** — submissions appear there.
2. Go to **Forms → Notifications → Add notification → Email** and enter your
   email so every lead lands in your inbox.

## Before you launch — customization checklist

Search `index.html` for `EDIT:` comments. You need to:

- [ ] Put your **city / service area** in the hero and footer
- [ ] Add your **name, story, and photo** to the About section
- [ ] Add your **phone number** to the footer
- [ ] Adjust prices if you want different numbers
- [ ] (Optional) Rename the business — "Five Hours Back" is a placeholder brand
      built on your guarantee; change the `<title>`, logo text, and footer if
      you pick another name
- [ ] (Optional) Buy a domain in Netlify (Domain settings) — ~$15/yr
