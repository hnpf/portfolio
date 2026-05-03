import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface BlogPost {
  id: string;
  title: string;
  snippet: string;
  content: string;
  date: string;
  category: string;
  readTime: string;
  link: string;
  votes: { up: number; down: number };
}

export interface ChangelogEntry {
  id: string;
  version: string;
  title: string;
  date: string;
  changes: {
    category: string;
    items: string[];
  }[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  link: string;
  tags: string[];
}

export interface Photo {
  id: string;
  url: string;
  description?: string;
}

export interface TrackerItem {
  id: string;
  title: string;
  tips: string[];
  tools: string[];
  category: "Cybersec" | "Dev" | "Research" | "Design";
}

export const PROJECTS: Project[] = [
  /*{
    id: 'loom-lang',
    title: 'loom lang',
    description: 'a lightweight, expressive, and efficient programming language. made for speed and simplicity.',
    link: '/loom',
    tags: ['Rust', 'Interpreter']
  },*/
  {
    id: "cons blog",
    title: "cons blog",
    description:
      "a simple react/tsx blog site. follows material design expressive guidelines without being overly bloated and confusing.",
    link: "https://github.com/hnpf/conspiracy.blog",
    tags: ["react", "typescript"],
  },
  {
    id: "mixtapes",
    title: "Mixtapes",
    description: "a modern Linux LibAdwaita-themed YT Music player.",
    link: "https://github.com/m-obeid/Mixtapes",
    tags: ["python", "yt-music"],
  },
  {
    id: "beetrap",
    title: "Beetrap",
    description:
      "a honeypot written in Go, it mimics common network services (SSH, FTP, HTTP) and logs connection attempts in a real-time TUI",
    link: "https://github.com/hnpf/beetrap",
    tags: ["GoLang", "honeypot"],
  },
  {
    id: "sniffcli",
    title: "SniffCLI",
    description:
      "a lightweight TUI packet sniffer and network sentry built in Go. features live protocol visualization, SSH brute-force detection, and outbound device monitoring.",
    link: "https://github.com/hnpf/sniffcli",
    tags: ["GoLang", "Terminal"],
  },
  {
    id: "sysdupd",
    title: "SYSDUPD",
    description:
      "have you wanted to just update your linux system and forgot how, or just too scared to? i never have, but this could be the solution for you!",
    link: "https://github.com/hnpf/sysdupd",
    tags: ["Gtk4", "Python"],
  },
  {
    id: "automate",
    title: "Automate",
    description:
      "a simple wayland autoclicker for linux, made using Python, and gtk4/libadwaita",
    link: "https://github.com/hnpf/automate",
    tags: ["Gtk4", "Python"],
  },
  {
    id: "google-pixel-plymouth",
    title: "Google Pixel Plymouth Theme",
    description:
      "a pixel-accurate gemini boot animation for Linux, also optimized for speed-demon machines.",
    link: "https://github.com/hnpf/google-pixel-plymouth-theme",
    tags: ["Linux", "Design"],
  },
  {
    id: "rust-projects",
    title: "Rust projects",
    description:
      "my collection of low level tools made for speed and reliability, you can find various projects on my GitHub!",
    link: "https://github.com/hnpf",
    tags: ["Rust", "Misc"],
  },
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "bladeandbath-shitpost",
    title: "brutal fantasies is literally the peak of human existence",
    snippet:
      "ok.. i'm coming back from the dead again to talk about the only album that matters right now, and i know its late talking about it. sorry not sorry.",
    content: `
## why im back (again)

it has been almost a week since i last posted but i literally dont care because i took like a month long break before that so i have energy again. the urge called and i answered with a blog post :)

i was gonna talk about sukkubys or blade and bath coming back to life because that whole scene is actually moving lately but i had a realization...

## the only thing that matters

**brutal fantasies** is literally the best album on this planet. no contest. its peak. its the absolute ceiling of the genre.

everyone else can stop recording now because this is it. the atmosphere is perfect. the production? exactly what it needs to be. the absolute dread and instrumental?? oh my god! this is modern beethoven! i have been looping this and honestly nothing else is hitting the same right now. WHAT ARE THEY FEEDING THESE ARTISTS?!

## this is kinda what i noticed on the album..

*   vocals that actually hurt to listen to (in a REALLY good way)
*   that specific raw energy that most dsbm bands try to fake but totally fail at
*   literally no skips!

| album | rating |
| :--- | :--- |
| Brutal Fantasies | 11/10 |
| Soundtrack for a Suicide: Opus II | 11/10 |
| Eternal Damnation | 11/10 |
| ..Of Mourning | 10/10 |
| and everything else | MID! |
---
## anyways, happy wallowing!
    `,
    date: "Apr 30, 2026",
    category: "music",
    readTime: "2 min read",
    votes: { up: 0, down: 0 },
    link: "bladeandbathpeak",
  },
  {
    id: "ricing-supremacy",
    title: "ricing supremacy and why ricing makes you an actually better dev",
    snippet:
      "PLEASE stop staring at ugly default themes. your environment is a reflection of your work.",
    content: `
# aesthetic is actual efficiency (dont @ me!)

if you're still on any default terminal theme, i'm praying for you. making things look good isn't just a "ricer on reddit" thing but more about building a comfortable space where you actually *want* to suffer through merge conflicts!

## why color palettes?

it's the total peak of human engineering. colors, decent contrast, and something that won't torch your retinas at midnight

## final thoughts

stop settling for defaults. start spending time actually configuring your colorscheme instead of shipping :). it's actually something called investment.

> "also, if your terminal is ugly, your logic is probably ugly too :3" - virex ong

  `,
    date: "Apr 26, 2026",
    category: "tech",
    readTime: "2 min read",
    votes: { up: 0, down: 0 },
    link: "gruvbox-supremacy",
  },

