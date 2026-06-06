import { useState, useEffect } from 'react';

export const IS_APR = (() => {
  const now = new Date();
  return now.getMonth() === 3 && now.getDate() === 1;
})();

export const useAprilFools = () => {
  const [fihMode, setFihMode] = useState(false);
  const [popup, setPopup] = useState<string | null>(null);

  useEffect(() => {
    if (!IS_APR) return;

    const msgs = [
      "fih has blocked u.",
      "accept fih as your lord and savior to continue!!",
      "fih was found. please install fish-shield (free).",
      "download more fih today!",
      "issue found! not enough fih.",
    ];

    const gamble = () => {
      const r = Math.random();
      if (r < 0.2) {
        window.location.href = "/no";
      } else if (r < 0.5) {
        setFihMode(true);
        setTimeout(() => setFihMode(false), 15000);
      } else {
        setPopup(msgs[Math.floor(Math.random() * msgs.length)]);
      }
    };
    const gamble_itv = setInterval(gamble, 15000);

    document.body.classList.add("fsh-mode");

    const hijack = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("a, button, .sidebar-item, .bottom-nav-item")) {
        window.location.href = "/fsh-spin.gif";
      }
    };
    window.addEventListener("click", hijack);

    const flip_it = () => {
      const els = document.querySelectorAll("div, p, h1, h2, h3, img, span");
      const target = els[Math.floor(Math.random() * els.length)];
      if (target && !target.closest(".sidebar-item")) {
        target.classList.toggle("fsh-flip");
      }
    };
    const interval = setInterval(flip_it, 3000);

    const titles = [
      "did i get u?",
      "fih.",
      "LOOK BEHIND YOU!!111!",
      "virex (but cooler)",
      "fih | /DEV/NULL/VIREX.",
      "404 fih aint found",
    ];
    const meta_gamble = () => {
      document.title = titles[Math.floor(Math.random() * titles.length)];
      const fsh_svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🐟</text></svg>`;
      const fav = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
      if (fav)
        fav.href = `data:image/svg+xml;utf8,${encodeURIComponent(fsh_svg)}`;
    };
    const meta_itv = setInterval(meta_gamble, 5000);

    return () => {
      document.body.classList.remove("fsh-mode");
      window.removeEventListener("click", hijack);
      clearInterval(interval);
      clearInterval(gamble_itv);
      clearInterval(meta_itv);
    };
  }, []);

  useEffect(() => {
    if (!fihMode) return;

    const fih_it = (node: Node) => {
      if (node.nodeType === 3) {
        const val = node.nodeValue || "";
        if (val.trim().length > 0 && !val.includes("fih")) {
          node.nodeValue = val.replace(/\w+/g, "fih");
        }
      } else {
        for (let i = 0; i < node.childNodes.length; i++) {
          fih_it(node.childNodes[i]);
        }
      }
    };

    let frame: number;
    const observer = new MutationObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => fih_it(document.body));
    });

    observer.observe(document.body, {
      characterData: true,
      childList: true,
      subtree: true,
    });

    fih_it(document.body);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [fihMode]);

  return { popup, setPopup, IS_APR };
};
