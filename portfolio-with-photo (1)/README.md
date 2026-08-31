# Raviprakash K — Portfolio

A static, dependency-free 3D portfolio. No framework, no bundler, no server code.
Three.js is loaded from a CDN; everything else is plain HTML, CSS and JavaScript.

---

## Project structure

```
portfolio/                  ← the site itself
  index.html                markup only (semantic, SEO + Open Graph in <head>)
  css/styles.css            all styles, tokenised at the top
  js/config.js              ← contact settings live here (edit this file)
  js/data.js                ← projects, skills, timeline (edit this file)
  js/render.js              turns data.js into DOM
  js/scene.js               Three.js background scene
  js/ui.js                  nav, cursor, reveals, 3D card tilt, easter egg
  js/contact.js             contact form logic + link wiring
  assets/                   portrait, favicon
build.js                    assembles dist/
package.json                npm scripts
dist/                       ← created by `npm run build`, this is what you upload
```

Content and behaviour are deliberately separated: adding a project or fixing a
date never means touching markup or styles.

---

## Running it locally

```bash
npm run dev
```

Then open <http://localhost:3000>.

You can also just double-click `portfolio/index.html` — the scripts are classic
(non-module) scripts, so the site works over `file://` too.

---

## Production build

```bash
npm run build
```

This copies `index.html`, `css/`, `js/` and `assets/` into a clean `dist/` folder
and prints the file count and total size. **`dist/` is the folder to upload to
your host.** To check it before uploading:

```bash
npm run preview
```

There is no compile step, so nothing can fail to transpile — the build simply
assembles the deployable folder.

---

## Editing content

### Adding a project

Open `portfolio/js/data.js` and copy one object inside the `projects` array:

```js
{
  id: 'my-project',
  name: 'My Project',
  role: 'Builder & Developer',
  category: 'AI / Web App',
  status: 'Built',              // Live | Built | Project | Ongoing
  icon: 'MP',                   // 2-letter monogram shown on the card
  description: 'One or two factual sentences.',
  tech: ['React', 'Node'],
  image: null,                  // or 'assets/my-project.jpg'
  liveUrl: null,                // https://… to show a Live Demo button
  githubUrl: null               // https://… to show a GitHub button
}
```

The Live Demo and GitHub buttons **only render when the URL is a real
`https://` string**. Leaving a field as `null` simply hides that button, so
there are never dead links on the page.

> **Scrapify:** its `liveUrl` and `githubUrl` are currently `null` because no
> public URL for it exists anywhere in this project. Paste the real URL into
> either field and the matching button appears immediately.

### Adding a card image

Drop the file into `portfolio/assets/` and set `image: 'assets/your-file.jpg'`.
Card images are lazy-loaded and get a parallax offset on hover automatically.

---

## Contact form

The form is honest by design: **it never reports success unless something
actually accepted the message.** It has two modes.

### Mode A — no setup (current default)

`contactEndpoint` in `js/config.js` is an empty string. The form validates the
visitor's input, then opens their own email client with the message composed and
addressed to `raviprakash0948@gmail.com`. The on-screen text says exactly that —
it never claims a message was delivered.

This works the moment you deploy, with nothing to configure.

### Mode B — real delivery to your inbox (recommended)

Pick one free service, then paste its URL into `js/config.js`:

**Formspree** — <https://formspree.io>

1. Sign up, create a form, point it at `raviprakash0948@gmail.com`.
2. Copy the endpoint it gives you.
3. In `portfolio/js/config.js`:
   ```js
   contactEndpoint: 'https://formspree.io/f/YOURFORMID',
   ```

**Web3Forms** — <https://web3forms.com>

1. Enter your email, receive an access key by mail.
2. In `portfolio/js/config.js`:
   ```js
   contactEndpoint: 'https://api.web3forms.com/submit',
   web3formsAccessKey: 'your-access-key',
   ```

Rebuild (`npm run build`) and re-upload. Messages now arrive in your inbox, and
the form shows a real success message only on a genuine 2xx response. If the
request fails, the visitor sees the actual error plus a working mailto fallback.

### Environment variables

**None are required.** This is a static site with no build-time substitution and
no server, so there is nothing to inject at deploy time — which is why there is
no `.env.example` in this repo.

The form-service values above (a Formspree form id, a Web3Forms access key) are
public identifiers by design, not secrets: they are safe to commit and are
visible in the page source of every site that uses them.

**Never put a real secret in `js/config.js` or any file under `portfolio/`.**
Everything in that folder is downloaded by the visitor's browser and readable by
anyone. If you ever need a genuine private key, it has to live behind a
serverless function, not in this folder.

---

## Contact links

All four contact routes are generated from `js/config.js`, so the phone number
and email address exist in exactly one place:

| Route | Behaviour |
|---|---|
| Email | `mailto:` — opens the visitor's mail app |
| WhatsApp | `https://wa.me/919964705686` with a pre-filled greeting, new tab |
| LinkedIn | Profile URL, new tab, `rel="noopener noreferrer"` |
| Form | Mode A or Mode B above |

Change `email`, `whatsapp` or `linkedin` in `config.js` and every button,
card and footer icon updates together.

---

## Accessibility & motion

- Skip link, semantic landmarks, one `<h1>`, ordered heading levels
- Visible focus ring on every interactive element; the mobile menu closes on Escape
- Form labels are bound to inputs; errors are announced via `aria-live`
- No information is hover-only — every card's content is in the DOM as text
- `prefers-reduced-motion` is honoured: animations stop, the 3D scene renders a
  single static frame, the custom cursor is disabled, and all revealed content is
  shown immediately

## Performance notes

- The portrait is a real `.jpg` asset (was a 200 KB base64 blob inlined in the
  HTML), so it is cached, lazy-loaded and no longer blocks first paint
- Particle count drops from 1800 to 550 below 900 px, and device pixel ratio is capped
- The render loop stops completely when the tab is hidden
- Scroll handlers are `requestAnimationFrame`-throttled; reveals use `IntersectionObserver`

## Easter egg

Konami code (↑ ↑ ↓ ↓ ← → ← → B A) briefly accelerates the particle field.
Typing inside the contact form never triggers it.
