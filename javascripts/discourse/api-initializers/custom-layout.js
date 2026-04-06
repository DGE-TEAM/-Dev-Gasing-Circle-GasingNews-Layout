// =============================================================
// GASING CIRCLE — Academy News Theme Component
// File: javascripts/discourse/api-initializers/custom-layout.js
// Target Route: /c/ga-updates/10
// =============================================================

import { apiInitializer } from "discourse/lib/api";
import { later, scheduleOnce } from "@ember/runloop";
import { getOwner } from "@ember/application";

// ─────────────────────────────────────────────────────────────
// HELPER: SVG ICONS
// ─────────────────────────────────────────────────────────────
const SVG = {
  search: `<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"/></svg>`,
  calendar: `<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/></svg>`,
  filter: `<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.553.894l-4 2A1 1 0 016 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clip-rule="evenodd"/></svg>`,
  heart: `<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"/></svg>`,
  chat: `<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clip-rule="evenodd"/></svg>`,
  eye: `<svg viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/><path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/></svg>`,
  bookmark: `<svg viewBox="0 0 20 20" fill="currentColor"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"/></svg>`,
  share: `<svg viewBox="0 0 20 20" fill="currentColor"><path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"/></svg>`,
  reply: `<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>`,
  more: `<svg viewBox="0 0 20 20" fill="currentColor"><path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"/></svg>`,
  save: `<svg viewBox="0 0 20 20" fill="currentColor"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"/></svg>`,
  report: `<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clip-rule="evenodd"/></svg>`,
  newspaper: `<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clip-rule="evenodd"/><path d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V7z"/></svg>`,
  chevronLeft: `<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>`,
  chevronRight: `<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/></svg>`,
};

// ─────────────────────────────────────────────────────────────
// STATE
// ─────────────────────────────────────────────────────────────
const STATE = {
  activeFilter: "latest",
  filterOpen: false,
  dateOpen: false,
  selectedFilters: [],
  dateRange: { start: null, end: null },
  activeTopicId: null,
  calendarMonth: { left: null, right: null },
};

// ─────────────────────────────────────────────────────────────
// UTILITY: Is this the target category route?
// ─────────────────────────────────────────────────────────────
function isTargetRoute() {
  const path = window.location.pathname;
  return path.startsWith("/c/ga-updates") || path.includes("/c/ga-updates/10");
}

function addBodyClass() {
  if (isTargetRoute()) {
    document.body.classList.add("category-ga-updates");
  } else {
    document.body.classList.remove("category-ga-updates");
  }
}

// ─────────────────────────────────────────────────────────────
// TAG HELPERS
// ─────────────────────────────────────────────────────────────
const TAG_CLASSES = {
  pelatihan: "gc-tag--pelatihan",
  pendidikan: "gc-tag--pendidikan",
  dunia: "gc-tag--dunia",
  lainnya: "gc-tag--lainnya",
};

function renderTag(tagName) {
  if (!tagName) return "";
  const cls = TAG_CLASSES[tagName.toLowerCase()] || "gc-tag--lainnya";
  const label = tagName.charAt(0).toUpperCase() + tagName.slice(1);
  return `<span class="gc-tag ${cls}">${label}</span>`;
}

function getTopicTag(topic) {
  if (!topic) return null;
  const tags = topic.tags || [];
  for (const t of tags) {
    if (TAG_CLASSES[t.toLowerCase()]) return t;
  }
  return tags[0] || null;
}

// ─────────────────────────────────────────────────────────────
// FORMAT DATE
// ─────────────────────────────────────────────────────────────
function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const months = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

// ─────────────────────────────────────────────────────────────
// CALENDAR HELPERS
// ─────────────────────────────────────────────────────────────
const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];
const DOW = ["Su","Mo","Tu","We","Th","Fr","Sa"];

