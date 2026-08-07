import express from "express";
import { pageCacheManager } from "../utils/pageCache.js";

const router = express.Router();

// Localized strings dictionary for server-side HTML fragment rendering
const translations = {
  en: {
    heroTitle: "Video meetings that actually work.",
    heroSubtitle: "Experience crystal clear video calls, real-time group collaboration, and instant scheduling.",
    featuresTitle: "Why Choose MeetFlow",
    feature1: "HD Video & Crystal Clear Audio",
    feature2: "Instant Group Scheduling & Reminders",
    feature3: "End-to-End Encrypted Communication",
    statsTitle: "Trusted by thousands of teams worldwide",
    activeUsers: "50,000+ Active Users",
    meetingsHeld: "1,000,000+ Meetings Hosted",
  },
  es: {
    heroTitle: "Reuniones de video que realmente funcionan.",
    heroSubtitle: "Experimente llamadas de video nítidas, colaboración en grupo en tiempo real y programación instantánea.",
    featuresTitle: "Por qué elegir MeetFlow",
    feature1: "Video HD y Audio Cristalino",
    feature2: "Programación de Grupo Instantánea y Recordatorios",
    feature3: "Comunicación Encriptada de Extremo a Extremo",
    statsTitle: "Confianza de miles de equipos en todo el mundo",
    activeUsers: "50,000+ Usuarios Activos",
    meetingsHeld: "1,000,000+ Reuniones Alojadas",
  },
  fr: {
    heroTitle: "Des visioconférences qui fonctionnent vraiment.",
    heroSubtitle: "Profitez de visioconférences claires, d'une collaboration de groupe en temps réel et d'une planification instantanée.",
    featuresTitle: "Pourquoi choisir MeetFlow",
    feature1: "Vidéo HD et son cristal clair",
    feature2: "Planification de groupe instantanée et rappels",
    feature3: "Communication chiffrée de bout en bout",
    statsTitle: "Fait confiance par des milliers d'équipes dans le monde entier",
    activeUsers: "50 000+ utilisateurs actifs",
    meetingsHeld: "1 000 000+ réunions hébergées",
  },
};

/**
 * GET /api/public/landing-fragment
 * Server-rendered public landing HTML fragment with dynamic holes for user hydration
 */
router.get(
  "/landing-fragment",
  pageCacheManager.createMiddleware({ ttl: 5 * 60 * 1000 }),
  (req, res) => {
    const locale = req.query.locale && translations[req.query.locale] ? req.query.locale : "en";
    const t = translations[locale];

    // Heavy server-side HTML fragment template rendering
    const htmlFragment = `
      <section className="landing-fragment-hero" data-locale="${locale}">
        <div class="container">
          <div class="header-user-bar">
            <!-- DYNAMIC:USER_STATE -->
          </div>
          <h1 class="hero-title">${t.heroTitle}</h1>
          <p class="hero-subtitle">${t.heroSubtitle}</p>
        </div>
      </section>
      <section className="landing-fragment-features">
        <h2>${t.featuresTitle}</h2>
        <ul class="feature-list">
          <li>✨ ${t.feature1}</li>
          <li>📅 ${t.feature2}</li>
          <li>🔒 ${t.feature3}</li>
        </ul>
      </section>
      <section className="landing-fragment-stats">
        <h3>${t.statsTitle}</h3>
        <div class="stat-badges">
          <span class="badge">${t.activeUsers}</span>
          <span class="badge">${t.meetingsHeld}</span>
        </div>
      </section>
    `.trim();

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(htmlFragment);
  }
);

/**
 * GET /api/public/stats
 * Server-rendered public platform statistics fragment
 */
router.get(
  "/stats",
  pageCacheManager.createMiddleware({ ttl: 60 * 1000 }),
  (req, res) => {
    const statsHtml = `
      <div class="public-stats-box">
        <span class="stat-item">Active Sessions: 1,420</span>
        <span class="stat-item">System Status: Operational</span>
        <!-- DYNAMIC:REQUEST_ID -->
      </div>
    `.trim();

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(statsHtml);
  }
);

/**
 * POST /api/public/clear-cache
 * Invalidate cached fragments on content change or admin action
 */
router.post("/clear-cache", (req, res) => {
  const pattern = req.body.pattern || "*";
  const count = pageCacheManager.invalidate(pattern);
  res.json({ success: true, invalidatedCount: count, message: `Invalidated ${count} cache entries.` });
});

export default router;
