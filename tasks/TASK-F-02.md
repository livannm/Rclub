# TASK-F-02 - Bascule FR/EN

## Métadonnées
- Feature ID: `F-02`
- Priorité: `P0`
- Persona: `Visiteur`
- Branche: `feat/F-02-i18n-fr-en`
- Dépendances: aucune

## Objectif
Permettre de passer le site du français vers l'anglais avec conservation de la navigation.

## Plan de tests (à écrire en premier)
- [x] Base de données mock créée si nécessaire
- [x] Unitaire: résolution locale active
- [x] Intégration: contenus traduits des pages clés
- [x] E2E: switch FR -> EN sur le site
- [x] Cas erreur: locale non supportée

## Critères d'acceptation (DoD)
- [x] Le scénario `F-02` de `features.md` passe
- [x] Toutes les pages MVP affichent une version FR et EN
- [x] Tests, lint et typecheck OK
- [x] `progress.md` mis à jour

## Checklist PR
- [x] PR liée à `F-02`
- [x] Liste des clés de traduction ajoutées

## Notes d'implémentation
- Le switch FR/EN est global (layout) et persiste via cookie `NEXT_LOCALE`.
- La pile MVP reste sur une base mock en mémoire pour les événements (aucune migration DB requise pour F-02).
- Commandes de validation exécutées: `pnpm lint`, `pnpm test`, `pnpm typecheck`, `pnpm build`, `pnpm test:e2e`.
