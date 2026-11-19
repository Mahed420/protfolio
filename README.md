# MD MAHED — The Digital Universe

Interactive 3D solar-system portfolio (Three.js). Static site, no build step.
Live: https://mahed420.github.io/protfolio/

## Structure
| Path | Purpose |
|---|---|
| `index.html` | The whole site (HTML, CSS, JS). Uses only relative paths, so it works under `/protfolio/`. |
| `api/chat.js`, `api/contact.js` | Optional Vercel serverless functions (COSMOS AI + contact form). |
| `.github/workflows/pages.yml` | Deploys `index.html` to GitHub Pages on every push to `main`. |
| `scripts/check.js` | Production check: no secrets, no absolute asset paths, JS parses. |
| `.env.example` | Names of env vars. Real values go in Vercel, never in Git. |

## Run locally
```bash
node scripts/check.js      # production check
npx serve . -l 3000        # open http://localhost:3000
```

## Deploy: GitHub Pages (frontend only)
1. Repo **Settings → Pages → Source: GitHub Actions**.
2. Push to `main`. The workflow runs the check and publishes.
3. Site: `https://mahed420.github.io/protfolio/`.

GitHub Pages cannot run server code. Without a backend, COSMOS runs in labelled demo mode and the contact form opens the visitor's email app (nothing is sent automatically).

> This project is plain static HTML, not Next.js, so no `basePath` or `next export` is needed. All asset paths are relative, which is what makes `/protfolio` work.

## Enable the real AI assistant and contact form (Vercel)
Backend functions need a server, so host them on Vercel (a VPS also works).
1. Import this repo into Vercel (or run `npx vercel`). Keep the Pages site for the frontend if you like.
2. In Vercel → Settings → Environment Variables, add the values from `.env.example`:
   `GEMINI_API_KEY`, `GEMINI_MODEL`, `ALLOWED_ORIGIN=https://mahed420.github.io`, `RESEND_API_KEY`, `CONTACT_TO`, `CONTACT_FROM`.
3. Redeploy. Your endpoints are `https://<your-project>.vercel.app/api/chat` and `/api/contact`.
4. In `index.html`, set in the `CFG` object:
   ```js
   const CFG={chatApi:"https://<your-project>.vercel.app/api/chat",formApi:"https://<your-project>.vercel.app/api/contact",photo:""};
   ```
5. Commit and push. The "Demo mode" label switches to "Connected".

If you also deploy the whole site on Vercel, `CFG` can use `"/api/chat"` and `"/api/contact"`.

## Security
- API keys exist only as Vercel environment variables. Never put them in `index.html` or commit `.env`.
- `.gitignore` excludes `.env*`. `scripts/check.js` blocks pushes with key-like strings.
- `ALLOWED_ORIGIN` restricts which site may call your API. Consider rate limiting (e.g. Vercel firewall) before heavy traffic.
- Your public phone/email appear in the page source by design. Expect some spam.

## Content to complete
Project screenshots, case studies, repo links, Run Mate details, timeline dates and portrait are marked "to add" in `index.html`. Only add verified information.
