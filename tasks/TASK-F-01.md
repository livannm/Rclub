# TASK-F-01 - Highlight prochain evenement

## Metadonnees
- Feature ID: `F-01`
- Priorite: `P0`
- Persona: `Visiteur`
- Branche: `feat/F-01-highlight-prochain-evenement`
- Dependances: `F-10`

## Objectif
Afficher en page d'accueil l'evenement publie a venir le plus proche.

## Plan de tests (a ecrire en premier)
- [x] Unitaire: tri chronologique base sur la date
- [x] Integration: selection des evenements publies a venir
- [x] E2E: highlight accueil montre le plus proche
- [x] Cas limite: fallback si aucun evenement

## Criteres d'acceptation (DoD)
- [x] Le scenario `F-01` de `features.md` passe
- [x] Le bloc highlight se base sur les evenements publies a venir
- [x] Fallback editorial affiche si aucun evenement
- [x] Tests, lint et typecheck OK
- [x] `progress.md` mis a jour

## Checklist PR
- [ ] PR liee a `F-01`
- [ ] UI validee sur mobile/desktop
