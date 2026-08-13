/**
 * cf pages func: /functions/blog/[id].js
 *
 * intercepts requests to /blog/<post-id> and rewrites OG meta tags for
 * bots/crawlers (discord, x, slack, etc.) using HTMLRewriter.
 * since virex.lol is a SPA, bots never execute JS, this injects te correct
 * blog post title + snippet as the embed description server-side.
 *
 */

const BLOG_POSTS = [
  {
    id: "2slimey-changed-how-i-listen",
    link: "2slimey-changed-how-i-listen",
    title: "2slimey changed the way I listen to music.",
    snippet:
      "Yes, a genuine opinion of mine. If this title made you roll your eyes, you are exactly who this is for! :)",
    date: "Aug 12, 2026",
    category: "music",
  },
  {
    id: "more-old-blogs-restored",
    link: "more-old-blogs-restored",
    title: "even more history! part 2 of restoring the early blogs",
    snippet:
      "restored a few more gems from the early 2026 snapshots, including some of my favorite rants and the revamped markdown stress test.",
    date: "Aug 1, 2026",
    category: "devlog",
  },
];

const DEFAULT_TITLE = "Virex | Blog";
const DEFAULT_DESC =
  "thoughts on code, systems, music production, and whatever else is on my mind.";
const DEFAULT_IMAGE = "https://virex.lol/photography/pfp/main.png";

const BOT_AGENTS = [
  "Twitterbot",
  "facebookexternalhit",
  "LinkedInBot",
  "Slackbot",
  "TelegramBot",
  "WhatsApp",
  "Discordbot",
  "discordbot",
  "ia_archiver",
  "Googlebot",
  "bingbot",
  "Applebot",
];

function isBot(userAgent) {
  if (!userAgent) return false;
  return BOT_AGENTS.some((bot) => userAgent.includes(bot));
}

class MetaRewriter {
  constructor(meta) {
    this.meta = meta;
    this.replaced = new Set();
  }

  element(element) {
    const prop = element.getAttribute("property");
    const name = element.getAttribute("name");
    const key = prop || name;

    if (!key) return;

    const { title, desc, image, url } = this.meta;

    const map = {
      "og:title": title,
      "og:description": desc,
      "og:image": image,
      "og:url": url,
      "og:type": "article",
      "twitter:title": title,
      "twitter:description": desc,
      "twitter:image": image,
      "twitter:card": "summary_large_image",
      description: desc,
    };

    if (key in map && !this.replaced.has(key)) {
      element.setAttribute("content", map[key]);
      this.replaced.add(key);
    }
  }
}

class TitleRewriter {
  constructor(title) {
    this.title = title;
  }

  element(element) {
    element.setInnerContent(this.title);
  }
}

export async function onRequest({ request, params, next }) {
  const postId = params.id;
  const userAgent = request.headers.get("User-Agent") || "";

  // fetch the original SPA index
  const response = await next();

  // only rewrite for bots, regular users get the normal SPA
  if (!isBot(userAgent)) return response;

  let title = DEFAULT_TITLE;
  let desc = DEFAULT_DESC;
  const image = DEFAULT_IMAGE;
  let pageUrl = `https://virex.lol/blog`;

  if (postId) {
    const post = BLOG_POSTS.find(
      (p) => p.id === postId || p.link === postId
    );
    if (post) {
      title = `Virex Blog | ${post.title}`;
      desc = post.snippet;
      pageUrl = `https://virex.lol/blog/${postId}`;
    }
  }

  const meta = { title, desc, image, url: pageUrl };

  return new HTMLRewriter()
    .on("title", new TitleRewriter(title))
    .on("meta[property]", new MetaRewriter(meta))
    .on("meta[name]", new MetaRewriter(meta))
    .transform(response);
}
