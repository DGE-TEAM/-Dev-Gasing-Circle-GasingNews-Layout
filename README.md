# Gasing Circle — Academy News Theme Component

## Overview

This Discourse Theme Component transforms the `/c/ga-updates` category page into a **Master-Detail layout** matching the Gasing Circle UI redesign.

### Features

- ✅ Hero Banner with integrated search
- ✅ Master-Detail split pane (Topic feed left / Reading pane right)
- ✅ Topic cards with thumbnails, excerpts, tags, and stats
- ✅ Pill-shaped Latest / Trending toggles
- ✅ Filter popup (Pendidikan, Pelatihan, Dunia, Lainnya)
- ✅ Date-range picker popup with dual-calendar
- ✅ Full topic reading pane with comments thread
- ✅ Post & Comment Interactions (Like, Reply, Smart Scroll) without page redirects
- ✅ Context menu (Simpan / Laporkan) on comment actions
- ✅ Client-side search in hero bar
- ✅ Responsive (collapses to single column on mobile / fixes Discourse sidebar overlaps)
- ✅ Scoped to `/c/ga-updates` — does NOT affect other categories

---

## Installation

### Method 1: Via Admin UI (Recommended)

1. Go to **Admin → Customize → Themes**
2. Click **Install** → **From a git repository**
3. Paste your repository URL, or choose **Upload** and provide the ZIP
4. After installing, go to the component's settings and **Enable** it
5. Add it as a **component** to your active theme

### Method 2: Manual File Upload

1. Create a new **Theme Component** in Admin → Customize → Themes → New
2. Set the name: `Gasing Circle Academy News`
3. Upload/Update files retaining the current directory structure.

---

## File Structure

```text
gasing-circle-theme/
├── about.json                          # Theme metadata
├── common/
│   ├── common.scss                     # All styles (CSS variables, layout, components)
│   └── head_tag.html                   # Google Fonts preload
├── config/
│   └── locales/
│       └── en.yml                      # Locale strings
└── javascripts/
    └── discourse/
        ├── api-initializers/
        │   └── custom-layout.js        # Entry point: layout injection & initialization
        └── lib/
            ├── gc-bindings.js          # Event listeners (click handlers, scrolls)
            ├── gc-builders.js          # HTML builders & DOM elements creation
            ├── gc-calendar.js          # Date picker & calendar logic
            ├── gc-comments.js          # Comments thread rendering & interaction logic
            ├── gc-fetch.js             # API helpers to Discourse endpoints
            ├── gc-filters.js           # Filter logic (tags, date ranges)
            ├── gc-icons.js             # SVG icons
            ├── gc-render.js            # Main view renderer (topic list, read pane)
            ├── gc-state.js             # Shared state & configuration
            ├── gc-tags.js              # Tag mapping & styling logic
            └── gc-utils.js             # General helper functions (date formatting, etc.)
```

---

## Architecture Decision: Why Not Ember Route Override?

The **Master-Detail layout** is implemented as a **DOM injection layer** rather than a full Ember route/template override, for these reasons:

1. **Stability** — Discourse's Ember internals change frequently. DOM injection via `apiInitializer` + `onPageChange` is the safest long-term approach.
2. **No Ruby backend needed** — Pure frontend Theme Component.
3. **API-driven** — Topic data is fetched via Discourse's public JSON API (`/c/ga-updates.json` and `/t/{slug}/{id}.json`), keeping the component decoupled from Discourse internals.
4. **Scoped** — The `body.category-ga-updates` CSS class ensures zero style bleed to other pages.

### Layout Strategy

```text
#main-outlet
  └── #gc-category-wrapper          (injected by JS)
        ├── #gc-hero-banner         (teal gradient header + search)
        ├── #gc-action-bar          (pills + icon buttons)
        └── #gc-master-detail
              ├── #gc-topic-feed    (left: scrollable card list)
              └── #gc-topic-detail  (right: topic reading pane)
```

The default Discourse `table.topic-list` is hidden via `display: none` using the scoped body class selector.

---

## Customization

### Change the target route

In `custom-layout.js` / state modules, update the target variables defining the category slug `/c/your-category-slug`.

### Change the color palette

All colors are CSS variables in `common.scss` under the `:root` block:

```scss
:root {
  --gc-blue-primary: #4a6cf7;
  --gc-hero-grad-start: #3abfbf;
  // ...
}
```

### Add more filter tags

Update the filter configurations located in the `lib/` modules (e.g. `gc-filters.js`), and update the tag classes matrix accordingly.

---

## Known Limitations

1. **Discourse version compatibility**: Tested against Discourse 3.1+. The `api.onPageChange` hook is available in Plugin API v0.8+.
2. **Topic detail fetch**: Each topic click triggers a network request to `/t/{slug}/{id}.json`. This is Discourse's standard JSON API and requires no authentication for public categories.
3. **Image URLs**: Discourse sometimes serves images through its CDN optimizer. If thumbnails don't load, check your Discourse CDN settings.
4. **Trending sort**: The "Trending" pill currently only changes the visual state. To wire it to real data, configure endpoints corresponding to Discourse's API (e.g. `top.json`).

---

## Browser Support

Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

---

_Built by Ery Prasetyo — Miracle Game / Gasing Community Platform_
