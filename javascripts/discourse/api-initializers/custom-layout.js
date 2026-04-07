// =============================================================
// GASING CIRCLE — Academy News Theme Component
// File: javascripts/discourse/api-initializers/custom-layout.js
// Version: 3.0.0 — Dynamic Category, Date Filter Fix, Pagination
// =============================================================

import { apiInitializer } from "discourse/lib/api";
import { later } from "@ember/runloop";
import { getOwner } from "@ember/application";
import { ajax } from "discourse/lib/ajax";
import { popupAjaxError } from "discourse/lib/ajax-error";
import moment from "moment";

// ─────────────────────────────────────────────────────────────
// HELPER: SVG ICONS
// ─────────────────────────────────────────────────────────────
const SVG = {
  search: `<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"/></svg>`,
  calendar: `<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/></svg>`,
  filter: `<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.553.894l-4 2A1 1 0 016 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clip-rule="evenodd"/></svg>`,
  heartOutline: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
  heartFilled: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
  heart: `<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"/></svg>`,
  chat: `<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clip-rule="evenodd"/></svg>`,
  eye: `<svg viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/><path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/></svg>`,
  bookmark: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>`,
  share: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>`,
  reply: `<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>`,
  more: `<svg viewBox="0 0 20 20" fill="currentColor"><path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"/></svg>`,
  save: `<svg viewBox="0 0 20 20" fill="currentColor"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"/></svg>`,
  report: `<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clip-rule="evenodd"/></svg>`,
  newspaper: `<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clip-rule="evenodd"/><path d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V7z"/></svg>`,
  chevronLeft: `<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>`,
  chevronRight: `<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/></svg>`,
  chevronUp: `<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd"/></svg>`,
  chevronDown: `<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>`,
};

// ─────────────────────────────────────────────────────────────
// STATE
// ─────────────────────────────────────────────────────────────
const STATE = {
  // Filters
  activeFilter: "latest",
  filterOpen: false,
  dateOpen: false,
  selectedFilters: [],
  searchQuery: "",
  dateRange: { start: null, end: null },
  // UI
  activeTopicId: null,
  calendarMonth: { left: null, right: null },
  expandedReplies: {},
  // Pagination
  allTopics: [],
  moreTopicsUrl: null,
  isLoadingMore: false,
  // Dynamic category
  categorySlug: null,
  categoryInfo: null,
  availableTags: [],
  currentBodyClass: null,
};

let discourseApi = null;

// ─────────────────────────────────────────────────────────────
// UTILITY — Dynamic Category Detection
// ─────────────────────────────────────────────────────────────

/**
 * Extracts the category slug from the current URL.
 * Handles: /c/slug, /c/slug/123, /c/parent/child, /c/parent/child/123, /c/slug/l/latest
 */
function getCategorySlugFromPath() {
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

function isTargetRoute() {
  return /\/c\/[^/]/.test(window.location.pathname);
}

function addBodyClass() {
  const slug = getCategorySlugFromPath();
  if (!slug) return;
  const cls = `gc-category-${slug.replace(/\//g, "-")}`;
  document.body.classList.add(cls);
  STATE.currentBodyClass = cls;
}

function cleanupBodyClass() {
  if (STATE.currentBodyClass) {
    document.body.classList.remove(STATE.currentBodyClass);
    STATE.currentBodyClass = null;
  }
}

// ─────────────────────────────────────────────────────────────
// TAG HELPERS — Dynamic (no hardcoded list)
// ─────────────────────────────────────────────────────────────

function renderTag(tagName) {
  if (!tagName) return "";
  // CSS class is derived dynamically from tag name
  const cls = `gc-tag--${tagName.toLowerCase().replace(/[\s/]+/g, "-")}`;
  const label = tagName.charAt(0).toUpperCase() + tagName.slice(1);
  return `<span class="gc-tag ${cls}">${label}</span>`;
}

function getTopicTag(topic) {
  if (!topic) return null;
  const tags = topic.tags || [];
  const first = tags[0];
  if (!first) return null;
  return typeof first === "string"
    ? first
    : first?.name || first?.id || String(first);
}

/**
 * Extracts unique tag names from an array of topics.
 */
function extractTagsFromTopics(topics) {
  const seen = new Set();
  topics.forEach((t) => {
    (t.tags || []).forEach((tag) => {
      const name = typeof tag === "string" ? tag : tag?.name || tag?.id || "";
      if (name) seen.add(name);
    });
  });
  return [...seen];
}

// ─────────────────────────────────────────────────────────────
// CALENDAR HELPERS
// ─────────────────────────────────────────────────────────────
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const DOW = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function buildCalendarHTML(year, month, rangeStart, rangeEnd) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  let html = `<div class="gc-calendar"><div class="gc-cal-header">${MONTH_NAMES[month]} ${year}</div><div class="gc-cal-grid">`;
  DOW.forEach((d) => {
    html += `<div class="gc-cal-dow">${d}</div>`;
  });
  for (let i = 0; i < firstDay; i++)
    html += `<div class="gc-cal-day other-month"></div>`;
  for (let day = 1; day <= daysInMonth; day++) {
    const ts = new Date(year, month, day).getTime();
    let cls = "gc-cal-day";
    if (
      today.getDate() === day &&
      today.getMonth() === month &&
      today.getFullYear() === year
    )
      cls += " today";
    if (rangeStart && Math.abs(ts - rangeStart) < 86400000)
      cls += " range-start";
    if (rangeEnd && Math.abs(ts - rangeEnd) < 86400000) cls += " range-end";
    if (rangeStart && rangeEnd && ts > rangeStart && ts < rangeEnd)
      cls += " in-range";
    html += `<div class="${cls}" data-ts="${ts}">${day}</div>`;
  }
  html += `</div></div>`;
  return html;
}

