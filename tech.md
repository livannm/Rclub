# Stack technique

## Technologies implémentées

### Framework
- **Next.js 16** (App Router, React Server Components, Server Actions)
- **React 19** / TypeScript 6
- **pnpm** — gestionnaire de paquets

### Base de données
- **PostgreSQL** (Railway en production)
- **Prisma 7** avec `@prisma/adapter-pg` (driver adapter pattern : pool pg → PrismaClient)
- Fallback in-memory automatique quand `DATABASE_URL` est absent (dev sans DB, CI/tests)

### Authentification
- **NextAuth v5** (beta.31) — provider `Credentials` uniquement
- Credentials validées contre les env vars `ADMIN_EMAIL` / `ADMIN_PASSWORD`
- Session JWT, durée 8h — page custom `/admin/login`
- Auth split : `auth.config.ts` (edge-compatible) + `auth.ts` (instance complète)

### i18n
- **next-intl 4** — deux locales : `fr` (défaut) et `en`
- Stratégie cookie `NEXT_LOCALE` (pas de préfixe URL, pas d'`hreflang`)
- Messages : `messages/fr.json` et `messages/en.json`

### Email
- **Resend** — templates HTML inline branded (fond noir/or)
- 3 templates : confirmation réservation, refus, mise à jour

### CSS / Design
- Variables CSS dans `app/globals.css` — source unique des tokens
- **Tailwind CSS v4** (PostCSS) coexiste pour les utilitaires (`tw-merge` + `clsx`)
- Classes BEM-style sémantiques pour les composants complexes
- Typographie : Cormorant Garamond (display) + DM Sans (UI) via Google Fonts

### Animations
- **GSAP 3** + `@gsap/react` — animations complexes (carousel 3D)
- **Framer Motion** (`motion ^12`) — transitions React
- **OGL** — WebGL pour le carousel 3D

### Validation
- **Zod 4** — tous les schémas de formulaires et d'API

### Tests
- Unitaires / intégration : **Vitest 4** + Testing Library + jsdom
- E2E : **Playwright** (Chromium uniquement, workers: 1)
- Coverage : `@vitest/coverage-v8`

### Sécurité
- Anti-spam formulaires : honeypot + rate-limit in-process (3 req/15 min)
- `mapsUrl` validé `https://` avant usage dans les liens (`lib/site/contact.ts`)
- Middleware NextAuth protège toutes les routes `/admin/*`

---

## Architecture services

Chaque domaine suit le pattern :

```
repository interface
  → implémentation in-memory (tests / dev sans DB)
  → implémentation Prisma (production)
  → service (logique métier)
  → singleton instance (DB-aware, instancié une seule fois)
```

**Domaines :** `events`, `gallery`, `reservations`, `privatizations`, `site-assets`, `admin-stats`

**Server Actions admin :** `lib/admin/event-actions.ts`, `lib/admin/reservation-actions.ts`

---

## Schéma de base de données (Prisma)

**Modèles :** `AdminUser`, `Event`, `EventMedia`, `ReservationRequest`, `PrivatizationRequest`, `SiteAsset`

**Enums :**
- `ReservationRequestStatus` : `new`, `reviewed`, `contacted`, `confirmed`, `refused`, `closed`
- `Role` : `super_admin`, `editor`
- `MediaType` : `photo`, `video`
- `SiteAssetKey` : `logo`, `home_hero_video`, `home_hero_poster`

---

## Contraintes et limitations connues

| Sujet | Contrainte |
|-------|-----------|
| Auth admin | Env vars uniquement — modèle `AdminUser` en DB non utilisé pour l'auth |
| Upload médias | URLs uniquement — pas de pipeline upload binaire |
| Rate-limit | In-process — se remet à zéro au redémarrage serveur (pas Redis/edge) |
| Médias statiques | Phase 1 : `public/media/`. Phase 2 : migration Cloudinary (abstraction en place) |
| Images home sections | `HomeInsideClub` utilise des images placeholder events — à remplacer par photos club définitives |

---

## Variables d'environnement (`.env.example`)

| Variable | Obligatoire | Usage |
|----------|-------------|-------|
| `DATABASE_URL` | production | Connexion PostgreSQL |
| `ADMIN_EMAIL` | oui | Login admin |
| `ADMIN_PASSWORD` | oui | Mot de passe admin |
| `AUTH_SECRET` | oui | NextAuth JWT secret |
| `RESEND_API_KEY` | oui | Emails transactionnels |
| `NEXT_PUBLIC_CLUB_ADDRESS` | non | Adresse affichée (défaut 24 Place des Halles) |
| `NEXT_PUBLIC_CLUB_MAPS_URL` | non | URL Maps externe — doit commencer par `https://` |
| `NEXT_PUBLIC_CLUB_MAPS_EMBED_URL` | non | URL iframe Google Maps (défaut : géocodage sur l’adresse) |
| `NEXT_PUBLIC_CLUB_PHONE` | non | Téléphone principal affiché |
| `NEXT_PUBLIC_CLUB_PHONE_2` | non | Second numéro affiché |
| `NEXT_PUBLIC_CLUB_INSTAGRAM_URL` | non | URL Instagram |
| `NEXT_PUBLIC_CLUB_FACEBOOK_URL` | non | URL Facebook |
| `NEXT_PUBLIC_CLUB_TIKTOK_URL` | non | URL TikTok |