function buildCalendarHTML(year, month, rangeStart, rangeEnd) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  let html = `<div class="gc-calendar">
    <div class="gc-cal-header">${MONTH_NAMES[month]} ${year}</div>
    <div class="gc-cal-grid">`;

  DOW.forEach(d => { html += `<div class="gc-cal-dow">${d}</div>`; });

  // Leading empty cells
  for (let i = 0; i < firstDay; i++) {
    html += `<div class="gc-cal-day other-month"></div>`;
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const ts = date.getTime();
    let cls = "gc-cal-day";

    if (today.getDate() === day && today.getMonth() === month && today.getFullYear() === year) {
      cls += " today";
    }
    if (rangeStart && Math.abs(ts - rangeStart) < 86400000) cls += " range-start";
    if (rangeEnd && Math.abs(ts - rangeEnd) < 86400000) cls += " range-end";
    if (rangeStart && rangeEnd && ts > rangeStart && ts < rangeEnd) cls += " in-range";

    html += `<div class="${cls}" data-ts="${ts}">${day}</div>`;
  }

  html += `</div></div>`;
  return html;
}

// ─────────────────────────────────────────────────────────────
// BUILD HERO BANNER HTML
// ─────────────────────────────────────────────────────────────
function buildHeroBanner() {
  return `
    <div id="gc-hero-banner">
      <h1 class="gc-hero-title">Gasing Academy News <span class="gc-hero-emoji">📰</span></h1>
      <p class="gc-hero-subtitle">Ikuti berita dan perkembangan terkini seputar Gasing!</p>
      <div class="gc-search-wrapper">
        <span class="gc-search-icon">${SVG.search}</span>
        <input class="gc-search-input" type="text" id="gc-search-input" placeholder="Search topic..." />
      </div>
    </div>
  `;
}

// ─────────────────────────────────────────────────────────────
// BUILD ACTION BAR HTML
// ─────────────────────────────────────────────────────────────
function buildActionBar() {
  return `
    <div id="gc-action-bar">
      <div class="gc-action-bar-inner">
        <div class="gc-pills">
          <button class="gc-pill active" data-pill="latest">Latest <span class="gc-pill-badge" id="gc-badge-latest">—</span></button>
          <button class="gc-pill" data-pill="trending">Trending <span class="gc-pill-badge" id="gc-badge-trending">—</span></button>
        </div>
        <div class="gc-bar-divider"></div>
        <div class="gc-icon-buttons">
          <button class="gc-icon-btn" id="gc-date-btn" title="Filter by date">${SVG.calendar}</button>
          <button class="gc-icon-btn" id="gc-filter-btn" title="Filter by category">${SVG.filter}</button>
        </div>
      </div>
    </div>
  `;
}

// ─────────────────────────────────────────────────────────────
// BUILD FILTER POPUP HTML
// ─────────────────────────────────────────────────────────────
function buildFilterPopup() {
  const filters = ["Pendidikan", "Pelatihan", "Dunia", "Lainnya"];
  const items = filters.map(f => `
    <div class="gc-filter-item">
      <input type="checkbox" id="gc-filter-${f.toLowerCase()}" data-filter="${f.toLowerCase()}"
        ${STATE.selectedFilters.includes(f.toLowerCase()) ? "checked" : ""} />
      <label for="gc-filter-${f.toLowerCase()}">${f}</label>
    </div>
  `).join("");
  return `<div id="gc-filter-popup">${items}</div>`;
}

// ─────────────────────────────────────────────────────────────
// BUILD DATE POPUP HTML
// ─────────────────────────────────────────────────────────────
function buildDatePopup() {
  const now = new Date();
  if (!STATE.calendarMonth.left) {
    STATE.calendarMonth.left = { year: now.getFullYear(), month: now.getMonth() - 1 < 0 ? 11 : now.getMonth() - 1 };
    STATE.calendarMonth.right = { year: now.getFullYear(), month: now.getMonth() };
  }
  const { left, right } = STATE.calendarMonth;

  return `
    <div id="gc-date-popup">
      <div class="gc-date-header">
        <button id="gc-date-prev">${SVG.chevronLeft}</button>
        <span></span>
        <button id="gc-date-next">${SVG.chevronRight}</button>
      </div>
      <div class="gc-calendars">
        ${buildCalendarHTML(left.year, left.month, STATE.dateRange.start, STATE.dateRange.end)}
        ${buildCalendarHTML(right.year, right.month, STATE.dateRange.start, STATE.dateRange.end)}
      </div>
    </div>
  `;
}

