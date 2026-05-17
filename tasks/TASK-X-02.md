# TASK-X-02 - SEO avancé

## Métadonnées
- Feature ID: `X-02`
- Priorité: `P2`
- Persona: `Visiteur`
- Branche: `feat/X-02-seo-avance`
- Dépendances: `F-02`, `F-03`, `F-05`

## Objectif
Renforcer le référencement naturel des pages publiques avec métadonnées dédiées, sitemap, robots.txt et données structurées.

## Plan de tests (à écrire en premier)
- [x] Unitaire: génération des métadonnées canoniques par page publique
- [x] Unitaire: métadonnées localisées des galeries événement
- [x] Unitaire: JSON-LD organisation / événement
- [x] Unitaire: règles robots.txt admin/API

## Critères d'acceptation (DoD)
- [x] Les pages publiques ont des titres/descriptions dédiés
- [x] Les URLs canoniques sont générées depuis `NEXT_PUBLIC_SITE_URL`
- [x] `robots.txt` autorise le public et bloque `/admin` + `/api`
- [x] Les routes admin exposent une directive `noindex,nofollow`
- [x] `sitemap.xml` liste les pages publiques et galeries publiées
- [x] La page d'accueil expose du JSON-LD organisation et prochain événement
- [x] Tests, lint et typecheck OK
- [x] `progress.md` mis à jour

## Checklist PR
- [x] PR liée à `X-02`
- [x] Liste des impacts SEO ajoutée

## Notes d'implémentation
- Les helpers SEO sont centralisés dans `lib/seo/metadata.ts`.
- Les galeries événement génèrent des métadonnées dynamiques localisées FR/EN.
- Les routes metadata Next.js `app/robots.ts` et `app/sitemap.ts` couvrent l'indexation publique.
- Commandes de validation exécutées: `pnpm test`, `pnpm lint`, `pnpm typecheck`, `pnpm build`.
