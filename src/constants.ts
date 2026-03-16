import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

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
  category: 'Cybersec' | 'Dev' | 'Research' | 'Design';
  status: 'Live' | 'Complete' | 'Researching';
}

export const PROJECTS: Project[] = [
  {
    id: 'loom-lang',
    title: 'Loom Language',
    description: 'A lightweight, expressive, and efficient programming language. Built for speed and simplicity.',
    link: '/loom',
    tags: ['Rust', 'Interpreter']
  },
  {
    id: 'sniffcli',
    title: 'SniffCLI',
    description: 'A lightweight TUI packet sniffer and network sentry built in Go. Features live protocol visualization, SSH brute-force detection, and outbound device monitoring.',
    link: 'https://github.com/hnpf/sniffcli',
    tags: ['GoLang', 'Terminal']
  },
  {
    id: 'sysdupd',
    title: 'SYSDUPD',
    description: 'Have you wanted to just update your Linux system and forgot? I never did, but this could be the solution for you!',
    link: 'https://github.com/hnpf/sysdupd',
    tags: ['Gtk4', 'Python']
  },
  {
    id: 'automate',
    title: 'Automate',
    description: 'A simple Wayland autoclicker for Linux, made with Python, and gtk4/libadwaita',
    link: 'https://github.com/hnpf/automate',
    tags: ['Gtk4', 'Python']
  },
  {
    id: 'google-pixel-plymouth',
    title: 'Google Pixel Plymouth Theme',
    description: 'A pixel-accurate Gemini boot animation for Linux, optimized for speed-demon machines.',
    link: 'https://github.com/hnpf/google-pixel-plymouth-theme',
    tags: ['Linux', 'Design']
  },
  {
    id: 'rust-projects',
    title: 'Rust projects',
    description: 'My collection of low level tools made for speed and reliability, you can find various projects in my GitHub!',
    link: 'https://github.com/hnpf',
    tags: ['Rust', 'Misc']
  }
];

