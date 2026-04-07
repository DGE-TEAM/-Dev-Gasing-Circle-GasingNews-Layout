// ─────────────────────────────────────────────────────────────
// gc-utils.js — Route detection & body-class management
// ─────────────────────────────────────────────────────────────

import { STATE } from "./gc-state";

/**
 * Extracts the category slug from the current URL.
 * Handles: /c/slug, /c/slug/123, /c/parent/child, /c/parent/child/123, /c/slug/l/latest
 */
export function getCategorySlugFromPath() {
  const parts = window.location.pathname.split("/").filter(Boolean);
  const cIdx = parts.indexOf("c");
  if (cIdx === -1) return null;
  // Take parts after "c", strip page numbers and filter keywords
  const slugParts = parts
    .slice(cIdx + 1)
    .filter(
      (p) =>
        !/^\d+$/.test(p) &&
        p !== "l" &&
        !["latest", "top", "new", "unread", "hot"].includes(p),
    );
  return slugParts.join("/") || null;
}

export function isTargetRoute() {
  return /\/c\/[^/]/.test(window.location.pathname);
}

export function addBodyClass() {
  const slug = getCategorySlugFromPath();
  if (!slug) return;
  const cls = `gc-category-${slug.replace(/\//g, "-")}`;
  document.body.classList.add(cls);
  STATE.currentBodyClass = cls;
}

export function cleanupBodyClass() {
  if (STATE.currentBodyClass) {
    document.body.classList.remove(STATE.currentBodyClass);
    STATE.currentBodyClass = null;
  }
}