// ─────────────────────────────────────────────────────────────
// HERO BANNER — Dynamic from category metadata
// ─────────────────────────────────────────────────────────────
function buildHeroBanner(categoryInfo) {
  const title = categoryInfo?.name || "Category News";
  const rawDesc =
    categoryInfo?.description_text || categoryInfo?.description || "";
  const desc =
    rawDesc
      .replace(/<[^>]*>/g, "")
      .trim()
      .substring(0, 160) || "Ikuti berita dan perkembangan terkini!";
  return `<div id="gc-hero-banner">
    <h1 class="gc-hero-title">${title} <span class="gc-hero-emoji">📰</span></h1>
    <p class="gc-hero-subtitle">${desc}</p>
    <div class="gc-search-wrapper">
      <span class="gc-search-icon">${SVG.search}</span>
      <input class="gc-search-input" type="text" id="gc-search-input" placeholder="Search topic..." />
    </div>
  </div>`;
}

// ─────────────────────────────────────────────────────────────
// ACTION BAR
// ─────────────────────────────────────────────────────────────
function buildActionBar() {
  return `<div id="gc-action-bar"><div class="gc-action-bar-inner">
    <div class="gc-pills">
      <button class="gc-pill active" data-pill="latest">Latest <span class="gc-pill-badge" id="gc-badge-latest">—</span></button>
      <button class="gc-pill" data-pill="trending">Trending <span class="gc-pill-badge" id="gc-badge-trending">—</span></button>
    </div>
    <div class="gc-bar-divider"></div>
    <div class="gc-icon-buttons">
      <button class="gc-icon-btn" id="gc-date-btn">${SVG.calendar}</button>
      <button class="gc-icon-btn" id="gc-filter-btn">${SVG.filter}</button>
    </div>
  </div></div>`;
}

// ─────────────────────────────────────────────────────────────
// FILTER POPUP — Tags extracted dynamically from fetched topics
// ─────────────────────────────────────────────────────────────
function buildFilterPopup() {
  const tags = STATE.availableTags;
  if (!tags.length) {
    return `<div id="gc-filter-popup"><p class="gc-filter-empty" style="padding:8px 12px;font-size:0.82rem;color:var(--gc-text-muted)">Tidak ada tag tersedia.</p></div>`;
  }
  return `<div id="gc-filter-popup">${tags
    .map((tag) => {
      const val = tag.toLowerCase();
      const id = `gc-filter-${val.replace(/[\s/]+/g, "-")}`;
      const label = tag.charAt(0).toUpperCase() + tag.slice(1);
      return `<div class="gc-filter-item">
        <input type="checkbox" id="${id}" data-filter="${val}" ${STATE.selectedFilters.includes(val) ? "checked" : ""} />
        <label for="${id}">${label}</label>
      </div>`;
    })
    .join("")}</div>`;
}

// ─────────────────────────────────────────────────────────────
// DATE POPUP
// ─────────────────────────────────────────────────────────────
function buildDatePopup() {
  const now = new Date();
  if (!STATE.calendarMonth.left) {
    STATE.calendarMonth.left = {
      year: now.getFullYear(),
      month: now.getMonth() - 1 < 0 ? 11 : now.getMonth() - 1,
    };
    STATE.calendarMonth.right = {
      year: now.getFullYear(),
      month: now.getMonth(),
    };
  }
  const { left, right } = STATE.calendarMonth;
  const hasRange = STATE.dateRange.start || STATE.dateRange.end;
  return `<div id="gc-date-popup">
    <div class="gc-date-header">
      <button id="gc-date-prev">${SVG.chevronLeft}</button>
      <span></span>
      <button id="gc-date-next">${SVG.chevronRight}</button>
    </div>
    <div class="gc-calendars">
      ${buildCalendarHTML(left.year, left.month, STATE.dateRange.start, STATE.dateRange.end)}
      ${buildCalendarHTML(right.year, right.month, STATE.dateRange.start, STATE.dateRange.end)}
    </div>
    ${hasRange ? `<div class="gc-date-actions"><button id="gc-date-clear" class="gc-date-clear-btn">Hapus Filter</button></div>` : ""}
  </div>`;
}

// ─────────────────────────────────────────────────────────────
// LOAD MORE BUTTON
// ─────────────────────────────────────────────────────────────
function buildLoadMoreButton() {
  return `<div id="gc-load-more-wrap">
    <button id="gc-load-more-btn" class="gc-load-more-btn">Muat Lebih Banyak</button>
  </div>`;
}

// ─────────────────────────────────────────────────────────────
// TOPIC CARD
// ─────────────────────────────────────────────────────────────
function buildTopicCard(topic) {
  if (!topic) return "";
  const tag = getTopicTag(topic);
  const tagHtml = tag ? renderTag(tag) : "";
  const img = topic.image_url
    ? `<div class="gc-card-thumbnail"><img src="${topic.image_url}" alt="" loading="lazy" /></div>`
    : "";
  const excerpt = topic.excerpt
    ? `<p class="gc-card-excerpt">${topic.excerpt.replace(/<[^>]*>/g, "").substring(0, 100)}...</p>`
    : "";
  const avatar = topic.posters?.[0]?.user?.avatar_template
    ? `<img class="gc-avatar" src="${topic.posters[0].user.avatar_template.replace("{size}", "24")}" alt="" />`
    : "";
  return `
    <div class="gc-topic-card" data-topic-id="${topic.id}" data-topic-slug="${topic.slug}" data-created-at="${topic.created_at}">
      ${img}
      <div class="gc-card-body">
        ${tagHtml}
        <p class="gc-card-title">${topic.title}</p>
        ${excerpt}
        <div class="gc-card-meta">
          ${avatar}
          <span class="gc-meta-item">${SVG.heart} ${topic.like_count || 0}</span>
          <span class="gc-meta-item">${SVG.chat} ${topic.posts_count ? topic.posts_count - 1 : 0}</span>
          <span class="gc-meta-item">${SVG.eye} ${topic.views || 0}</span>
          <span class="gc-meta-item" style="margin-left:auto">${moment(topic.created_at).format("D MMM YYYY")}</span>
        </div>
      </div>
    </div>`;
}

