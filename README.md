# Link Saver - Notion Vibrant Mobile Fixed (Wired) 🚀

Ultra-modern, high-contrast link saver and bookmark curation hub built with **Next.js 14**, **Tailwind CSS**, and **Google Sheets bi-directional sync**.

Supported and powered by:
- [Sudarshan AI](https://sudarshan-ai.com/) — Next-Gen Autonomous Enterprise AI Platform
- [Vyapai Blogs](https://blogs.vyapai.in/) — Tech, Software Architecture & Business Insights

---

## ⚡ Features & Mobile Fixes
- **Mobile Visibility & Contrast**: 1.5px contrast glossy borders on every element, 98% solid background (not translucent), 4.5:1 text contrast for high sunlight readability.
- **Vibrant Design System**: Saturated violet/blue/emerald/amber/rose/fuchsia badges, glassmorphic aurora background, 60fps spring animations.
- **Typography**: Plus Jakarta Sans 800 + Inter 700 with bold 18px card titles on mobile.
- **4 Intuitive Views**:
  - **Grid**: Bento-style interactive link cards
  - **List**: Clean Notion-style row list
  - **Gallery**: Visual cards with large gradient favicons
  - **Table**: Full database spreadsheet view with selection checkboxes
- **SEO-Optimised Footer & CTAs**:
  - Semantic, accessible footer featuring high-converting CTAs for [Sudarshan AI](https://sudarshan-ai.com/) and [Vyapai Blogs](https://blogs.vyapai.in/).
  - Rich OpenGraph and search engine indexing metadata.
- **Auto Date Generation**: Live ticking clock in creation modal, relative timestamps on cards.
- **Keyboard Shortcuts**:
  - `N`: Create new link
  - `/`: Focus search input
  - `Cmd+K` or `Ctrl+K`: Toggle command palette
  - `?`: Open shortcuts help
  - `Esc`: Dismiss modals
- **Google Sheets Sync**: Two-way sync to Google Sheets via Google Apps Script.

---

## 🛠️ Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📊 Wire to your Google Sheet
- **Pre-configured Sheet ID**: `1h9dlyn8bzdIr9sq_TGfrarMMZVvSPPZ49zhxAGYM-JE`
- **Spreadsheet URL**: [Open Google Sheet](https://docs.google.com/spreadsheets/d/1h9dlyn8bzdIr9sq_TGfrarMMZVvSPPZ49zhxAGYM-JE/edit)

### Setup Steps:
1. Open your Google Sheet.
2. Go to **Extensions** → **Apps Script**.
3. Replace existing script with code from [`scripts/apps-script.js`](./scripts/apps-script.js).
4. Save and click **Deploy** → **New Deployment**.
   - Type: **Web App**
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Copy the Web App URL and paste it into `.env.local` as `NEXT_PUBLIC_APPS_SCRIPT_URL` or use the in-app **Google Sheets Sync** modal.

---

## 🌐 SEO & Partner Links
- **Sudarshan AI**: [https://sudarshan-ai.com/](https://sudarshan-ai.com/)
- **Vyapai Blogs**: [https://blogs.vyapai.in/](https://blogs.vyapai.in/)

---

## 🚀 Deployment

### Deploy on Vercel:
```bash
npx vercel --prod
```

### GitHub Repository:
[https://github.com/sheevu/Links-saver-app.git](https://github.com/sheevu/Links-saver-app.git)
