# Suivi d'avancement - Rclub

## Légende statuts
- `todo`: non démarré
- `in_progress`: en cours
- `blocked`: bloqué
- `review`: prêt pour revue
- `done`: terminé (tests passants)

## Backlog P0
| Feature | Titre | Owner | Statut | Tests | PR | Notes |
|---|---|---|---|---|---|---|
| F-07 | Connexion admin | Codex | done | unit+integration+e2e OK | [#1](https://github.com/livannm/Rclub/pull/1) | Auth.js v5 credentials + proxy guard |
| F-10 | CRUD événements | Codex | done | unit+integration+e2e OK | [#1](https://github.com/livannm/Rclub/pull/1) | Service events + admin CRUD |
| F-01 | Highlight prochain événement | Codex | done | e2e OK | [#2](https://github.com/livannm/Rclub/pull/2) | Highlight nearest event + fallback |
| F-05 | Agenda événements | Codex | done | unit+e2e OK | [#3](https://github.com/livannm/Rclub/pull/3) | Agenda trié + fallback vide |
| F-04 | Demande réservation | Codex | done | unit+integration+e2e OK | - | Formulaire réservation + consentement RGPD |
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
| F-07 | Connexion admin | Codex | done | unit+integration+e2e OK | - | Auth.js v5 credentials, proxy guard `/admin`, session JWT 8h |
| F-10 | CRUD événements | Codex | done | unit+integration+e2e OK | - | Admin CRUD + agenda public + is_published |
| F-01 | Highlight prochain événement | Codex | done | unit+integration+e2e OK | - | Bloc accueil affiche l'evenement publie le plus proche |
| F-05 | Agenda événements | Codex | done | unit+integration+e2e OK | - | Agenda a venir trie par date croissante + fallback vide |
| F-04 | Demande réservation | - | todo | - | - | Inclure consentement RGPD |
| F-02 | Bascule FR/EN | Codex | review | lint+test+typecheck+build+e2e OK | - | Switch global FR/EN + persistance cookie `NEXT_LOCALE` (DB mock mémoire conservée) |
| F-09 | Édition texte accueil | Codex | review | lint+test+typecheck+build+e2e OK | [#6](https://github.com/livannm/Rclub/pull/6) | Admin édite texte FR/EN de l'accueil, stocké en mémoire avec `updated_at` |

### P1
| Feature | Titre | Owner | Statut | Tests | PR | Notes |
|---|---|---|---|---|---|---|
| F-03 | Galerie Cash Out (visiteur) | - | todo | - | - | |
| F-06 | Demande privatisation | - | todo | - | - | Inclure consentement RGPD |
| F-08 | Changer logo | - | todo | - | - | Dépend de F-07 |
| F-11 | Gérer photos Cash Out | - | todo | - | - | Dépend de F-07 et F-10 |
| F-12 | Changer vidéo hero | - | todo | - | - | Dépend de F-07 |

### P2
| Feature | Titre | Owner | Statut | Tests | PR | Notes |
|---|---|---|---|---|---|---|
| X-01 | Anti-spam formulaires | - | todo | - | - | Rate limit + honeypot/captcha |
| X-02 | SEO avancé | - | todo | - | - | |
| X-03 | Stats dashboard admin | - | todo | - | - | |

## Journal des décisions
| Date | Décision | Impact | Owner |
|---|---|---|---|
| 2026-05-17 | Priorisation initiale P0/P1/P2 créée | Clarifie l'ordre de delivery | Orchestrateur |
| 2026-05-17 | Schémas de données minimaux ajoutés dans `project.md` | Réduit les ambiguïtés backend | Orchestrateur |
| 2026-05-17 | Stack validée implémentée pour F-07 (Auth.js v5, Prisma, Vitest, Playwright) | Établit le socle auth admin et tests | Codex |
| 2026-05-17 | F-10 livré avec modèle Event, service CRUD, UI admin, agenda public et tests | Débloque F-01 et F-05 | Codex |
| 2026-05-17 | F-01/F-05 livrés avec highlight homepage et agenda trié + fallback | Couvre la visibilité visiteur des événements à venir | Codex |
| 2026-05-17 | F-02 livré avec switch FR/EN global, persistance locale et couverture tests mise à jour | Active l'i18n MVP sans changer la stratégie DB mock en mémoire | Codex |
| 2026-05-17 | F-09 livré avec édition admin du texte d'accueil FR/EN et affichage visiteur | Rend les contenus éditoriaux homepage administrables sans DB (mock mémoire) | Codex |

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
