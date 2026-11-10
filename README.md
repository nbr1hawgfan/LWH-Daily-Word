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

### Added in 1.4 — Pastor's Study
- **Study a passage** — text, top cross references, classic commentaries (Adam Clarke, Matthew Henry, John Gill, Jamieson-Fausset-Brown, Keil-Delitzsch, Calvin, Tyndale notes — list loaded live from bible.helloao.org), Spurgeon sermons on that text (429 indexed in `spurgeon.js`, plus links to the complete Spurgeon Gems Scripture index), and your own past sermons on the passage.
- **Outlines** — 59 original, editable outlines in `outlines.js`, written for a Free Will Baptist pulpit (whosoever will, continuing in faith, believer's baptism by immersion, the Lord's Supper, washing the saints' feet), grouped by topic, church calendar and special services (funeral, wedding, homecoming, revival).
- **My Sermons** — sermon editor with expository/topical/narrative templates, dictation, Preach (Present mode with a running timer) and a "preached on / where" history. Sermons sync with the user's account.
- **Services** (`ceremonies.js`) — complete orders of service: Traditional Christian Wedding (Book of Common Prayer wording, KJV), Modern Christian Wedding, Short and Simple Ceremony, Renewal of Vows; Traditional Funeral (with graveside committal), Celebration of Life, Graveside Committal, Service of Comfort (faith of the departed not known), Service for a Child. Fill in names, dates, family and life notes once; Scripture readings are inserted automatically; saved to My Sermons with an "Officiated" history.
- Settings → "Show Pastor's Study on the Home screen."

### Added in 1.3
- **Morning Devotional** — a guided 10–15 minute quiet time from the Home screen: Be Still (call-to-worship verse, optional minute of quiet) → Read (today's reading-plan chapters, or a Psalm and a Proverb) → Reflect (a daily question, answered by voice or typing, saved to the Journal) → Pray (ACTS prompts plus requests from the Prayer List) → Go (verse to carry and a blessing). Completing it marks the reading-plan day and fills a monthly reading-log calendar.
- **Sync across devices** — Settings → Sync Across Devices. Name + PIN sign-in; journal, saved verses, highlights, prayers, speeches, plans and devotional log stay the same on phone and PC. Data lives in the LWH Companion Supabase project (`dw_users`, `dw_sessions`, `dw_state`), reachable only through the `dw_login / dw_pull / dw_push / dw_logout` functions.
- **Accounts** — readers create their own account (name + PIN) in Settings → Sync Across Devices. Admins get **Manage Readers**: reset a forgotten PIN (one-time temporary PIN, reader chooses a new one at sign-in), unlock, or remove access. Admins never see anyone's notes.
- **Make someone an admin** (Supabase SQL editor, after they create their account): `select dw_admin_set_admin('Ronnie Robertson', true);`

### Added in 1.2
- **Book design** — Crimson Pro book typography, cream paper, oxblood leather header, gold rules; Home and More laid out like a table of contents.
- **Full-screen reading** — the top and bottom bars slide away while reading and return on scroll up, a tap on the page, or at the end of the chapter.
- Page-turn motion between chapters; Previous/Next show the chapter names. App icon matches the cover.

### Added in 1.1
- **Cover** — leather-look Bible cover with the owner's name stamped in gold; tap to open. Can be turned off in Settings.
- **Presentation page** — "Presented to / by / on" with a dedication message and a blessing (Numbers 6:24-26). Fully editable in Settings.
- **Book-style pages** — chapter headings with ornament, drop cap, red letters (when the translation marks the words of Jesus), and a **ribbon bookmark** (tap the ribbon to mark the page).
- **Journal** — Journal, Sermon Notes (church and speaker) and Gratitude entries. **Tap to Speak** dictation, with spoken "period", "comma", "question mark" and "new paragraph". Saves automatically. Searchable, grouped by month.
- **Margin marks** — verses with a journal entry or note show a small pen mark; tapping the verse shows your notes.
- **On This Day** — home card showing what was written or saved on this date in past years.
- **Cross references** — tap a verse → Cross References (OpenBible.info data via bible.helloao.org).
- **Give a copy to someone** — Settings → create a personal link like `.../?for=Ronnie%20Robertson`. The name pre-fills on first open.

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