// ─────────────────────────────────────────────────────────────
// COMMENT HELPERS
// ─────────────────────────────────────────────────────────────
function getLikeData(post) {
  const a = post.actions_summary?.find((x) => x.id === 2);
  return { count: a?.count || 0, liked: a?.acted || false };
}

function getUserRole(post) {
  if (post.user_title) return post.user_title;
  if (post.primary_group_name) return post.primary_group_name;
  if (post.staff) return "Trainer Utama";
  if ((post.trust_level || 0) >= 3) return "Trainer Kelas";
  return "";
}

// ─────────────────────────────────────────────────────────────
// BUILD SINGLE COMMENT
// ─────────────────────────────────────────────────────────────
function buildCommentHTML(post, isNested) {
  const av = (post.avatar_template || "").replace("{size}", "40");
  const role = getUserRole(post);
  const timeAgo = moment(post.created_at).fromNow();
  const { count: likeCount, liked } = getLikeData(post);
  const hasReplies = (post.reply_count || 0) > 0;
  const isExpanded = STATE.expandedReplies[post.id] || false;

  return `
    <div class="gc-comment${isNested ? " gc-comment--nested" : ""}" data-post-id="${post.id}" data-post-number="${post.post_number}">
      <div class="gc-comment-avatar-wrap">
        <img class="gc-comment-avatar" src="${av}" alt="${post.name || post.username}" loading="lazy" onerror="this.style.visibility='hidden'" />
      </div>
      <div class="gc-comment-body">
        <div class="gc-comment-header">
          <span class="gc-comment-author">${post.name || post.username}</span>
          ${role ? `<span class="gc-comment-role">${role}</span>` : ""}
          <span class="gc-comment-time">${timeAgo}</span>
        </div>
        <div class="gc-comment-text">${post.cooked}</div>
        <div class="gc-comment-actions">
          ${
            hasReplies
              ? `<button class="gc-replies-pill" data-post-id="${post.id}" data-expanded="${isExpanded}">
              ${isExpanded ? SVG.chevronUp : SVG.chevronDown}
              ${post.reply_count} Balasan
            </button>`
              : ""
          }
          <button class="gc-comment-like${liked ? " is-liked" : ""}" data-post-id="${post.id}">
            ${liked ? SVG.heartFilled : SVG.heartOutline}
            <span class="gc-like-count">${likeCount > 0 ? likeCount : ""}</span>
          </button>
          <button class="gc-comment-more" data-post-id="${post.id}">${SVG.more}</button>
          <button class="gc-comment-reply-btn" data-post-id="${post.id}" data-post-number="${post.post_number}" data-username="${post.username}">
            ${SVG.reply} Balas
          </button>
        </div>
        ${hasReplies ? `<div class="gc-nested-replies" data-parent-post-id="${post.id}"${isExpanded ? "" : ` style="display:none"`}></div>` : ""}
      </div>
    </div>`;
}

// ─────────────────────────────────────────────────────────────
// BUILD TOPIC DETAIL
// ─────────────────────────────────────────────────────────────
function buildTopicDetail(topic, posts) {
  if (!topic) {
    return `<div id="gc-empty-detail">${SVG.newspaper}<p>Pilih artikel untuk membaca</p></div>`;
  }

  const tag = getTopicTag(topic);
  const tagHtml = tag ? renderTag(tag) : "";
  const likes = topic.like_count || 0;
  const replies =
    topic.reply_count || (topic.posts_count ? topic.posts_count - 1 : 0);
  const views = topic.views || 0;

  const firstPost = posts?.[0];
  let bodyText = (firstPost?.cooked || `<p>${topic.excerpt || ""}</p>`).trim();

  const subtitleText = topic.excerpt
    ? topic.excerpt.replace(/<[^>]*>/g, "").trim()
    : "";
  if (subtitleText) {
    const norm = (s) =>
      s
        .replace(/<[^>]*>/g, "")
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase();
    const ns = norm(subtitleText).substring(0, 80);
    bodyText = bodyText
      .replace(/^(<p>)([\s\S]*?)(<\/p>)/, (m, o, inner, c) =>
        norm(inner).substring(0, 80).startsWith(ns) ? "" : m,
      )
      .trim();
  }

  const topLevelPosts =
    posts
      ?.slice(1)
      .filter((p) => !p.reply_to_post_number && p.post_type === 1) || [];
  const commentsHtml = topLevelPosts
    .map((p) => buildCommentHTML(p, false))
    .join("");

  return `
    <div class="gc-detail-inner">
      <div class="gc-detail-date">${moment(topic.created_at).format("D MMM YYYY")} ${tagHtml}</div>
      <h2 class="gc-detail-title">${topic.title}</h2>
      ${subtitleText ? `<p class="gc-detail-subtitle">${subtitleText}</p>` : ""}
      <hr class="gc-detail-sep" />
      <div class="gc-stats-row gc-stats-top">
        <div class="gc-stats-left">
          <span class="gc-stat">${SVG.heart}<span class="gc-stat-value">${likes}</span></span>
          <span class="gc-stat">${SVG.chat}<span class="gc-stat-value">${replies}</span></span>
          <span class="gc-stat">${SVG.eye}<span class="gc-stat-value">${views}</span></span>
        </div>
        <div class="gc-stats-right">
          <button class="gc-action-icon gc-topic-bookmark-btn">${SVG.bookmark}</button>
          <button class="gc-action-icon gc-topic-share-btn">${SVG.share}</button>
        </div>
      </div>
      <div class="gc-detail-body">${bodyText}</div>

      <div class="gc-comments-header">
        <div class="gc-comments-stats-row">
          <span class="gc-cstat">${SVG.heartOutline}<span>${likes}</span></span>
          <span class="gc-cstat">${SVG.chat}<span>${replies}</span></span>
          <span class="gc-cstat">${SVG.eye}<span>${views}</span></span>
          <button class="gc-action-icon gc-topic-bookmark-btn">${SVG.bookmark}</button>
          <button class="gc-action-icon gc-topic-share-btn">${SVG.share}</button>
        </div>
        <button class="gc-main-reply-btn" data-topic-id="${topic.id}">
          ${SVG.reply} Balas
        </button>
      </div>

      <hr class="gc-detail-sep-bottom" />

      ${topLevelPosts.length > 0 ? `<div class="gc-comments" id="gc-comments-list">${commentsHtml}</div>` : ""}
    </div>`;
}

