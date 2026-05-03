# [virex.lol](https://virex.lol)

personal hub and experimental site. material 3 ui, custom android-like shell, built on react 19. research, photography, rants.

### screenshots

**desktop**
<table>
  <tr>
    <td><img src="github/demo/virex.png" width="220"/></td>
    <td><img src="github/demo/blog.png" width="220"/></td>
    <td><img src="github/demo/settings.png" width="220"/></td>
    <td><img src="github/demo/readme.png" width="220"/></td>
  </tr>
</table>

**mobile**
<table>
  <tr>
    <td><img src="github/demo/mobilevirex.png" width="160"/></td>
    <td><img src="github/demo/mobileblog.png" width="160"/></td>
    <td><img src="github/demo/mobilesettings.png" width="160"/></td>
    <td><img src="github/demo/mobilereadme.png" width="160"/></td>
  </tr>
</table>

## stack

| layer | tech |
|---|---|
| front | react 19 + vite 6, tailwind 4, motion (liquid physics), lucide |
| back | express on vercel, sqlite via `better-sqlite3` |
| assets | webp via `sharp`, custom noise engine |

## features

**lens** — bento-grid photo gallery. swipe/drag, keyboard nav, high-refresh animations. assets compressed ~200mb → ~40mb.

**blog** — linux, e-waste, dev rants. read-tracking + rss at `/rss.xml` (it's officially re-supported and i actually update it now so yeah.)

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
- [x] fix hover secondary flicker bug
- [ ] fix desktop window height making profile container "squished" when being too low. (honestly would just enforce the noprofilecontainer setting) 
- [ ] amoled capability
- [ ] mobile navbar pill text + icon centered in capsule like state for collapsed sidebar instead of just shortening the buttons themselves
- [ ] maybe some sick bounce/squish animation for slider when you try to drag past the borders
- [ ] or a small stretch-squish physics-based animation when switch toggles 
- [ ] blog: tags + filter ui
- [ ] settings: export/import config as json - future work. 

---

[github.com/hnpf](https://github.com/hnpf) · licensed under gpl-3.0
