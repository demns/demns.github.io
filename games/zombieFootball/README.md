# Zombie Free Kick (v1.0.0)

A Halloween free-kick game: help a little zombie kick a skull past obstacles into the goal.
60 levels in 3 worlds, works on desktop (mouse/keyboard) and phones (touch), in any modern browser.

## What's in this folder

| File | What it is |
|---|---|
| `index.html` | The whole game: code, graphics, sounds and fonts in one file. |
| `manifest.webmanifest`, `sw.js` | Let players install the game as an app and play offline (on https sites). |
| `icons/` | App icons (favicon is built into `index.html`). |
| `og-image.png` | 1200×630 preview shown when the link is shared. |
| `screenshots/` | 1280×720 screenshots for a store or itch.io page. |
| `LICENSE-fonts.txt` | Licence of the two embedded fonts (SIL Open Font License, must stay with the game). |

## Try it locally

Opening `index.html` directly works. To also test install/offline mode, serve the folder:

```
cd zombie-free-kick-web
python3 -m http.server 8000
```
then open http://localhost:8000

## Publish it

**itch.io** (easiest, free)
1. Create a new project, set *Kind of project* to **HTML**.
2. Upload `zombie-free-kick-web.zip` and tick **This file will be played in the browser**.
3. Embed options: viewport **960 × 540**, tick **Mobile friendly** (orientation: landscape) and **Fullscreen button**.
4. Add `screenshots/*.png` and `og-image.png` as cover/screenshots, then save and publish.

**GitHub Pages** (free, your own URL)
1. Create a repository and upload the contents of this folder (not the folder itself).
2. Settings → Pages → *Deploy from a branch* → `main` / root. The game appears at `https://<user>.github.io/<repo>/`.

**Netlify Drop** (free, no account needed for a quick test)
Drag this folder onto https://app.netlify.com/drop

**Your own web space**
Upload the folder contents to any static web host. Use https so offline mode and "install app" work.

After publishing, edit the two `og-image.png` lines in `index.html` to full addresses
(e.g. `https://you.itch.io/zombie-free-kick/og-image.png`) so link previews show the picture everywhere.

## Updating

Replace the files, then change `CACHE` in `sw.js` (for example bump the version number);
otherwise players who installed the game may keep the old copy until their next visit.

## Privacy

No cookies, no analytics, no ads, no requests to other servers (the fonts are embedded).
Progress and settings are stored only in the player's own browser (`localStorage`).

## Credits

Fonts: Creepster (Font Diner, Inc.) and Fredoka (The Fredoka Project Authors), both under the
SIL Open Font License 1.1 (see `LICENSE-fonts.txt`). All other graphics and sounds are generated in code.
