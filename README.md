# QuizSpark

QuizSpark is a Kahoot-style live quiz demo built with TanStack Start + React + Vite.

This README shows how to run the project locally and includes placeholders for screenshots that demonstrate the main flows (Host lobby, Player join, and Play view).

## Quick Start

Install dependencies and run the dev server:

```bash
npm install
npm run dev
# open http://localhost:5173
```

Production build:

```bash
npm run build
```

Available scripts:

- `npm run dev` — start development server
- `npm run build` — production build
- `npm run preview` — preview production build
- `npm run lint` — run linting
- `npm run format` — format code

## How the app works

- Host creates a game in `/create` which generates a 6-digit PIN and opens a host `lobby`.
- Players join via `/join?pin=XXXXXX` or by entering the PIN on the Join page.
- Current implementation stores room state in `localStorage` and per-tab session in `sessionStorage` so multiple tabs on the same browser will sync live.

## Screenshots

Add screenshots to the repository at `assets/screenshots` and they will render here. Suggested files:

- `assets/screenshots/lobby.png` — host lobby (PIN + players list)
- `assets/screenshots/join.png` — join page with PIN prefilled
- `assets/screenshots/play.png` — question/play view with timer and options

Example markdown to include an image (will render when file exists):

```md
![Lobby screenshot](assets/screenshots/lobby.png)
```

How to capture screenshots locally (example using Chromium/Chrome headless):

```bash
# open the app in a browser normally, or use headless Chrome to save a screenshot
google-chrome --headless --screenshot=assets/screenshots/lobby.png --window-size=1280,800 "http://localhost:5173/lobby"
```

Or take manual screenshots and place them in `assets/screenshots/` before committing.

## Notes about multiplayer & limitations

- Current cross-tab sync uses `localStorage` + the `storage` event — works only for tabs on the same origin/browser profile.
- To support cross-device multiplayer, add a backend (WebSocket or server-sent events) and move room state to the server.

## Files to check

- `src/lib/game-store.ts` — session/room helpers (now backed by `localStorage` for room state)
- `src/lib/quiz-data.ts` — demo quizzes + storage of custom quizzes
- `src/routes/lobby.tsx`, `src/routes/join.tsx`, `src/routes/play.tsx` — main flows

## Committing screenshots

After adding screenshot files, commit and push:

```bash
git add assets/screenshots/*.png README.md
git commit -m "Add README + screenshots"
git push origin main
```

If you want, I can add example screenshots from the running local app and commit them for you — tell me if you'd like me to capture and include them now.
