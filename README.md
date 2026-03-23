# virex.lol

my portfolio. it uses material 3 rules, react 19, and it's dense and immersive! [live site](https://virex.lol)

![preview](github/demo/virex.png)

## stack

[React 19](https://react.dev/) + [Vite 6](https://vitejs.dev/) — [Tailwind 4](https://tailwindcss.com/) — [Motion](https://motion.dev/) — [Lucide](https://lucide.dev/) — deployed on [Vercel](https://vercel.com)

## quick start

```bash
npm install
npm run dev    # dev server
npm run build  # prod build
```

## what's in here:

**lens** - photography gallery with a bento grid layout, lightbox, swipe/drag navigation

**loom docs** - embedded docs viewer for my [Loom language](https://github.com/hnpf/LOOM_PROGRAMMING_LANGUAGE). prefetches all markdown on load for full body-content search

**blog** - markdown blog with read-tracking, rss at `/rss.xml`, and a zen/focus mode

**url shortener** - `/r/:path` redirect system backed by sqlite, managed from the dash

**settings** - theme (light/dark/system), accent color w/ custom hue, brutalist mode, jetbrains mono font, sidebar flip/collapse, focus mode

misc: dynamic favicon that matches your accent color, PWA manifest, OpenGraph + JSON-LD, `llms.txt`

## structure

```
src/          components + logic
public/
  loom/       language docs + binaries
  photography/ webp photography archive
  llms.txt    clanker-readable site context
```

---

[hnpf](https://github.com/hnpf)
