// @ts-nocheck
import { useState, useEffect, useRef, useCallback } from "react";

export interface TextSearchState {
  query: string;
  isOpen: boolean;
  matchCount: number;
  currentMatch: number;
}

export function useTextSearch() {
  const [searchState, setSearchState] = useState<TextSearchState>({
    query: "",
    isOpen: false,
    matchCount: 0,
    currentMatch: 0,
  });

  const highlightedNodesRef = useRef<
    Array<{ node: Node; originalHTML: string }>
  >([]);

  // remove all highlights from the page
  const clearHighlights = useCallback(() => {
    highlightedNodesRef.current.forEach(({ node, originalHTML }: { node: Node; originalHTML: string }) => {
      if (node.parentElement) {
        node.parentElement.innerHTML = originalHTML;
      }
    });
    highlightedNodesRef.current = [];
  }, []);

  // highlight all matches of the search query
  const highlightMatches = useCallback((query: string) => {
    clearHighlights();

    if (!query.trim()) {
      setSearchState((prev: TextSearchState) => ({ ...prev, matchCount: 0, currentMatch: 0 }));
      return;
    }

    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
    let matchCount = 0;
    const mainContent = document.querySelector("main") || document.body;

    const walk = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent || "";
        if (regex.test(text)) {
          const span = document.createElement("span");
          span.innerHTML = text.replace(
            regex,
            `<mark style="background-color: rgba(255, 193, 7, 0.4); border-radius: 2px; padding: 2px 4px;">$1</mark>`
          );

          if (node.parentElement) {
            const originalHTML = node.parentElement.innerHTML;
            node.parentElement.replaceChild(span, node);
            highlightedNodesRef.current.push({
              node: span,
              originalHTML,
            });
          }

          matchCount += (text.match(regex) || []).length;
          regex.lastIndex = 0;
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as Element;
        // skip script, style, and code highlight elements
        if (!["SCRIPT", "STYLE", "CODE"].includes(element.tagName)) {
          Array.from(node.childNodes).forEach(walk);
        }
      }
    };

    walk(mainContent);
    setSearchState((prev: TextSearchState) => ({
      ...prev,
      matchCount,
      currentMatch: matchCount > 0 ? 1 : 0,
    }));
  }, [clearHighlights]);

  const toggleSearch = useCallback(() => {
    setSearchState((prev: TextSearchState) => ({
      ...prev,
      isOpen: !prev.isOpen,
      query: "",
    }));
    clearHighlights();
  }, [clearHighlights]);

  const updateQuery = useCallback(
    (query: string) => {
      setSearchState((prev: TextSearchState) => ({
        ...prev,
        query,
        currentMatch: 0,
      }));
      highlightMatches(query);
    },
    [highlightMatches]
  );

  const closeSearch = useCallback(() => {
    setSearchState((prev: TextSearchState) => ({
      ...prev,
      isOpen: false,
      query: "",
    }));
    clearHighlights();
  }, [clearHighlights]);

  // setup keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ctrl+f or cmd+f to open search
      if ((e.ctrlKey || e.metaKey) && e.key === "f") {
        e.preventDefault();
        if (!searchState.isOpen) {
          toggleSearch();
        }
      }

      // esca to close search
      if (e.key === "Escape" && searchState.isOpen) {
        e.preventDefault();
        closeSearch();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [searchState.isOpen, toggleSearch, closeSearch]);

  return {
    ...searchState,
    updateQuery,
    toggleSearch,
    closeSearch,
    clearHighlights,
  };
}
