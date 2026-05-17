# TASK-F-09 - Édition texte page d'accueil

## Métadonnées
- Feature ID: `F-09`
- Priorité: `P0`
- Persona: `Admin`
- Branche: `feat/F-09-edition-texte-accueil`
- Dépendances: `F-07`

## Objectif
Permettre à l'admin de modifier les textes éditoriaux de la page d'accueil.

## Plan de tests (à écrire en premier)
- [x] Unitaire: validation texte (longueur, champs requis)
- [x] Intégration: sauvegarde des contenus
- [x] E2E: édition admin visible côté visiteur
- [x] Cas erreur: sauvegarde impossible

## Critères d'acceptation (DoD)
- [x] Le scénario `F-09` de `features.md` passe
- [x] Les textes sont versionnés au minimum avec `updated_at`
- [x] FR/EN pris en compte si applicable
- [x] Tests, lint et typecheck OK
- [x] `progress.md` mis à jour

## Checklist PR
- [x] PR liée à `F-09`
- [ ] Capture d'écran formulaire admin
