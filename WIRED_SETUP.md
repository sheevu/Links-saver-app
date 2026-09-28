
# ✅ Wired to Your Sheet

**Your Sheet:** https://docs.google.com/spreadsheets/d/1h9dlyn8bzdIr9sq_TGfrarMMZVvSPPZ49zhxAGYM-JE/edit
**Sheet ID:** 1h9dlyn8bzdIr9sq_TGfrarMMZVvSPPZ49zhxAGYM-JE

## What's already wired?
- NEXT_PUBLIC_SHEET_ID is pre-filled in .env.local
- DEFAULT_SHEET_ID exported from lib/sheets.ts
- App will auto-detect this Sheet ID on first load

## Final Step (2 mins) - Deploy Apps Script
You still need to deploy the backend once:

1. Open your sheet: https://docs.google.com/spreadsheets/d/1h9dlyn8bzdIr9sq_TGfrarMMZVvSPPZ49zhxAGYM-JE/edit
2. Extensions → Apps Script
3. Delete any code, paste from `scripts/apps-script.js`
4. Save (Ctrl+S)
5. Deploy → New Deployment → Select type: Web App
   - Description: Link Saver Backend
   - Execute as: Me
   - Who has access: Anyone
   - Click Deploy → Authorize → Copy Web App URL
6. Paste Web App URL into:
   - In-app: Connect Sheets button → Web App URL field
   - AND into .env.local → NEXT_PUBLIC_APPS_SCRIPT_URL

After that, Push All will fill your empty sheet instantly.

## Header Row
Ensure first row is: Title | URL | Label | Tag | Date | Favorite | ID | Favicon
The script auto-creates it if empty.