// ─────────────────────────────────────────────────────────────
// BUILD TOPIC CARD HTML
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
  const likes = topic.like_count || 0;
  const replies = topic.posts_count ? topic.posts_count - 1 : 0;
  const views = topic.views || 0;
  const date = formatDate(topic.created_at);

  return `
    <div class="gc-topic-card" data-topic-id="${topic.id}" data-topic-slug="${topic.slug}">
      ${img}
      <div class="gc-card-body">
        ${tagHtml}
        <p class="gc-card-title">${topic.title}</p>
        ${excerpt}
        <div class="gc-card-meta">
          ${avatar}
          <span class="gc-meta-item">${SVG.heart} ${likes}</span>
          <span class="gc-meta-item">${SVG.chat} ${replies}</span>
          <span class="gc-meta-item">${SVG.eye} ${views}</span>
          <span class="gc-meta-item" style="margin-left:auto">${date}</span>
        </div>
      </div>
    </div>
  `;
}

// ─────────────────────────────────────────────────────────────
// BUILD TOPIC DETAIL PANEL HTML
// ─────────────────────────────────────────────────────────────
function buildTopicDetail(topic, posts) {
  if (!topic) {
    return `
      <div id="gc-empty-detail">
        ${SVG.newspaper}
        <p>Pilih artikel untuk membaca</p>
      </div>
    `;
  }

  const tag = getTopicTag(topic);
  const tagHtml = tag ? renderTag(tag) : "";
  const date = formatDate(topic.created_at);
  const likes = topic.like_count || 0;
  const replies = topic.posts_count ? topic.posts_count - 1 : 0;
  const views = topic.views || 0;

  // First post (OP)
  const firstPost = posts?.[0];
  const cooked = firstPost?.cooked || `<p>${topic.excerpt || ""}</p>`;

  // Reply posts (skip OP)
  const replyPosts = posts?.slice(1) || [];
  const commentsHtml = replyPosts.map((post, idx) => {
    const avatarUrl = post.avatar_template?.replace("{size}", "32") || "";
    const isReply = idx > 0 && post.reply_to_post_number;
    const role = post.staff ? "Trainer Utama" : (post.trust_level >= 2 ? "Trainer Kelas" : "");
    const timeAgo = getRelativeTime(post.created_at);

    return `
      <div class="gc-comment ${isReply ? "gc-comment--reply" : ""}">
        ${avatarUrl ? `<img class="gc-comment-avatar" src="${avatarUrl}" alt="" />` : ""}
        <div class="gc-comment-content">
          <div class="gc-comment-header">
            <span class="gc-comment-author">${post.username || "User"}</span>
            ${role ? `<span class="gc-comment-role">${role}</span>` : ""}
            <span class="gc-comment-time">${timeAgo}</span>
          </div>
          <div class="gc-comment-text">${(post.cooked || "").replace(/<[^>]*>/g, "").substring(0, 200)}</div>
          <div class="gc-comment-actions">
            <button class="gc-comment-like">${SVG.heart} ${post.like_count || 49}</button>
            <button class="gc-comment-more">${SVG.more}</button>
            <button class="gc-comment-reply-btn">${SVG.reply} Balas</button>
            ${post.reply_count > 0 ? `<span class="gc-reply-badge">${post.reply_count} Balasan</span>` : ""}
          </div>
        </div>
      </div>
    `;
  }).join("");

  // Subtitle: the plain-text excerpt shown directly below the title.
  // Comes from topic.excerpt (same text as the card excerpt in the left feed).
  const subtitleText = topic.excerpt
    ? topic.excerpt.replace(/<[^>]*>/g, "").trim()
    : "";

  // Body text: full cooked HTML with images in their natural position.
  // Strip the opening paragraph from cooked if it duplicates the subtitle
  // (Discourse copies the excerpt as the first <p> in the post body).
  let bodyText = cooked.trim();
  if (subtitleText) {
    // Normalise both strings to bare words for comparison (strip tags + collapse whitespace)
    const normalise = (s) => s.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim().toLowerCase();
    const normSub = normalise(subtitleText).substring(0, 80);  // compare first 80 chars
    // Match the first <p>…</p> block and remove it only if it starts with the subtitle text
    bodyText = bodyText.replace(/^(<p>)([\s\S]*?)(<\/p>)/, (match, open, inner, close) => {
      const normInner = normalise(inner).substring(0, 80);
      return normInner.startsWith(normSub) ? "" : match;
    }).trim();
  }

  // Reusable stats markup
  const statsRow = `
    <span class="gc-stat">${SVG.heart} ${likes}</span>
    <span class="gc-stat">${SVG.chat} ${replies}</span>
    <span class="gc-stat">${SVG.eye} ${views}</span>
    <div class="gc-detail-actions">
      <button class="gc-action-icon" title="Simpan">${SVG.bookmark}</button>
      <button class="gc-action-icon" title="Bagikan">${SVG.share}</button>
    </div>
  `;

  return `
    <div class="gc-detail-inner">

      <div class="gc-detail-date">${date} ${tagHtml}</div>
      <h2 class="gc-detail-title">${topic.title}</h2>
      ${subtitleText ? `<p class="gc-detail-subtitle">${subtitleText}</p>` : ""}

      <hr class="gc-detail-sep" />

      <div class="gc-detail-stats">${statsRow}</div>

      <div class="gc-detail-body">${bodyText}</div>

      <button class="gc-reply-btn">${SVG.reply} Balas</button>

      <hr class="gc-detail-sep-bottom" />

      <div class="gc-detail-bottom-stats">${statsRow}</div>

      ${replyPosts.length > 0 ? `<div class="gc-comments">${commentsHtml}</div>` : ""}

    </div>
  `;
}

