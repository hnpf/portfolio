import { useEffect } from 'react';
import { BLOG_POSTS } from '../constants';

export const useMetadata = (page: string, blogPostId: string | null, isApr: boolean) => {
  useEffect(() => {
    if (isApr) return;
    const name =
      page === "readme" ? "Info" : page.charAt(0).toUpperCase() + page.slice(1);
    const title =
      page === "blog" && blogPostId
        ? `Virex | ${BLOG_POSTS.find((p) => p.id === blogPostId || p.link === blogPostId)?.title || "Post"}`
        : page === "home"
          ? "Virex"
          : `Virex | ${name}`;
    document.title = title;

    let desc =
      "i am virex. a software researcher and problem solver, i explore systems and programming, UI/UX, and security research.";
    let og_title = title;
    let og_img = "https://virex.lol/photography/pfp/main.png";
    if (page === "blog" && blogPostId) {
      const p = BLOG_POSTS.find(
        (p) => p.id === blogPostId || p.link === blogPostId,
      );
      if (p) {
        desc = p.snippet;
        og_title = `Virex Blog | ${p.title}`;
      }
    } else if (page === "readme") {
      desc =
        "README: my personal biography, a quick summary about my mission, and identity.";
    } else if (page === "lens") {
      desc = "lens: my photography collection, all done with a literal phone.";
    }

    const set_meta = (key: string, val: string, is_prop = false) => {
      let el = document.querySelector(
        is_prop ? `meta[property="${key}"]` : `meta[name="${key}"]`,
      );
      if (!el) {
        el = document.createElement("meta");
        if (is_prop) el.setAttribute("property", key);
        else el.setAttribute("name", key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", val);
    };
    set_meta("description", desc);
    set_meta("og:title", og_title, true);
    set_meta("og:description", desc, true);
    set_meta("og:image", og_img, true);
    set_meta("twitter:title", og_title);
    set_meta("twitter:description", desc);

    const old_ld = document.getElementById("json-ld-structured-data");
    if (old_ld) old_ld.remove();

    const ld: any = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Virex",
      url: "https://virex.lol",
      author: {
        "@type": "Person",
        name: "virex",
      },
    };

    if (page === "blog" && blogPostId) {
      const p = BLOG_POSTS.find(
        (p) => p.id === blogPostId || p.link === blogPostId,
      );
      if (p) {
        ld["@type"] = "BlogPosting";
        ld["headline"] = p.title;
        ld["description"] = p.snippet;
        ld["datePublished"] = new Date(p.date).toISOString();
        ld["author"] = { "@type": "Person", name: "Virex" };
      }
    }

    const script = document.createElement("script");
    script.id = "json-ld-structured-data";
    script.type = "application/ld+json";
    script.text = JSON.stringify(ld);
    document.head.appendChild(script);
  }, [page, blogPostId, isApr]);
};
