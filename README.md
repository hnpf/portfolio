## Virex Portfolio

> "It's small, it's faster, and it's finally better."

My portfolio! A high-performance, minimalist but beautiful portfolio built with React 19, focusing on information density, and deep immersion.

![Virex Preview](github/demo/virex.png)

##  Quick Start:

```bash
# install dependencies
npm install

# start up the dev server
npm run dev

# build for production
npm run build
```

## The Tech Stack:

- **Framework**: [React 19](https://react.dev/) + [Vite 6](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) (Expressive UI, Material 3 & Adwaita rules and patterns)
- **Animation**: [Motion](https://motion.dev/) (Framer Motion)
- **Content**: [React Markdown](https://github.com/remarkjs/react-markdown) + [Remark GFM](https://github.com/remarkjs/remark-gfm)
- **Deployment**: [Vercel](https://vercel.com)
- **Icons**: [Lucide React](https://lucide.dev/)

## Key Features:

### Lens (Photography Archive)
A fully rewritten photography gallery optimized for performance.
- **Bento Layout**: Dynamic, responsive grid for visual storytelling.
- **Optimized Lightbox**: Smooth transitions and intuitive controls.

### Loom Language Docs
Integrated documentation viewer for the **Loom** programming language.
- **Deep Search**: Pre-fetches Markdown for real-time body-content searching.
- **Tutorials & Guides**: Stdlib and concurrency documentation.

### Blog & Devlog
A functional, lightweight blog engine with full Markdown support.
- **RSS Feed**: Available at `/rss.xml`.
- **Zen Mode**: Immersive reading with depth-of-field blurs and card "peeking."
- **Brutalist Mode**: One-click UI shift to 0px border radii.

### Technical Prowess
- **Dynamic Favicon**: Favicon updates instantly to match your theme accent.
- **PWA Support**: Fully installable via a custom manifest.
- **SEO Optimized**: Dynamic OpenGraph tags and JSON-LD structured data.
- **LLM Friendly**: Includes `llms.txt` and `llms-full.txt` for AI context.

## Project Structure

- `src/`: Core React components and logic.
- `public/loom/`: Loom language documentation and binary assets.
- `public/photography/`: Optimized WebP image archives.
- `public/llms.txt`: Machine-readable site context.

---

Built with love, by [virex](https://github.com/hnpf). 
*Check out the [live site](https://virex.lol) or follow the [RSS feed](https://virex.lol/rss.xml).*
