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
    tags: ['Rust', 'Compiler']
  },
  {
    id: 'sniffcli',
    title: 'SniffCLI',
    description: 'A lightweight TUI packet sniffer and network sentry built in Go. Features live protocol visualization, SSH brute-force detection, and outbound device monitoring.',
    link: 'https://github.com/hnpf/sniffcli',
    tags: ['Go', 'TUI']
  },
  {
    id: 'sysdupd',
    title: 'SYSDUPD',
    description: 'Have you wanted to just update your Linux system and forgot? I never did, but this could be the solution for you!',
    link: 'https://github.com/hnpf/sysdupd',
    tags: ['Rust', 'Linux']
  },
  {
    id: 'automate',
    title: 'Automate',
    description: 'A simple Wayland autoclicker for Linux, made with Python, and gtk4/libadwaita',
    link: 'https://github.com/hnpf/automate',
    tags: ['Python', 'GTK4', 'Wayland']
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
    tags: ['Rust', 'Systems']
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'immersion-integrity-overhaul',
    title: 'VIREX: The Immersion & Integrity Overhaul',
    snippet: 'A series of updates focusing on information density, deep site tweaks, and a complete UX overhaul.',
    content: `
# VIREX: The Immersion & Integrity Overhaul (Complete as of Mar 06, 2026)
We've spent the last few days stripping away the filler and focusing on what matters. There's now improved information density, professional utility, and deep immersion. The site now feels less like a playground and rather more proper.

## Readme: Information Density
* **Bio Overhaul**: Replaced the filler cards with a **Biography** and **Mission** section. It's now a universal bio that actually tells you about who I am.
* **PGP Integration**: Added my official PGP Fingerprint directly to the header.

## Lens: The Full Rewrite
* **Navigation Overhaul**: Destroyed the overlapping floating buttons. We now use a structured layout with centered controls on desktop and intuitive swipe gestures on mobile.
* **Typography Sync**: Swapped the "dev mono" headers for the expressive site-wide display typography.
* **Optimized Lightbox**: Removed the aggressive blurs and fixed description cutoffs, keeping a really smooth experience across all devices.
* **Bento Layout**: The photography archive now uses a fairly dynamic Bento layout with enhanced performance.

## Tweaks & Immersion
* **Dynamic Identity**: Added a **Dynamic Favicon** that listens to your theme accent. When you change the accent color, the browser tab icon updates instantly to match.
* **Focus Mode (Zen)**: Added a full-immersion mode with top/bottom depth-of-field blurs and card-level "peeking." Hit \`Esc\` to snap back.
* **Brutalist Mode**: For when you're tired of squircles. Every corner on the site now has a 0px radius.
* **Developer Font**: Global override to JetBrains Mono. It's the only way to browse.

## Performance & Utility
* **Lens Optimization**: **Reduced total image assets from ~200MB to ~40MB** while maintaining visual fidelity. This is due to us now using WebP, instead of JPG, and PNG.
* **Loom Deep Search**: Upgraded the documentation viewer to pre-fetch markdown files, allowing for real-time body-content searching.
* **PWA Support**: The site is now fully installable on mobile and desktop via a custom manifest. It feels like a native app.
* **RSS Feed Compatibility**: You can now add virex blog as an RSS feed! (https://virex.lol/rss.xml). Have fun! :)
* **Deep SEO**: Implemented dynamic OpenGraph tags and JSON-LD structured data for proper metadata previews.

---
*Signed, Virex.*
`,
    date: 'Mar 06, 2026',
    category: 'devlog',
    readTime: '8 min read',
    link: 'immersion-integrity-overhaul'
  },
  {
    id: 'the-great-refactor-2026',
    title: 'Low Standards, make Virex great again! 2026 rebuild',
    snippet: 'I deleted almost everything. It’s smaller, faster, and finally looks how I wanted it to. Let’s talk about the purge.',
    content: `
# Virex is great again now!
It's finally happened. I looked at the old repo and realized I was fighting the code more than I was writing it. So, I did the only logical thing: **I hit delete** .. only on some parts.

## It really is out with the old, in with the "actually good"
The previous iteration of virex.lol was... fine. But it was messy. it had that "bad grammar" feel in the docs and too many components that didn't really need to exist. I stripped it down to the bare essentials. 

### What actually changed?
* **Architecture**: Moved to a hella barebones structure. If a component didn't serve a purpose, IT GOT THE AXE.
* **Design Overhaul**: Fully leaned into a material 3 feel. Soft squircles > sharp corners.
* **The "lens" gallery**: Refactored the photography logic to be way more efficient. No more metadata baggage!
* **Finally, the Blog Engine**: Yes, It's actually functional now. 

## The casualty list
I ended up deleting some of the older update logs. They didn't really fit the new "independent researcher" feel, and honestly, they were just cluttering the site. We're going forward now, not back!

---
It's smaller, it's faster, and it's better. Welcome to virex portfolio (V1 is lost media atp). 

---
## peace.
    `,
    date: 'Feb 26, 2026',
    category: 'devlog',
    readTime: '7 min read',
    link: 'mvga-2026'
  },
  {
    id: 'markdown-test',
    title: 'markdown stress test, testing the new parser',
    snippet: 'checking if the new react-markdown setup can handle me.',
    content: `
# header 1 looks like this
## and header 2 looks like this

this is a normal paragraph with some **bold text**, some *italics*, and a [**link to my github**](https://github.com/hnpf) just to see if it works. 

## testing the code blocks

here is some simple python logic:

\`\`\`python
def add(a, b):
    return a + b

def subtract(a, b):
    return a - b
\`\`\`

## testing lists and formatting
* top level item
    * nested item
    * another nested one
* back to basics

> "if it works on my machine, it's production ready." - basically me

### testing GFM (tables)
| feature | status |
| :--- | :--- |
| headers | working |
| tables | hopefully working |
| sanity | gone? |

---
horizontal rules are cool too.
    `,
    date: 'Jan 17, 2026',
    category: 'devlog',
    readTime: '1 min read',
    link: 'markdown-test'
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
    title: 'Material 3 & LibAdwaita',
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
    { label: 'Desktop', value: 'Gnome 49.1' },
    { label: 'Kernel', value: 'linux 6.19.3-2' }
  ],
  processing: [
    { label: 'CPU', value: 'Intel(R) Core(TM) i5-14600k (20 cores) @ 5.30 GHz' },
    { label: 'GPU', value: 'AMD Radeon RX 6800 XT [Discrete]' }
  ],
  mem: [
    { label: 'Memory', value: '38.92 GiB DDR4 @ 3600 Mt/s' },
    { label: 'Storage Capacity', value: '65.0GB / 1.82TB' }
  ]
};

export const TECH_STACK = {
  web: [
    'React 19',
    'TypeScript',
    'TailwindCSS',
    'Next.js',
    'Three.js',
    'Node.js',
    'PostgreSQL',
    'Docker',
    'Vercel'
  ],
  technical: [
    'Rust',
    'Go',
    'Python',
    'Java',
    'C',
    'C++',
    'Reverse Engineering',
    'Assembly (x86/x64)',
    'Linux kernel',
    'BASH',
  ]
};