  {
    id: "idek-anymore",
    title: "turning ewaste into a small dev rig",
    snippet:
      "this is why I decided to torture myself by putting debian on a snappy chromebook and how it actually kinda works!",
    content: `
## why do i do this to myself?
honestly, there is something so satisfying about taking a "dead" chromebook and making it run a real OS. my old hp x360 (aka snappy) was basically a paperweight, but now it's a dedicated debian 13 box.

### okay, here's the setup..
it’s not just about flashing mrchromebox! it's about making sure the audio actually works and the trackpad actually responds.

* **OS:** debian 13. because I like living on the edge of "stable"
* **DE:** GNOME classic (obviously). it's heavy for these specs but it just feels like home.
* **vim:** the only editor that belongs on a screen this bad.

## moral of the story:

> "it's not ewaste if you can still run a terminal on it."

    `,
    date: "Mar 15, 2026",
    category: "linux",
    readTime: "4 min read",
    votes: { up: 0, down: 0 },
    link: "ewaste-1-fr",
  },

  {
    id: "sysdupd",
    title: "sysdupd: arch updates without the headache",
    snippet:
      "i finally got tired of manual pacman runs, so i built a libadwaita manager for my personal use",
    content: `
# it finally works.
## i built a custom update manager using python, gtk4, and libadwaita.

* it handles systemd timers for background checks and even has a "dangerous" auto-update mode for when i'm lazy.

# some of the features it has:

  * a dynamic distro detection (no hardcoded arch linux distro lol)
  * background service via systemd
  * proper update history logs
  * a sleek adwaita interface

check the source on my github (hnpf) or install it via aur!
( yay -S sysdupd / yay -S sysdupd-git )
    `,
    date: "Jan 16, 2026",
    category: "Dev",
    readTime: "3 min read",
    link: "sysdupd",
  },

  {
    id: "pixel-10-pro-honest-review",
    title: "long term pixel 10 pro use: my review of the tensor G5",
    snippet:
      "the 3nm transition, on device ai, and why the pixel 10 pro is finally a consistent daily driver.",
    content: `
## architectural maturity (the TSMC shift)
* the biggest update to the pixel 10 pro isnt really the outer chassis, but the silicon.

* with the G5 moving to TSMCs 3nm process, the efficiency increase over the previous samsung fabbed repitition slop is insantly noticable.

* thermals are still stable under sustained loads, and the nona-core CPU configuration (with the cortex-x4 at 3.78 ghz) got a much needed lift in single threaded performance

## the memory and multitasking
* paired with 16gb of lpddr5x ram, the os handles aggressive background processes without the typical aggressive killing of cached apps!

## best of all, the camera and computer vision

* the new ISP thrown onto the G5 allows for a literal 100x zoom, which obviously uses on device generative models to throw in some detail that was lost to noise!

* even more noticably, that reliance on cloud-based "video boost"? that's been reduced as well! with more of the heavy lifting for realtime relighting and audio focus AI happening, once again, locally on the TPU.
    `,
    date: "Jan 16, 2026",
    category: "research",
    readTime: "5 min read",
    link: "pixel-10-review",
  },