// ─────────────────────────────────────────────────────────────
// FETCH FUNCTIONS
// ─────────────────────────────────────────────────────────────

/**
 * Fetches topics for the current category (or a pagination URL).
 * Returns { topics, moreUrl, categoryData }.
 */
async function fetchCategoryTopics(url) {
  const slug = STATE.categorySlug;
  if (!slug && !url) return { topics: [], moreUrl: null, categoryData: null };
  const fetchUrl = url || `/c/${slug}.json?no_definitions=true`;
  try {
    const res = await fetch(fetchUrl, {
      headers: {
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
    });
    if (!res.ok) return { topics: [], moreUrl: null, categoryData: null };
    const data = await res.json();
    return {
      topics: data.topic_list?.topics || [],
      moreUrl: data.topic_list?.more_topics_url || null,
      categoryData: data.category || null,
    };
  } catch (e) {
    return { topics: [], moreUrl: null, categoryData: null };
  }
}

/**
 * Looks up category metadata from the Discourse site service (synchronous).
 */
function getCategoryInfoFromSite(slug) {
  if (!slug || !discourseApi) return null;
  try {
    const site = discourseApi.container?.lookup("service:site");
    const categories = site?.categories || [];
    const slugParts = slug.split("/");
    const lastSlug = slugParts[slugParts.length - 1];
    return (
      categories.find((c) => c.slug === lastSlug || c.slug === slug) || null
    );
  } catch (e) {
    return null;
  }
}

async function fetchTopicPosts(topicId, topicSlug) {
  try {
    const res = await fetch(`/t/${topicSlug}/${topicId}.json`, {
      headers: {
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
    });
    if (!res.ok) return { topic: null, posts: [] };
    const data = await res.json();
    return { topic: data, posts: data.post_stream?.posts || [] };
  } catch (e) {
    return { topic: null, posts: [] };
  }
}

async function fetchPostReplies(topicId, postNumber) {
  try {
    const res = await fetch(
      `/t/${topicId}/posts.json?post_number=${postNumber}&asc=true`,
      {
        headers: {
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
      },
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.post_stream?.posts || []).filter(
      (p) => p.reply_to_post_number === postNumber && p.post_type === 1,
    );
  } catch (e) {
    return [];
  }
}

// ─────────────────────────────────────────────────────────────
// UNIFIED FILTER — applies all active filters to topic cards
// ─────────────────────────────────────────────────────────────
function applyAllFilters() {
  const topics = STATE.allTopics;
  const { start, end } = STATE.dateRange;
  const q = STATE.searchQuery.toLowerCase().trim();

  document.querySelectorAll("#gc-topic-feed .gc-topic-card").forEach((card) => {
    const topicId = parseInt(card.dataset.topicId);
    const t = topics.find((x) => x.id === topicId);
    if (!t) {
      card.style.display = "none";
      return;
    }

    // 1. Trending filter
    if (STATE.activeFilter === "trending") {
      if ((t.views || 0) < 50 && (t.like_count || 0) < 10) {
        card.style.display = "none";
        return;
      }
    }

    // 2. Tag filter
    if (STATE.selectedFilters.length) {
      const topicTags = (t.tags || []).map((tag) =>
        (typeof tag === "string" ? tag : tag?.name || "").toLowerCase(),
      );
      if (!STATE.selectedFilters.some((f) => topicTags.includes(f))) {
        card.style.display = "none";
        return;
      }
    }

    // 3. Date range filter
    if (start || end) {
      const created = new Date(t.created_at).getTime();
      if (start && created < start) {
        card.style.display = "none";
        return;
      }
      // Include the full end day (add 23:59:59 ms)
      if (end && created > end + 86399999) {
        card.style.display = "none";
        return;
      }
    }

    // 4. Search filter
    if (q) {
      const title = (t.title || "").toLowerCase();
      const excerpt = (t.excerpt || "").replace(/<[^>]*>/g, "").toLowerCase();
      if (!title.includes(q) && !excerpt.includes(q)) {
        card.style.display = "none";
        return;
      }
    }

    card.style.display = "";
  });
}

// ─────────────────────────────────────────────────────────────
// MASTER RENDER
// ─────────────────────────────────────────────────────────────
async function renderLayout() {
  if (!isTargetRoute()) return;

  // Resolve current category slug and store in STATE
  STATE.categorySlug = getCategorySlugFromPath();
  if (!STATE.categorySlug) return;

  addBodyClass();

  const outlet = document.getElementById("main-outlet");
  if (!outlet || document.getElementById("gc-category-wrapper")) return;

  // Try synchronous lookup from Discourse site service first
  STATE.categoryInfo = getCategoryInfoFromSite(STATE.categorySlug);

  outlet.style.opacity = "0";

  const wrapper = document.createElement("div");
  wrapper.id = "gc-category-wrapper";
  wrapper.innerHTML = `
    ${buildHeroBanner(STATE.categoryInfo)}
    ${buildActionBar()}
    <div id="gc-master-detail">
      <div id="gc-topic-feed">
        ${[1, 2, 3, 4, 5]
          .map(
            () => `<div class="gc-topic-card" style="pointer-events:none"><div class="gc-card-body">
          <div class="gc-skeleton" style="height:14px;width:60%;margin-bottom:6px"></div>
          <div class="gc-skeleton" style="height:11px;width:90%;margin-bottom:4px"></div>
          <div class="gc-skeleton" style="height:11px;width:70%"></div>
        </div></div>`,
          )
          .join("")}
      </div>
      <div id="gc-topic-detail">
        <div id="gc-empty-detail">${SVG.newspaper}<p>Pilih artikel untuk membaca</p></div>
      </div>
    </div>`;

  (outlet.querySelector(".container") || outlet).prepend(wrapper);
  outlet.style.opacity = "1";

  const { topics, moreUrl, categoryData } = await fetchCategoryTopics();

  // Update hero banner with API category data if site service had no info
  if (!STATE.categoryInfo && categoryData) {
    STATE.categoryInfo = categoryData;
    const heroEl = document.getElementById("gc-hero-banner");
    if (heroEl) {
      const tmp = document.createElement("div");
      tmp.innerHTML = buildHeroBanner(STATE.categoryInfo);
      heroEl.replaceWith(tmp.firstElementChild);
    }
  }

  // Store all state
  STATE.allTopics = topics;
  STATE.moreTopicsUrl = moreUrl;
  STATE.availableTags = extractTagsFromTopics(topics);

  const feed = document.getElementById("gc-topic-feed");
  const latestBadge = document.getElementById("gc-badge-latest");
  const trendingBadge = document.getElementById("gc-badge-trending");

  if (latestBadge) latestBadge.textContent = topics.length;
  if (trendingBadge)
    trendingBadge.textContent = topics.filter(
      (t) => (t.views || 0) >= 50 || (t.like_count || 0) >= 10,
    ).length;

  if (feed) {
    if (!topics.length) {
      feed.innerHTML = `<div style="padding:20px;text-align:center;color:var(--gc-text-muted);font-size:0.82rem">Tidak ada artikel ditemukan.</div>`;
    } else {
      feed.innerHTML = topics.map((t) => buildTopicCard(t)).join("");

      if (STATE.moreTopicsUrl) {
        const wrap = document.createElement("div");
        wrap.innerHTML = buildLoadMoreButton();
        feed.appendChild(wrap.firstElementChild);
      }

      bindTopicCardClicks();
      bindLoadMore();
      feed.querySelector(".gc-topic-card")?.click();
    }
  }

  bindActionBar();
  bindSearch();
}

// ─────────────────────────────────────────────────────────────
// BIND TOPIC CARD CLICKS
// Uses event delegation + STATE.allTopics so newly loaded topics work
// ─────────────────────────────────────────────────────────────
function bindTopicCardClicks() {
  const feed = document.getElementById("gc-topic-feed");
  if (!feed || feed._clickBound) return;
  feed._clickBound = true;

  feed.addEventListener("click", async (e) => {
    const card = e.target.closest(".gc-topic-card");
    if (!card) return;
    const topicId = parseInt(card.dataset.topicId);
    const topicSlug = card.dataset.topicSlug;
    if (!topicId) return;

    feed
      .querySelectorAll(".gc-topic-card")
      .forEach((c) => c.classList.remove("active"));
    card.classList.add("active");
    STATE.activeTopicId = topicId;
    STATE.expandedReplies = {};

    const detail = document.getElementById("gc-topic-detail");
    if (detail) {
      detail.innerHTML = `<div class="gc-detail-inner">${[1, 2, 3]
        .map(
          () => `
        <div class="gc-skeleton" style="height:18px;width:80%;margin-bottom:10px"></div>
        <div class="gc-skeleton" style="height:12px;width:95%;margin-bottom:6px"></div>
        <div class="gc-skeleton" style="height:200px;width:100%;margin-bottom:10px;border-radius:10px"></div>
      `,
        )
        .join("")}</div>`;
    }

    const { topic, posts } = await fetchTopicPosts(topicId, topicSlug);
    const fallbackTopic = STATE.allTopics.find((t) => t.id === topicId);
    if (detail) {
      detail.innerHTML = buildTopicDetail(topic || fallbackTopic, posts);
      detail.scrollTop = 0;
      bindDetailActions(detail, topic || fallbackTopic, posts);
    }
  });
}

// ─────────────────────────────────────────────────────────────
// BIND LOAD MORE — appends next page of topics to feed
// ─────────────────────────────────────────────────────────────
function bindLoadMore() {
  document
    .getElementById("gc-load-more-btn")
    ?.addEventListener("click", async () => {
      if (STATE.isLoadingMore || !STATE.moreTopicsUrl) return;
      STATE.isLoadingMore = true;

      const btn = document.getElementById("gc-load-more-btn");
      if (btn) {
        btn.disabled = true;
        btn.textContent = "Memuat...";
      }

      const { topics: newTopics, moreUrl } = await fetchCategoryTopics(
        STATE.moreTopicsUrl,
      );
      STATE.moreTopicsUrl = moreUrl;
      STATE.allTopics = [...STATE.allTopics, ...newTopics];
      STATE.availableTags = extractTagsFromTopics(STATE.allTopics);

      // Remove current load-more button
      document.getElementById("gc-load-more-wrap")?.remove();

      const feed = document.getElementById("gc-topic-feed");
      if (feed && newTopics.length) {
        const frag = document.createDocumentFragment();
        newTopics.forEach((t) => {
          const div = document.createElement("div");
          div.innerHTML = buildTopicCard(t);
          if (div.firstElementChild) frag.appendChild(div.firstElementChild);
        });
        feed.appendChild(frag);

        // Add new load-more button if there are more pages
        if (STATE.moreTopicsUrl) {
          const wrap = document.createElement("div");
          wrap.innerHTML = buildLoadMoreButton();
          feed.appendChild(wrap.firstElementChild);
          bindLoadMore();
        }

        // Update badges
        const latestBadge = document.getElementById("gc-badge-latest");
        const trendingBadge = document.getElementById("gc-badge-trending");
        if (latestBadge) latestBadge.textContent = STATE.allTopics.length;
        if (trendingBadge)
          trendingBadge.textContent = STATE.allTopics.filter(
            (t) => (t.views || 0) >= 50 || (t.like_count || 0) >= 10,
          ).length;

        // Re-apply active filters so newly appended cards respect current state
        applyAllFilters();
      }

      STATE.isLoadingMore = false;
    });
}

// ─────────────────────────────────────────────────────────────
// COMPOSER HELPER — kompatibel Discourse v3.x ke atas
// ─────────────────────────────────────────────────────────────
function openComposer(opts) {
  const composerService = discourseApi.container?.lookup("service:composer");
  if (composerService) {
    return composerService.open(opts);
  }
  const composerController = discourseApi.container?.lookup(
    "controller:composer",
  );
  if (composerController) {
    return composerController.open(opts);
  }
}

// ─────────────────────────────────────────────────────────────
// BOOKMARK HELPER
// ─────────────────────────────────────────────────────────────
async function toggleBookmark(btn, bookmarkableType, bookmarkableId) {
  const isBookmarked = btn.classList.contains("is-bookmarked");
  try {
    if (isBookmarked) {
      const bookmarkId = btn.dataset.bookmarkId;
      if (bookmarkId) {
        await ajax(`/bookmarks/${bookmarkId}`, { type: "DELETE" });
      }
      btn.classList.remove("is-bookmarked");
      delete btn.dataset.bookmarkId;
    } else {
      const result = await ajax("/bookmarks", {
        type: "POST",
        data: {
          bookmarkable_type: bookmarkableType,
          bookmarkable_id: bookmarkableId,
        },
      });
      if (result?.id) {
        btn.dataset.bookmarkId = result.id;
      }
      btn.classList.add("is-bookmarked");
    }
  } catch (err) {
    popupAjaxError(err);
  }
}

// ─────────────────────────────────────────────────────────────
// FLAG/REPORT HELPER
// ─────────────────────────────────────────────────────────────
function openFlagModal(post) {
  const modalService = discourseApi.container?.lookup("service:modal");
  if (modalService?.show) {
    import("discourse/components/modal/flag-post")
      .then((module) => {
        modalService.show(module.default, {
          model: { flagTarget: post, flagTopic: false },
        });
      })
      .catch(() => {
        flagPostFallback(post.id);
      });
    return;
  }
  const modalsController = discourseApi.container?.lookup("controller:modals");
  if (modalsController?.show) {
    modalsController.show("flag", { post, flagTopic: false });
    return;
  }
  flagPostFallback(post.id);
}

async function flagPostFallback(postId) {
  if (!window.confirm("Laporkan komentar ini sebagai tidak pantas?")) return;
  try {
    await ajax("/post_actions", {
      type: "POST",
      data: { id: postId, post_action_type_id: 4, flag_topic: false },
    });
  } catch (err) {
    popupAjaxError(err);
  }
}

// ─────────────────────────────────────────────────────────────
// EDIT POST HELPER
// ─────────────────────────────────────────────────────────────
async function openEditComposer(postId) {
  try {
    const res = await ajax(`/posts/${postId}`, { type: "GET" });
    const post = res?.post || res;
    openComposer({
      action: "edit",
      post,
      draftKey: post.draft_key || `post_${postId}`,
    });
  } catch (err) {
    popupAjaxError(err);
  }
}

// ─────────────────────────────────────────────────────────────
// BIND DETAIL ACTIONS
// ─────────────────────────────────────────────────────────────
function bindDetailActions(container, topic, posts) {
  const currentUser = discourseApi?.currentUser;

  // Main reply
  container.querySelectorAll(".gc-main-reply-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!currentUser) {
        discourseApi?.container
          ?.lookup("route:application")
          ?._router?.transitionTo("login");
        return;
      }
      openComposer({ action: "reply", topic, draftKey: topic?.draft_key });
    });
  });

  // Bookmark topic
  container.querySelectorAll(".gc-topic-bookmark-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      if (!currentUser || !topic) return;
      await toggleBookmark(btn, "Topic", topic.id);
    });
  });

  // Share topic
  container.querySelectorAll(".gc-topic-share-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      if (!topic) return;
      const url = `${window.location.origin}/t/${topic.slug || topic.id}/${topic.id}`;
      if (navigator.share) {
        try {
          await navigator.share({ title: topic.title, url });
        } catch (_) {}
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        btn.classList.add("is-copied");
        setTimeout(() => btn.classList.remove("is-copied"), 1500);
      }
    });
  });

  // Like / Unlike per comment
  container.querySelectorAll(".gc-comment-like").forEach((btn) => {
    btn.addEventListener("click", async () => {
      if (!currentUser) return;
      const postId = btn.dataset.postId;
      const isLiked = btn.classList.contains("is-liked");
      const countEl = btn.querySelector(".gc-like-count");
      const currentCount = parseInt(countEl?.textContent || "0") || 0;

      const optimisticCount = currentCount + (isLiked ? -1 : 1);
      btn.classList.toggle("is-liked");
      const nowLiked = btn.classList.contains("is-liked");
      btn.innerHTML = `${nowLiked ? SVG.heartFilled : SVG.heartOutline}<span class="gc-like-count">${optimisticCount > 0 ? optimisticCount : ""}</span>`;

      try {
        if (isLiked) {
          await ajax(`/post_actions/${postId}`, {
            type: "DELETE",
            data: { post_action_type_id: 2 },
          });
        } else {
          const result = await ajax("/post_actions", {
            type: "POST",
            data: { id: postId, post_action_type_id: 2, flag_topic: false },
          });
          const serverCount = result?.post?.actions_summary?.find(
            (a) => a.id === 2,
          )?.count;
          if (serverCount !== undefined) {
            btn.querySelector(".gc-like-count").textContent =
              serverCount > 0 ? serverCount : "";
          }
        }
      } catch (err) {
        btn.classList.toggle("is-liked");
        const rolledBack = btn.classList.contains("is-liked");
        btn.innerHTML = `${rolledBack ? SVG.heartFilled : SVG.heartOutline}<span class="gc-like-count">${currentCount > 0 ? currentCount : ""}</span>`;
        popupAjaxError(err);
      }
    });
  });

  // More (...) dropdown
  container.querySelectorAll(".gc-comment-more").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      document.querySelectorAll(".gc-more-menu").forEach((m) => m.remove());

      const postId = btn.dataset.postId;
      const post = posts.find((p) => String(p.id) === String(postId));
      const canEdit =
        post && (post.yours || currentUser?.staff || currentUser?.moderator);

      const menu = document.createElement("div");
      menu.className = "gc-more-menu";
      menu.innerHTML = `
        ${canEdit ? `<button class="gc-more-item" data-action="edit">${SVG.save} Edit</button>` : ""}
        <button class="gc-more-item" data-action="bookmark">${SVG.bookmark} Simpan</button>
        ${currentUser ? `<button class="gc-more-item gc-more-item--danger" data-action="report">${SVG.report} Laporkan</button>` : ""}
        ${canEdit ? `<button class="gc-more-item gc-more-item--danger" data-action="delete">${SVG.report} Hapus</button>` : ""}
      `;

      btn.style.position = "relative";
      btn.appendChild(menu);

      menu
        .querySelector('[data-action="edit"]')
        ?.addEventListener("click", () => {
          openEditComposer(postId);
          menu.remove();
        });

      menu
        .querySelector('[data-action="bookmark"]')
        ?.addEventListener("click", async () => {
          if (!currentUser) return;
          try {
            const targetPost = posts.find(
              (p) => String(p.id) === String(postId),
            );
            const isAlreadyBookmarked = targetPost?.bookmarked || false;
            if (isAlreadyBookmarked && targetPost?.bookmark_id) {
              await ajax(`/bookmarks/${targetPost.bookmark_id}`, {
                type: "DELETE",
              });
            } else {
              await ajax("/bookmarks", {
                type: "POST",
                data: { bookmarkable_type: "Post", bookmarkable_id: postId },
              });
            }
          } catch (err) {
            popupAjaxError(err);
          }
          menu.remove();
        });

      menu
        .querySelector('[data-action="report"]')
        ?.addEventListener("click", () => {
          if (post) openFlagModal(post);
          menu.remove();
        });

      menu
        .querySelector('[data-action="delete"]')
        ?.addEventListener("click", async () => {
          if (!window.confirm("Hapus komentar ini?")) {
            menu.remove();
            return;
          }
          try {
            await ajax(`/posts/${postId}`, { type: "DELETE" });
            btn.closest(".gc-comment")?.remove();
          } catch (err) {
            popupAjaxError(err);
          }
          menu.remove();
        });

      setTimeout(() => {
        document.addEventListener("click", () => menu.remove(), { once: true });
      }, 0);
    });
  });

  // Per-comment "Balas"
  container.querySelectorAll(".gc-comment-reply-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!currentUser) {
        discourseApi?.container
          ?.lookup("route:application")
          ?._router?.transitionTo("login");
        return;
      }
      const postNumber = btn.dataset.postNumber;
      const targetPost = posts.find(
        (p) => String(p.post_number) === String(postNumber),
      );
      if (!targetPost || !topic) return;
      openComposer({
        action: "reply",
        topic,
        post: targetPost,
        draftKey: targetPost.draft_key || `post_${targetPost.id}`,
      });
    });
  });

  // Replies pill — expand / collapse nested comments
  container.querySelectorAll(".gc-replies-pill").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const postId = btn.dataset.postId;
      const isExpanded = btn.dataset.expanded === "true";
      const commentEl = btn.closest(".gc-comment");
      const nestedContainer = commentEl?.querySelector(".gc-nested-replies");
      if (!nestedContainer) return;

      const replyCount = btn.textContent.trim().match(/\d+/)?.[0] || "0";
      const countText = `${replyCount} Balasan`;

      if (isExpanded) {
        nestedContainer.style.display = "none";
        btn.dataset.expanded = "false";
        STATE.expandedReplies[postId] = false;
        btn.innerHTML = `${SVG.chevronDown} ${countText}`;
      } else {
        if (!nestedContainer.innerHTML.trim()) {
          btn.classList.add("is-loading");
          btn.disabled = true;
          const post = posts.find((p) => String(p.id) === String(postId));
          const topicId = topic?.id || STATE.activeTopicId;
          if (post && topicId) {
            const replies = await fetchPostReplies(topicId, post.post_number);
            if (replies.length > 0) {
              nestedContainer.innerHTML = replies
                .map((r) => buildCommentHTML(r, true))
                .join("");
              bindDetailActions(nestedContainer, topic, [...posts, ...replies]);
            } else {
              nestedContainer.innerHTML = `<p class="gc-no-replies">Belum ada balasan.</p>`;
            }
          }
          btn.classList.remove("is-loading");
          btn.disabled = false;
        }
        nestedContainer.style.display = "";
        btn.dataset.expanded = "true";
        STATE.expandedReplies[postId] = true;
        btn.innerHTML = `${SVG.chevronUp} ${countText}`;
      }
    });
  });
}

