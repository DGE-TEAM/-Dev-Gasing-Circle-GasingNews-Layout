// =============================================================
// GASING CIRCLE — Academy News Theme Component
// File: javascripts/discourse/api-initializers/custom-layout.js
// Version: 3.1.0 — Refactored into modular lib files
// =============================================================

import { apiInitializer } from "discourse/lib/api";
import { later } from "@ember/runloop";
import { getOwner } from "@ember/application";
import { API } from "../lib/gc-state";
import { isTargetRoute } from "../lib/gc-utils";
import { renderLayout, cleanupLayout } from "../lib/gc-render";

export default apiInitializer("1.8.0", (api) => {
  API.instance = api;

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