  {
    id: "cloud-is-someone-elses-computer",
    title: "your cloud is just someone elses computer.",
    snippet: "this is why i hoard data (and you probably should too)",
    content: `
# stop trusting corporations to keep your data safe.

i have massive amounts of storage for a reason. people think im crazy for archiving games, software, and gallery backups, but have you even seen the state of the internet lately?
people call me crazy until it actually comes useful and you lose stuff forever. the internet is made to have temporary-first data.

* if it's on my drive, no one can "un-license" it or edit the content after the fact.
* paying $15 a month for a library that changes every week is a joke.
* i keep games, movies, music, tools, and old software because once they're gone from the main web, they're gone forever!
    `,
    date: "Jan 14, 2026",
    category: "Research",
    readTime: "3 min read",
    link: "cloud-is-someone-elses-computer",
  },

  {
    id: "why-i-actually-use-arch",
    title: "why I actually use arch.. (and it’s not a joke)",
    snippet:
      "everyone thinks arch users just want to flex their fastfetch, but i actually just want a system that doesnt hand bs over to me...",
    content: `
# why arch? (unironically)

honestly if i were to see one more person say "i use arch btw" as a joke i might actually lose it. on a serious note, i use it because i dont want some random distro maintainer deciding what packages i need to have installed.

* **no bloat:** i have exactly what i need and nothing else.
* **the wiki:** literally the holy grail of 'perfect' documentation. if it’s not in the wiki, it probably doesnt even exist.
    `,
    date: "Jan 14, 2026",
    category: "Research",
    readTime: "2 min read",
    link: "why-i-actually-use-arch",
  },

  {
    id: "the-internet-is-dead",
    title: "the internet is dead.",
    snippet:
      "if you think youre still talking to real people on big platforms, i have a bridge to sell you.",
    content: `

i've been looking at the traffic patterns on the major socials and it's literally just bots talking to bots.
it's now just a loop of ai-generated slop being consumed by ai-generated scrapers. dystopian right?

* you post a thought, and three seconds later, five "blue checks" with generic ai names reply with something vaguely related.
* we're literally just being shown what keeps us scrolling for 0.5 seconds longer.
* you can't have a debate anymore because the "person" you are arguing with is probably a clanker running on a server in a basement somewhere.
    `,
    date: "Jan 12, 2026",
    category: "research",
    readTime: "2 min read",
    link: "the-internet-is-dead",
  },

  {
    id: "epstein-files-is-a-joke",
    title: 'the epstein "files" are a joke',
    snippet:
      "so the DOJ finally dropped the files and... surprise! it’s basically just 50 pages of blacked out text...",
    content: `
# the most transparent administration I guess?

the DOJ literally just dropped a bunch of documents that are so redacted they look like modern art.

apparently, they missed the deadline set by the transparency act and are now doing "rolling releases" or.. batches, which is just code for "we're still redacting."
    `,
    date: "Dec 21, 2025",
    category: "Research",
    readTime: "3 min read",
    link: "epstein-files-is-a-joke",
  },

  {
    id: "why-love-open-source",
    title: "heres why i love open source",
    snippet:
      "honestly, open source is just better. it’s all about the community and...",
    content: `
# why open source is absolutely goated

it's literally just people helping people for learning (and overall better code because contributors duh).

* you get to check under the hood of massive projects.
* see how the experienced developers actually make big things.
* contributing feels way better than just gatekeeping.
* community feedback makes everything 10x more secure and efficient.
    `,
    date: "Nov 12, 2025",
    category: "Dev",
    readTime: "1 min read",
    link: "why-love-open-source",
  },
];

