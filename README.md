# LWH Daily Word

A personal mobile Bible built for the leadership of Logistics Warehouse, Inc.
Red-and-black LWH portal styling, large text, no logins, works as a home-screen app.

## Deploy (GitHub Pages)
1. Create a repo (suggested name: `LWH-Daily-Word`) and upload everything in this folder.
2. Settings → Pages → Deploy from branch → `main` / root.
3. Open `https://<your-account>.github.io/LWH-Daily-Word/` on the phone.
4. iPhone: Share → **Add to Home Screen**. Android: menu → **Install app**.

## Features
- **Home** — greeting by name, time, Fort Smith weather and forecast, Verse of the Day, Today's Proverb (chapter = day of month), continue reading.
- **Reader** — every book and chapter, translation picker (KJV default; NKJV, ESV, NIV, NLT and more loaded live), text size, day/night, swipe between chapters, **read aloud**.
- **Tap a verse** — highlight (4 colors), save, save with note and collection, copy, share, **verse picture** (branded image for texting), compare across translations, use in a speech.
- **Search** — type a reference (`John 3:16`, `Ps 23`, `1 Cor 13:4-7`) or a topic/phrase. Meaning-based search by default; "Exact words only" for word matches; OT/NT filter.
- **Topics** — 13 hand-picked themes for leading people and running a business (Integrity, Hard Work, Servant Leadership, Perseverance, Gratitude, Teamwork, Wisdom, Safety & Care, Stewardship, Peace in Worry, Hope, Kindness, Courage).
- **Speech Builder** — pick theme, occasion (staff meeting, safety meeting, holiday, hard season, welcoming new hires...), length (2/5/10 min) and key verse. Builds an editable devotional with Scripture, reflection, workplace application, challenge and prayer. Save, share, **Present mode** (huge text, auto-scroll, read aloud, screen stays on), and "Copy Polish Prompt" for Claude.
- **Reading Plans** — Gospels in 30 days, Psalms in 60, Wisdom for Leaders (40), New Testament in 90, Bible in a Year.
- **Prayer List** — requests by category, mark answered with a note, answered history.
- **Settings** — name, default translation, text size, layout, theme, voice speed, weather location, **backup / restore** file.

## Data and privacy
Everything (saved verses, notes, speeches, prayers) is stored only on that phone in browser storage. Nothing is sent to LWH or anyone else. Use **Settings → Save Backup** before changing phones.

## Sources
- Scripture: [Bolls Bible API](https://bolls.life) — free, no key. Backup for KJV/WEB: [bible-api.com](https://bible-api.com).
- Weather: [Open-Meteo](https://open-meteo.com) — free, no key.
- Chapters already read are cached on the phone for reading without signal. Search and new chapters need a connection.

## Notes
- Bolls is a free community service with no uptime promise. If it is down, KJV still loads from bible-api.com.
- Modern translations (NIV, ESV, NLT, NKJV) are copyrighted by their publishers. Fine for personal reading; do not republish their text in bulk.
- To update the app: edit files, bump `VERSION` in `sw.js`, push. Phones pick it up on the next open.