// ─────────────────────────────────────────────────────────────
// ACTION BAR BINDINGS
// ─────────────────────────────────────────────────────────────
function bindActionBar() {
  // Pills — use applyAllFilters for unified filtering
  document.addEventListener("click", (e) => {
    const pill = e.target.closest(".gc-pill");
    if (!pill) return;
    document
      .querySelectorAll(".gc-pill")
      .forEach((p) => p.classList.remove("active"));
    pill.classList.add("active");
    STATE.activeFilter = pill.dataset.pill;
    applyAllFilters();
  });

  document.getElementById("gc-filter-btn")?.addEventListener("click", (e) => {
    e.stopPropagation();
    closeAllPopups();
    STATE.filterOpen = true;
    document.getElementById("gc-filter-btn")?.classList.add("active");
    const el = document.createElement("div");
    el.innerHTML = buildFilterPopup();
    document
      .querySelector(".gc-icon-buttons")
      .appendChild(el.firstElementChild);
    bindFilterPopup();
  });

  document.getElementById("gc-date-btn")?.addEventListener("click", (e) => {
    e.stopPropagation();
    closeAllPopups();
    STATE.dateOpen = true;
    document.getElementById("gc-date-btn")?.classList.add("active");
    const el = document.createElement("div");
    el.innerHTML = buildDatePopup();
    document
      .querySelector(".gc-icon-buttons")
      .appendChild(el.firstElementChild);
    bindDatePopup();
  });

  document.addEventListener("click", (e) => {
    if (
      !e.target.closest(
        "#gc-filter-popup,#gc-filter-btn,#gc-date-popup,#gc-date-btn",
      )
    ) {
      closeAllPopups();
    }
  });
}