export const CHANGELOGS: ChangelogEntry[] = [
  {
    id: "m3-consistency-revamp",
    version: "2026.05.01",
    title: "m3 consistency revamp",
    date: "May 01, 2026",
    changes: [
      {
        category: "material 3 expressive component overhaul",
        items: [
          "slider redesign: using vanilla material 3 expressive slider (!almost! direct port from android 16) to the settings for new saturation and overhauled hue shift.",
          "switch redesign: same as slider, now uses android 16 expressive 2-icon style switch",
          "saturation: a new customization option has arrived! saturation! you can now express your vibrancy depending on the mood or the setup, just how i like it :) - amoled potentially coming soon <3",
          "toggle grouping: added settings toggle grouping so things don't get cluttered. introduced in v1.5.7-stable (m3-revamp-patches)",
          "profile container toggle: in the *sidebar* settings, there's a new toggle! profile container switch; which just toggles the profile container. introduced in v1.5.7-stable (m3-revamp-patches)",
        ],
      },
      {
        category: "component overhaul pre-deployment fixes",
        items: [
          "switch overhaul: rewritten with pixel-perfect dimensions (52x32) and symmetric 6px handle gaps for better visuals",
          "switch stability: fixed inconsistent Y-axis positioning by standardizing centering with top: 50% and margin-top: -8px",
          "slider refinement: moved icon color transitions to CSS to prevent oklch interpolation artifacts during saturation shifts",
        ],
      },
      {
        category: "global & theme fixes",
        items: [
          'saturation fix: transitioned all variable-based color animations from MotionValue to CSS transitions to stop "random" color cycling',
          "flicker bug prevention: implemented a blocking theme-initialization script in index.html and switched to useLayoutEffect in ThemeProvider to eliminate a purple flash on reload",
          "sidebar fixes: moved sidebar background animations to style/CSS to ensure stability during rapid navigation or theme changes",
        ],
      },
    ],
  },
  {
    id: "md3-liquid-sidebar-fix",
    version: "2026.04.30-B",
    title: "liquid physics, fixes, and stability update!",
    date: "Apr 30, 2026",
    changes: [
      {
        category: "sidebar fixes & changes",
        items: [
          "profile makeover: wrapped the sidebar header in a nice rounded material container with expressive padding",
          "pfp edge fix: squashed the bleed-through bug on pfp edges by switching to ring offsets and nested clipping",
          'liquid physics: implemented "ultra-low" mass spring physics for sidebar navigation, creating a "mercury-drop" flow effect',
          "md3 update refinements: added variable stroke weights and tonal containers for navigation items, aligning with android 16/m3e design cues",
          "bug fix: squashed a hyperspecific rendering bug that caused corners to sharpen during rapid hovering",
          "performance: removed heavy filters and blurs to ensure locked 60fps during complex sidebar transitions",
        ],
      },
    ],
  },
  {
    id: "md3-tactile-vibe-shift",
    version: "2026.04.26",
    title: "MD3 makeover and tactile shift",
    date: "Apr 26, 2026",
    changes: [
      {
        category: "material design 3 makeover",
        items: [
          "sidebar overhaul: better use of vertical space and refined page section with proper M3 navigation standards",
          "sidebar cleanup: removed redundant hardware specs and quick theme toggles to focus on navigation",
          "floating sidebar: undock the sidebar with rounded corners for a modern, airy feel",
          "visual depth: added a subtle noise/grain overlay to containers for a more tactile, organic texture",
        ],
      },
      {
        category: "animations and feedback",
        items: [
          "120Hz mode: added high-refresh animation toggle for snappier, low-latency spring physics",
          'signature borders: standardized 6px "signature" borders across all cards, chips, and interactive elements',
          "hover feedback: refined hover animations for cards and chips with scale-up and border-accent effects",
        ],
      },
      {
        category: "performance and stability",
        items: [
          "lens recovery: fixed ReferenceError that caused the gallery to blank out (oops)",
          'sidebar contrast: fixed "darkened" active pill by correcting background layering',
          "lens architecture: moved border hover to ::after pseudo-elements for better paint performance",
          "GPU optimization: swapped backdrop-blur-xl for backdrop-blur-md and added will-change: transform to gallery images",
          "motion refinement: simplified gallery reveal animations to reduce simultaneous compositor work",
          "grain engine: replaced live SVG filters with a high-performance tiled background noise engine",
          "focus mode fix: optimized blur logic to skip heavy image grids, saving massive GPU cycles",
          "layer management: removed excessive will-change hints to prevent browser layer explosion",
        ],
      },
      {
        category: "debug and security",
        items: [
          "debug overhaul: added layout grid lines and technical build metrics (CPU/GPU/OS) inside the debug view",
          "safety first: implemented a confirmation modal for debug mode to prevent accidental layout confusion",
          "terminal refinement: added hover states and standardized 6px borders to the lore terminal",
        ],
      },
    ],
  },
  {
    id: "virex-shorten-launch",
    version: "2026.03.16-C",
    title: "launch: virex shorten!",
    date: "Mar 16, 2026",
    changes: [
      {
        category: "backend progress",
        items: [
          "core: a high-performance URL shortening engine using Express.js and SQLite with better-sqlite3",
          "persistence strategy: used Vercel-optimized SQLite storage using temp link state (not sorry)",
          "vanity and security: added route shadowing protection (dash, api, static, r, etc.) to prevent link hijacking of routes",
          "smart slug gen: custom 6-character hex slug generator with collision-avoidance do-while logic etc etc",
        ],
      },
      {
        category: "post fixes",
        items: [
          "source tracking: `src` tagging for analytics across web/mobile entry points",
          "responsive fash: designed the shortener dashboard with mobile first card layouts and desktop optimized tables",
          "protocol strictness: deep URL validation to make sure theres only valid http/https protocols and 2048-char length limits",
          "better vercel integration: optimized vercel.json with rewrites and serverless function routing for high density performance",
        ],
      },
    ],
  },
  {
    id: "polish-performance-patch-2",
    version: "2026.03.16",
    title: "polish and performance II",
    date: "Mar 16, 2026",
    changes: [
      {
        category: "ux and motion",
        items: [
          'FAB positioning: fixed "scroll to top" button overlapping the sidebar when flipped',
          "mobile performance: added hardware acceleration (GPU) to the mobile navbar for 120fps fluid motion",
          "card responsiveness: eliminated useless hover delays and transition conflicts across all pages",
          "spring physics: some refined card animations with high stiffness springs for better instant feedback",
        ],
      },
      {
        category: "lens and performance",
        items: [
          "proactive loading: increased lens viewport margin to 200px to trigger animations before entry",
          "priority assets: added eager loading for initial lens gallery rows to remove white flashes",
          "scroll smoothness: refined the gallery entry logic for more consistent performance during more rapid scrolling",
        ],
      },
    ],
  },
  {
    id: "the-polish-performance-patch",
    version: "2026.03.15-B",
    title: "polish and performance",
    date: "Mar 15, 2026",
    changes: [
      {
        category: "ux and motion",
        items: [
          "animation lag: fixed card hover animations to be instant and responsive, removing the exit delay",
          "fluid transitions: page transitions should now use spring physics and custom bezier curves for a bouncier feel",
          "navigation refinement: fixed active pill centering and disabled distracting tilt animations on mobile",
          "m3 compliance: removed bottom nav rounding to align with m3 standards",
          "motion GPU: optimized all major animations to run on hardware acceleration",
        ],
      },
      {
        category: "readme and identity",
        items: [
          'immersion mode: added "expand" modal functionality for technical cards, improving readability on narrow screens',
          "mobile scaling: optimized PGP fingerprint, chip text, and stack grids for better information density on mobile",
          "stack cleanup: pruned standard tech from stacks to focus on core specialties (Rust, RE, Security)",
        ],
      },
      {
        category: "settings and ui",
        items: [
          "appearance Sliding: theme mode selector now uses a smooth sliding indicator instead of abrupt switching",
          "themed hue shift: added a vibrant gradient track and live feedback to the custom color slider",
          "visual balance: fixed toggle switch padding symmetry and improved 404 page layout/spacing",
          "theme-aware lens: expanded image view now respects system theme (no longer hardcoded to dark)",
        ],
      },
    ],
  },
  {
    id: "scaling-and-changelog-migration",
    version: "2026.03.15",
    title: "visual balance",
    date: "Mar 15, 2026",
    changes: [
      {
        category: "architecture",
        items: [
          "changelog migration: decoupled devlogs from the blog feed into a dedicated system-level view",
          "routing overhaul: added support for deep linked changelog entries",
          "data schema: structured ChangelogEntry interface for better integrity",
        ],
      },
      {
        category: "UX/UI",
        items: [
          "global scaling: changed root font-size to 90% for optimized information density, things now look much better on desktop and mobile.",
          'settings integration: added "other info" section to settings for easy access to version history, instead of cluttering blog',
          "sidebar refinement: fixed sidebar height and positioning for the new global scale. stuff fits now!",
        ],
      },
    ],
  },
  {
    id: "immersion-integrity-overhaul",
    version: "2026.03.06",
    title: "immersion & integrity overhaul",
    date: "Mar 06, 2026",
    changes: [
      {
        category: "new in readme",
        items: [
          "bio overhaul: replaced filler cards with biography and mission sections",
          "PGP integration: added official PGP Fingerprint to header",
        ],
      },
      {
        category: "new in lens",
        items: [
          "navigation overhaul: new structured layout with centered controls",
          "typography sync: swapped dev mono for site wide display typography",
          "optimized lightbox: removed aggressive blurs and fixed description cutoffs",
          "bento layout: dynamic layout with better performance",
        ],
      },
      {
        category: "tweaks and immersion",
        items: [
          "dynamic theme favicon: favicon now updates based on theme accent color",
          "focus mode (Zen): full-immersion mode with DOF blurs",
          "brutalist mode: option to remove all border radiuses",
          "developer font: global override to JetBrains Mono",
        ],
      },
      {
        category: "performance and utility",
        items: [
          "lens optimization: reduced image assets from ~200MB to ~40MB (WebP conversion)",
          "loom deep search: prefetch markdown for real-time body-content search",
          "PWA support: fully installable via custom manifest",
          "RSS feed: official support (https://virex.lol/rss.xml)",
          "deep SEO: added OpenGraph and JSON-LD structured data",
        ],
      },
    ],
  },
];

