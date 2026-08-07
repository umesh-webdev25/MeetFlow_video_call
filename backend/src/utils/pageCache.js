import Logger from "./logger.js";

export class PageCacheManager {
  constructor(options = {}) {
    this.cache = new Map();
    this.defaultTTL = options.defaultTTL || 5 * 60 * 1000; // 5 minutes
    this.maxSize = options.maxSize || 500;
  }

  generateKey(req) {
    const path = req.originalUrl || req.url || "/";
    const locale =
      req.query.locale ||
      (req.headers["accept-language"] ? req.headers["accept-language"].split(",")[0].trim() : "en");
    const theme = req.query.theme || "default";

    return `page_fragment:${path}:${locale}:${theme}`;
  }

  get(key) {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    entry.hits++;
    return entry;
  }

  set(key, content, options = {}) {
    const ttl = options.ttl || this.defaultTTL;
    const contentType = options.contentType || "text/html; charset=utf-8";

    // LRU eviction if cache size exceeds max limit
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) this.cache.delete(oldestKey);
    }

    const entry = {
      content,
      contentType,
      createdAt: Date.now(),
      expiresAt: Date.now() + ttl,
      hits: 0,
    };

    this.cache.set(key, entry);
    Logger.debug(`[PageCache] Cached fragment key="${key}" (TTL: ${ttl}ms)`);
    return entry;
  }

  invalidate(keyOrPattern) {
    let count = 0;
    if (typeof keyOrPattern === "string" && !keyOrPattern.includes("*")) {
      if (this.cache.has(keyOrPattern)) {
        this.cache.delete(keyOrPattern);
        count = 1;
      }
    } else {
      const regex = new RegExp(
        typeof keyOrPattern === "string" ? keyOrPattern.replace(/\*/g, ".*") : keyOrPattern
      );
      for (const key of this.cache.keys()) {
        if (regex.test(key)) {
          this.cache.delete(key);
          count++;
        }
      }
    }
    Logger.info(`[PageCache] Invalidated ${count} entries matching "${keyOrPattern}"`);
    return count;
  }

  clear() {
    this.cache.clear();
  }

  /**
   * Replace dynamic placeholders in cached templates with personalized user data
   */
  injectDynamicHoles(htmlContent, dynamicValues = {}) {
    let result = htmlContent;

    // Replace user state placeholder
    const userSlot = dynamicValues.user
      ? `<div id="user-slot" data-authenticated="true" data-user-id="${dynamicValues.user._id || dynamicValues.user.id}">
          <span className="user-name">${dynamicValues.user.fullName || dynamicValues.user.name}</span>
          <img src="${dynamicValues.user.profilePic || "/avatar.png"}" alt="User Avatar" class="user-avatar" />
         </div>`
      : `<div id="user-slot" data-authenticated="false">
          <a href="/login" class="btn-login">Sign In</a>
         </div>`;

    result = result.replace(/<!-- DYNAMIC:USER_STATE -->/g, userSlot);
    result = result.replace(/{{DYNAMIC_USER_SLOT}}/g, userSlot);

    // Replace timestamp / request ID placeholder
    const requestId = dynamicValues.requestId || Math.random().toString(36).substring(7);
    result = result.replace(/<!-- DYNAMIC:REQUEST_ID -->/g, requestId);

    return result;
  }

  createMiddleware(options = {}) {
    return (req, res, next) => {
      // Only cache GET requests
      if (req.method !== "GET") return next();

      const key = this.generateKey(req);
      const cached = this.get(key);

      if (cached) {
        res.setHeader("X-Cache", "HIT");
        res.setHeader("Content-Type", cached.contentType);

        // Inject personalized user data into dynamic holes
        const personalizedOutput = this.injectDynamicHoles(cached.content, {
          user: req.user || null,
          requestId: req.headers["x-request-id"],
        });

        return res.send(personalizedOutput);
      }

      // Intercept res.send to store response in cache
      res.setHeader("X-Cache", "MISS");
      const originalSend = res.send.bind(res);

      res.send = (body) => {
        if (res.statusCode === 200 && typeof body === "string") {
          const contentType = res.getHeader("Content-Type") || "text/html; charset=utf-8";
          this.set(key, body, {
            ttl: options.ttl || this.defaultTTL,
            contentType,
          });
        }

        const personalizedOutput = typeof body === "string"
          ? this.injectDynamicHoles(body, { user: req.user || null })
          : body;

        return originalSend(personalizedOutput);
      };

      next();
    };
  }

  getStats() {
    let totalHits = 0;
    for (const entry of this.cache.values()) {
      totalHits += entry.hits;
    }
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      totalHits,
    };
  }
}

export const pageCacheManager = new PageCacheManager({
  defaultTTL: 5 * 60 * 1000, // 5 minutes
  maxSize: 500,
});