function getRelativeTime(dateStr) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const hrs = Math.floor(diff / 3600000);
  if (hrs < 1) return "baru saja";
  if (hrs < 24) return `${hrs} jam yang lalu`;
  const days = Math.floor(hrs / 24);
  return `${days} hari yang lalu`;
}

// ─────────────────────────────────────────────────────────────
// FETCH TOPICS from API
// ─────────────────────────────────────────────────────────────
async function fetchCategoryTopics() {
  try {
    const res = await fetch("/c/ga-updates/10.json?no_definitions=true", {
      headers: { "Accept": "application/json", "X-Requested-With": "XMLHttpRequest" }
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.topic_list?.topics || [];
  } catch (e) {
    console.warn("[GasingTheme] Failed to fetch topics:", e);
    return [];
  }
}

// ─────────────────────────────────────────────────────────────
// FETCH TOPIC POSTS
// ─────────────────────────────────────────────────────────────
async function fetchTopicPosts(topicId, topicSlug) {
  try {
    const res = await fetch(`/t/${topicSlug}/${topicId}.json`, {
      headers: { "Accept": "application/json", "X-Requested-With": "XMLHttpRequest" }
    });
    if (!res.ok) return { topic: null, posts: [] };
    const data = await res.json();
    return {
      topic: data,
      posts: data.post_stream?.posts || [],
    };
  } catch (e) {
    console.warn("[GasingTheme] Failed to fetch topic posts:", e);
    return { topic: null, posts: [] };
  }
}

// ─────────────────────────────────────────────────────────────
// MASTER RENDER: inject the full layout into the page
// ─────────────────────────────────────────────────────────────
let _renderTimeout = null;

async function renderLayout() {
  if (!isTargetRoute()) return;

  addBodyClass();

  // Find or create the wrapper
  let outlet = document.getElementById("main-outlet");
  if (!outlet) return;

  // Prevent double render
  if (document.getElementById("gc-category-wrapper")) {
    // Already rendered, just refresh feed
    return;
  }

  // Hide existing Discourse content temporarily
  outlet.style.opacity = "0";

  // Build wrapper
  const wrapper = document.createElement("div");
  wrapper.id = "gc-category-wrapper";
  wrapper.innerHTML = `
    ${buildHeroBanner()}
    ${buildActionBar()}
    <div id="gc-master-detail">
      <div id="gc-topic-feed">
        ${[1,2,3,4,5].map(() => `
          <div class="gc-topic-card" style="pointer-events:none">
            <div class="gc-card-body">
              <div class="gc-skeleton" style="height:14px;width:60%;margin-bottom:6px"></div>
              <div class="gc-skeleton" style="height:11px;width:90%;margin-bottom:4px"></div>
              <div class="gc-skeleton" style="height:11px;width:70%"></div>
            </div>
          </div>
        `).join("")}
      </div>
      <div id="gc-topic-detail">
        <div id="gc-empty-detail">
          ${SVG.newspaper}
          <p>Pilih artikel untuk membaca</p>
        </div>
      </div>
    </div>
  `;

  // Insert after #main-outlet's first child, or prepend to outlet
  const mainContainer = outlet.querySelector(".container") || outlet;
  mainContainer.prepend(wrapper);

  outlet.style.opacity = "1";

  // Fetch real topics
  const topics = await fetchCategoryTopics();
  const feed = document.getElementById("gc-topic-feed");

  // Update badge counts dynamically
  const latestCount = topics.length;
  const TRENDING_VIEW_THRESHOLD = 50;
  const trendingTopics = topics.filter(t => (t.views || 0) >= TRENDING_VIEW_THRESHOLD || (t.like_count || 0) >= 10);
  const trendingCount = trendingTopics.length;

  const latestBadge = document.getElementById("gc-badge-latest");
  const trendingBadge = document.getElementById("gc-badge-trending");
  if (latestBadge) latestBadge.textContent = latestCount;
  if (trendingBadge) trendingBadge.textContent = trendingCount;
  if (feed) {
    if (topics.length === 0) {
      feed.innerHTML = `<div style="padding:20px;text-align:center;color:var(--gc-text-muted);font-size:0.82rem">Tidak ada artikel ditemukan.</div>`;
    } else {
      feed.innerHTML = topics.map(t => buildTopicCard(t)).join("");
      bindTopicCardClicks(topics);

      // Auto-select first topic
      const firstCard = feed.querySelector(".gc-topic-card");
      if (firstCard) {
        firstCard.click();
      }
    }
  }

  bindActionBar(topics);
  bindSearch(topics);
}

// ─────────────────────────────────────────────────────────────
// BIND TOPIC CARD CLICKS
// ─────────────────────────────────────────────────────────────
function bindTopicCardClicks(topics) {
  const feed = document.getElementById("gc-topic-feed");
  if (!feed) return;

  feed.addEventListener("click", async (e) => {
    const card = e.target.closest(".gc-topic-card");
    if (!card) return;

    const topicId = parseInt(card.dataset.topicId);
    const topicSlug = card.dataset.topicSlug;
    if (!topicId) return;

    // Mark active
    feed.querySelectorAll(".gc-topic-card").forEach(c => c.classList.remove("active"));
    card.classList.add("active");
    STATE.activeTopicId = topicId;

    // Show loading
    const detail = document.getElementById("gc-topic-detail");
    if (detail) {
      detail.innerHTML = `
        <div class="gc-detail-inner">
          ${[1,2,3].map(() => `
            <div class="gc-skeleton" style="height:18px;width:80%;margin-bottom:10px"></div>
            <div class="gc-skeleton" style="height:12px;width:95%;margin-bottom:6px"></div>
            <div class="gc-skeleton" style="height:200px;width:100%;margin-bottom:10px;border-radius:10px"></div>
          `).join("")}
        </div>
      `;
    }

    const { topic, posts } = await fetchTopicPosts(topicId, topicSlug);
    const topicMeta = topics.find(t => t.id === topicId);

    if (detail) {
      detail.innerHTML = buildTopicDetail(topic || topicMeta, posts);
      detail.scrollTop = 0;
      bindContextMenus(detail);
    }
  });
}

// ─────────────────────────────────────────────────────────────
// BIND ACTION BAR (pills, filter, date)
// ─────────────────────────────────────────────────────────────
function bindActionBar(topics) {
  const TRENDING_VIEW_THRESHOLD = 50;

  // Pill toggles
  document.addEventListener("click", (e) => {
    const pill = e.target.closest(".gc-pill");
    if (pill) {
      document.querySelectorAll(".gc-pill").forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      STATE.activeFilter = pill.dataset.pill;

      // Filter feed based on pill selection
      const feed = document.getElementById("gc-topic-feed");
      if (feed) {
        const cards = feed.querySelectorAll(".gc-topic-card");
        cards.forEach(card => {
          const topicId = parseInt(card.dataset.topicId);
          const topic = topics.find(t => t.id === topicId);
          if (!topic) return;

          if (STATE.activeFilter === "trending") {
            const isTrending = (topic.views || 0) >= TRENDING_VIEW_THRESHOLD || (topic.like_count || 0) >= 10;
            card.style.display = isTrending ? "" : "none";
          } else {
            card.style.display = "";
          }
        });
      }
    }
  });

  // Filter popup toggle
  const filterBtn = document.getElementById("gc-filter-btn");
  if (filterBtn) {
    filterBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      closeAllPopups();
      STATE.filterOpen = !STATE.filterOpen;
      if (STATE.filterOpen) {
        filterBtn.classList.add("active");
        const popup = document.createElement("div");
        popup.innerHTML = buildFilterPopup();
        const iconBtns = document.querySelector(".gc-icon-buttons");
        iconBtns.style.position = "relative";
        iconBtns.appendChild(popup.firstElementChild);
        bindFilterPopup();
      }
    });
  }

  // Date popup toggle
  const dateBtn = document.getElementById("gc-date-btn");
  if (dateBtn) {
    dateBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      closeAllPopups();
      STATE.dateOpen = !STATE.dateOpen;
      if (STATE.dateOpen) {
        dateBtn.classList.add("active");
        const popup = document.createElement("div");
        popup.innerHTML = buildDatePopup();
        const iconBtns = document.querySelector(".gc-icon-buttons");
        iconBtns.style.position = "relative";
        iconBtns.appendChild(popup.firstElementChild);
        bindDatePopup();
      }
    });
  }

  // Close popups on outside click
  document.addEventListener("click", (e) => {
    if (!e.target.closest("#gc-filter-popup") && !e.target.closest("#gc-filter-btn") &&
        !e.target.closest("#gc-date-popup") && !e.target.closest("#gc-date-btn")) {
      closeAllPopups();
    }
  });
}

