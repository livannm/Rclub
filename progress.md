# Suivi d'avancement - Rclub

## Objectif
Ce fichier sert de source unique de suivi pour coordonner un orchestrateur et plusieurs agents ouvriers.

## Légende statuts
- `todo`: non démarré
- `in_progress`: en cours
- `blocked`: bloqué (préciser le blocage)
- `review`: prêt pour revue
- `done`: terminé (tests passants)

## Backlog par priorité

### P0
| Feature | Titre | Owner | Statut | Tests | PR | Notes |
|---|---|---|---|---|---|---|
| F-07 | Connexion admin | Codex | done | unit+integration+e2e OK | [#1](https://github.com/livannm/Rclub/pull/1) | Auth.js v5 credentials, proxy guard `/admin`, session JWT 8h |
| F-10 | CRUD événements | Codex | done | unit+integration+e2e OK | [#1](https://github.com/livannm/Rclub/pull/1) | Admin CRUD + agenda public + is_published — à compléter : upload image couverture |
| F-01 | Highlight prochain événement | Codex | done | unit+integration+e2e OK | [#2](https://github.com/livannm/Rclub/pull/2) | Bloc accueil affiche l'événement publié le plus proche |
| F-05 | Agenda événements | Codex | done | unit+integration+e2e OK | [#3](https://github.com/livannm/Rclub/pull/3) | Agenda à venir trié par date croissante + fallback vide |
| F-04 | Demande réservation | Codex | done | unit+integration+e2e OK | [#4](https://github.com/livannm/Rclub/pull/4) | Formulaire réservation + consentement RGPD |
| F-02 | Bascule FR/EN | Codex | done | lint+test+typecheck+build+e2e OK | [#5](https://github.com/livannm/Rclub/pull/5) | Switch global FR/EN + persistance cookie `NEXT_LOCALE` |
| F-09 | Édition texte accueil | Codex | done | lint+test+typecheck+build+e2e OK | [#6](https://github.com/livannm/Rclub/pull/6) | Edition admin du texte homepage FR/EN |

### P1
| Feature | Titre | Owner | Statut | Tests | PR | Notes |
|---|---|---|---|---|---|---|
| F-03 | Galerie par événement (visiteur) | Codex | done | lint+test+typecheck+build+e2e OK | [#9](https://github.com/livannm/Rclub/pull/9) | `/galerie` liste événements avec photos, `/galerie/[slug]` photos d'un event — Cash Out est un event |
| F-06 | Demande privatisation | Codex | done | lint+test+typecheck+build+e2e OK | [#10](https://github.com/livannm/Rclub/pull/10) | Formulaire privatisation + consentement RGPD |
| F-08 | Changer logo | Codex | done | unit+integration+e2e OK | [#11](https://github.com/livannm/Rclub/pull/11) | PUT /api/admin/site-assets/logo, section admin, logo dynamique dans layout (fallback /media/logo.svg) |
| F-11 | Gérer photos par événement (admin) | Codex | done | unit+intégration+e2e OK | feat/F-12-update-video-hero | EventMedia schema, service CRUD, API routes admin, UI admin photos, pages galerie visiteur |
| F-12 | Changer vidéo hero | Codex | done | unit+integration+e2e OK | - | SiteAssetService, PUT /api/admin/site-assets/hero-video, vidéo hero sur homepage |

### P2
| Feature | Titre | Owner | Statut | Tests | PR | Notes |
|---|---|---|---|---|---|---|
| X-01 | Anti-spam formulaires | Codex | done | unit+integration OK, e2e bloque (navigateurs Playwright absents) | - | Rate limit en memoire + honeypot sur reservation et privatisation |
| X-02 | SEO avancé | Codex | done | unit OK, lint/typecheck/build OK | - | Métadonnées dédiées, canoniques, Open Graph/Twitter, sitemap, robots.txt, noindex admin, JSON-LD organisation + événement |
| X-03 | Stats dashboard admin | Codex | done | unit+lint+typecheck OK | - | Bloc stats rapides admin: événements, demandes, galerie |

### P3 – Design
| Feature | Titre | Owner | Statut | Tests | PR | Notes |
|---|---|---|---|---|---|---|
| D-01 | Identité visuelle globale | Codex | done | lint+typecheck+build OK | - | Tokens design appliqués dans `app/globals.css`, base noir/or, typographie, surfaces, boutons, inputs, cartes |
| D-02 | Page d'accueil (hero + highlight) | Codex | done | lint+typecheck+build OK | - | Hero vidéo plein écran avec overlay 55%, CTA, highlight prochain événement au-dessus du contenu |
| D-03 | Agenda & cartes événements | Codex | done | lint+typecheck+build OK | - | Grille responsive, cartes événements avec media ratio stable et CTA billetterie |
| D-04 | Formulaires (réservation / privatisation) | Codex | done | lint+typecheck+build OK | - | Formulaires en panneaux, champs tactiles, feedback succès/erreur, consentement RGPD visible |
| D-05 | Galerie Cash Out | Codex | done | lint+typecheck+build OK | - | Galerie par événement en grille responsive 2 colonnes mobile, media cards stables |
| D-06 | Interface admin | Codex | done | lint+typecheck+build OK | - | Dashboard, login et gestion événements harmonisés avec panneaux admin, stats, formulaires et listes photos |
| D-07 | Responsive & accessibilité | Codex | review | lint+typecheck+build OK | - | Breakpoints CSS, focus visible, tailles cibles 44px, contrastes tokens; QA visuelle Playwright multi-viewports encore à exécuter |

## Journal des décisions
| Date | Décision | Impact | Owner |
|---|---|---|---|
| 2026-05-17 | Priorisation initiale P0/P1/P2 créée | Clarifie l'ordre de delivery | Orchestrateur |
| 2026-05-17 | Schémas de données minimaux ajoutés dans `project.md` | Réduit les ambiguïtés backend | Orchestrateur |
| 2026-05-17 | Stack validée implémentée pour F-07 (Auth.js v5, Prisma, Vitest, Playwright) | Établit le socle auth admin et tests | Codex |
| 2026-05-17 | F-10 livré avec modèle Event, service CRUD, UI admin, agenda public et tests | Débloque F-01 et F-05 | Codex |
| 2026-05-17 | F-01/F-05 livrés avec highlight homepage et agenda trié + fallback | Couvre la visibilité visiteur des événements à venir | Codex |
| 2026-05-17 | F-02 livré avec switch FR/EN global, persistance locale et couverture tests mise à jour | Active l'i18n MVP sans changer la stratégie DB mock en mémoire | Codex |
| 2026-05-17 | F-04 livré avec formulaire réservation, consentement RGPD et statut initial `new` | Couvre la demande de réservation visiteur MVP | Codex |
| 2026-05-17 | F-09 livré avec édition admin du texte homepage FR/EN | Débloque la gestion éditoriale côté admin | Codex |
| 2026-05-17 | F-06 livré avec formulaire privatisation, consentement RGPD et statut `new` | Couvre la demande de privatisation visiteur | Codex |
| 2026-05-17 | X-01 livré avec honeypot et rate-limit en memoire sur les formulaires reservation/privatisation | Reduit le spam formulaires avant stockage des demandes | Codex |
| 2026-05-17 | F-03 livré avec galerie Cash Out (source media mock + page visiteur + i18n) | Couvre la consultation des photos Cash Out côté visiteur | Codex |

| 2026-05-17 | F-11 livré avec EventMedia schema, CRUD gallery service, API routes admin photos, UI admin (add/delete/reorder), pages galerie visiteur + tests | Débloque la gestion de la galerie photos par l'admin | Codex |

| 2026-05-17 | X-02 livré avec métadonnées SEO avancées, sitemap/robots et JSON-LD homepage | Améliore l’indexation des pages publiques et protège admin/API de l’indexation | Codex |
| 2026-05-17 | X-03 livré avec service de statistiques dashboard admin et bloc `Statistiques rapides` | Donne une synthèse admin des événements, demandes et photos | Codex |
| 2026-05-17 | Passe P3 design livrée: tokens globaux, hero vidéo, cartes agenda/galerie, formulaires, admin et responsive CSS | Harmonise l'expérience publique et admin selon `design.md`; reste une QA visuelle multi-viewports à faire | Codex |

## Blocages ouverts
- Aucun pour le moment.

## Questions produit en attente
- Les champs obligatoires finaux des formulaires réservation/privatisation sont-ils validés tels que proposés?
- Durée de conservation RGPD: confirmer 12 mois.
- Fallback UI exact si aucun événement à venir.

## Convention de branches
- Feature: `feat/F-XX-slug-court` (ex: `feat/F-07-auth-admin`)
- Fix: `fix/F-XX-slug-court` (si correction ciblée liée à une feature)
- Chore/refactor: `chore/slug-court` ou `refactor/F-XX-slug-court`

## Plan de parallélisation (lot initial recommandé)

### Vague 1 (socle)
- Agent A: `F-07` sur `feat/F-07-auth-admin`
- Agent B: `F-10` sur `feat/F-10-crud-evenements`
- Agent C: `F-02` sur `feat/F-02-i18n-fr-en`

### Vague 2 (dépend de vague 1)
- Agent D: `F-01` sur `feat/F-01-highlight-prochain-evenement` (après `F-10`)
- Agent E: `F-05` sur `feat/F-05-agenda-evenements` (après `F-10`)
- Agent F: `F-09` sur `feat/F-09-edition-texte-accueil` (après `F-07`)

### Vague 3
- Agent G: `F-04` sur `feat/F-04-formulaire-reservation`