function closeAllPopups() {
  document.getElementById("gc-filter-popup")?.remove();
  document.getElementById("gc-date-popup")?.remove();
  document.getElementById("gc-filter-btn")?.classList.remove("active");
  document.getElementById("gc-date-btn")?.classList.remove("active");
  STATE.filterOpen = false;
  STATE.dateOpen = false;
}

function bindFilterPopup() {
  document
    .getElementById("gc-filter-popup")
    ?.querySelectorAll("input[type='checkbox']")
    .forEach((cb) => {
      cb.addEventListener("change", () => {
        const val = cb.dataset.filter;
        if (cb.checked) {
          if (!STATE.selectedFilters.includes(val))
            STATE.selectedFilters.push(val);
        } else {
          STATE.selectedFilters = STATE.selectedFilters.filter(
            (f) => f !== val,
          );
        }
        applyAllFilters();
      });
    });
}

function bindDatePopup() {
  const popup = document.getElementById("gc-date-popup");
  if (!popup) return;

  popup
    .querySelector("#gc-date-prev")
    ?.addEventListener("click", () => navigateCalendar(-1));
  popup
    .querySelector("#gc-date-next")
    ?.addEventListener("click", () => navigateCalendar(1));

  // Clear date filter button
  popup.querySelector("#gc-date-clear")?.addEventListener("click", () => {
    STATE.dateRange = { start: null, end: null };
    applyAllFilters();
    refreshDatePopup();
  });

  popup.querySelectorAll(".gc-cal-day").forEach((day) => {
    const ts = parseInt(day.dataset.ts);
    if (!ts) return;
    day.addEventListener("click", () => {
      if (
        !STATE.dateRange.start ||
        (STATE.dateRange.start && STATE.dateRange.end)
      ) {
        STATE.dateRange = { start: ts, end: null };
      } else {
        STATE.dateRange =
          ts < STATE.dateRange.start
            ? { start: ts, end: STATE.dateRange.start }
            : { start: STATE.dateRange.start, end: ts };
      }
      // Apply filter immediately after each selection, then refresh calendar UI
      applyAllFilters();
      refreshDatePopup();
    });
  });
}

