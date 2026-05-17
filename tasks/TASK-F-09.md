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
- [ ] Base de données mock créée si nécessaire
- [ ] Unitaire: validation texte (longueur, champs requis)
- [ ] Intégration: sauvegarde des contenus
- [ ] E2E: édition admin visible côté visiteur
- [ ] Cas erreur: sauvegarde impossible

## Critères d'acceptation (DoD)
- [ ] Le scénario `F-09` de `features.md` passe
- [ ] Les textes sont versionnés au minimum avec `updated_at`
- [ ] FR/EN pris en compte si applicable
- [ ] Tests, lint et typecheck OK
- [ ] `progress.md` mis à jour

## Checklist PR
- [ ] PR liée à `F-09`
- [ ] Capture d'écran formulaire admin
