
# Link Saver - Ultra Modern + GSheet

Vibrant, premium link saver with Google Sheets sync, built with Next.js 14.

## Features
- Title, URL, Label, Dropdown Tag (blog/webpage/game/tool/video/design/inspiration/news/docs/article/portfolio/other)
- Auto-updating date every second
- AI auto-tag suggestions
- Favicon wall + grid view
- Command palette Cmd+K
- Glassmorphism, aurora mesh, 60fps spring animations
- Google Sheets sync via Apps Script
- Offline-first localStorage + bulk actions + import/export

## Quick Start
```bash
npm install
npm run dev
```

## Wire to your actual Google Sheet
1. Create a Google Sheet with header: Title | URL | Label | Tag | Date | Favorite | ID | Favicon
2. Extensions → Apps Script → paste code from `scripts/apps-script.js` → Save
3. Deploy → New Deployment → Web App → Execute as You, Anyone can access → Copy URL
4. Paste URL and Sheet ID into app via Connect Sheets button OR into .env:
   - Copy `.env.example` to `.env.local`
   - Set `NEXT_PUBLIC_APPS_SCRIPT_URL` and `NEXT_PUBLIC_SHEET_ID`
5. The app will auto-sync on add/edit/delete

The wiring code is in `lib/sheets.ts` and used in `components/LinkSaver.tsx`.

## Deploy to Vercel
```bash
vercel
```

## Push to GitHub
```bash
git init
git add .
git commit -m "feat: ultra modern link saver with sheets"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/link-saver.git
git push -u origin main
```

## GitHub Repo Update
If you already have a repo, just copy this folder over and push. Or use GitHub CLI:
```bash
gh repo create link-saver --public --source=. --remote=origin --push
```

## Structure
- app/page.tsx → main page
- components/LinkSaver.tsx → 900+ lines premium component
- lib/sheets.ts → GSheet wiring
- scripts/apps-script.js → Apps Script backend
- app/globals.css → aurora + glass styles