function closeAllPopups() {
  const fp = document.getElementById("gc-filter-popup");
  if (fp) fp.remove();
  const dp = document.getElementById("gc-date-popup");
  if (dp) dp.remove();

  document.getElementById("gc-filter-btn")?.classList.remove("active");
  document.getElementById("gc-date-btn")?.classList.remove("active");
  STATE.filterOpen = false;
  STATE.dateOpen = false;
}

// ─────────────────────────────────────────────────────────────
// BIND FILTER POPUP
// ─────────────────────────────────────────────────────────────
function bindFilterPopup() {
  const popup = document.getElementById("gc-filter-popup");
  if (!popup) return;

  popup.querySelectorAll("input[type='checkbox']").forEach(cb => {
    cb.addEventListener("change", () => {
      const val = cb.dataset.filter;
      if (cb.checked) {
        if (!STATE.selectedFilters.includes(val)) STATE.selectedFilters.push(val);
      } else {
        STATE.selectedFilters = STATE.selectedFilters.filter(f => f !== val);
      }
      filterTopicFeed();
    });
  });
}

function filterTopicFeed() {
  const cards = document.querySelectorAll(".gc-topic-card");
  cards.forEach(card => {
    const tag = card.querySelector(".gc-tag");
    if (STATE.selectedFilters.length === 0) {
      card.style.display = "";
      return;
    }
    const tagClass = tag ? tag.className : "";
    const matches = STATE.selectedFilters.some(f => tagClass.includes(f));
    card.style.display = matches ? "" : "none";
  });
}