export const BLOG_POSTS: BlogPost[] = [
{
    id: 'idek-anymore',
    title: 'Turning ewaste into a small dev rig: CHROMEBOOK IS HELL',
    snippet: 'This is why I decided to torture myself by putting debian on a snappy chromebook and how it actually kinda works!',
    content: `
## Why do I do this to myself?
Honestly, there is something so satisfying about taking a "dead" chromebook and making it run a real OS. My old hp x360 (aka snappy) was basically a paperweight, but now it's a dedicated debian 13 box.

### Okay, here's the setup..
It’s not just about flashing mrchromebox! It's about making sure the audio actually works and the trackpad actually responds.

* **OS:** Debian 13. because I like living on the edge of "stable"
* **DE:** GNOME classic (obviously). It's heavy for these specs but it just feels like home.
* **vim:** The only editor that belongs on a screen this bad.

## moral of the story!

> "it's not ewaste if you can still run a terminal on it."

    `,
    date: 'Mar 15, 2026',
    category: 'linux',
    readTime: '4 min read',
    votes: { up: 0, down: 0 },
    link: 'ewaste-chronicles-1-fr'
  },
  {
    id: 'cybersec-101',
    title: 'Basic Cybersec And How To Not Be A Victim',
    snippet: 'Keep your life private.',
    content: `
The internet is a hostile environment, and most users are making themselves easy targets. Protecting yourself doesn't require a degree in computer science. it just requires discipline and the right tools. 

## 1. Password management is a must-have.
If you are still reusing the same password across multiple sites, you are asking to be compromised. You should absolutely use a password manager to generate and store complex passwords for everything. 

## 2. You need to enable MFA!
 Passwords alone are no longer enough. Whenever possible, please use MFA! You should avoid SMS-based codes if you can. Use an authenticator app or a physical security key. This is so that even if your password is stolen, your account stays inaccessible. 

 ## 3. Software updates are your best defense!
 Developers don't just release updates for new features! They release updates to patch security vulnerabilities. When your OS prompts you for an update, absolutely go through with it. Delaying updates is simply leaving the door unlocked, especially if there's a known issue. 

 ## 4. Avoid phishing attacks.
 Phishing is the most effective way to get pwned. Be skeptical of EVERY link, especially those in emails or DMs that create a sense of urgency. If a person or service claims there is an issue with your account, go directly to the official website instead of clicking the link provided, always check your links. 

 ## 5. Public Wi-Fi is a serious thing to avoid, don't use it.
 Absolutely don't use public Wi-Fi for sensitive tasks unless you are using a known trusted VPN. Your home network should use WPA3 encryption if your hardware supports it, and your router's default admin password should be changed immediately. 

 ### Security Table
| tool | priority | status |
| :--- | :--- | :--- |
| A Password Manager | Critical | Check |
| MFA | High | Check |
| Updates | High | Check |

---

> "security is a process, not a product." - bruce schneier (basically)
    `,
    date: 'Jan 17, 2026',
    category: 'Cybersec',
    readTime: '2 min read',
    link: 'cybersec-101'
  },
  {
    id: 'sysdupd',
    title: 'sysdupd: Arch updates without the headache',
    snippet: 'I finally got tired of manual Pacman runs, so I built a libadwaita manager for my personal rig',
    content: `
# it finally works.
## I've built a custom update manager using python, gtk4, and libadwaita. 

* It handles systemd timers for background checks and even has a "dangerous" auto-update mode for when i'm lazy.

# Some of the features:

  * A dynamic distro detection (no hardcoded Arch linux rig lol) 
  * Background service integration via systemd
  * Proper update history logs
  * A sleek Adwaita interface

check the source on my github (hnpf) or install it via the aur soon! 
( yay -S sysdupd / yay -S sysdupd-git )
    `,
    date: 'Jan 16, 2026',
    category: 'Dev',
    readTime: '3 min read',
    link: 'sysdupd'
  },
  {
    id: 'pixel-10-pro-honest-review',
    title: 'Long Term Pixel 10 Pro Use: My Review of the Tensor G5 Architecture',
    snippet: 'A deep dive into the 3nm transition, on-device generative models, and why the Pixel 10 Pro is finally a consistent daily driver.',
    content: `
## Architectural Maturity: The TSMC Shift
* The most significant update to the Google Pixel 10 Pro isn't the outer chassis, but the silicon. 

* With the Tensor G5 moving to TSMC's 3nm process, the efficiency gains over the previous Samsung-fabbed iterations are immediately apparent. 

* Thermals are still stable under sustained loads, and the nona-core CPU configuration (with the cortex-x4 at 3.78 ghz) has a much needed lift in single-threaded performance!

## The Memory and Multitasking
* Paired with 16gb of lpddr5x ram, the system handles aggressive background process management without the typical aggressive killing of cached apps!

* For full-stack devs like me, or power users running multiple containers or local testing environments, the overhead is finally sufficient.

## Best of all, The Camera & Computer Vision

* The new Image Signal Processor (ISP) baked into the G5 allows for a literal 100x pro res zoom, which uses on-device generative models to actually reconstruct detail that was once lost to noise!

* Even more notably, that reliance on cloud-based "video boost"? That's been reduced as well! With more of the heavy lifting for real-time relighting and audio focus AI happening, once again, locally on the TPU.
    `,
    date: 'Jan 16, 2026',
    category: 'Research',
    readTime: '5 min read',
    link: 'pixel-10-pro-honest-review'
  },
  {
    id: 'the-web-is-cooked',
    title: 'The web is cooked (..And we are the ones smelling the smoke)',
    snippet: 'Why does a site need more processing power than the apollo 11 moon landing?? The state of web dev is actually embarrassing.',
    content: `
# The modern web is basically malware at this point.

I was looking at a "minimalist" landing page the other day and the dev tools showed **12mb of javascript**. For a page with three buttons and a logo. Are we okay?

* Developers are importing entire ecosystems just to handle a toggle menu. If you need 500kb of react code for a STATIC site, you aren't an engineer.
* 60% of your load time is just a dozen different analytics scripts trying to figure out how long you hovered over a "buy now" button. 
* We've reached a point where we have frameworks to fix the performance issues caused by the *other* frameworks we're already using. 

I built virex.lol to be fast because I actually respect your hardware. The average webpage in 2026 is over 2.5mb, most of which is just "management overhead" and ads. 
    `,
    date: 'Jan 14, 2026',
    category: 'Dev',
    readTime: '2 min read',
    link: 'the-web-is-cooked'
  },
  {
    id: 'cloud-is-someone-elses-computer',
    title: 'Your cloud is just someone elses computer.',
    snippet: 'This is why i hoard data (and you should too)',
    content: `
# Stop trusting corporations to keep your data safe. 

I have massive amounts of storage for a reason. People think im crazy for archiving games, software, and gallery backups, but have you even seen the state of the internet lately?
People call me crazy until it actually comes useful and you lose stuff forever. The internet is made to have temporary-first data.

* If it's on my drive, no one can "un-license" it or edit the content after the fact.
* Paying $15 a month for a library that changes every week is a joke.
* I keep games, movies, music, tools, and old software because once they're gone from the main web, they're gone FOREVER.
    `,
    date: 'Jan 14, 2026',
    category: 'Research',
    readTime: '3 min read',
    link: 'cloud-is-someone-elses-computer'
  },
  {
    id: 'why-i-actually-use-arch',
    title: 'Why I actually use Arch.. (and it’s not for the meme)',
    snippet: 'Everyone thinks Arch users just want to flex their Neofetch, but I actually just want a system that doesnt hand bs over to me...',
    content: `
# Why Arch? (unironically)

Honestly if I were to see one more person say "I use Arch btw" as a joke I might actually lose it. On a serious note, I use it because I dont want some random distro maintainer deciding what packages I need to have installed.

* **No bloat:** I have exactly what I need and nothing else. 
* **The Wiki:** Literally the holy grail of 'perfect' documentation. If it’s not in the wiki, it probably doesnt even exist.
* **Rolling release:** Yes, I want the latest kernel features immediately, and NOT in six months when the "stable" release feels like prehistoric technology.
    `,
    date: 'Jan 14, 2026',
    category: 'Research',
    readTime: '2 min read',
    link: 'why-i-actually-use-arch'
  },
  {
    id: 'the-internet-is-dead',
    title: 'The internet is dead.',
    snippet: 'If you think you are talking to real people on the big platforms anymore, I have a bridge to sell you.',
    content: `
# This is why I self host my website.

I've been looking at the traffic patterns on the major socials and it's literally just bots talking to bots. 
It's now just a loop of ai-generated slop being consumed by ai-generated scrapers. Dystopian right?

* You post a thought, and three seconds later, five "blue checks" with generic ai names reply with something vaguely related.
* We aren't even being shown what's good anymore, rather, we're just being shown what keeps us scrolling for 0.5 seconds longer. 
* You can't have a debate anymore because the "person" you are arguing with is probably a clanker running on a server in a basement somewhere.
    `,
    date: 'Jan 12, 2026',
    category: 'Research',
    readTime: '2 min read',
    link: 'the-internet-is-dead'
  },
  {
    id: 'epstein-files-is-a-joke',
    title: 'The epstein "files" is a joke!',
    snippet: 'So the DOJ finally dropped the files and... surprise! it’s basically just 50 pages of ONLY blacked out text...',
    content: `
# The most transparent administration I guess?

The DOJ literally just dropped a bunch of documents that are so redacted they look like modern art.

Apparently, they missed the deadline set by the transparency act and are now doing "rolling releases" slash slash.. batches, which is just code for "we're still redacting."
    `,
    date: 'Dec 21, 2025',
    category: 'Research',
    readTime: '3 min read',
    link: 'epstein-files-is-a-joke'
  },
  {
    id: 'why-love-open-source',
    title: 'This is why I love Open Source',
    snippet: 'honestly, open source is just built different. it’s all about the community and...',
    content: `
# Why Open Source is absolutely goated

It's literally just people helping people for learning (and overall better code).

* You get to peek under the hood of massive projects.
* See how the experienced developers actually build things.
* Contributing feels way better than just gatekeeping code.
* Community feedback makes everything 10x more secure and efficient.
    `,
    date: 'Nov 12, 2025',
    category: 'Dev',
    readTime: '1 min read',
    link: 'why-love-open-source'
  },
  {
    id: 'first-blog-post',
    title: 'This is the first blog post!',
    snippet: 'This is the first blog post, and im happy to share updates on..',
    content: `
# Hello, World!

I'm happy to share updates on my projects and thoughts on development and other topics!

As a developer, I believe in sharing knowledge and experiences.

This blog will cover everything from coding tutorials to personal insights on the tech industry.

Stay tuned for more content!
    `,
    date: 'Nov 04, 2025',
    category: 'Dev',
    readTime: '1 min read',
    link: 'first-blog-post'
  }
];

