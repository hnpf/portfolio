# [virex.lol](https://virex.lol)

personal hub and experiment site. material 3 ui, custom android-like shell, built on react 19. research, photography, rants.

![preview](github/demo/virex.png)

## stack

| layer | tech |
|---|---|
| front | react 19 + vite 6, tailwind 4, motion (liquid physics), lucide |
| back | express on vercel, sqlite via `better-sqlite3` |
| assets | webp via `sharp`, custom noise engine |

## features

**lens** — bento-grid photo gallery. swipe/drag, keyboard nav, high-refresh animations. assets compressed ~200mb → ~40mb.

**blog** — linux, e-waste, dev rants. read-tracking + rss at `/rss.xml` (technically works, practically ignored).

**virex shorten** — url shortener at `/r/:slug`. sqlite-backed, dash-managed, route shadow protection included.

**lore** — interactive bio with live build metrics and pgp.

**tracker** — research log. cybersec, dev, design, tooling, whatever i'm currently poking at.

**settings** — accent hue, light/dark/system sync, highHz mode, brutalist mode (0px radii), zen mode, jetbrains mono override, and more.

## getting started

```bash
npm install
npm run dev       # vite + local api
npm run build     # prod build
```

pnpm works too.

## layout

```
api/
  index.ts        express handlers
  db.ts           sqlite logic
public/
  photography/    webp archive
  robots.txt
  rss.xml
  sitemap.xml
src/
  App.tsx         router + page logic
  Dash.tsx        shortener dashboard
  constants.ts    data source
  ThemeContext.tsx accent/mode/settings state
  M3Slider.tsx    material 3 slider component
  M3Switch.tsx    material 3 switch component
  CopyLinkCapsule.tsx
  NotFound.tsx    404 page
  No.tsx          easter egg.. oops didnt mean to say that!
  index.css
  main.tsx
```

## todo ..maybe.
- [ ] amoled capability
- [ ] allow profile container to be toggled off since it's ugly sometimes.
- [ ] fix hover secondary flicker bug
- [ ] actually update the rss feed
- [ ] tracker: persist state to sqlite instead of constants.ts
- [ ] lens: lazy-load below-fold tiles (currently loads all ~40mb upfront)
- [ ] blog: tags + filter ui
- [ ] settings: export/import config as json - future shit. 
- [ ] look into service worker for offline shell

---

[github.com/hnpf](https://github.com/hnpf) · licensed under gpl-3.0