// ─────────────────────────────────────────────────────────────
// BIND DATE POPUP
// ─────────────────────────────────────────────────────────────
function bindDatePopup() {
  const popup = document.getElementById("gc-date-popup");
  if (!popup) return;

  // Prev/Next nav
  popup.querySelector("#gc-date-prev")?.addEventListener("click", () => {
    navigateCalendar(-1);
  });
  popup.querySelector("#gc-date-next")?.addEventListener("click", () => {
    navigateCalendar(1);
  });

  // Day clicks
  popup.querySelectorAll(".gc-cal-day").forEach(day => {
    const ts = parseInt(day.dataset.ts);
    if (!ts) return;

    day.addEventListener("click", () => {
      if (!STATE.dateRange.start || (STATE.dateRange.start && STATE.dateRange.end)) {
        STATE.dateRange = { start: ts, end: null };
      } else {
        if (ts < STATE.dateRange.start) {
          STATE.dateRange = { start: ts, end: STATE.dateRange.start };
        } else {
          STATE.dateRange.end = ts;
        }
      }
      refreshDatePopup();
    });
  });
}

function navigateCalendar(dir) {
  const l = STATE.calendarMonth.left;
  const r = STATE.calendarMonth.right;
  let lm = l.month + dir;
  let ly = l.year;
  let rm = r.month + dir;
  let ry = r.year;

  if (lm < 0) { lm = 11; ly--; }
  if (lm > 11) { lm = 0; ly++; }
  if (rm < 0) { rm = 11; ry--; }
  if (rm > 11) { rm = 0; ry++; }

  STATE.calendarMonth = {
    left: { year: ly, month: lm },
    right: { year: ry, month: rm },
  };
  refreshDatePopup();
}

