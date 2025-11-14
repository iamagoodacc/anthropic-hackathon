# 🕳️ VOID CLICKER - QUICK START

## 📁 Project Structure
```
void-clicker/
├── package.json          ← Dependencies
├── vite.config.js        ← Vite config
├── tailwind.config.js    ← Tailwind config
├── postcss.config.js     ← PostCSS config
├── index.html            ← HTML entry point
└── src/
    ├── main.jsx          ← React entry point
    ├── App.jsx           ← THE VOID (main game)
    └── index.css         ← Tailwind imports
```

## 🚀 Setup Commands

```bash
# 1. Download all files to a folder called 'void-clicker'

# 2. Navigate to the folder
cd void-clicker

# 3. Install everything
npm install

# 4. Start the void
npm run dev
```

## 🌐 Access the Void
Open: http://localhost:5173

## 🎮 How to "Play"
1. Click the black circle
2. Watch numbers go up
3. Question your life choices
4. Buy meaningless upgrades
5. Repeat

## 📦 What Gets Installed
- React 18 (for the void to exist in)
- Vite (fast dev server)
- Tailwind CSS (to make nothing look pretty)
- Total size: ~250MB node_modules (yes, for a button)

## 🏗️ Build for Production
```bash
npm run build
```
Output goes to `dist/` folder

## 💀 Features
- ✅ Pointless clicking
- ✅ Meaningless upgrades
- ✅ Existential dread
- ✅ Brainrot memes
- ✅ False sense of progression
- ✅ Waste of electricity ⚡

### Prime Blackout

- ✅ When the counter reaches a prime number the screen briefly blacks out for 2 seconds and displays the slogan **PRIMED FOR NOTHING**.
- ⚙️ To tweak timing, edit the constants near the top of `src/App.jsx`:
    - `PRIME_OVERLAY_DURATION` — how long (ms) the blackout stays visible (default 2000)
    - `PRIME_FADE_MS` — fade transition time (ms)

### Random Lock / Password Puzzle

- ✅ Occasionally the center click (`The Void`) randomly locks and becomes disabled.
- ✅ To re-enable it you must complete a simple in-game password puzzle (numeric code). Levels vary length (3–5 digits) and give limited attempts.
- ⚙️ To tweak frequency, edit `LOCK_CHANCE` in `src/App.jsx` (default `0.02` = 2% chance per click).

### Lockout & "Deep-Fry" UX

- ✅ If a player fails all attempts on the password puzzle they are locked out for 5s, the screen briefly shakes, and then the puzzle resets with 3 attempts again.
- ✅ Every 3 full failure cycles the UI becomes more "deep-fried" (color shifts, blur/contrast) to visually punish repeated failure; this stacks and is visible until you clear a password level.
- ✅ When you successfully clear a password level the app resets your void counter to 0 (this is intentional — you earned nothing).

⚙️ Tweak parameters in `src/App.jsx`:
- `LOCK_CHANCE` — chance a click will spawn a password lock
- lockout duration and deep-fry behavior are implemented inline and can be adjusted in the file

### Center Activation Mode

- The center (`The Void`) now starts inactive and will not accept clicks at start.
- The app periodically rolls an activation chance; when triggered the center becomes active and all other UI controls are disabled so the center is the only clickable button.
- Tweak activation behavior in `src/App.jsx`:
    - `ACTIVATION_CHANCE` — probability per interval that the center activates (default 0.02)
    - `ACTIVATION_INTERVAL_MS` — interval (ms) between activation checks (default 3000)

---

**Nothing Inc. - Making nothing since 2025**