export const CHANGELOGS: ChangelogEntry[] = [
  {
    id: 'polish-performance-patch-2',
    version: '2026.03.16',
    title: 'Polish & Performance II',
    date: 'Mar 16, 2026',
    changes: [
      {
        category: 'UX & Motion',
        items: [
          'FAB Positioning: Fixed scroll-to-top button overlapping the sidebar when flipped',
          'Mobile Performance: Added hardware acceleration (GPU) to the mobile navbar for 120fps fluid motion',
          'Card Responsiveness: Eliminated artificial hover delays and transition conflicts across all pages',
          'Spring Physics: Refined card animations with high-stiffness springs for instantaneous feedback'
        ]
      },
      {
        category: 'Lens & Performance',
        items: [
          'Proactive Loading: Increased Lens viewport margin to 200px to trigger animations before entry',
          'Priority Assets: Enabled eager loading for initial Lens gallery rows to eliminate white flashes',
          'Scroll Smoothness: Refined gallery entry logic for more consistent framerates during rapid scrolling'
        ]
      }
    ]
  },
  {
    id: 'the-polish-performance-patch',
    version: '2026.03.15-B',
    title: 'Polish & Performance',
    date: 'Mar 15, 2026',
    changes: [
      {
        category: 'UX & Motion',
        items: [
          'Animation Lag: Fixed card hover animations to be instant and responsive, removing the exit delay',
          'Fluid Transitions: Page transitions now use spring physics and custom bezier curves for a "bouncier" premium feel',
          'Navigation Refinement: Fixed active pill centering and disabled distracting tilt animations on mobile',
          'Material Compliance: Removed bottom nav rounding to align with Material Design standards',
          'Motion-GPU: Optimized all major animations to run on hardware acceleration'
        ]
      },
      {
        category: 'Readme & Identity',
        items: [
          'Terminal Overhaul: Replaced the image toggle with a minimal, high-legibility terminal component with vertical stats',
          'Immersion Mode: Added "Expand" modal functionality for technical cards, improving readability on narrow screens',
          'Mobile Scaling: Optimized PGP fingerprint, chip text, and stack grids for better information density on mobile',
          'Stack Cleanup: Pruned standard tech from stacks to focus on core specialties (Rust, RE, Security)'
        ]
      },
      {
        category: 'Settings & UI',
        items: [
          'Appearance Sliding: Theme mode selector now uses a smooth sliding indicator instead of abrupt switching',
          'Themed Hue Shift: Added a vibrant gradient track and live feedback to the custom color slider',
          'Visual Balance: Fixed toggle switch padding symmetry and improved 404 page layout/spacing',
          'Theme-Aware Lens: Expanded image view now respects system theme (no longer hardcoded to dark)'
        ]
      },
      {
        category: 'Performance',
        items: [
          'Lens Optimization: Implemented eager loading and async decoding for expanded images to eliminate lag',
          'Gradient Removal: Replaced expensive 404 blurs with clean, performant layouts',
          'Progress Logic: Refined Temporal Progress component with high-precision system time tracking'
        ]
      }
    ]
  },
  {
    id: 'scaling-and-changelog-migration',
    version: '2026.03.15',
    title: 'Visual Balance',
    date: 'Mar 15, 2026',
    changes: [
      {
        category: 'Architecture',
        items: [
          'Changelog Migration: Decoupled devlogs from the blog feed into a dedicated system-level view',
          'Routing Overhaul: Added support for deep-linked changelog entries',
          'Data Schema: Implemented structured ChangelogEntry interface for better data integrity'
        ]
      },
      {
        category: 'UX/UI',
        items: [
          'Global Scaling: Adjusted root font-size to 90% for optimized information density, EVERYTHING now looks good on desktop and mobile.',
          'Settings Integration: Added "System Info" section to settings for easy access to version history, instead of cluttering the Blog',
          'Sidebar Refinement: Optimized sidebar height and positioning for the new global scale. Things fit now!'
        ]
      }
    ]
  },
  {
    id: 'immersion-integrity-overhaul',
    version: '2026.03.06',
    title: 'The Immersion & Integrity Overhaul',
    date: 'Mar 06, 2026',
    changes: [
      {
        category: 'New In Readme',
        items: [
          'Bio Overhaul: Replaced filler cards with Biography and Mission sections',
          'PGP Integration: Added official PGP Fingerprint to header'
        ]
      },
      {
        category: 'New in Lens',
        items: [
          'Navigation Overhaul: New structured layout with centered controls',
          'Typography Sync: Swapped dev mono for site-wide display typography',
          'Optimized Lightbox: Removed aggressive blurs and fixed description cutoffs',
          'Bento Layout: Dynamic layout with enhanced performance'
        ]
      },
      {
        category: 'Tweaks & Immersion',
        items: [
          'Dynamic Identity: Favicon now updates based on theme accent color',
          'Focus Mode (Zen): Full-immersion mode with depth-of-field blurs',
          'Brutalist Mode: Option to remove all border radiuses',
          'Developer Font: Global override to JetBrains Mono'
        ]
      },
      {
        category: 'Performance & Utility',
        items: [
          'Lens Optimization: Reduced image assets from ~200MB to ~40MB (WebP conversion)',
          'Loom Deep Search: Pre-fetch markdown for real-time body-content search',
          'PWA Support: Fully installable via custom manifest',
          'RSS Feed: Official support (https://virex.lol/rss.xml)',
          'Deep SEO: Implemented OpenGraph and JSON-LD structured data'
        ]
      }
    ]
  }
];