function refreshDatePopup() {
  const oldPopup = document.getElementById("gc-date-popup");
  if (!oldPopup) return;
  const iconBtns = document.querySelector(".gc-icon-buttons");
  oldPopup.remove();
  const popup = document.createElement("div");
  popup.innerHTML = buildDatePopup();
  iconBtns.appendChild(popup.firstElementChild);
  bindDatePopup();
}

// ─────────────────────────────────────────────────────────────
// BIND SEARCH
// ─────────────────────────────────────────────────────────────
function bindSearch(topics) {
  const input = document.getElementById("gc-search-input");
  if (!input) return;

  input.addEventListener("input", (e) => {
    const q = e.target.value.toLowerCase().trim();
    const cards = document.querySelectorAll(".gc-topic-card");
    cards.forEach(card => {
      const title = card.querySelector(".gc-card-title")?.textContent.toLowerCase() || "";
      const excerpt = card.querySelector(".gc-card-excerpt")?.textContent.toLowerCase() || "";
      card.style.display = (!q || title.includes(q) || excerpt.includes(q)) ? "" : "none";
    });
  });
}

// ─────────────────────────────────────────────────────────────
// BIND CONTEXT MENUS (Simpan / Laporkan)
// ─────────────────────────────────────────────────────────────
function bindContextMenus(container) {
  container.querySelectorAll(".gc-comment-more").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      // Remove existing context menus
      document.querySelectorAll(".gc-context-menu").forEach(m => m.remove());

      const menu = document.createElement("div");
      menu.className = "gc-context-menu";
      menu.innerHTML = `
        <div class="gc-context-item">${SVG.save} Simpan</div>
        <div class="gc-context-item">${SVG.report} Laporkan</div>
      `;
      btn.closest(".gc-comment-content").style.position = "relative";
      btn.closest(".gc-comment-content").appendChild(menu);

      setTimeout(() => {
        document.addEventListener("click", () => menu.remove(), { once: true });
      }, 0);
    });
  });
}

// ─────────────────────────────────────────────────────────────
// CLEANUP: remove the custom layout when navigating away
// ─────────────────────────────────────────────────────────────
function cleanupLayout() {
  document.getElementById("gc-category-wrapper")?.remove();
  document.body.classList.remove("category-ga-updates");
}

// ─────────────────────────────────────────────────────────────
// API INITIALIZER
// ─────────────────────────────────────────────────────────────
export default apiInitializer("1.8.0", (api) => {
  // Hook into Discourse's page change events
  api.onPageChange((url) => {
    // Clean up first
    cleanupLayout();

    if (url.includes("/c/ga-updates") || url.includes("/c/ga-updates/10")) {
      addBodyClass();
      // Small delay to let Discourse render its base elements
      later(() => {
        scheduleOnce("afterRender", this, renderLayout);
      }, 150);
    }
  });

  // Also run on initial page load if we're already on the route
  api.registerBehaviorTransformer?.("discovery-layout", () => {
    if (isTargetRoute()) {
      later(renderLayout, 200);
    }
  });

  // Fallback: watch for DOM readiness
  if (isTargetRoute()) {
    if (document.readyState === "complete" || document.readyState === "interactive") {
      later(renderLayout, 300);
    } else {
      document.addEventListener("DOMContentLoaded", () => later(renderLayout, 300));
    }
  }

  // Handle Ember route transitions via router service
  try {
    const container = getOwner(api);
    if (container) {
      const router = container.lookup("service:router");
      if (router) {
        router.on("routeDidChange", () => {
          const path = window.location.pathname;
          if (path.includes("/c/ga-updates")) {
            cleanupLayout();
            later(renderLayout, 200);
          } else {
            cleanupLayout();
          }
        });
      }
    }
  } catch (e) {
    // Silent fail — router hook is best-effort
  }
});
