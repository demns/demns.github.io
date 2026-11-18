# Purrfect Shot — web package (v0.3.0)

A one-shot ice-hockey puzzle game with kittens: 60 levels in 3 worlds. Everything (code, art, sound, fonts)
is inside `index.html`; it makes no requests to other sites, sets no cookies and has no tracking.
Progress is saved only in the player's browser.

## What's in here

| File | What it is |
|---|---|
| `index.html` | The game. Opens by double-click too (offline install then stays off). |
| `manifest.webmanifest`, `sw.js`, `icons/` | Let players install the game as an app and play offline after the first visit (https only). |
| `og-image.png` | 1200×630 preview picture for links shared on social media and chat apps. |
| `screenshots/` | Four 1280×720 screenshots for a store page. |
| `LICENSE-Nunito.txt` | Licence of the embedded Nunito font (SIL Open Font License 1.1). Keep it with the game. |

## Publish

**itch.io**
1. Create a new project, set *Kind of project* to **HTML**.
2. Upload this zip as-is and tick **This file will be played in the browser**.
3. Embed options: viewport 1280×720 (or *Click to launch in fullscreen*), tick **Mobile friendly** and **Fullscreen button**.
4. Add the files in `screenshots/` as screenshots, then save and view the page.

**Netlify**
Open https://app.netlify.com/drop and drag the unzipped folder onto the page.

**GitHub Pages**
Put the unzipped files at the top of a repository, then *Settings → Pages → Deploy from a branch* (main, root).

**Your own web space**
Upload the unzipped files into one folder over https. Offline play needs https; everything else works on any host.

## After you publish

Change the two `og-image.png` lines in `index.html` to the full address (for example
`https://you.itch.io/purrfect-shot/og-image.png`), so link previews show the picture everywhere.
For a new version, replace the files and bump `CACHE` in `sw.js`, so installed copies update.