export const TRACKER_ITEMS: TrackerItem[] = [
  {
    id: 'cybersecurity-ceh',
    title: 'CEH Certification',
    category: 'Cybersec',
    status: 'Live',
    tips: ['Understand the methodology, not just the tool!', 'Network layer fundamentals are everything'],
    tools: ['Nmap', 'Wireshark', 'Metasploit', 'Burp Suite']
  },
  {
    id: 'm3-adwaita-ui',
    title: 'M3e, LibAdwaita, etc',
    category: 'Design',
    status: 'Complete',
    tips: ['Squircles are superior geometry', 'Animations should feel organic and not robotic'],
    tools: ['Tailwind CSS', 'Framer Motion', 'Radix UI', 'LibAdwaita']
  },
  {
    id: 'systems-automation',
    title: 'Systems & Automation',
    category: 'Dev',
    status: 'Live',
    tips: ['If you do it twice, script it', ' Minimalism is not a constraint.', 'Minimalism is a feature.'],
    tools: ['Rust', 'Vim', 'Arch Linux', 'GNOME']
  },
  {
    id: 'vulnerability-lab',
    title: 'Vulnerability Research',
    category: 'Research',
    status: 'Researching',
    tips: ['Documentation is 50% of the exploit', 'Keep the lab environment isolated'],
    tools: ['GDB', 'Ghidra', 'Docker', 'Python']
  }
];

export const HARDWARE_SPECS = {
  core: [
    { label: 'Host', value: 'MSI MEG Z690 GODLIKE' },
    { label: 'Window Manager', value: 'Hyprland' },
    { label: 'Kernel', value: 'Linux 6.19.6-zen' }
  ],
  processing: [
    { label: 'CPU', value: 'Intel(R) Core(TM) i5-14600k (20 cores) @ 5.30 GHz' },
    { label: 'GPU', value: 'AMD Radeon RX 6800 XT' }
  ],
  mem: [
    { label: 'Memory', value: '40 GiB DDR4 @ 3700 Mt/s' },
    { label: 'Storage Capacity', value: '73.8GB / 1.82TB' }
  ]
};

export const TECH_STACK = {
  web: [
    'React 19',
    'TypeScript',
    'TailwindCSS',
    'Next.js',
    'Three.js',
  ],
  technical: [
    'Rust',
    'Go',
    'Python',
    'Java',
    'C',
    'C++',
    'Assembly (x86/x64)',
  ]
};