function navigateCalendar(dir) {
  const adj = (y, m) => {
    m += dir;
    if (m < 0) {
      m = 11;
      y--;
    }
    if (m > 11) {
      m = 0;
      y++;
    }
    return { year: y, month: m };
  };
  STATE.calendarMonth = {
    left: adj(STATE.calendarMonth.left.year, STATE.calendarMonth.left.month),
    right: adj(STATE.calendarMonth.right.year, STATE.calendarMonth.right.month),
  };
  refreshDatePopup();
}

function refreshDatePopup() {
  const old = document.getElementById("gc-date-popup");
  if (!old) return;
  const iconBtns = document.querySelector(".gc-icon-buttons");
  old.remove();
  const el = document.createElement("div");
  el.innerHTML = buildDatePopup();
  iconBtns.appendChild(el.firstElementChild);
  bindDatePopup();
}

function bindSearch() {
  document.getElementById("gc-search-input")?.addEventListener("input", (e) => {
    STATE.searchQuery = e.target.value;
    applyAllFilters();
  });
}

// ─────────────────────────────────────────────────────────────
// CLEANUP
// ─────────────────────────────────────────────────────────────
function cleanupLayout() {
  document.getElementById("gc-category-wrapper")?.remove();
  cleanupBodyClass();
  // Reset all state for fresh render on next route
  STATE.allTopics = [];
  STATE.moreTopicsUrl = null;
  STATE.isLoadingMore = false;
  STATE.categorySlug = null;
  STATE.categoryInfo = null;
  STATE.availableTags = [];
  STATE.selectedFilters = [];
  STATE.searchQuery = "";
  STATE.dateRange = { start: null, end: null };
  STATE.activeFilter = "latest";
  STATE.calendarMonth = { left: null, right: null };
}

// ─────────────────────────────────────────────────────────────
// API INITIALIZER
// ─────────────────────────────────────────────────────────────
export default apiInitializer("1.8.0", (api) => {
  discourseApi = api;

  api.onPageChange((_url) => {
    cleanupLayout();
    if (isTargetRoute()) {
      later(renderLayout, 150);
    }
  });

  api.registerBehaviorTransformer?.("discovery-layout", () => {
    if (isTargetRoute()) later(renderLayout, 200);
  });

  if (isTargetRoute()) {
    if (
      document.readyState === "complete" ||
      document.readyState === "interactive"
    ) {
      later(renderLayout, 300);
    } else {
      document.addEventListener("DOMContentLoaded", () =>
        later(renderLayout, 300),
      );
    }
  }

  try {
    const router = getOwner(api)?.lookup("service:router");
    router?.on("routeDidChange", () => {
      cleanupLayout();
      if (isTargetRoute()) later(renderLayout, 200);
    });
  } catch (e) {}
});
