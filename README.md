# virex.lol

my personal hub and experiment website. it's basically a custom modern-android-like interface for my research, photography, and rants. built with material 3 rules and react 19. [virex.lol](https://virex.lol)

![preview](github/demo/virex.png)

## stack

- **front:** [React 19](https://react.dev/) + [Vite 6](https://vitejs.dev/) — [Tailwind 4](https://tailwindcss.com/) — [Motion](https://motion.dev/) (liquid physics) — [Lucide](https://lucide.dev/)
- **back:** [Express](https://expressjs.com/) on [Vercel](https://vercel.com) + [SQLite](https://sqlite.org) (`better-sqlite3`)
- **assets:** WebP optimized via `sharp`, custom noise engine for texture

## features

**lens** - bento-grid photo gallery. supports swipe/drag, keyboard nav, and high-refresh animations. optimized assets from ~200MB to ~40MB. you should do the same.

**blog** - rants, linux ricing, and e-waste torture. supports read-tracking and rss at `/rss.xml`, which i don't bother updating since no one uses rss.

**virex shorten** - high-perf url shortener at `/r/:slug`. managed via dash, backed by sqlite. includes route shadowing protection to keep things safe too.

**lore** - interactive bio with real-time build metrics and pgp integration.

**tracker** - current research lab (cybersec, dev, design). tracking random stuff to even toolings.

**settings** - deep personalization:
- accent hue slider + light/dark/system sync
- highHz mode
- brutalist mode (0px radiuses which loooks beautiful and might give u some nostalgia from old virex)
- zen mode (full immersion + focus blurs, really sexy)
- jetbrains mono font override
- and much, much more!

## getting started

```bash
npm install
npm run dev         # starts vite + local api
npm run build       # prod build
```
or, use pnpm!

## layout

```
api/          express handlers + sqlite logic
public/
  photography/ webp archive
  loom/        docs + binaries
src/
  App.tsx      main router + page logic
  Dash.tsx     shortener mgmt
  constants.ts data source
```

[see my profile](https://github.com/hnpf)

---
## licensed under GNU General Public License v3.0