export const TRACKER_ITEMS: TrackerItem[] = [
  {
    id: "cybersecurity-ceh",
    title: "ceh cert",
    category: "security",
    tips: [
      "understand the methodology, not just the tool",
      "network layer basics are everything",
    ],
    tools: ["Nmap", "Wireshark", "Metasploit"],
  },
  {
    id: "m3-adwaita-ui",
    title: "m3e, Libadwaita, etc",
    category: "Design",
    tips: [
      "squircles are superior geometry",
      "animations should feel organic and not static",
    ],
    tools: ["Tailwind CSS", "Framer Motion", "Radix UI"],
  },
  {
    id: "systems-automation",
    title: "automation",
    category: "system",
    tips: ["if you must do it twice, script it", "minimalism is a feature."],
    tools: ["Rust", "Vim", "Linux", "GNOME"],
  },
  {
    id: "vulnerability-lab",
    title: "research",
    category: "security",
    tips: [
      "documentation is 50% of the exploit",
      "keep the environment isolated",
    ],
    tools: ["GDB", "Ghidra", "Python"],
  },
];

export const HARDWARE_SPECS = {
  core: [
    { label: "Host", value: "ASRock Z690 Pro RS" },
    { label: "DE/WM", value: "GNOME 49.4" },
    { label: "Kernel", value: "Linux 6.19.10-zen1-1-zen" },
  ],
  processing: [
    {
      label: "CPU",
      value: "Intel(R) Core(TM) i5-14600k (20 cores) @ 5.30 GHz",
    },
    { label: "GPU", value: "AMD Radeon RX 6800 XT" },
  ],
  mem: [
    { label: "Memory", value: "40 GiB DDR4 @ 3700 Mt/s" },
    { label: "Storage Capacity", value: "73.8GB / 1.82TB" },
  ],
};

export const TECH_STACK = {
  web: ["React", "TypeScript", "TailwindCSS", "Next.js", "Node", "Javascript"],
  technical: ["Rust", "Golang", "Java", "Python", "C", "Docker", "bash"],
};
